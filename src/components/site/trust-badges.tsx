"use client";

import { ShieldCheck, Eye, PawPrint } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";

export function TrustBadges({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { messages } = useLocale();
  const f = messages.funnel;
  const isDark = variant === "dark";

  const badges = [
    { icon: ShieldCheck, label: f.trustSecure },
    { icon: Eye, label: f.trustTransparent },
    { icon: PawPrint, label: f.trustImpact },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
      {badges.map((b) => (
        <div
          key={b.label}
          className={
            "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] " +
            (isDark ? "bg-white/10 text-white" : "bg-sky-soft text-navy-deep")
          }
        >
          <b.icon className="h-4 w-4 text-grass" aria-hidden="true" />
          {b.label}
        </div>
      ))}
    </div>
  );
}
