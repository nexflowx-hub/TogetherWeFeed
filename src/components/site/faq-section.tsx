"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";

export function FaqSection() {
  const { messages } = useLocale();
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-sky-soft py-14 sm:py-20">
      <div className="twf-container">
        <h2 className="twf-section-title text-center text-navy-deep">
          {messages.faq.title}
        </h2>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {messages.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <article
                key={i}
                className={
                  "overflow-hidden rounded-2xl bg-white shadow-sm ring-1 transition-colors " +
                  (isOpen ? "ring-grass/40" : "ring-sky-soft")
                }
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span className="font-display text-base font-bold text-navy-deep sm:text-lg">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={
                      "h-5 w-5 shrink-0 text-grass transition-transform duration-300 " +
                      (isOpen ? "rotate-180" : "")
                    }
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`faq-panel-${i}`}
                  className={
                    "grid transition-all duration-300 ease-out " +
                    (isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
                  }
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-[15px] leading-relaxed text-slate-600 sm:px-6">
                      {item.a}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
