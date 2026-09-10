import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function normaliseCountry(value: string | null): string | null {
  const country = value?.trim().toUpperCase();
  return country && /^[A-Z]{2}$/.test(country) ? country : null;
}

/**
 * Resolve the visitor country from trusted CDN/proxy headers.
 *
 * IMPORTANT: this response is visitor-specific and MUST NOT be stored in a
 * shared CDN/browser cache. A cached country can silently send a donor to the
 * wrong currency/store and is particularly dangerous when payment API keys
 * are selected by market.
 */
export async function GET(request: NextRequest) {
  const headers = request.headers;
  const country =
    normaliseCountry(headers.get("cf-ipcountry")) ??
    normaliseCountry(headers.get("x-vercel-ip-country")) ??
    normaliseCountry(headers.get("x-country-code")) ??
    normaliseCountry(headers.get("geoip-country-code")) ??
    normaliseCountry(headers.get("x-geo-country"));

  const acceptLanguage = headers.get("accept-language") ?? null;

  return NextResponse.json(
    {
      country,
      acceptLanguage,
      detectedAt: new Date().toISOString(),
    },
    {
      headers: {
        "cache-control": "private, no-store, max-age=0, must-revalidate",
        pragma: "no-cache",
        expires: "0",
        vary: "Accept-Language",
      },
    }
  );
}
