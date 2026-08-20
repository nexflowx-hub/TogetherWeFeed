import Image from "next/image";

export function Hero() {
  return (
    <section
      aria-label="Together We Feed"
      className="relative w-full overflow-hidden bg-navy-deep"
    >
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet="/media/images/hero-mobile.webp"
          type="image/webp"
        />
        <Image
          src="/media/images/hero-desktop.webp"
          alt="Together We Feed — juntos alimentamos vidas"
          width={1920}
          height={800}
          priority
          fetchPriority="high"
          className="block h-auto w-full max-h-[80vh] object-cover"
        />
      </picture>
    </section>
  );
}
