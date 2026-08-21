"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";
import { LOCALES, CURRENCIES, type CurrencyCode, type LocaleCode } from "@/i18n/config";

export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, currency, setLocale, setCurrency, messages } = useLocale();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"lang" | "cur">("lang");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const activeLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
  const activeCurrency = CURRENCIES[currency];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={`${messages.switcher.language} / ${messages.switcher.currency}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={
          "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-colors " +
          (compact
            ? "bg-white/15 text-white hover:bg-white/25"
            : "bg-sky-soft text-navy-deep hover:bg-sky-mid")
        }
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span>{activeLocale.flag}</span>
        <span className="hidden sm:inline">{activeCurrency.code}</span>
        <ChevronDown
          className={"h-3.5 w-3.5 transition-transform " + (open ? "rotate-180" : "")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-sky-soft">
          <div className="grid grid-cols-2 border-b border-sky-soft text-xs font-bold uppercase tracking-[0.1em]">
            <button
              type="button"
              onClick={() => setTab("lang")}
              className={
                "px-4 py-3 transition-colors " +
                (tab === "lang"
                  ? "bg-grass text-white"
                  : "text-slate-500 hover:bg-sky-soft")
              }
            >
              {messages.switcher.language}
            </button>
            <button
              type="button"
              onClick={() => setTab("cur")}
              className={
                "px-4 py-3 transition-colors " +
                (tab === "cur"
                  ? "bg-grass text-white"
                  : "text-slate-500 hover:bg-sky-soft")
              }
            >
              {messages.switcher.currency}
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto twf-scroll-area p-2">
            {tab === "lang"
              ? LOCALES.map((l) => {
                  const active = l.code === locale;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLocale(l.code as LocaleCode);
                      }}
                      className={
                        "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors " +
                        (active
                          ? "bg-sky-soft font-bold text-navy-deep"
                          : "text-slate-700 hover:bg-sky-soft/60")
                      }
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg" aria-hidden="true">
                          {l.flag}
                        </span>
                        {l.label}
                      </span>
                      {active && <Check className="h-4 w-4 text-grass" />}
                    </button>
                  );
                })
              : (Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                  const c = CURRENCIES[code];
                  const active = code === currency;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCurrency(code)}
                      className={
                        "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors " +
                        (active
                          ? "bg-sky-soft font-bold text-navy-deep"
                          : "text-slate-700 hover:bg-sky-soft/60")
                      }
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-display w-8 text-center text-base">
                          {c.symbol}
                        </span>
                        <span>
                          {c.code} · {c.label}
                        </span>
                      </span>
                      {active && <Check className="h-4 w-4 text-grass" />}
                    </button>
                  );
                })}
          </div>
        </div>
      )}
    </div>
  );
}
