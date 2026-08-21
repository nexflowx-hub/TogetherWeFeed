// Locale + currency configuration for Together We Feed
// Base currency is EUR; each locale maps to a default currency but the
// currency is independently switchable so donors always see familiar units.

export type CurrencyCode = "EUR" | "USD" | "GBP" | "BRL" | "CHF" | "CAD";

export type LocaleCode =
  | "pt-PT"
  | "pt-BR"
  | "en-US"
  | "en-GB"
  | "es-ES"
  | "fr-FR"
  | "de-DE"
  | "it-IT";

export type LocaleConfig = {
  code: LocaleCode;
  label: string; // native name
  flag: string; // emoji flag
  language: string;
  defaultCurrency: CurrencyCode;
  /** ISO 3166-1 alpha-2 country code this locale primarily represents */
  country: string;
  /** Stripe Checkout locale code */
  stripeLocale: string;
};

export type CurrencyConfig = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  // Clean, donation-friendly preset amounts per currency (derived from EUR base)
  presets: number[];
  // Approximate conversion rate from 1 EUR (for live goal display only)
  rateFromEur: number;
  /** Countries whose default currency matches this */
  countries: string[];
};

/**
 * Payment methods to enable per currency. Stripe supports these on Checkout
 * when the currency is compatible — we surface the most relevant ones based
 * on the donor's currency so the experience feels local.
 *
 * Reference: https://stripe.com/docs/payments/payment-methods/supported-currencies
 */
export const PAYMENT_METHODS_BY_CURRENCY: Record<
  CurrencyCode,
  {
    type: string;
    label: string;
    // Restrict to currencies/countries where the method is most relevant
    note?: string;
  }[]
> = {
  EUR: [
    { type: "card", label: "Visa · Mastercard · Amex" },
    { type: "ideal", label: "iDEAL", note: "NL" },
    { type: "bancontact", label: "Bancontact", note: "BE" },
    { type: "sepa_debit", label: "SEPA Direct Debit" },
    { type: "giropay", label: "giropay", note: "DE" },
    { type: "sofort", label: "Sofort" },
    { type: "paypal", label: "PayPal" },
  ],
  USD: [
    { type: "card", label: "Visa · Mastercard · Amex" },
    { type: "ach", label: "ACH Direct Debit" },
    { type: "cashapp", label: "Cash App Pay" },
    { type: "paypal", label: "PayPal" },
    { type: "link", label: "Link" },
  ],
  GBP: [
    { type: "card", label: "Visa · Mastercard · Amex" },
    { type: "bacs_debit", label: "Bacs Direct Debit" },
    { type: "bancontact", label: "Bancontact" },
    { type: "paypal", label: "PayPal" },
  ],
  BRL: [
    { type: "card", label: "Visa · Mastercard · Elo · Hipercard" },
    { type: "boleto", label: "Boleto" },
    { type: "pix", label: "Pix" },
  ],
  CHF: [
    { type: "card", label: "Visa · Mastercard · Amex" },
    { type: "sepa_debit", label: "SEPA Direct Debit" },
    { type: "paypal", label: "PayPal" },
  ],
  CAD: [
    { type: "card", label: "Visa · Mastercard · Amex" },
    { type: "ach", label: "ACH Direct Debit" },
    { type: "paypal", label: "PayPal" },
  ],
};

/** ISO country → default currency (used when geo-detecting the donor) */
export const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  // Eurozone
  AT: "EUR", BE: "EUR", CY: "EUR", DE: "EUR", EE: "EUR", ES: "EUR",
  FI: "EUR", FR: "EUR", GR: "EUR", IE: "EUR", IT: "EUR", LT: "EUR",
  LU: "EUR", LV: "EUR", MT: "EUR", NL: "EUR", PT: "EUR", SK: "EUR",
  SI: "EUR", HR: "EUR",
  // UK / Americas
  GB: "GBP", US: "USD", CA: "CAD", BR: "BRL", MX: "USD",
  // Switzerland / Nordics (still EUR-friendly for donations)
  CH: "CHF", NO: "EUR", SE: "EUR", DK: "EUR",
};

/** ISO country → preferred Stripe Checkout locale */
export const COUNTRY_TO_LOCALE: Record<string, LocaleCode> = {
  PT: "pt-PT", BR: "pt-BR",
  US: "en-US", GB: "en-GB", IE: "en-GB",
  ES: "es-ES", MX: "es-ES", AR: "es-ES", CO: "es-ES",
  FR: "fr-FR", BE: "fr-FR", LU: "fr-FR",
  DE: "de-DE", AT: "de-DE", CH: "de-DE",
  IT: "it-IT",
  NL: "en-US", // fallback to English for unmapped EU
};

export const LOCALES: LocaleConfig[] = [
  { code: "pt-PT", label: "Português (PT)", flag: "🇵🇹", language: "pt", defaultCurrency: "EUR", country: "PT", stripeLocale: "pt" },
  { code: "pt-BR", label: "Português (BR)", flag: "🇧🇷", language: "pt", defaultCurrency: "BRL", country: "BR", stripeLocale: "pt-BR" },
  { code: "en-US", label: "English (US)", flag: "🇺🇸", language: "en", defaultCurrency: "USD", country: "US", stripeLocale: "en" },
  { code: "en-GB", label: "English (UK)", flag: "🇬🇧", language: "en", defaultCurrency: "GBP", country: "GB", stripeLocale: "en-GB" },
  { code: "es-ES", label: "Español", flag: "🇪🇸", language: "es", defaultCurrency: "EUR", country: "ES", stripeLocale: "es" },
  { code: "fr-FR", label: "Français", flag: "🇫🇷", language: "fr", defaultCurrency: "EUR", country: "FR", stripeLocale: "fr" },
  { code: "de-DE", label: "Deutsch", flag: "🇩🇪", language: "de", defaultCurrency: "EUR", country: "DE", stripeLocale: "de" },
  { code: "it-IT", label: "Italiano", flag: "🇮🇹", language: "it", defaultCurrency: "EUR", country: "IT", stripeLocale: "it" },
];

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  EUR: { code: "EUR", symbol: "€", label: "Euro", presets: [5, 10, 20, 35, 50, 100], rateFromEur: 1, countries: ["PT", "ES", "FR", "DE", "IT", "NL", "BE", "AT", "IE", "FI"] },
  USD: { code: "USD", symbol: "$", label: "US Dollar", presets: [5, 10, 20, 35, 50, 100], rateFromEur: 1.08, countries: ["US", "MX", "EC", "SV"] },
  GBP: { code: "GBP", symbol: "£", label: "Pound Sterling", presets: [5, 10, 20, 30, 50, 90], rateFromEur: 0.85, countries: ["GB", "IM", "JE", "GG"] },
  BRL: { code: "BRL", symbol: "R$", label: "Real Brasileiro", presets: [25, 50, 100, 175, 250, 500], rateFromEur: 5.4, countries: ["BR"] },
  CHF: { code: "CHF", symbol: "CHF", label: "Schweizer Franken", presets: [5, 10, 20, 35, 50, 100], rateFromEur: 0.95, countries: ["CH", "LI"] },
  CAD: { code: "CAD", symbol: "$", label: "Canadian Dollar", presets: [7, 15, 28, 48, 70, 135], rateFromEur: 1.47, countries: ["CA"] },
};

export const DEFAULT_LOCALE: LocaleCode = "pt-PT";
export const DEFAULT_CURRENCY: CurrencyCode = "EUR";

export const LOCALE_STORAGE_KEY = "twf-locale";
export const CURRENCY_STORAGE_KEY = "twf-currency";
export const COUNTRY_STORAGE_KEY = "twf-country";
export const LOCALE_COOKIE = "twf-locale";
export const CURRENCY_COOKIE = "twf-currency";
export const COUNTRY_COOKIE = "twf-country";

export function getLocaleConfig(code: LocaleCode): LocaleConfig {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}

export function getCurrencyConfig(code: CurrencyCode): CurrencyConfig {
  return CURRENCIES[code] ?? CURRENCIES.EUR;
}

export function getCurrencyForCountry(country?: string): CurrencyCode {
  if (!country) return DEFAULT_CURRENCY;
  return COUNTRY_TO_CURRENCY[country.toUpperCase()] ?? DEFAULT_CURRENCY;
}

export function getLocaleForCountry(country?: string): LocaleCode {
  if (!country) return DEFAULT_LOCALE;
  return COUNTRY_TO_LOCALE[country.toUpperCase()] ?? DEFAULT_LOCALE;
}

export function getPaymentMethodsForCurrency(currency: CurrencyCode) {
  return PAYMENT_METHODS_BY_CURRENCY[currency] ?? PAYMENT_METHODS_BY_CURRENCY.EUR;
}

export const ALL_LOCALES: LocaleCode[] = LOCALES.map((l) => l.code);
export const ALL_CURRENCIES: CurrencyCode[] = Object.keys(
  CURRENCIES
) as CurrencyCode[];
