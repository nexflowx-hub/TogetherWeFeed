import crypto from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type XPaymentsWebhookPayload = {
  event?: string;
  transaction_id?: string;
  reference?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
  method?: string;
  timestamp?: string;
};

const SUPPORTED_EVENTS = new Set(["payment.succeeded", "payment.failed"]);
const MAX_BODY_BYTES = 64 * 1024;

function configuredSecrets(): string[] {
  return Array.from(
    new Set(
      [
        process.env.XPAYMENTS_WEBHOOK_SECRET_EUR,
        process.env.XPAYMENTS_WEBHOOK_SECRET_BRL,
        process.env.XPAYMENTS_WEBHOOK_SECRET,
      ]
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value))
    )
  );
}

function signaturesMatch(rawBody: string, providedSignature: string, secret: string): boolean {
  const normalized = providedSignature.trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(normalized)) return false;

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const providedBuffer = Buffer.from(normalized, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return (
    providedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json({ received: false, error: "payload_too_large" }, { status: 413 });
  }

  const secrets = configuredSecrets();
  if (secrets.length === 0) {
    console.error("[xpayments-webhook] No signing secret configured");
    return NextResponse.json({ received: false, error: "webhook_not_configured" }, { status: 503 });
  }

  const signature =
    req.headers.get("x-nexflowx-signature") ??
    req.headers.get("x-xpayments-signature") ??
    "";

  if (!signature || !secrets.some((secret) => signaturesMatch(rawBody, signature, secret))) {
    console.warn("[xpayments-webhook] Invalid signature");
    return NextResponse.json({ received: false, error: "invalid_signature" }, { status: 401 });
  }

  let payload: XPaymentsWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as XPaymentsWebhookPayload;
  } catch {
    return NextResponse.json({ received: false, error: "invalid_json" }, { status: 400 });
  }

  if (!payload.event || !SUPPORTED_EVENTS.has(payload.event)) {
    // The endpoint intentionally subscribes only to payment lifecycle events.
    // Acknowledge other validly signed events so XPayments does not retry them.
    return NextResponse.json({ received: true, ignored: true });
  }

  if (!payload.transaction_id || !payload.reference || !payload.currency) {
    return NextResponse.json({ received: false, error: "invalid_payload" }, { status: 400 });
  }

  // The frontend repository currently has no durable donations database.
  // XPayments remains the financial source of truth; this receiver securely
  // verifies delivery and is ready to fan out to Supabase/CRM when added.
  console.info("[xpayments-webhook] Verified payment event", {
    event: payload.event,
    transactionId: payload.transaction_id,
    reference: payload.reference,
    currency: payload.currency,
    status: payload.status,
    method: payload.method,
    timestamp: payload.timestamp,
  });

  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "TogetherWeFeed XPayments webhook",
    configured: configuredSecrets().length > 0,
  });
}
