import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

// Receives Stripe webhook events. In production this should verify the
// signature with STRIPE_WEBHOOK_SECRET and persist donations to a database.
// For this demo we log + acknowledge so the integration is wired end-to-end.
export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  const signature = req.headers.get("stripe-signature") ?? "";
  const rawBody = await req.text();

  if (!stripe || !webhookSecret) {
    // Demo mode — acknowledge without verifying
    console.log("[webhook] demo mode — received payload, no verification");
    return NextResponse.json({ received: true, mode: "demo" });
  }

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid_signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[webhook] donation completed:", {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_email,
        metadata: session.metadata,
      });
      // TODO: persist to DB (donation ledger)
      break;
    }
    case "invoice.paid": {
      // Recurring monthly donation
      console.log("[webhook] monthly donation paid:", event.data.object);
      break;
    }
    default:
      // Unhandled event — acknowledge silently
      break;
  }

  return NextResponse.json({ received: true, type: event.type });
}
