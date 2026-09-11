export type XPaymentsCurrency = "EUR" | "BRL";
export type XPaymentsNativeMethod = "pix" | "mb_way" | "multibanco" | "bizum";
export type XPaymentsEmbeddedMethod = "card" | "other";
export type XPaymentsMethod = XPaymentsNativeMethod | XPaymentsEmbeddedMethod;

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
  paymentMethodTypes?: string[];
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
  redirectUrl?: string;
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

export type XPaymentsStripeIntentResponse = {
  id: string;
  object?: string;
  client_secret?: string | null;
  status?: string;
  currency?: string;
  amount?: number;
  payment_method_types?: string[];
  metadata?: Record<string, string>;
  error?: unknown;
  message?: string;
  [key: string]: unknown;
};

type CreateChargeInput = {
  amountMinor: number;
  currency: XPaymentsCurrency;
  method: XPaymentsNativeMethod;
  orderId: string;
  customer?: XPaymentsCustomer;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

type CreateStripeIntentInput = {
  amountMinor: number;
  currency: XPaymentsCurrency;
  method: XPaymentsEmbeddedMethod;
  orderId: string;
  customer?: XPaymentsCustomer;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

const DEFAULT_BASE_URL = "https://api.xpayments.digital/api/v1";
const DEFAULT_STRIPE_BASE_URL = "https://api.xpayments.digital/api/stripe/v1";

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
  const key = currency === "BRL" ? process.env.XPAYMENTS_API_KEY_BRL : process.env.XPAYMENTS_API_KEY_EUR;
  return key?.trim() || null;
}

function getStripeApiKey(currency: XPaymentsCurrency): string | null {
  const dedicated =
    currency === "BRL"
      ? process.env.XPAYMENTS_STRIPE_API_KEY_BRL
      : process.env.XPAYMENTS_STRIPE_API_KEY_EUR;

  // EUR can reuse the existing Store key when the Store is already compatible
  // with the embedded provider surface. BRL remains isolated from the PIX Store.
  const fallback = currency === "EUR" ? process.env.XPAYMENTS_API_KEY_EUR : undefined;
  return dedicated?.trim() || fallback?.trim() || null;
}

function getBaseUrl(): string {
  return (process.env.XPAYMENTS_API_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/$/, "");
}

function getStripeBaseUrl(): string {
  return (process.env.XPAYMENTS_STRIPE_BASE_URL?.trim() || DEFAULT_STRIPE_BASE_URL).replace(/\/$/, "");
}

export function getXPaymentsStripePublishableKey(currency: XPaymentsCurrency): string | null {
  const key =
    currency === "BRL"
      ? process.env.XPAYMENTS_STRIPE_PUBLISHABLE_KEY_BRL
      : process.env.XPAYMENTS_STRIPE_PUBLISHABLE_KEY_EUR;

  const value = key?.trim() || null;
  return value && /^pk_(test|live)_/.test(value) ? value : null;
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
    "x-api-key": apiKey,
    authorization: `Bearer ${apiKey}`,
    "idempotency-key": orderId,
  };
}

export function isXPaymentsConfigured(currency: XPaymentsCurrency): boolean {
  return Boolean(getApiKey(currency));
}

export function isXPaymentsStripeDirectConfigured(currency: XPaymentsCurrency): boolean {
  return Boolean(getStripeApiKey(currency) && getXPaymentsStripePublishableKey(currency));
}

/**
 * Native XPayments S2S charge for PIX and certified local payment methods.
 * Amounts are minor units and the Store-scoped key remains server-side.
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
      reference: input.orderId,
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
 * Embedded payment surface. `card` creates a card-only intent; `other` enables
 * the broad eligible-method set. Provider implementation details stay outside
 * donor-facing copy and API semantics.
 */
export async function createXPaymentsStripeIntent(
  input: CreateStripeIntentInput
): Promise<XPaymentsStripeIntentResponse> {
  const apiKey = getStripeApiKey(input.currency);
  if (!apiKey) throw new Error(`XPAYMENTS_STRIPE_API_KEY_${input.currency} is not configured`);

  if (!Number.isInteger(input.amountMinor) || input.amountMinor <= 0) {
    throw new Error("XPayments embedded amount must be a positive integer in minor units");
  }

  const metadata = cleanObject({
    ...(input.metadata ?? {}),
    merchant_reference: input.orderId,
    order_id: input.orderId,
    source: "together-we-feed",
  });

  const body = new URLSearchParams();
  body.set("amount", String(input.amountMinor));
  body.set("currency", input.currency.toLowerCase());

  if (input.method === "card") {
    body.append("payment_method_types[]", "card");
  } else {
    body.set("automatic_payment_methods[enabled]", "true");
  }

  if (input.customer?.email) body.set("receipt_email", input.customer.email);

  for (const [key, value] of Object.entries(metadata)) {
    body.set(`metadata[${key}]`, String(value));
  }

  const response = await fetch(`${getStripeBaseUrl()}/payment_intents`, {
    method: "POST",
    cache: "no-store",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "x-api-key": apiKey,
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
      "idempotency-key": `twf:${input.orderId}:${input.method}`,
    },
    body,
    signal: AbortSignal.timeout(20_000),
  });

  return readJsonResponse<XPaymentsStripeIntentResponse>(response, "embedded PaymentIntent");
}
