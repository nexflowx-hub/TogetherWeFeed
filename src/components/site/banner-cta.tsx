import Image from "next/image";

export function BannerCta() {
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
            Transformar uma vida
          </a>
          <p className="mt-4 text-base text-slate-600">
            Toda a doação é um ato de amor 🐾
          </p>
        </div>
      </section>
    </>
  );
}
