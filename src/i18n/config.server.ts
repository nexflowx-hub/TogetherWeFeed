// Server-side helpers that read locale/currency from the request cookies
// without importing any client ("use client") module.

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  type LocaleCode,
  type CurrencyCode,
  DEFAULT_CURRENCY,
  CURRENCY_COOKIE,
  ALL_LOCALES,
  ALL_CURRENCIES,
} from "./config";

export function readLocaleFromCookieSafe(
  cookieHeader: string | null | undefined
): LocaleCode {
  if (!cookieHeader) return DEFAULT_LOCALE;
  const match = cookieHeader
    .split("; ")
    .find((c) => c.startsWith(`${LOCALE_COOKIE}=`));
  if (match) {
    const v = decodeURIComponent(match.split("=")[1]) as LocaleCode;
    if ((ALL_LOCALES as string[]).includes(v)) return v;
  }
  return DEFAULT_LOCALE;
}

export function readCurrencyFromCookieSafe(
  cookieHeader: string | null | undefined
): CurrencyCode {
  if (!cookieHeader) return DEFAULT_CURRENCY;
  const match = cookieHeader
    .split("; ")
    .find((c) => c.startsWith(`${CURRENCY_COOKIE}=`));
  if (match) {
    const v = decodeURIComponent(match.split("=")[1]) as CurrencyCode;
    if ((ALL_CURRENCIES as string[]).includes(v)) return v;
  }
  return DEFAULT_CURRENCY;
}
