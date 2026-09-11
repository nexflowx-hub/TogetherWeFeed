import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  createXPaymentsCharge,
  createXPaymentsStripeIntent,
  getXPaymentsStripePublishableKey,
  isXPaymentsConfigured,
  isXPaymentsStripeDirectConfigured,
  XPaymentsRequestError,
  type XPaymentsCurrency,
  type XPaymentsMethod,
} from "@/lib/xpayments";
import type { LocaleCode } from "@/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutCustomer = {
  name?: string;
  email?: string;
  phone?: string;
  document?: string;
};

type CheckoutBody = {
  amount: number;
  currency: XPaymentsCurrency;
  method: XPaymentsMethod;
  frequency?: "once" | "monthly";
  locale?: LocaleCode;
  country?: string;
  customer?: CheckoutCustomer;
};

function normaliseCountry(value?: string | null): string | null {
  const country = value?.trim().toUpperCase();
  return country && /^[A-Z]{2}$/.test(country) ? country : null;
}

function requestCountry(req: Request, fallback?: string): string | null {
  return (
    normaliseCountry(req.headers.get("cf-ipcountry")) ??
    normaliseCountry(req.headers.get("x-vercel-ip-country")) ??
    normaliseCountry(req.headers.get("x-country-code")) ??
    normaliseCountry(req.headers.get("geoip-country-code")) ??
    normaliseCountry(fallback)
  );
}

function clientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || null;
}

function cleanText(value?: string, max = 200): string | undefined {
  const cleaned = value?.trim().replace(/\s+/g, " ");
  return cleaned ? cleaned.slice(0, max) : undefined;
}

function cleanDocument(value?: string): string | undefined {
  const digits = value?.replace(/\D/g, "");
  return digits || undefined;
}

function normalisePortuguesePhone(value?: string): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  if (/^9\d{8}$/.test(digits)) return `+351${digits}`;
  if (/^3519\d{8}$/.test(digits)) return `+${digits}`;
  return raw.slice(0, 32);
}

function validEmail(value?: string): boolean {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
}

function allowedMethods(currency: XPaymentsCurrency, country: string | null): XPaymentsMethod[] {
  if (currency === "BRL") return ["pix", "card"];
  if (country === "PT") return ["mb_way", "multibanco", "card"];
  return ["card"];
}

function amountIsValid(amount: number, currency: XPaymentsCurrency): boolean {
  if (!Number.isFinite(amount)) return false;
  const min = currency === "BRL" ? 5 : 1;
  const max = currency === "BRL" ? 25_000 : 5_000;
  return amount >= min && amount <= max && Math.round(amount * 100) > 0;
}

function error(message: string, status = 400, errorCode?: string) {
  return NextResponse.json(
    { success: false, error: message, ...(errorCode ? { errorCode } : {}) },
    { status }
  );
}

function publicXPaymentsError(cause: unknown): { message: string; code: string } {
  if (cause instanceof XPaymentsRequestError) {
    const code = cause.code ?? `XPAYMENTS_HTTP_${cause.status}`;

    if (
      cause.status === 401 ||
      cause.status === 403 ||
      ["API_KEY_REQUIRED", "ACCESS_DENIED", "UNAUTHORIZED", "FORBIDDEN"].includes(code)
    ) {
      return {
        message: "A configuração de pagamento desta moeda ainda não está autenticada. Tente novamente em instantes.",
        code,
      };
    }

    if (["INVALID_DOCUMENT", "INVALID_PAYER_DOCUMENT", "PAYER_DOCUMENT_REQUIRED"].includes(code)) {
      return {
        message: "Não foi possível validar o CPF/CNPJ informado para o PIX.",
        code,
      };
    }

    if (
      [
        "GATEWAY_NOT_CONFIGURED",
        "PROVIDER_NOT_SUPPORTED",
        "PIX_ROUTE_NOT_CONFIGURED",
        "STRIPE_ROUTE_NOT_CONFIGURED",
        "NOT_STRIPE_ROUTE",
        "STRIPE_SECRET_MISSING",
        "STRIPE_ENVIRONMENT_MISMATCH",
      ].includes(code)
    ) {
      return {
        message: "Este método de pagamento ainda não está ativo nesta loja.",
        code,
      };
    }

    return {
      message: "Não foi possível iniciar o pagamento. Tente novamente.",
      code,
    };
  }

  return {
    message: "Não foi possível iniciar o pagamento. Tente novamente.",
    code: "XPAYMENTS_REQUEST_FAILED",
  };
}

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return error("Pedido de pagamento inválido.");
  }

  const currency = body.currency;
  const method = body.method;
  const frequency = body.frequency ?? "once";
  const country = requestCountry(req, body.country);

  if (currency !== "EUR" && currency !== "BRL") {
    return error("Moeda não suportada neste checkout.");
  }

  if (frequency !== "once") {
    return error("Os donativos recorrentes serão ativados numa fase posterior. Escolha um donativo único.");
  }

  if (!amountIsValid(body.amount, currency)) {
    return error("Valor de donativo inválido.");
  }

  if (!method || !allowedMethods(currency, country).includes(method)) {
    return error("Método de pagamento indisponível para esta localização/moeda.");
  }

  const name = cleanText(body.customer?.name, 120);
  const email = cleanText(body.customer?.email, 160)?.toLowerCase();
  const phone = normalisePortuguesePhone(body.customer?.phone);
  const document = cleanDocument(body.customer?.document);

  if (method === "pix" && (!name || !document || ![11, 14].includes(document.length))) {
    return error("Para PIX, indique o nome do pagador e um CPF/CNPJ válido.");
  }

  if (method === "mb_way" && (!phone || !/^\+3519\d{8}$/.test(phone))) {
    return error("Indique um número móvel português válido para MB WAY.");
  }

  if (method === "multibanco" && !validEmail(email)) {
    return error("Indique um email válido para Multibanco.");
  }

  const orderId = `TWF-${currency}-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const amountMinor = Math.round(body.amount * 100);
  const metadata = {
    campaign: "together-we-feed",
    locale: body.locale ?? "",
    country: country ?? "",
    customerIp: clientIp(req) ?? "",
    requestedMethod: method,
    ...(name ? { customerName: name } : {}),
    ...(document ? { document, customerDocument: document } : {}),
  };

  try {
    // Brazil PIX remains on the certified Native S2S MisticPay path.
    if (method === "pix") {
      if (!isXPaymentsConfigured(currency)) {
        return NextResponse.json({
          success: true,
          mode: "demo",
          provider: "xpayments",
          reference: orderId,
          amount: body.amount,
          currency,
          method,
          status: "demo",
          action: null,
        });
      }

      const charge = await createXPaymentsCharge({
        amountMinor,
        currency,
        method,
        orderId,
        customer: {
          name,
          fullName: name,
          email: validEmail(email) ? email : undefined,
          phone,
          ...(document ? { document, taxId: document } : {}),
        },
        metadata,
      });

      return NextResponse.json({
        success: true,
        mode: "live",
        provider: "xpayments",
        reference: charge.reference ?? orderId,
        transactionId: charge.transactionId ?? null,
        amount: body.amount,
        currency,
        method,
        status: charge.status ?? "pending",
        action: charge.action ?? null,
      });
    }

    // MB WAY, Multibanco, cards, Apple Pay, Google Pay and provider-eligible
    // local methods use XPayments Stripe-compatible Direct.
    if (!isXPaymentsStripeDirectConfigured(currency)) {
      return error(
        "O pagamento por cartão/carteira ainda não está configurado para esta moeda.",
        503,
        "STRIPE_DIRECT_NOT_CONFIGURED"
      );
    }

    const intent = await createXPaymentsStripeIntent({
      amountMinor,
      currency,
      method,
      orderId,
      customer: {
        name,
        email: validEmail(email) ? email : undefined,
        phone,
      },
      metadata,
    });

    const clientSecret = typeof intent.client_secret === "string" ? intent.client_secret : null;
    const publicKey = getXPaymentsStripePublishableKey(currency);

    if (!clientSecret || !publicKey) {
      return error(
        "A configuração Stripe Direct não devolveu os dados necessários para concluir o pagamento.",
        502,
        "STRIPE_DIRECT_CLIENT_CONFIG_MISSING"
      );
    }

    return NextResponse.json({
      success: true,
      mode: "live",
      provider: "xpayments",
      reference: orderId,
      transactionId: intent.metadata?.nexflowx_transaction_id ?? null,
      amount: body.amount,
      currency,
      method,
      status: intent.status ?? "requires_payment_method",
      action: {
        type: "stripe_direct",
        clientSecret,
        publicKey,
        providerTxId: intent.id,
        paymentMethodTypes: intent.payment_method_types ?? [],
      },
    });
  } catch (cause) {
    const diagnostic = publicXPaymentsError(cause);
    const upstream = cause instanceof Error ? cause.message : "unknown_xpayments_error";
    console.error("[checkout] XPayments request failed", {
      code: diagnostic.code,
      upstream,
      currency,
      method,
      reference: orderId,
    });
    return error(diagnostic.message, 502, diagnostic.code);
  }
}
