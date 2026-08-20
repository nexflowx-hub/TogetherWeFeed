import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep py-10 text-center text-white">
      <Image
        src="/media/images/logo.webp"
        alt="Together We Feed"
        width={180}
        height={73}
        loading="lazy"
        className="mx-auto mb-3"
      />
      <p className="font-display text-sm font-semibold tracking-wide text-white/90">
        Together We Feed
      </p>
      <p className="mt-2 text-xs text-white/60">
        Alimento, água e cuidados essenciais a cães abandonados no sul da Europa.
      </p>
      <p className="mt-4 text-xs text-white/40">
        Clone para análise · Não é uma página oficial de pagamento
      </p>
    </footer>
  );
}
