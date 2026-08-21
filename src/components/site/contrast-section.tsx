"use client";

import { useLocale } from "@/i18n/locale-provider";

export function ContrastSection() {
  const { messages } = useLocale();
  const c = messages.contrast;
  const NO_ITEMS = [c.no1, c.no2, c.no3];

  return (
    <section id="consigo" className="bg-white py-14 sm:py-20">
      <div className="twf-container">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {NO_ITEMS.map((text, i) => (
            <article
              key={i}
              className="relative flex flex-col gap-3 rounded-3xl bg-slate-soft p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-warn/10 text-xl font-bold text-rose-warn">
                ✕
              </div>
              <p className="text-[15px] leading-relaxed text-slate-700">{text}</p>
            </article>
          ))}

          <article className="relative flex flex-col gap-3 rounded-3xl bg-mint-soft p-6 shadow-lg ring-2 ring-grass/30">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-grass/15 text-xl font-bold text-grass">
              ✓
            </div>
            <p className="text-[15px] leading-relaxed text-slate-700">{c.yes}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
