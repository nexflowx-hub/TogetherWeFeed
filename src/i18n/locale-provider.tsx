"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CURRENCIES,
  CHECKOUT_CURRENCIES,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  CURRENCY_COOKIE,
  CURRENCY_STORAGE_KEY,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  COUNTRY_COOKIE,
  COUNTRY_STORAGE_KEY,
  ALL_LOCALES,
  getLocaleConfig,
  getCurrencyForCountry,
  getLocaleForCountry,
  getPaymentMethodsForCurrency,
  type CurrencyCode,
  type LocaleCode,
} from "./config";
import { MESSAGES, type Messages } from "./messages";

type LocaleContextValue = {
  locale: LocaleCode;
  currency: CurrencyCode;
  country: string | null;
  messages: Messages;
  setLocale: (code: LocaleCode) => void;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amount: number, opts?: { compact?: boolean }) => string;
  convertFromEur: (eur: number) => number;
  presets: number[];
  paymentMethods: ReturnType<typeof getPaymentMethodsForCurrency>;
  applyGeo: (country: string | null) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStored<T extends string>(
  storageKey: string,
  cookieName: string,
  fallback: T,
  valid: T[]
): T {
  if (typeof document !== "undefined") {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && (valid as string[]).includes(stored)) return stored as T;
    } catch {
      // Storage is best-effort only.
    }
    const match = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${cookieName}=`));
    if (match) {
      const value = decodeURIComponent(match.split("=")[1]);
      if ((valid as string[]).includes(value)) return value as T;
    }
    if (storageKey === LOCALE_STORAGE_KEY) {
      const nav = navigator.language as T;
      if (nav && (valid as string[]).includes(nav)) return nav;
    }
  }
  return fallback;
}

function readStoredCountry(): string | null {
  if (typeof document === "undefined") return null;
  try {
    const stored = localStorage.getItem(COUNTRY_STORAGE_KEY);
    if (stored) return stored;
  } catch {
    // ignore
  }
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COUNTRY_COOKIE}=`));
  if (match) return decodeURIComponent(match.split("=")[1]);
  return null;
}

function persist(storageKey: string, cookieName: string, value: string) {
  if (typeof document === "undefined") return;
  try {
    localStorage.setItem(storageKey, value);
  } catch {
    // ignore
  }
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${cookieName}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
}

const ALL_LOCALES_LIST = ALL_LOCALES;
const ACTIVE_CURRENCIES_LIST = CHECKOUT_CURRENCIES;

function hasUserChosenLocale(): boolean {
  if (typeof document === "undefined") return false;
  try {
    return localStorage.getItem("twf-locale-chosen") === "1";
  } catch {
    return false;
  }
}

function markLocaleChosen() {
  if (typeof document === "undefined") return;
  try {
    localStorage.setItem("twf-locale-chosen", "1");
  } catch {
    // ignore
  }
}

function hasUserChosenCurrency(): boolean {
  if (typeof document === "undefined") return false;
  try {
    return localStorage.getItem("twf-currency-chosen") === "1";
  } catch {
    return false;
  }
}

function markCurrencyChosen() {
  if (typeof document === "undefined") return;
  try {
    localStorage.setItem("twf-currency-chosen", "1");
  } catch {
    // ignore
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(() =>
    readStored<LocaleCode>(
      LOCALE_STORAGE_KEY,
      LOCALE_COOKIE,
      DEFAULT_LOCALE,
      ALL_LOCALES_LIST
    )
  );

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const loc = readStored<LocaleCode>(
      LOCALE_STORAGE_KEY,
      LOCALE_COOKIE,
      DEFAULT_LOCALE,
      ALL_LOCALES_LIST
    );
    const cur = readStored<CurrencyCode>(
      CURRENCY_STORAGE_KEY,
      CURRENCY_COOKIE,
      DEFAULT_CURRENCY,
      ACTIVE_CURRENCIES_LIST
    );
    const localeDefault = getLocaleConfig(loc).defaultCurrency;
    return cur === DEFAULT_CURRENCY && cur !== localeDefault ? localeDefault : cur;
  });

  const [country, setCountry] = useState<string | null>(() => readStoredCountry());

  useEffect(() => {
    document.documentElement.lang = locale.replace("_", "-");
  }, [locale]);

  // Visitor-specific geo lookup. Deliberately no-store: sharing a cached country
  // between donors can route them to the wrong currency/XPayments Store.
  useEffect(() => {
    if (hasUserChosenLocale() && hasUserChosenCurrency()) return;

    let cancelled = false;
    fetch("/api/geo", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { country?: string | null }) => {
        if (cancelled || !data.country) return;

        const geoCountry = data.country.toUpperCase();
        setCountry(geoCountry);
        persist(COUNTRY_STORAGE_KEY, COUNTRY_COOKIE, geoCountry);

        if (!hasUserChosenLocale()) {
          const geoLocale = getLocaleForCountry(geoCountry);
          if (geoLocale !== locale) setLocaleState(geoLocale);
          persist(LOCALE_STORAGE_KEY, LOCALE_COOKIE, geoLocale);
        }

        if (!hasUserChosenCurrency()) {
          const geoCurrency = getCurrencyForCountry(geoCountry);
          if (geoCurrency !== currency) setCurrencyState(geoCurrency);
          persist(CURRENCY_STORAGE_KEY, CURRENCY_COOKIE, geoCurrency);
        }
      })
      .catch(() => {
        // Geo-detection is best-effort; EUR remains the safe default.
      });

    return () => {
      cancelled = true;
    };
  }, []); // intentionally first mount only

  const setLocale = useCallback(
    (code: LocaleCode) => {
      markLocaleChosen();
      setLocaleState(code);
      persist(LOCALE_STORAGE_KEY, LOCALE_COOKIE, code);

      // Language is a presentation preference, not a payment-market signal.
      // Once a visitor country is known, switching PT-PT/PT-BR must not move a
      // donor between the EUR and BRL Stores.
      const marketCurrency = country
        ? getCurrencyForCountry(country)
        : getLocaleConfig(code).defaultCurrency;

      setCurrencyState((prev) => {
        if (!hasUserChosenCurrency() && prev !== marketCurrency) {
          persist(CURRENCY_STORAGE_KEY, CURRENCY_COOKIE, marketCurrency);
          return marketCurrency;
        }
        return prev;
      });
    },
    [country]
  );

  const setCurrency = useCallback((code: CurrencyCode) => {
    if (!ACTIVE_CURRENCIES_LIST.includes(code)) return;
    markCurrencyChosen();
    setCurrencyState(code);
    persist(CURRENCY_STORAGE_KEY, CURRENCY_COOKIE, code);
  }, []);

  const applyGeo = useCallback(
    (geoCountry: string | null) => {
      if (!geoCountry) return;
      const normalisedCountry = geoCountry.toUpperCase();
      setCountry(normalisedCountry);
      persist(COUNTRY_STORAGE_KEY, COUNTRY_COOKIE, normalisedCountry);

      if (!hasUserChosenLocale()) {
        const geoLocale = getLocaleForCountry(normalisedCountry);
        if (geoLocale !== locale) setLocaleState(geoLocale);
        persist(LOCALE_STORAGE_KEY, LOCALE_COOKIE, geoLocale);
      }

      if (!hasUserChosenCurrency()) {
        const geoCurrency = getCurrencyForCountry(normalisedCountry);
        if (geoCurrency !== currency) setCurrencyState(geoCurrency);
        persist(CURRENCY_STORAGE_KEY, CURRENCY_COOKIE, geoCurrency);
      }
    },
    [locale, currency]
  );

  const messages = useMemo(() => MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE], [locale]);
  const currencyConfig = useMemo(() => CURRENCIES[currency] ?? CURRENCIES.EUR, [currency]);

  const convertFromEur = useCallback(
    (eur: number) => Math.round(eur * currencyConfig.rateFromEur),
    [currencyConfig]
  );

  const formatPrice = useCallback(
    (amount: number, opts?: { compact?: boolean }) => {
      const { code, symbol } = currencyConfig;
      try {
        const formatted = new Intl.NumberFormat(locale, {
          style: "currency",
          currency: code,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          notation: opts?.compact ? "compact" : "standard",
        }).format(amount);
        if (code === "BRL") return `R$ ${amount.toLocaleString("pt-BR")}`;
        if (code === "CHF") return `${amount} CHF`;
        return formatted;
      } catch {
        return `${symbol}${amount}`;
      }
    },
    [currencyConfig, locale]
  );

  const paymentMethods = useMemo(
    () => getPaymentMethodsForCurrency(currency, country ?? undefined),
    [currency, country]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      currency,
      country,
      messages,
      setLocale,
      setCurrency,
      formatPrice,
      convertFromEur,
      presets: currencyConfig.presets,
      paymentMethods,
      applyGeo,
    }),
    [
      locale,
      currency,
      country,
      messages,
      setLocale,
      setCurrency,
      formatPrice,
      convertFromEur,
      currencyConfig.presets,
      paymentMethods,
      applyGeo,
    ]
  );

  return (
    <LocaleContext.Provider value={value}>
      <span suppressHydrationWarning data-twf-locale={locale} hidden />
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function readLocaleFromCookie(cookieHeader: string | null): LocaleCode {
  if (!cookieHeader) return DEFAULT_LOCALE;
  const match = cookieHeader
    .split("; ")
    .find((c) => c.startsWith(`${LOCALE_COOKIE}=`));
  if (match) {
    const value = decodeURIComponent(match.split("=")[1]) as LocaleCode;
    if ((ALL_LOCALES_LIST as string[]).includes(value)) return value;
  }
  return DEFAULT_LOCALE;
}

export function readCurrencyFromCookie(cookieHeader: string | null): CurrencyCode {
  if (!cookieHeader) return DEFAULT_CURRENCY;
  const match = cookieHeader
    .split("; ")
    .find((c) => c.startsWith(`${CURRENCY_COOKIE}=`));
  if (match) {
    const value = decodeURIComponent(match.split("=")[1]) as CurrencyCode;
    if ((ACTIVE_CURRENCIES_LIST as string[]).includes(value)) return value;
  }
  return DEFAULT_CURRENCY;
}

export function readCountryFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split("; ")
    .find((c) => c.startsWith(`${COUNTRY_COOKIE}=`));
  if (match) return decodeURIComponent(match.split("=")[1]);
  return null;
}
