"use client";

import { DONATION_OPTIONS, useDonate } from "./donate-provider";
import { useLocale } from "@/i18n/locale-provider";

type Variant = "sky" | "navy";

export function DonateSection({
  variant = "sky",
  id = "doar",
}: {
  variant?: Variant;
  id?: string;
}) {
  const { selectedId, select, openCheckout, label } = useDonate();
  const { messages, presets, formatPrice } = useLocale();
  const isSky = variant === "sky";

  return (
    <section
      id={id}
      className={
        isSky ? "bg-sky-soft py-14 sm:py-20" : "bg-navy-deep py-14 sm:py-20 text-white"
      }
    >
      <div className="twf-container">
        <h2
          className={
            isSky
              ? "twf-section-title text-center text-navy-deep"
              : "twf-section-title text-center text-white"
          }
        >
          {messages.donate.title}
        </h2>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {DONATION_OPTIONS.map((opt, idx) => {
            const active = selectedId === opt.id;
            const price = presets[idx] ?? opt.priceEur;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={active}
                aria-label={`${messages.donate.donate} ${formatPrice(price)}`}
                onClick={() => select(opt.id)}
                className={
                  "twf-donate-card " +
                  (active ? "is-selected " : "") +
                  (isSky && !active ? "text-navy-deep" : "")
                }
              >
                <span className="font-display text-2xl font-extrabold sm:text-3xl">
                  {formatPrice(price)}
                </span>
                <span
                  className={
                    "mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] " +
                    (active ? "text-white/80" : "text-grass")
                  }
                >
                  {messages.donate.donate}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button type="button" onClick={openCheckout} className="twf-btn-green-lg">
            {messages.donate.ctaOnce}
          </button>
          <p
            className={
              "mt-4 text-sm " + (isSky ? "text-slate-600" : "text-white/70")
            }
          >
            {messages.donate.secure}
          </p>
        </div>
      </div>
    </section>
  );
}
