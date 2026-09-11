import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  getCheckoutPolicy,
  getPixFallbackName,
  requestCountry,
} from "@/lib/checkout-policy";
import {
  createXPaymentsCharge,
  createXPaymentsStripeIntent,
  getXPaymentsStripePublishableKey,
  isXPaymentsConfigured,
  isXPaymentsStripeDirectConfigured,
  XPaymentsRequestError,
  type XPaymentsCurrency,
  type XPaymentsMethod,
  type XPaymentsNativeMethod,
  type XPaymentsEmbeddedMethod,
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

const NATIVE_METHODS = new Set<XPaymentsMethod>([
  "pix",
  "mb_way",
  "multibanco",
  "bizum",
]);

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

function normaliseSpanishPhone(value?: string): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  if (/^[67]\d{8}$/.test(digits)) return `+34${digits}`;
  if (/^34[67]\d{8}$/.test(digits)) return `+${digits}`;
  return raw.slice(0, 32);
}

function validEmail(value?: string): boolean {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
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

function publicXPaymentsError(cause: unknown): { message: string; code: string; status: number } {
  if (cause instanceof XPaymentsRequestError) {
    const upstreamCode = cause.code ?? `XPAYMENTS_HTTP_${cause.status}`;

    if (cause.status === 401 || cause.status === 403) {
      return {
        message: "Este meio de pagamento está temporariamente indisponível.",
        code: "PAYMENT_AUTH_UNAVAILABLE",
        status: 502,
      };
    }

    if (upstreamCode === "PAYER_DOCUMENT_REQUIRED") {
      return {
        message: "Para concluir este PIX, informe o CPF/CNPJ do pagador.",
        code: "PAYER_DOCUMENT_REQUIRED",
        status: 422,
      };
    }

    if (["INVALID_DOCUMENT", "INVALID_PAYER_DOCUMENT"].includes(upstreamCode)) {
      return {
        message: "Não foi possível validar o CPF/CNPJ informado para o PIX.",
        code: "INVALID_PAYER_DOCUMENT",
        status: 422,
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
      ].includes(upstreamCode)
    ) {
      return {
        message: "Este meio de pagamento ainda não está disponível.",
        code: "PAYMENT_ROUTE_NOT_CONFIGURED",
        status: 503,
      };
    }

    return {
      message: "Não foi possível iniciar o pagamento. Tente novamente.",
      code: "XPAYMENTS_REQUEST_FAILED",
      status: 502,
    };
  }

  return {
    message: "Não foi possível iniciar o pagamento. Tente novamente.",
    code: "XPAYMENTS_REQUEST_FAILED",
    status: 502,
  };
}

function paymentReturnUrl(req: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return `${configured || new URL(req.url).origin}/payment/complete`;
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

  const policy = getCheckoutPolicy(country, currency);
  if (!policy.enabled) {
    return error(
      policy.message || "Os donativos desta campanha não estão disponíveis nesta localização.",
      403,
      "CHECKOUT_CAMPAIGN_BLOCKED"
    );
  }

  if (frequency !== "once") {
    return error("Os donativos recorrentes serão ativados numa fase posterior. Escolha um donativo único.");
  }

  if (!amountIsValid(body.amount, currency)) {
    return error("Valor de donativo inválido.");
  }

  if (!method || !policy.methods.includes(method)) {
    return error(
      "Este meio de pagamento não está ativo nesta campanha.",
      403,
      "PAYMENT_METHOD_DISABLED"
    );
  }

  const enteredName = cleanText(body.customer?.name, 120);
  const email = cleanText(body.customer?.email, 160)?.toLowerCase();
  const document = cleanDocument(body.customer?.document);
  const phone =
    method === "mb_way"
      ? normalisePortuguesePhone(body.customer?.phone)
      : method === "bizum"
        ? normaliseSpanishPhone(body.customer?.phone)
        : cleanText(body.customer?.phone, 32);

  if (method === "pix") {
    if (document && ![11, 14].includes(document.length)) {
      return error("Indique um CPF/CNPJ válido ou deixe o campo em branco.", 422, "INVALID_PAYER_DOCUMENT");
    }

    if (policy.pixPayerFields === "required" && !document) {
      return error("Para PIX, indique um CPF/CNPJ válido.", 422, "PAYER_DOCUMENT_REQUIRED");
    }
  }

  if (method === "mb_way" && (!phone || !/^\+3519\d{8}$/.test(phone))) {
    return error("Indique um número móvel português válido para MB WAY.");
  }

  if (method === "multibanco" && !validEmail(email)) {
    return error("Indique um email válido para Multibanco.");
  }

  if (method === "bizum" && (!phone || !/^\+34[67]\d{8}$/.test(phone))) {
    return error("Indique um número móvel espanhol válido para Bizum.");
  }

  const pixPayerName = method === "pix" ? enteredName || getPixFallbackName() : enteredName;
  const orderId = `TWF-${currency}-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const amountMinor = Math.round(body.amount * 100);
  const metadata = {
    campaign: "together-we-feed",
    locale: body.locale ?? "",
    country: country ?? "",
    customerIp: clientIp(req) ?? "",
    requestedMethod: method,
    ...(method === "bizum" ? { return_url: paymentReturnUrl(req) } : {}),
    ...(pixPayerName ? { customerName: pixPayerName } : {}),
    ...(document ? { document, customerDocument: document } : {}),
  };

  try {
    if (NATIVE_METHODS.has(method)) {
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
        method: method as XPaymentsNativeMethod,
        orderId,
        customer: {
          name: pixPayerName,
          fullName: pixPayerName,
          email: validEmail(email) ? email : undefined,
          phone,
          ...(method === "pix" && document ? { document, taxId: document } : {}),
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

    if (!isXPaymentsStripeDirectConfigured(currency)) {
      return error(
        "Este meio de pagamento ainda não está disponível.",
        503,
        "EMBEDDED_PAYMENT_NOT_CONFIGURED"
      );
    }

    const intent = await createXPaymentsStripeIntent({
      amountMinor,
      currency,
      method: method as XPaymentsEmbeddedMethod,
      orderId,
      customer: {
        name: enteredName,
        email: validEmail(email) ? email : undefined,
        phone,
      },
      metadata,
    });

    const clientSecret = typeof intent.client_secret === "string" ? intent.client_secret : null;
    const publicKey = getXPaymentsStripePublishableKey(currency);

    if (!clientSecret || !publicKey) {
      return error(
        "Não foi possível preparar o pagamento seguro. Tente novamente.",
        502,
        "EMBEDDED_PAYMENT_CLIENT_CONFIG_MISSING"
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
        type: "embedded_payment",
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
    return error(diagnostic.message, diagnostic.status, diagnostic.code);
  }
}
