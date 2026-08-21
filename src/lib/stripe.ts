import Stripe from "stripe";

/**
 * Stripe client singleton.
 *
 * Reads the secret key from STRIPE_SECRET_KEY. When the env var is missing
 * (e.g. local demo / preview), `getStripe()` returns null and the checkout
 * API falls back to demo mode (no real charge is made).
 */
let stripeInstance: Stripe | null = null;
let checked = false;

export function getStripe(): Stripe | null {
  if (checked) return stripeInstance;
  checked = true;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "sk_test_placeholder") {
    return null;
  }
  try {
    stripeInstance = new Stripe(key, {
      apiVersion: "2025-08-27.basil" as Stripe.LatestApiVersion,
      typescript: true,
    });
  } catch (e) {
    console.error("[stripe] failed to initialise:", e);
    stripeInstance = null;
  }
  return stripeInstance;
}

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export function isStripeConfigured(): boolean {
  return getStripe() !== null;
}
