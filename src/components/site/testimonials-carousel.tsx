import Image from "next/image";
import { Carousel } from "./carousel";

type Testimonial = {
  img: string;
  alt: string;
  name: string;
  role: string;
  text: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    img: "/media/images/depoimento-01.webp",
    alt: "Milo, adotado por Julia P.",
    name: "Julia P.",
    role: "🐾 Adotou o Milo",
    text: "O Milo é incrível! Ele passou por muito, mas hoje é pura felicidade. Ver esta transformação só me faz agradecer ao Resgate todos os dias! 🙏",
  },
  {
    img: "/media/images/depoimento-02.webp",
    alt: "Nina, adotada por Carla N.",
    name: "Carla N.",
    role: "🐾 Adotou a Nina",
    text: "Recebi a Nina já recuperada e com todas as vacinas. O acompanhamento do abrigo antes e depois da adoção fez toda a diferença.",
  },
  {
    img: "/media/images/depoimento-03.webp",
    alt: "Doador mensal Rafael S.",
    name: "Rafael S.",
    role: "💙 Doador mensal",
    text: "Faço donativos todos os meses e recebo as atualizações com fotografias. Dá para ver exatamente onde o dinheiro foi parar.",
  },
  {
    img: "/media/images/depoimento-04.webp",
    alt: "Luna, adotada por Maria A.",
    name: "Maria A.",
    role: "🐾 Adotou o Luna",
    text: "A Luna chegou tímida e hoje não se desgruda das crianças. Gratidão eterna a quem cuidou dela antes de nós.",
  },
];

export function TestimonialsCarousel() {
  return (
    <section id="depoimentos" className="bg-white py-14 sm:py-20">
      <div className="twf-container">
        <h2 className="twf-section-title text-center text-navy-deep">
          Adoção que transforma vidas
        </h2>

        <div className="mx-auto mt-10 max-w-3xl">
          <Carousel autoplay={6000} ariaLabel="Depoimentos de adoção">
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
                    <p
                      className="text-grass"
                      aria-label="5 estrelas"
                    >
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
