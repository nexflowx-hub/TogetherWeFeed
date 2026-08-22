"use client";

import { useEffect, useState } from "react";
import { Heart, Share2, X, PartyPopper } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";

export function DonationSuccessBanner() {
  const { messages } = useLocale();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("donation") === "success") {
      setVisible(true);
      // Clean the URL so a refresh doesn't re-show the banner
      const url = new URL(window.location.href);
      url.searchParams.delete("donation");
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: messages.meta.title,
      text: messages.success.headline,
      url: window.location.origin,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(
        `${shareData.text} ${shareData.url}`
      );
    }
  };

  if (!visible || dismissed) return null;

  const m = messages.success;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-navy-deep/70 p-4 pt-[10vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={m.title}
    >
      <div className="relative w-full max-w-lg twf-fade-up overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Gradient top bar */}
        <div className="h-2 bg-gradient-to-r from-grass via-emerald-400 to-teal-400" />

        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
          }}
          aria-label={m.close}
          className="absolute right-4 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-sky-soft text-navy-deep transition hover:bg-sky-mid"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-6 pb-8 pt-8 text-center sm:px-10">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-grass/15 to-emerald-100">
            <PartyPopper className="h-10 w-10 text-grass" />
          </div>

          {/* Title */}
          <h2 className="font-display text-3xl font-extrabold text-navy-deep sm:text-4xl">
            {m.title}
          </h2>

          {/* Headline */}
          <p className="mt-3 text-lg font-semibold text-grass-dark">
            {m.headline}
          </p>

          {/* Body */}
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            {m.body}
          </p>

          {/* Heart divider */}
          <div className="my-6 flex items-center justify-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-sky-soft" />
            <Heart className="h-5 w-5 fill-grass text-grass" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-sky-soft" />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleShare}
              className="twf-btn-green inline-flex items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              {m.share}
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-sky-soft px-6 py-3 text-sm font-bold text-navy-deep transition hover:border-grass/40 hover:bg-sky-soft/50"
            >
              {m.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
