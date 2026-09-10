"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";

export function SiteFooter() {
  const { messages } = useLocale();
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
      <p className="mx-auto mt-2 max-w-md text-xs text-white/60">
        {messages.footer.tagline}
      </p>
      <p className="mx-auto mt-4 flex max-w-md items-center justify-center gap-2 text-xs text-white/55">
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        <span>Pagamentos protegidos pela XPAYMENTS.</span>
      </p>
    </footer>
  );
}
