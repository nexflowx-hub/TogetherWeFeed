export type XPaymentsCurrency = "EUR" | "BRL";
export type XPaymentsMethod = "pix" | "mb_way" | "multibanco" | "card";

export type XPaymentsCustomer = {
  name?: string;
  email?: string;
  phone?: string;
};

export type XPaymentsAction = {
  type?: string;
  message?: string;
  clientSecret?: string;
  publicKey?: string;
  providerTxId?: string;
  entity?: string;
  entidade?: string;
  reference?: string;
  referencia?: string;
  amount?: string | number;
  montante?: string | number;
  expiresAt?: string;
  copyPaste?: string;
  pixString?: string;
  qrCode?: string;
  qrCodeBase64?: string;
  qrCodeUrl?: string;
  url?: string;
  [key: string]: unknown;
};

export type XPaymentsChargeResponse = {
  success: boolean;
  transactionId?: string;
  reference?: string;
  status?: string;
  method?: XPaymentsMethod | string;
  action?: XPaymentsAction | null;
  error?: unknown;
  message?: string;
  [key: string]: unknown;
};

type CreateChargeInput = {
  amountMinor: number;
  currency: XPaymentsCurrency;
  method: XPaymentsMethod;
  orderId: string;
  customer?: XPaymentsCustomer;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

const DEFAULT_BASE_URL = "https://api.xpayments.digital/api/v1";

function getApiKey(currency: XPaymentsCurrency): string | null {
  const key =
    currency === "BRL"
      ? process.env.XPAYMENTS_API_KEY_BRL
      : process.env.XPAYMENTS_API_KEY_EUR;

  return key?.trim() || null;
}

function getBaseUrl(): string {
  return (process.env.XPAYMENTS_API_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/$/, "");
}

function cleanObject<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined && item !== null && item !== "")
  ) as T;
}

export function isXPaymentsConfigured(currency: XPaymentsCurrency): boolean {
  return Boolean(getApiKey(currency));
}

/**
 * Server-only XPayments S2S charge.
 *
 * API keys never leave the Next.js server. The order id is sent both in the
 * request metadata (the documented idempotency reference) and as a request
 * header so retries caused by flaky mobile networks cannot create duplicate
 * donations when the upstream supports that header.
 */
export async function createXPaymentsCharge(
  input: CreateChargeInput
): Promise<XPaymentsChargeResponse> {
  const apiKey = getApiKey(input.currency);
  if (!apiKey) {
    throw new Error(`XPAYMENTS_API_KEY_${input.currency} is not configured`);
  }

  if (!Number.isInteger(input.amountMinor) || input.amountMinor <= 0) {
    throw new Error("XPayments amount must be a positive integer in minor units");
  }

  const metadata = cleanObject({
    ...(input.metadata ?? {}),
    order_id: input.orderId,
    reference: input.orderId,
    source: "together-we-feed",
  });

  const response = await fetch(`${getBaseUrl()}/payments/charge`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "x-api-key": apiKey,
      "idempotency-key": input.orderId,
    },
    body: JSON.stringify({
      amount: input.amountMinor,
      currency: input.currency,
      payment_method_types: [input.method],
      metadata,
      ...(input.customer && Object.keys(cleanObject(input.customer)).length
        ? { customer: cleanObject(input.customer) }
        : {}),
    }),
    signal: AbortSignal.timeout(20_000),
  });

  const text = await response.text();
  let payload: XPaymentsChargeResponse;

  try {
    payload = text ? (JSON.parse(text) as XPaymentsChargeResponse) : { success: response.ok };
  } catch {
    throw new Error(`XPayments returned a non-JSON response (HTTP ${response.status})`);
  }

  if (!response.ok || payload.success === false) {
    const upstreamMessage =
      typeof payload.message === "string"
        ? payload.message
        : typeof payload.error === "string"
          ? payload.error
          : `XPayments charge failed (HTTP ${response.status})`;
    throw new Error(upstreamMessage);
  }

  return payload;
}
