"use client";

import { DONATION_OPTIONS } from "./donation-options";
import { useDonate } from "./donate-provider";
import { useLocale } from "@/i18n/locale-provider";

export function ImpactsSection() {
  const { messages, presets, formatPrice } = useLocale();
  const { select, openCheckout, selectedId } = useDonate();

  return (
    <section id="impactos" className="bg-white py-14 sm:py-20">
      <div className="twf-container">
        <h2 className="twf-section-title text-center text-navy-deep">
          {messages.impacts.title}
        </h2>
        <p className="twf-subtitle mx-auto max-w-2xl text-center">
          {messages.impacts.subtitle}
        </p>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {DONATION_OPTIONS.map((opt, idx) => {
            const price = presets[idx] ?? opt.priceEur;
            const active = selectedId === opt.id;
            return (
              <article
                key={opt.id}
                className={
                  "twf-impact-row transition-all " +
                  (active ? "ring-2 ring-grass" : "")
                }
              >
                <div className="font-display text-3xl font-extrabold text-grass sm:w-28 sm:text-4xl">
                  {formatPrice(price)}
                </div>
                <p className="flex-1 text-center text-[15px] text-slate-700 sm:text-left sm:text-base">
                  <span className="mr-1" aria-hidden="true">
                    {opt.emoji}
                  </span>
                  {messages.impacts.items[opt.impactKey]}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    select(opt.id);
                    openCheckout();
                  }}
                  className="twf-btn-green shrink-0 text-xs"
                >
                  {messages.donate.donate}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
