import Image from "next/image";
import { Carousel } from "./carousel";

const STORIES = [
  { src: "/media/images/historias-01.webp", alt: "História de resgate 1" },
  { src: "/media/images/historias-02.webp", alt: "História de resgate 2" },
  { src: "/media/images/historias-03.webp", alt: "História de resgate 3" },
  { src: "/media/images/historias-04.webp", alt: "História de resgate 4" },
  { src: "/media/images/historias-05.webp", alt: "História de resgate 5" },
  { src: "/media/images/historias-06.webp", alt: "História de resgate 6" },
];

export function StoriesCarousel() {
  return (
    <section id="historias" className="bg-sun py-14 sm:py-20">
      <div className="twf-container">
        <h2 className="twf-section-title text-center text-white">
          Histórias de Transformação
        </h2>
        <p className="mt-3 text-center text-base text-white/90 sm:text-lg">
          Estas são algumas das centenas de animais que conseguimos resgatar e
          reabilitar graças ao vosso apoio.
        </p>

        <div className="mx-auto mt-10 max-w-4xl">
          <Carousel autoplay={5000} ariaLabel="Histórias de resgate">
            {STORIES.map((s) => (
              <div
                key={s.src}
                className="overflow-hidden rounded-3xl shadow-2xl"
              >
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
      </div>
    </section>
  );
}
