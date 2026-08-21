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
};

export type CurrencyConfig = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  // Clean, donation-friendly preset amounts per currency (derived from EUR base)
  presets: number[];
  // Approximate conversion rate from 1 EUR (for live goal display only)
  rateFromEur: number;
};

export const LOCALES: LocaleConfig[] = [
  { code: "pt-PT", label: "Português (PT)", flag: "🇵🇹", language: "pt", defaultCurrency: "EUR" },
  { code: "pt-BR", label: "Português (BR)", flag: "🇧🇷", language: "pt", defaultCurrency: "BRL" },
  { code: "en-US", label: "English (US)", flag: "🇺🇸", language: "en", defaultCurrency: "USD" },
  { code: "en-GB", label: "English (UK)", flag: "🇬🇧", language: "en", defaultCurrency: "GBP" },
  { code: "es-ES", label: "Español", flag: "🇪🇸", language: "es", defaultCurrency: "EUR" },
  { code: "fr-FR", label: "Français", flag: "🇫🇷", language: "fr", defaultCurrency: "EUR" },
  { code: "de-DE", label: "Deutsch", flag: "🇩🇪", language: "de", defaultCurrency: "EUR" },
  { code: "it-IT", label: "Italiano", flag: "🇮🇹", language: "it", defaultCurrency: "EUR" },
];

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  EUR: { code: "EUR", symbol: "€", label: "Euro", presets: [5, 10, 20, 35, 50, 100], rateFromEur: 1 },
  USD: { code: "USD", symbol: "$", label: "US Dollar", presets: [5, 10, 20, 35, 50, 100], rateFromEur: 1.08 },
  GBP: { code: "GBP", symbol: "£", label: "Pound Sterling", presets: [5, 10, 20, 30, 50, 90], rateFromEur: 0.85 },
  BRL: { code: "BRL", symbol: "R$", label: "Real Brasileiro", presets: [25, 50, 100, 175, 250, 500], rateFromEur: 5.4 },
  CHF: { code: "CHF", symbol: "CHF", label: "Schweizer Franken", presets: [5, 10, 20, 35, 50, 100], rateFromEur: 0.95 },
  CAD: { code: "CAD", symbol: "$", label: "Canadian Dollar", presets: [7, 15, 28, 48, 70, 135], rateFromEur: 1.47 },
};

export const DEFAULT_LOCALE: LocaleCode = "pt-PT";
export const DEFAULT_CURRENCY: CurrencyCode = "EUR";

export const LOCALE_STORAGE_KEY = "twf-locale";
export const CURRENCY_STORAGE_KEY = "twf-currency";
export const LOCALE_COOKIE = "twf-locale";
export const CURRENCY_COOKIE = "twf-currency";

export function getLocaleConfig(code: LocaleCode): LocaleConfig {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}

export function getCurrencyConfig(code: CurrencyCode): CurrencyConfig {
  return CURRENCIES[code] ?? CURRENCIES.EUR;
}

export const ALL_LOCALES: LocaleCode[] = LOCALES.map((l) => l.code);
export const ALL_CURRENCIES: CurrencyCode[] = Object.keys(
  CURRENCIES
) as CurrencyCode[];
