"use client";

import Image from "next/image";
import { Carousel } from "./carousel";
import { useLocale } from "@/i18n/locale-provider";

export function TestimonialsCarousel() {
  const { messages } = useLocale();
  const TESTIMONIALS = messages.testimonials.items.map((t, i) => ({
    img: `/media/images/depoimento-0${i + 1}.webp`,
    alt: t.name,
    name: t.name,
    role: t.role,
    text: t.text,
  }));

  return (
    <section id="depoimentos" className="bg-white py-14 sm:py-20">
      <div className="twf-container">
        <h2 className="twf-section-title text-center text-navy-deep">
          {messages.testimonials.title}
        </h2>

        <div className="mx-auto mt-10 max-w-3xl">
          <Carousel autoplay={6000} ariaLabel={messages.testimonials.title}>
            {TESTIMONIALS.map((t) => (
              <article
                key={t.name}
                className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-sky-soft"
              >
                <div className="grid gap-0 sm:grid-cols-2">
                  <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto">
                    <Image
                      src={t.img}
                      alt={t.alt}
                      width={900}
                      height={675}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-2 p-6 sm:p-8">
                    <p className="text-grass" aria-label={messages.testimonials.stars}>
                      ★★★★★
                    </p>
                    <h3 className="font-display text-xl font-bold text-navy-deep">
                      {t.name}
                    </h3>
                    <p className="text-sm font-semibold text-grass">{t.role}</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-slate-700">
                      {t.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
