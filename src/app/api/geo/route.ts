import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Detects the visitor's country from request headers and returns the
 * recommended locale + currency. The frontend uses this to auto-set the
 * locale/currency on first visit (before the user manually overrides).
 *
 * Supported headers (in priority order):
 *  - Cloudflare: CF-IPCountry
 *  - Vercel: x-vercel-ip-country
 *  - Generic: x-country-code, GEOIP_COUNTRY_CODE
 *  - Fallback: parse Accept-Language for a region hint
 */
export async function GET(req: Request) {
  const headers = req.headers;
  const country =
    headers.get("cf-ipcountry") ||
    headers.get("x-vercel-ip-country") ||
    headers.get("x-country-code") ||
    headers.get("geoip-country-code") ||
    headers.get("x-geo-country") ||
    "";

  const acceptLanguage = headers.get("accept-language") || "";

  // Cache for 1 day on the edge so repeat visits are instant
  return NextResponse.json(
    {
      country: country.toUpperCase() || null,
      acceptLanguage,
      detectedAt: new Date().toISOString(),
    },
    {
      headers: {
        "cache-control": "public, max-age=86400, s-maxage=86400",
      },
    }
  );
}
