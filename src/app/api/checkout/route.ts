import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  CURRENCIES,
  getLocaleConfig,
  getPaymentMethodsForCurrency,
  type CurrencyCode,
  type LocaleCode,
} from "@/i18n/config";

export const runtime = "nodejs";

type CheckoutBody = {
  amount: number;
  currency: CurrencyCode;
  frequency: "once" | "monthly";
  locale?: LocaleCode;
  country?: string;
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

  const { amount, currency, frequency, locale, country } = body;

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
      paymentMethods: getPaymentMethodsForCurrency(currency),
    });
  }

  try {
    // Build the payment method list aligned with the donor's currency.
    // Card is always included; local methods are filtered by Stripe itself
    // based on currency compatibility, so we pass the full relevant set.
    const paymentMethods = getPaymentMethodsForCurrency(currency);
    const localeConfig = locale ? getLocaleConfig(locale) : null;
    const stripeLocale = (localeConfig?.stripeLocale ?? "pt") as
      | "pt"
      | "pt-BR"
      | "en"
      | "en-GB"
      | "es"
      | "fr"
      | "de"
      | "it";

    // Stripe Checkout `payment_method_types` accepts a curated list.
    // We pass "card" + the locally-relevant methods; Stripe ignores any
    // that aren't compatible with the currency.
    const pmTypes = Array.from(
      new Set(paymentMethods.map((m) => m.type))
    );

    const session = await stripe.checkout.sessions.create({
      mode: frequency === "monthly" ? "subscription" : "payment",
      // When passing an array of payment_method_types, Stripe Checkout
      // shows a payment-method picker and only renders methods that
      // support the given currency.
      payment_method_types: pmTypes as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
      payment_method_options: {
        card: { setup_future_usage: "on_session" },
      },
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
      // Email + name are collected inside Stripe Checkout so the donor
      // never types them on our page.
      client_reference_id: `twf_${Date.now()}`,
      metadata: {
        frequency,
        locale: locale || "",
        country: country || "",
        currency,
      },
      success_url: `${req.headers.get("origin") ?? ""}/?donation=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin") ?? ""}/?donation=cancelled`,
      billing_address_collection: "auto",
      // Collect the donor's name + email on the Stripe Checkout page.
      customer_creation: frequency === "monthly" ? "always" : "always",
      allow_promotion_codes: true,
      locale: stripeLocale,
      // Surface relevant wallets/methods aligned with the currency.
      ...(currency === "EUR"
        ? { payment_method_configuration: "pm_eu" }
        : {}),
    });

    return NextResponse.json({
      mode: "live",
      sessionId: session.id,
      url: session.url,
      amount,
      currency,
      frequency,
      paymentMethods,
    });
  } catch (err) {
    console.error("[checkout] stripe error:", err);
    const message = err instanceof Error ? err.message : "stripe_error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
