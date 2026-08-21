"use client";

import Image from "next/image";
import { useLocale } from "@/i18n/locale-provider";

export function MissionSection() {
  const { messages } = useLocale();
  const m = messages.mission;
  return (
    <section id="missao" className="bg-white py-14 sm:py-20">
      <div className="twf-container">
        <h2 className="twf-prose-block-title text-navy-deep">{m.title}</h2>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5 text-[17px] leading-relaxed text-slate-700">
            <p>{m.p1}</p>
            <p>
              <strong className="text-grass">{m.cared}</strong>.{" "}
              {m.p2}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/media/images/missao-impacto.webp"
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
