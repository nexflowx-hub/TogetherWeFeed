"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Lock, X, Loader2, Sparkles } from "lucide-react";
import { DONATION_OPTIONS, useDonate } from "./donate-provider";
import { useLocale } from "@/i18n/locale-provider";

type Frequency = "once" | "monthly";

type CheckoutResponse = {
  mode: "demo" | "live";
  sessionId: string;
  url: string | null;
  amount: number;
  currency: string;
  frequency: Frequency;
  error?: string;
};

export function CheckoutDialog() {
  const { selected, selectedId, select, checkoutOpen, closeCheckout, price, label } = useDonate();
  const { messages, currency, locale, presets, formatPrice } = useLocale();
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "redirect" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Derived-state-during-render pattern (avoids setState in effect).
  const [prevOpen, setPrevOpen] = useState(checkoutOpen);
  const [prevSelected, setPrevSelected] = useState(selectedId);
  if (checkoutOpen !== prevOpen || selectedId !== prevSelected) {
    setPrevOpen(checkoutOpen);
    setPrevSelected(selectedId);
    if (checkoutOpen) {
      setStatus("idle");
      setErrorMsg("");
    }
  }

  useEffect(() => {
    if (!checkoutOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCheckout();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [checkoutOpen, closeCheckout]);

  if (!checkoutOpen) return null;

  const m = messages.checkout;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          currency,
          frequency,
          locale,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "checkout_failed");
      }

      const data = (await res.json()) as CheckoutResponse;

      if (data.mode === "live" && data.url) {
        setStatus("redirect");
        // Brief delay so the user sees the confirmation before redirect
        setTimeout(() => {
          window.location.href = data.url!;
        }, 600);
        return;
      }

      // Demo mode — show success screen
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "checkout_failed");
      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-deep/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={m.title}
      onClick={closeCheckout}
    >
      <div
        className="twf-scroll-area relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeCheckout}
          aria-label={m.close}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-sky-soft text-navy-deep transition hover:bg-sky-mid"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-grass/15 text-grass">
              <ShieldCheck className="h-8 w-8" strokeWidth={3} />
            </div>
            <h3 className="font-display text-2xl font-extrabold text-navy-deep">
              {m.successTitle}
            </h3>
            <p className="max-w-sm text-sm text-slate-600">
              <strong className="text-grass">{label}</strong>{" "}
              {frequency === "monthly"
                ? `· ${messages.donate.monthly}`
                : `· ${messages.donate.oneTime}`}
            </p>
            <p className="text-sm text-slate-500">{messages.banner.sub}</p>
            <button type="button" onClick={closeCheckout} className="twf-btn-green mt-2">
              {m.successClose}
            </button>
          </div>
        ) : status === "redirect" ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-grass" />
            <h3 className="font-display text-xl font-bold text-navy-deep">
              {messages.funnel.trustSecure}…
            </h3>
            <p className="text-sm text-slate-500">Stripe · {m.secure}</p>
          </div>
        ) : (
          <>
            {/* Match campaign banner */}
            <div className="mb-4 flex items-start gap-2 rounded-2xl bg-gradient-to-r from-grass/10 to-emerald-100 px-4 py-3 ring-1 ring-grass/20">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-grass" />
              <p className="text-xs font-semibold text-grass-dark">
                {messages.funnel.matchTitle} · {messages.funnel.matchBody}
              </p>
            </div>

            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-grass">
                {m.youAreDonating}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-navy-deep">
                  {label}
                </span>
                <span className="text-sm text-slate-500">
                  {frequency === "monthly"
                    ? `· ${messages.donate.monthly}`
                    : `· ${messages.donate.oneTime}`}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                <span aria-hidden="true">{selected.emoji}</span>{" "}
                {messages.impacts.items[selected.impactKey]}
              </p>
            </div>

            {/* Frequency toggle */}
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-full bg-sky-soft p-1">
              {(
                [
                  { id: "once", label: m.oneTime },
                  { id: "monthly", label: m.monthly },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={frequency === opt.id}
                  onClick={() => setFrequency(opt.id)}
                  className={
                    "rounded-full px-4 py-2.5 text-sm font-bold transition-all " +
                    (frequency === opt.id
                      ? "bg-white text-navy-deep shadow"
                      : "text-slate-500 hover:text-navy-deep")
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Amount selector */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                {m.chooseOther}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {DONATION_OPTIONS.map((opt, idx) => {
                  const active = selectedId === opt.id;
                  const p = presets[idx] ?? opt.priceEur;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => select(opt.id)}
                      aria-pressed={active}
                      className={
                        "min-h-[44px] rounded-xl border-2 px-2 py-2.5 text-sm font-bold transition-all " +
                        (active
                          ? "border-grass bg-grass text-white"
                          : "border-sky-soft bg-white text-navy-deep hover:border-grass/40")
                      }
                    >
                      {formatPrice(p)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-5 flex items-center gap-2 rounded-xl bg-mint-soft px-3 py-2.5 text-xs text-grass-dark">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>{m.secure}</span>
            </div>

            <form className="space-y-3" onSubmit={handleCheckout}>
              {status === "error" && (
                <div className="rounded-xl bg-rose-warn/10 px-3 py-2 text-xs text-rose-warn">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="twf-btn-green-lg w-full disabled:opacity-60"
              >
                {status === "loading" ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                {m.donate} {label}
                {frequency === "monthly" ? ` · ${messages.donate.monthly}` : ""}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
