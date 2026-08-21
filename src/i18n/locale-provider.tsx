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
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  CURRENCY_COOKIE,
  CURRENCY_STORAGE_KEY,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  ALL_LOCALES,
  ALL_CURRENCIES,
  getLocaleConfig,
  type CurrencyCode,
  type LocaleCode,
} from "./config";
import { MESSAGES, type Messages } from "./messages";

type LocaleContextValue = {
  locale: LocaleCode;
  currency: CurrencyCode;
  messages: Messages;
  setLocale: (code: LocaleCode) => void;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amount: number, opts?: { compact?: boolean }) => string;
  convertFromEur: (eur: number) => number;
  // Preset donation amounts in the active currency
  presets: number[];
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
      // ignore
    }
    const match = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${cookieName}=`));
    if (match) {
      const v = decodeURIComponent(match.split("=")[1]);
      if ((valid as string[]).includes(v)) return v as T;
    }
    // Browser language hint
    const nav = navigator.language as T;
    if (nav && (valid as string[]).includes(nav)) return nav;
  }
  return fallback;
}

function persist(storageKey: string, cookieName: string, value: string) {
  if (typeof document === "undefined") return;
  try {
    localStorage.setItem(storageKey, value);
  } catch {
    // ignore
  }
  // 1 year cookie so server can read initial locale
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${cookieName}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
}

const ALL_LOCALES_LIST = ALL_LOCALES;
const ALL_CURRENCIES_LIST = ALL_CURRENCIES;

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Lazy initialisation reads from localStorage/cookie/browser on the client's
  // very first render — avoids setState-in-effect and the resulting hydration
  // flash. SSR renders with defaults (safe because the tree is wrapped with
  // suppressHydrationWarning and strings resolve to defaults server-side).
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
      ALL_CURRENCIES_LIST
    );
    const localeDefault = getLocaleConfig(loc).defaultCurrency;
    return cur === DEFAULT_CURRENCY && cur !== localeDefault ? localeDefault : cur;
  });

  // Keep <html lang> in sync for SEO/accessibility
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale.replace("_", "-");
    }
  }, [locale]);

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code);
    persist(LOCALE_STORAGE_KEY, LOCALE_COOKIE, code);
    // Auto-switch currency to the locale's default if the user hasn't
    // manually chosen a currency that differs from the previous locale's default.
    const newDefault = getLocaleConfig(code).defaultCurrency;
    setCurrencyState((prev) => {
      // Only auto-switch if the previous currency was a EUR default-ish scenario
      const prevDefault = getLocaleConfig(
        ALL_LOCALES.find((l) => getLocaleConfig(l).defaultCurrency === prev) ??
          DEFAULT_LOCALE
      ).defaultCurrency;
      if (prev === prevDefault) {
        persist(CURRENCY_STORAGE_KEY, CURRENCY_COOKIE, newDefault);
        return newDefault;
      }
      return prev;
    });
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    persist(CURRENCY_STORAGE_KEY, CURRENCY_COOKIE, code);
  }, []);

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
          minimumFractionDigits: code === "BRL" ? 0 : 0,
          maximumFractionDigits: code === "BRL" ? 0 : 0,
          notation: opts?.compact ? "compact" : "standard",
        }).format(amount);
        // Ensure symbol readability for BRL / CHF
        if (code === "BRL") return `R$ ${amount.toLocaleString("pt-BR")}`;
        if (code === "CHF") return `${amount} CHF`;
        return formatted;
      } catch {
        return `${symbol}${amount}`;
      }
    },
    [currencyConfig, locale]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      currency,
      messages,
      setLocale,
      setCurrency,
      formatPrice,
      convertFromEur,
      presets: currencyConfig.presets,
    }),
    [locale, currency, messages, setLocale, setCurrency, formatPrice, convertFromEur, currencyConfig.presets]
  );

  // Mark hydration boundary (lazy-init already ensures client/server agree
  // on the first paint, but we keep a marker for debugging).
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

// Server-side helper to read locale from cookies (for metadata generation)
export function readLocaleFromCookie(cookieHeader: string | null): LocaleCode {
  if (!cookieHeader) return DEFAULT_LOCALE;
  const match = cookieHeader
    .split("; ")
    .find((c) => c.startsWith(`${LOCALE_COOKIE}=`));
  if (match) {
    const v = decodeURIComponent(match.split("=")[1]) as LocaleCode;
    if ((ALL_LOCALES_LIST as string[]).includes(v)) return v;
  }
  return DEFAULT_LOCALE;
}

export function readCurrencyFromCookie(cookieHeader: string | null): CurrencyCode {
  if (!cookieHeader) return DEFAULT_CURRENCY;
  const match = cookieHeader
    .split("; ")
    .find((c) => c.startsWith(`${CURRENCY_COOKIE}=`));
  if (match) {
    const v = decodeURIComponent(match.split("=")[1]) as CurrencyCode;
    if ((ALL_CURRENCIES_LIST as string[]).includes(v)) return v;
  }
  return DEFAULT_CURRENCY;
}
