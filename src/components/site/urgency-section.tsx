"use client";

import Image from "next/image";
import { useLocale } from "@/i18n/locale-provider";

export function UrgencySection() {
  const { messages } = useLocale();
  const u = messages.urgency;
  return (
    <section id="urgencia" className="bg-sky-soft py-14 sm:py-20">
      <div className="twf-container">
        <h2 className="twf-prose-block-title text-navy">{u.title}</h2>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="order-2 space-y-5 text-[17px] leading-relaxed text-slate-700 lg:order-1">
            <p>{u.text}</p>
            <a href="#doar" className="twf-btn-green">
              {u.cta}
            </a>
          </div>

          <div className="relative order-1 overflow-hidden rounded-3xl shadow-xl lg:order-2">
            <Image
              src="/media/images/ajuda-hojee.webp"
              alt="Together We Feed"
              width={1400}
              height={900}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
