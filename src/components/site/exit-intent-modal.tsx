"use client";

import { useEffect, useState } from "react";
import { X, Heart } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";
import { useDonate } from "./donate-provider";

const DISMISS_KEY = "twf-exit-dismissed";

export function ExitIntentModal() {
  const { messages } = useLocale();
  const { openCheckout } = useDonate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(DISMISS_KEY)) return;

    const onMouseOut = (e: MouseEvent) => {
      // Trigger when the cursor leaves through the top of the viewport
      if (e.clientY <= 0 && !e.relatedTarget) {
        setOpen(true);
        document.removeEventListener("mouseout", onMouseOut);
      }
    };

    // Only enable after the user has engaged a bit (3s)
    const timer = setTimeout(() => {
      document.addEventListener("mouseout", onMouseOut);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  const dismiss = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const f = messages.funnel;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-deep/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={f.exitTitle}
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label={messages.checkout.close}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-sky-soft text-navy-deep transition hover:bg-sky-mid"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-gradient-to-br from-sun to-orange-500 px-6 py-8 text-center text-white">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <Heart className="h-7 w-7 fill-current" aria-hidden="true" />
          </span>
          <h3 className="font-display text-2xl font-extrabold">{f.exitTitle}</h3>
        </div>

        <div className="px-6 py-6 text-center">
          <p className="text-[15px] leading-relaxed text-slate-700">{f.exitBody}</p>

          <button
            type="button"
            onClick={() => {
              dismiss();
              openCheckout();
            }}
            className="twf-btn-green-lg mt-5 w-full"
          >
            {f.exitCta}
          </button>

          <button
            type="button"
            onClick={dismiss}
            className="mt-3 text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            {f.exitNo}
          </button>
        </div>
      </div>
    </div>
  );
}
