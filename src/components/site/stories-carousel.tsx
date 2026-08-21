"use client";

import Image from "next/image";
import { Carousel } from "./carousel";
import { useLocale } from "@/i18n/locale-provider";

const STORIES = [
  { src: "/media/images/historias-01.webp", alt: "Together We Feed" },
  { src: "/media/images/historias-02.webp", alt: "Together We Feed" },
  { src: "/media/images/historias-03.webp", alt: "Together We Feed" },
  { src: "/media/images/historias-04.webp", alt: "Together We Feed" },
  { src: "/media/images/historias-05.webp", alt: "Together We Feed" },
  { src: "/media/images/historias-06.webp", alt: "Together We Feed" },
];

export function StoriesCarousel() {
  const { messages, locale } = useLocale();
  return (
    <section id="historias" className="bg-sun py-14 sm:py-20">
      <div className="twf-container">
        <h2 className="twf-section-title text-center text-white">
          {messages.stories.title}
        </h2>
        <p className="mt-3 text-center text-base text-white/90 sm:text-lg">
          {messages.stories.subtitle}
        </p>

        <div className="mx-auto mt-10 max-w-4xl">
          <Carousel autoplay={5000} ariaLabel={messages.stories.title}>
            {STORIES.map((s, i) => (
              <div key={s.src} className="overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={1400}
                  height={875}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </Carousel>
        </div>
        <span className="sr-only">{locale}</span>
      </div>
    </section>
  );
}
