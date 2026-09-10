export type XPaymentsCurrency = "EUR" | "BRL";
export type XPaymentsMethod = "pix" | "mb_way" | "multibanco" | "card";

export type XPaymentsCustomer = {
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  document?: string;
  taxId?: string;
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

export type XPaymentsCheckoutSessionResponse = {
  success?: boolean;
  sessionId?: string;
  checkoutUrl?: string;
  id?: string;
  url?: string;
  error?: unknown;
  message?: string;
  [key: string]: unknown;
};

type XPaymentsCheckoutSessionEnvelope = XPaymentsCheckoutSessionResponse & {
  data?: XPaymentsCheckoutSessionResponse;
};

type CreateChargeInput = {
  amountMinor: number;
  currency: XPaymentsCurrency;
  method: Exclude<XPaymentsMethod, "card">;
  orderId: string;
  customer?: XPaymentsCustomer;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

type CreateCheckoutSessionInput = {
  amountMajor: number;
  currency: XPaymentsCurrency;
  orderId: string;
  customerEmail?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

const DEFAULT_BASE_URL = "https://api.xpayments.digital/api/v1";

export class XPaymentsRequestError extends Error {
  readonly status: number;
  readonly code: string | null;

  constructor(message: string, status: number, code: string | null = null) {
    super(message);
    this.name = "XPaymentsRequestError";
    this.status = status;
    this.code = code;
  }
}

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

function upstreamErrorDetails(payload: { error?: unknown; message?: string }): {
  message: string | null;
  code: string | null;
} {
  if (typeof payload.message === "string" && payload.message.trim()) {
    return { message: payload.message.trim(), code: null };
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    return { message: payload.error.trim(), code: null };
  }

  if (payload.error && typeof payload.error === "object") {
    const value = payload.error as Record<string, unknown>;
    const message = typeof value.message === "string" && value.message.trim() ? value.message.trim() : null;
    const code = typeof value.code === "string" && value.code.trim() ? value.code.trim() : null;
    return { message, code };
  }

  return { message: null, code: null };
}

async function readJsonResponse<T extends { success?: boolean; error?: unknown; message?: string }>(
  response: Response,
  context: string
): Promise<T> {
  const text = await response.text();
  let payload: T;

  try {
    payload = (text ? JSON.parse(text) : { success: response.ok }) as T;
  } catch {
    throw new XPaymentsRequestError(
      `XPayments returned a non-JSON response for ${context}`,
      response.status,
      "NON_JSON_RESPONSE"
    );
  }

  if (!response.ok || payload.success === false) {
    const details = upstreamErrorDetails(payload);
    throw new XPaymentsRequestError(
      details.message ?? `XPayments ${context} failed`,
      response.status,
      details.code
    );
  }

  return payload;
}

function authHeaders(apiKey: string, orderId: string): HeadersInit {
  return {
    "content-type": "application/json",
    accept: "application/json",
    // Current XPayments runtime accepts x-api-key; checkout documentation also
    // describes Bearer API-key auth. Sending both keeps this S2S integration
    // compatible without ever exposing the Store key to the browser.
    "x-api-key": apiKey,
    authorization: `Bearer ${apiKey}`,
    "idempotency-key": orderId,
  };
}

export function isXPaymentsConfigured(currency: XPaymentsCurrency): boolean {
  return Boolean(getApiKey(currency));
}

/**
 * Server-only XPayments S2S charge for local payment methods.
 * Direct Charge uses minor units (cents), as documented by the S2S contract.
 * API keys never leave the Next.js server.
 */
export async function createXPaymentsCharge(
  input: CreateChargeInput
): Promise<XPaymentsChargeResponse> {
  const apiKey = getApiKey(input.currency);
  if (!apiKey) throw new Error(`XPAYMENTS_API_KEY_${input.currency} is not configured`);

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
    headers: authHeaders(apiKey, input.orderId),
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

  return readJsonResponse<XPaymentsChargeResponse>(response, "charge");
}

/**
 * Card fallback through XPayments hosted checkout.
 *
 * IMPORTANT: unlike Direct Charge, the CURRENT checkout runtime persists
 * CheckoutSession.amount in major units and converts it to minor units during
 * `/checkout/initiate`. Older dossier material described this field as cents;
 * runtime behaviour is authoritative here to avoid a 100x charge error.
 */
export async function createXPaymentsCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<XPaymentsCheckoutSessionResponse> {
  const apiKey = getApiKey(input.currency);
  if (!apiKey) throw new Error(`XPAYMENTS_API_KEY_${input.currency} is not configured`);

  if (!Number.isFinite(input.amountMajor) || input.amountMajor <= 0) {
    throw new Error("XPayments checkout amount must be positive in major units");
  }

  const metadata = cleanObject({
    ...(input.metadata ?? {}),
    order_id: input.orderId,
    reference: input.orderId,
    source: "together-we-feed",
    requested_method: "card",
  });

  const response = await fetch(`${getBaseUrl()}/checkout/session`, {
    method: "POST",
    cache: "no-store",
    headers: authHeaders(apiKey, input.orderId),
    body: JSON.stringify({
      amount: Number(input.amountMajor.toFixed(2)),
      currency: input.currency,
      reference: input.orderId,
      ...(input.customerEmail ? { customerEmail: input.customerEmail } : {}),
      metadata,
    }),
    signal: AbortSignal.timeout(20_000),
  });

  const envelope = await readJsonResponse<XPaymentsCheckoutSessionEnvelope>(
    response,
    "checkout session"
  );

  // The technical contract documents a flat response while current runtime
  // material also shows the standard { success, data } envelope. Support both.
  return envelope.data ?? envelope;
}
