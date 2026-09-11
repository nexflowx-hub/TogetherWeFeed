import { NextResponse } from "next/server";
import {
  getCheckoutPolicy,
  requestCountry,
} from "@/lib/checkout-policy";
import type { XPaymentsCurrency } from "@/lib/xpayments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const requestedCurrency = url.searchParams.get("currency")?.toUpperCase();
  const fallbackCountry = url.searchParams.get("country");
  const country = requestCountry(req, fallbackCountry);

  if (requestedCurrency !== "BRL" && requestedCurrency !== "EUR") {
    return NextResponse.json(
      { enabled: false, error: "Moeda inválida." },
      { status: 400 }
    );
  }

  const currency = requestedCurrency as XPaymentsCurrency;
  const policy = getCheckoutPolicy(country, currency);

  return NextResponse.json({
    enabled: policy.enabled,
    country: policy.country,
    currency: policy.currency,
    methods: policy.methods,
    pixPayerFields: policy.pixPayerFields,
    message: policy.message ?? null,
  });
}
