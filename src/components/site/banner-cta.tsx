"use client";

import Image from "next/image";
import { useLocale } from "@/i18n/locale-provider";

export function BannerCta() {
  const { messages } = useLocale();
  return (
    <>
      <section aria-label="Together We Feed" className="bg-sky-soft">
        <Image
          src="/media/images/banner-final.webp"
          alt="Together We Feed"
          width={1600}
          height={700}
          loading="lazy"
          className="block h-full max-h-[60vh] w-full object-cover"
        />
      </section>

      <section className="bg-sky-soft py-12 text-center sm:py-16">
        <div className="twf-container">
          <a href="#doar" className="twf-btn-green-lg">
            {messages.banner.cta}
          </a>
          <p className="mt-4 text-base text-slate-600">{messages.banner.sub}</p>
        </div>
      </section>
    </>
  );
}
