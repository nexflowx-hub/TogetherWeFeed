import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { CURRENCIES, type CurrencyCode } from "@/i18n/config";

export const runtime = "nodejs";

type CheckoutBody = {
  amount: number;
  currency: CurrencyCode;
  frequency: "once" | "monthly";
  name?: string;
  email?: string;
  locale?: string;
};

// Stable, friendly product name per locale
function productName(locale?: string) {
  switch (locale?.slice(0, 2)) {
    case "en":
      return "Together We Feed — Donation";
    case "es":
      return "Together We Feed — Donación";
    case "fr":
      return "Together We Feed — Don";
    case "de":
      return "Together We Feed — Spende";
    case "it":
      return "Together We Feed — Donazione";
    default:
      return "Together We Feed — Donativo";
  }
}

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { amount, currency, frequency, name, email, locale } = body;

  if (typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
  }
  if (!CURRENCIES[currency]) {
    return NextResponse.json({ error: "invalid_currency" }, { status: 400 });
  }

  const stripe = getStripe();

  // Demo mode: no Stripe key configured → return a fake checkout URL
  // so the frontend can show a graceful fallback experience.
  if (!stripe) {
    return NextResponse.json({
      mode: "demo",
      sessionId: `demo_${Date.now()}`,
      url: null,
      amount,
      currency,
      frequency,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: frequency === "monthly" ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: Math.round(amount * 100),
            ...(frequency === "monthly"
              ? { recurring: { interval: "month" as const } }
              : {}),
            product_data: {
              name: productName(locale),
              images: ["https://hopeheaart.com/pt/media/images/logo.webp"],
              metadata: { campaign: "together-we-feed", source: "website" },
            },
          },
          quantity: 1,
        },
      ],
      customer_email: email || undefined,
      client_reference_id: `twf_${Date.now()}`,
      metadata: {
        donor_name: name || "",
        donor_email: email || "",
        frequency,
        locale: locale || "",
      },
      success_url: `${req.headers.get("origin") ?? ""}/?donation=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin") ?? ""}/?donation=cancelled`,
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      locale: (locale?.slice(0, 2) as "pt" | "en" | "es" | "fr" | "de" | "it") || "pt",
    });

    return NextResponse.json({
      mode: "live",
      sessionId: session.id,
      url: session.url,
      amount,
      currency,
      frequency,
    });
  } catch (err) {
    console.error("[checkout] stripe error:", err);
    const message = err instanceof Error ? err.message : "stripe_error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
