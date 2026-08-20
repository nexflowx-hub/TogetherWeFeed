import Image from "next/image";

export function UrgencySection() {
  return (
    <section id="urgencia" className="bg-sky-soft py-14 sm:py-20">
      <div className="twf-container">
        <h2 className="twf-prose-block-title text-navy">
          Eles precisam de ajuda hoje
        </h2>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1 space-y-5 text-[17px] leading-relaxed text-slate-700">
            <p>
              <strong className="text-navy">
                O calor, a fome e os cuidados veterinários não podem esperar.
              </strong>{" "}
              A sua contribuição ajuda-nos a alimentar, tratar e proteger cães
              que dependem de nós todos os dias.
            </p>
            <a href="#doar" className="twf-btn-green">
              Quero ajudar agora
            </a>
          </div>

          <div className="order-1 lg:order-2 relative overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/media/images/ajuda-hojee.webp"
              alt="Cão à espera de ajuda"
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
