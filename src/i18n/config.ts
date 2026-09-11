// Locale + currency configuration for Together We Feed.
//
// Payments are normalised to two merchant markets during launch:
//   - Brazil -> BRL
//   - every other country, including Europe -> EUR
//
// The checkout presents local methods first and keeps provider/routing details
// outside the donor-facing experience.

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
  label: string;
  flag: string;
  language: string;
  defaultCurrency: CurrencyCode;
  country: string;
  stripeLocale: string;
};

export type CurrencyConfig = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  presets: number[];
  rateFromEur: number;
  countries: string[];
};

export type PaymentMethodConfig = {
  type: string;
  label: string;
  note?: string;
  countries?: string[];
};

/** Donor-facing method order. Local payment rails come before generic options. */
export const PAYMENT_METHODS_BY_CURRENCY: Record<CurrencyCode, PaymentMethodConfig[]> = {
  EUR: [
    { type: "mb_way", label: "MB WAY", note: "Pagamento pelo telemóvel", countries: ["PT"] },
    { type: "multibanco", label: "Multibanco", note: "Entidade e referência", countries: ["PT"] },
    { type: "bizum", label: "Bizum", note: "Pagamento pelo telemóvel", countries: ["ES"] },
    { type: "card", label: "Cartão", note: "Pagamento seguro" },
    { type: "other", label: "Outros meios", note: "Ver opções disponíveis" },
  ],
  BRL: [
    { type: "pix", label: "PIX", note: "QR Code + Copia e Cola", countries: ["BR"] },
    { type: "card", label: "Cartão", note: "Pagamento seguro" },
    { type: "other", label: "Outros meios", note: "Ver opções disponíveis" },
  ],
  USD: [
    { type: "card", label: "Cartão" },
    { type: "other", label: "Outros meios" },
  ],
  GBP: [
    { type: "card", label: "Cartão" },
    { type: "other", label: "Outros meios" },
  ],
  CHF: [
    { type: "card", label: "Cartão" },
    { type: "other", label: "Outros meios" },
  ],
  CAD: [
    { type: "card", label: "Cartão" },
    { type: "other", label: "Outros meios" },
  ],
};

/** During launch, every visitor outside Brazil defaults to EUR. */
export const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  BR: "BRL",
};

export const COUNTRY_TO_LOCALE: Record<string, LocaleCode> = {
  PT: "pt-PT", BR: "pt-BR",
  US: "en-US", GB: "en-GB", IE: "en-GB",
  ES: "es-ES", MX: "es-ES", AR: "es-ES", CO: "es-ES",
  FR: "fr-FR", BE: "fr-FR", LU: "fr-FR",
  DE: "de-DE", AT: "de-DE", CH: "de-DE",
  IT: "it-IT",
  NL: "en-US",
};

export const LOCALES: LocaleConfig[] = [
  { code: "pt-PT", label: "Português (PT)", flag: "🇵🇹", language: "pt", defaultCurrency: "EUR", country: "PT", stripeLocale: "pt" },
  { code: "pt-BR", label: "Português (BR)", flag: "🇧🇷", language: "pt", defaultCurrency: "BRL", country: "BR", stripeLocale: "pt-BR" },
  { code: "en-US", label: "English (US)", flag: "🇺🇸", language: "en", defaultCurrency: "EUR", country: "US", stripeLocale: "en" },
  { code: "en-GB", label: "English (UK)", flag: "🇬🇧", language: "en", defaultCurrency: "EUR", country: "GB", stripeLocale: "en-GB" },
  { code: "es-ES", label: "Español", flag: "🇪🇸", language: "es", defaultCurrency: "EUR", country: "ES", stripeLocale: "es" },
  { code: "fr-FR", label: "Français", flag: "🇫🇷", language: "fr", defaultCurrency: "EUR", country: "FR", stripeLocale: "fr" },
  { code: "de-DE", label: "Deutsch", flag: "🇩🇪", language: "de", defaultCurrency: "EUR", country: "DE", stripeLocale: "de" },
  { code: "it-IT", label: "Italiano", flag: "🇮🇹", language: "it", defaultCurrency: "EUR", country: "IT", stripeLocale: "it" },
];

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  EUR: { code: "EUR", symbol: "€", label: "Euro", presets: [5, 10, 20, 35, 50, 100], rateFromEur: 1, countries: ["PT", "ES", "FR", "DE", "IT", "NL", "BE", "AT", "IE"] },
  USD: { code: "USD", symbol: "$", label: "US Dollar", presets: [5, 10, 20, 35, 50, 100], rateFromEur: 1.08, countries: ["US", "MX", "EC", "SV"] },
  GBP: { code: "GBP", symbol: "£", label: "Pound Sterling", presets: [5, 10, 20, 30, 50, 90], rateFromEur: 0.85, countries: ["GB", "IM", "JE", "GG"] },
  BRL: { code: "BRL", symbol: "R$", label: "Real Brasileiro", presets: [25, 50, 100, 175, 250, 500], rateFromEur: 5.4, countries: ["BR"] },
  CHF: { code: "CHF", symbol: "CHF", label: "Schweizer Franken", presets: [5, 10, 20, 35, 50, 100], rateFromEur: 0.95, countries: ["CH", "LI"] },
  CAD: { code: "CAD", symbol: "$", label: "Canadian Dollar", presets: [7, 15, 28, 48, 70, 135], rateFromEur: 1.47, countries: ["CA"] },
};

export const CHECKOUT_CURRENCIES: CurrencyCode[] = ["EUR", "BRL"];

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
  return country.toUpperCase() === "BR" ? "BRL" : "EUR";
}

export function getLocaleForCountry(country?: string): LocaleCode {
  if (!country) return DEFAULT_LOCALE;
  return COUNTRY_TO_LOCALE[country.toUpperCase()] ?? DEFAULT_LOCALE;
}

export function getPaymentMethodsForCurrency(currency: CurrencyCode, country?: string) {
  const methods = PAYMENT_METHODS_BY_CURRENCY[currency] ?? PAYMENT_METHODS_BY_CURRENCY.EUR;
  if (!country) return methods;

  const isoCountry = country.toUpperCase();
  return methods.filter((method) => !method.countries || method.countries.includes(isoCountry));
}

export const ALL_LOCALES: LocaleCode[] = LOCALES.map((l) => l.code);
export const ALL_CURRENCIES: CurrencyCode[] = Object.keys(CURRENCIES) as CurrencyCode[];
