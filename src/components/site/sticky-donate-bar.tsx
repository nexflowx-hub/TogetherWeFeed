"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { DONATION_OPTIONS, useDonate } from "./donate-provider";
import { useLocale } from "@/i18n/locale-provider";

export function StickyDonateBar() {
  const { select, openCheckout, selectedId, label } = useDonate();
  const { messages, presets, formatPrice } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={
        "fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 " +
        (visible ? "translate-y-0" : "translate-y-full")
      }
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-3xl px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-sky-soft bg-white/95 p-3 shadow-2xl ring-1 ring-navy/5 backdrop-blur sm:flex-row sm:items-center sm:gap-4 sm:p-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-grass/10 text-grass">
              <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
            </span>
            <span className="font-display text-sm font-bold text-navy-deep">
              {messages.donate.donate}
            </span>
          </div>

          <div className="twf-scroll-area flex flex-1 gap-1.5 overflow-x-auto">
            {DONATION_OPTIONS.map((opt, idx) => {
              const active = selectedId === opt.id;
              const price = presets[idx] ?? opt.priceEur;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => select(opt.id)}
                  aria-pressed={active}
                  className={
                    "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all " +
                    (active
                      ? "bg-grass text-white shadow-md shadow-grass/30"
                      : "bg-sky-soft text-navy-deep hover:bg-sky-mid")
                  }
                >
                  {formatPrice(price)}
                </button>
              );
            })}
          </div>

          <button type="button" onClick={openCheckout} className="twf-btn-green shrink-0">
            {messages.donate.donate} {label}
          </button>
        </div>
      </div>
    </div>
  );
}
