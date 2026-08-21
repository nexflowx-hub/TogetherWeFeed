"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";
import { useDonate } from "./donate-provider";
import { DONATION_OPTIONS } from "./donation-options";

// Simulated recent-donor feed. In production this would stream from a
// webhook-backed database; for the demo we synthesize realistic events
// so donors feel social proof throughout their visit.

const CITIES: Record<string, string[]> = {
  pt: ["Lisboa", "Porto", "Faro", "Coimbra", "Setúbal"],
  en: ["London", "Manchester", "Dublin", "Berlin", "Paris"],
  es: ["Madrid", "Barcelona", "Sevilla", "Valencia"],
  fr: ["Paris", "Lyon", "Marseille", "Bordeaux"],
  de: ["Berlin", "München", "Hamburg", "Köln"],
  it: ["Roma", "Milano", "Napoli", "Torino"],
};

const NAMES = ["Ana", "João", "Maria", "Pedro", "Sofia", "Luca", "Emma", "Lucas", "Léa", "Hans", "Carla", "Marco", "Elena", "Tom", "Lena", "Paulo", "Nina", "Rui", "Catarina", "Miguel"];

type Donation = { id: number; name: string; city: string; amountIdx: number; ago: number };

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function SocialProofNotifications() {
  const { locale, formatPrice, presets, messages } = useLocale();
  const { openCheckout } = useDonate();
  const [current, setCurrent] = useState<Donation | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let hideTimeout: ReturnType<typeof setTimeout>;
    let counter = 1;

    const showOne = () => {
      const lang = locale.slice(0, 2);
      const cities = CITIES[lang] ?? CITIES.pt;
      const donation: Donation = {
        id: counter++,
        name: randomFrom(NAMES),
        city: randomFrom(cities),
        amountIdx: Math.floor(Math.random() * DONATION_OPTIONS.length),
        ago: Math.floor(Math.random() * 8) + 1,
      };
      setCurrent(donation);
      setVisible(true);

      hideTimeout = setTimeout(() => setVisible(false), 5000);
      timeout = setTimeout(showOne, 9000 + Math.random() * 4000);
    };

    // First notification after a short delay
    const initial = setTimeout(showOne, 4000);
    return () => {
      clearTimeout(initial);
      clearTimeout(timeout);
      clearTimeout(hideTimeout);
    };
  }, [locale]);

  if (!current) return null;

  const amount = presets[current.amountIdx] ?? 5;
  const f = messages.funnel;

  return (
    <div
      className={
        "fixed bottom-24 left-3 z-30 max-w-[19rem] transition-all duration-500 sm:left-4 " +
        (visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0")
      }
      aria-live="polite"
    >
      <button
        type="button"
        onClick={openCheckout}
        className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-2xl ring-1 ring-sky-soft transition hover:ring-grass/40"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-grass/10 text-grass">
          <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-navy-deep">
            {current.name} {f.from} {current.city}
          </p>
          <p className="truncate text-xs text-slate-500">
            {messages.donate.donate} <strong className="text-grass">{formatPrice(amount)}</strong> · {current.ago} min
          </p>
        </div>
      </button>
    </div>
  );
}
