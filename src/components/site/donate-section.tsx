"use client";

import { DONATION_OPTIONS, useDonate } from "./donate-provider";

type Variant = "sky" | "navy";

export function DonateSection({
  variant = "sky",
  id = "doar",
  ctaLabel = "Quero ajudar agora",
}: {
  variant?: Variant;
  id?: string;
  ctaLabel?: string;
}) {
  const { selected, select, openCheckout } = useDonate();

  const isSky = variant === "sky";

  return (
    <section
      id={id}
      className={
        isSky
          ? "bg-sky-soft py-14 sm:py-20"
          : "bg-navy-deep py-14 sm:py-20 text-white"
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
          Escolha um valor e salve uma vida
        </h2>

        <div
          role="list"
          className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
        >
          {DONATION_OPTIONS.map((opt) => {
            const active = selected.id === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={active}
                aria-label={`Doar ${opt.label}`}
                onClick={() => select(opt.id)}
                className={
                  "twf-donate-card " +
                  (active ? "is-selected " : "") +
                  (isSky && !active ? "text-navy-deep" : "")
                }
              >
                <span className="font-display text-2xl font-extrabold sm:text-3xl">
                  {opt.label}
                </span>
                <span
                  className={
                    "mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] " +
                    (active
                      ? "text-white/80"
                      : isSky
                        ? "text-grass"
                        : "text-grass")
                  }
                >
                  Doar
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={openCheckout}
            className="twf-btn-green-lg"
          >
            {ctaLabel}
          </button>
          <p
            className={
              "mt-4 text-sm " +
              (isSky ? "text-slate-600" : "text-white/70")
            }
          >
            Doação segura · Pagamento encriptado · Cancela quando quiseres
          </p>
        </div>
      </div>
    </section>
  );
}
