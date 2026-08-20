import Image from "next/image";

export function MissionSection() {
  return (
    <section id="missao" className="bg-white py-14 sm:py-20">
      <div className="twf-container">
        <h2 className="twf-prose-block-title text-navy-deep">
          Da missão ao impacto
        </h2>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5 text-[17px] leading-relaxed text-slate-700">
            <p>
              A <strong className="text-navy-deep">Together We Feed</strong>{" "}
              atua para levar alimento, água e cuidados essenciais a cães
              abandonados e em situação de risco no sul da Europa. Com o apoio
              de pessoas que acreditam nesta causa, já salvámos mais de{" "}
              <strong className="text-grass">1.200 animais</strong> e
              garantimos mais de{" "}
              <strong className="text-grass">150 mil refeições</strong> a cães e
              gatos de rua.
            </p>
            <p>
              Hoje, mais de{" "}
              <strong className="text-grass">150 animais estão sob o nosso cuidado</strong>,
              enquanto muitos outros continuam nas ruas, expostos à fome, à
              sede, ao calor extremo e à falta de medicamentos. Cada
              contribuição ajuda-nos a salvá-los.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/media/images/missao-impacto.webp"
              alt="Cães resgatados pela Together We Feed"
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
