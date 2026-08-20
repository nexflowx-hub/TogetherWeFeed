"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Lock, X, Check } from "lucide-react";
import { DONATION_OPTIONS, useDonate } from "./donate-provider";

type Frequency = "once" | "monthly";

export function CheckoutDialog() {
  const { selected, checkoutOpen, closeCheckout, select } = useDonate();
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Reset the success screen whenever the dialog re-opens or the
  // selected amount changes. Implemented as derived-state-during-render
  // (the React-recommended pattern) to avoid setState inside an effect.
  const [prevOpen, setPrevOpen] = useState(checkoutOpen);
  const [prevAmount, setPrevAmount] = useState(selected.id);
  if (
    checkoutOpen !== prevOpen ||
    selected.id !== prevAmount
  ) {
    setPrevOpen(checkoutOpen);
    setPrevAmount(selected.id);
    if (checkoutOpen) setSubmitted(false);
  }

  // Esc to close
  useEffect(() => {
    if (!checkoutOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCheckout();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [checkoutOpen, closeCheckout]);

  if (!checkoutOpen) return null;

  const amount = selected.price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-deep/60 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Concluir doação"
      onClick={closeCheckout}
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto twf-scroll-area rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeCheckout}
          aria-label="Fechar"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-sky-soft text-navy-deep transition hover:bg-sky-mid"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-grass/15 text-grass">
              <Check className="h-8 w-8" strokeWidth={3} />
            </div>
            <h3 className="font-display text-2xl font-extrabold text-navy-deep">
              Obrigado por ajudar! 🐾
            </h3>
            <p className="max-w-sm text-sm text-slate-600">
              A sua doação de{" "}
              <strong className="text-grass">{selected.label}</strong> foi
              registada. Este é um clone para análise — nenhum pagamento real
              foi processado.
            </p>
            <p className="text-sm text-slate-500">
              {name ? `Em nome de ${name}, ` : ""}obrigado por fazer parte desta
              missão de amor. 💛
            </p>
            <button
              type="button"
              onClick={closeCheckout}
              className="twf-btn-green mt-2"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-grass">
                Estás a doar
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-navy-deep">
                  {selected.label}
                </span>
                <span className="text-sm text-slate-500">
                  {frequency === "monthly" ? "/ mês" : "pagamento único"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                <span aria-hidden="true">🩵</span> {selected.impact}
              </p>
            </div>

            {/* Frequency toggle */}
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-full bg-sky-soft p-1">
              {(
                [
                  { id: "once", label: "Único" },
                  { id: "monthly", label: "Mensal" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={frequency === opt.id}
                  onClick={() => setFrequency(opt.id)}
                  className={
                    "rounded-full px-4 py-2 text-sm font-bold transition-all " +
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
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Escolher outro valor
              </p>
              <div className="grid grid-cols-3 gap-2">
                {DONATION_OPTIONS.map((opt) => {
                  const active = selected.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => select(opt.id)}
                      aria-pressed={active}
                      className={
                        "rounded-xl border-2 px-2 py-2.5 text-sm font-bold transition-all " +
                        (active
                          ? "border-grass bg-grass text-white"
                          : "border-sky-soft bg-white text-navy-deep hover:border-grass/40")
                      }
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="donor-name"
                  className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500"
                >
                  Nome
                </label>
                <input
                  id="donor-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="O seu nome"
                  className="w-full rounded-xl border border-sky-soft bg-white px-4 py-2.5 text-sm text-navy-deep outline-none transition focus:border-grass focus:ring-2 focus:ring-grass/30"
                />
              </div>
              <div>
                <label
                  htmlFor="donor-email"
                  className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500"
                >
                  Email
                </label>
                <input
                  id="donor-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="o.seu@email.com"
                  className="w-full rounded-xl border border-sky-soft bg-white px-4 py-2.5 text-sm text-navy-deep outline-none transition focus:border-grass focus:ring-2 focus:ring-grass/30"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-mint-soft px-3 py-2 text-xs text-grass-dark">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>
                  Pagamento encriptado e seguro. Receberá um recibo por email.
                </span>
              </div>

              <button type="submit" className="twf-btn-green-lg w-full">
                <Lock className="mr-2 h-4 w-4" aria-hidden="true" />
                Doar {selected.label}
                {frequency === "monthly" ? " / mês" : ""}
              </button>
              <p className="text-center text-xs text-slate-400">
                Demonstração — nenhum pagamento real é processado
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
