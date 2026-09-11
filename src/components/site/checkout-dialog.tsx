"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  QrCode,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import { DONATION_OPTIONS, useDonate } from "./donate-provider";
import { StripeDirectPayment } from "./stripe-direct-payment";
import { useLocale } from "@/i18n/locale-provider";

type PaymentMethod = "pix" | "mb_way" | "multibanco" | "card";
type Status = "idle" | "loading" | "result" | "error";

type PaymentAction = {
  type?: string;
  message?: string;
  url?: string;
  clientSecret?: string;
  publicKey?: string;
  providerTxId?: string;
  paymentMethodTypes?: string[];
  copyPaste?: string;
  pixString?: string;
  qrCode?: string;
  qrCodeBase64?: string;
  qrCodeUrl?: string;
  entity?: string;
  entidade?: string;
  reference?: string;
  referencia?: string;
  amount?: string | number;
  montante?: string | number;
  expiresAt?: string;
};

type CheckoutResponse = {
  success: boolean;
  mode: "demo" | "live";
  provider: "xpayments";
  reference: string;
  transactionId?: string | null;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: string;
  action?: PaymentAction | null;
  error?: string;
};

const METHOD_META: Record<
  PaymentMethod,
  { label: string; short: string; icon: typeof QrCode }
> = {
  pix: { label: "PIX", short: "QR + Copia e Cola", icon: QrCode },
  mb_way: { label: "MB WAY", short: "Prioritário em Portugal", icon: Smartphone },
  multibanco: { label: "Multibanco", short: "Referência / homebanking", icon: Landmark },
  card: { label: "Cartão + wallets", short: "Apple Pay · Google Pay · Link", icon: CreditCard },
};

function fieldClass() {
  return "min-h-[48px] w-full rounded-xl border-2 border-sky-soft bg-white px-3.5 text-base text-navy-deep outline-none transition placeholder:text-slate-400 focus:border-grass";
}

export function CheckoutDialog() {
  const { selected, selectedId, select, checkoutOpen, closeCheckout, price, label } = useDonate();
  const { messages, currency, locale, country, presets, formatPrice, paymentMethods } = useLocale();
  const availableMethods = useMemo(
    () => paymentMethods.map((item) => item.type).filter((item): item is PaymentMethod => item in METHOD_META),
    [paymentMethods]
  );

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<CheckoutResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");

  useEffect(() => {
    if (!checkoutOpen) return;
    const preferred = availableMethods[0] ?? "card";
    if (!availableMethods.includes(method)) setMethod(preferred);
  }, [checkoutOpen, availableMethods, method]);

  useEffect(() => {
    if (!checkoutOpen) return;
    setStatus("idle");
    setErrorMsg("");
    setResult(null);
    setCopied(false);
  }, [checkoutOpen, selectedId, currency]);

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
  const action = result?.action ?? null;
  const pixCode = action?.copyPaste ?? action?.pixString ?? "";
  const pixQr = action?.qrCode ?? action?.qrCodeBase64 ?? action?.qrCodeUrl ?? "";

  const copyPix = async () => {
    if (!pixCode) return;
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const chooseAnotherMethod = () => {
    setResult(null);
    setStatus("idle");
    setErrorMsg("");
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          currency,
          method,
          frequency: "once",
          locale,
          country,
          customer: { name, email, phone, document },
        }),
      });

      const data = (await res.json().catch(() => ({}))) as CheckoutResponse & { error?: string };
      if (!res.ok || data.success === false) {
        throw new Error(data.error || "Não foi possível iniciar o pagamento.");
      }

      setResult(data);
      setStatus("result");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Não foi possível iniciar o pagamento.");
      setStatus("error");
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if (result.mode === "demo") {
      return (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <ShieldCheck className="h-12 w-12 text-grass" />
          <h3 className="font-display text-2xl font-extrabold text-navy-deep">Checkout XPAYMENTS preparado</h3>
          <p className="max-w-sm text-sm leading-relaxed text-slate-600">
            Este ambiente ainda não tem a chave XPAYMENTS de {currency} configurada. Nenhum pagamento foi criado.
          </p>
          <button type="button" onClick={chooseAnotherMethod} className="twf-btn-green">Voltar</button>
        </div>
      );
    }

    if (
      action?.type === "stripe_direct" &&
      action.clientSecret &&
      action.publicKey &&
      result.method !== "pix"
    ) {
      return (
        <StripeDirectPayment
          clientSecret={action.clientSecret}
          publicKey={action.publicKey}
          reference={result.reference}
          method={result.method}
          amountLabel={label}
          onBack={chooseAnotherMethod}
        />
      );
    }

    if (result.method === "pix") {
      return (
        <div className="space-y-5 py-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-grass/10 text-grass">
            <QrCode className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-extrabold text-navy-deep">Pague com PIX</h3>
            <p className="mt-1 text-sm text-slate-600">Abra a app do seu banco e leia o QR Code ou use PIX Copia e Cola.</p>
          </div>
          {pixQr && (
            <div className="mx-auto w-fit rounded-2xl bg-white p-3 shadow-sm ring-1 ring-sky-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pixQr} alt="QR Code PIX para o donativo" className="h-56 w-56 max-w-full object-contain" />
            </div>
          )}
          {pixCode && (
            <div className="rounded-2xl bg-sky-soft p-3 text-left">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">PIX Copia e Cola</p>
              <p className="max-h-20 overflow-hidden break-all text-xs text-slate-700">{pixCode}</p>
              <button type="button" onClick={copyPix} className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-navy-deep px-4 text-sm font-bold text-white">
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado" : "Copiar código PIX"}
              </button>
            </div>
          )}
          <p className="text-xs text-slate-500">Referência: {result.reference}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 py-8 text-center">
        <p className="text-sm text-slate-600">Não foi possível apresentar o método de pagamento.</p>
        <button type="button" onClick={chooseAnotherMethod} className="twf-btn-green">Voltar</button>
      </div>
    );
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
        className="twf-scroll-area relative max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-h-[92vh] sm:rounded-3xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={closeCheckout} aria-label={m.close} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-sky-soft text-navy-deep transition hover:bg-sky-mid">
          <X className="h-5 w-5" />
        </button>

        {status === "result" ? renderResult() : (
          <>
            <div className="mb-5 pr-10">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-grass">{m.youAreDonating}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-navy-deep">{label}</span>
                <span className="text-sm text-slate-500">· {messages.donate.oneTime}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600"><span aria-hidden="true">{selected.emoji}</span>{" "}{messages.impacts.items[selected.impactKey]}</p>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{m.chooseOther}</p>
              <div className="grid grid-cols-3 gap-2">
                {DONATION_OPTIONS.map((opt, idx) => {
                  const active = selectedId === opt.id;
                  const p = presets[idx] ?? opt.priceEur;
                  return (
                    <button key={opt.id} type="button" onClick={() => select(opt.id)} aria-pressed={active} className={"min-h-[46px] rounded-xl border-2 px-2 py-2.5 text-sm font-bold transition-all " + (active ? "border-grass bg-grass text-white" : "border-sky-soft bg-white text-navy-deep hover:border-grass/40")}>
                      {formatPrice(p)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Como quer pagar?</p>
                <span className="text-[11px] font-semibold text-slate-400">{country === "BR" ? "Brasil" : country === "PT" ? "Portugal" : currency}</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {availableMethods.map((code) => {
                  const meta = METHOD_META[code];
                  const Icon = meta.icon;
                  const active = method === code;
                  return (
                    <button key={code} type="button" onClick={() => setMethod(code)} aria-pressed={active} className={"flex min-h-[68px] items-center gap-3 rounded-2xl border-2 px-3 text-left transition-all " + (active ? "border-grass bg-grass/5 shadow-sm" : "border-sky-soft hover:border-grass/40")}>
                      <span className={"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl " + (active ? "bg-grass text-white" : "bg-sky-soft text-navy-deep")}><Icon className="h-5 w-5" /></span>
                      <span><strong className="block text-sm text-navy-deep">{meta.label}</strong><span className="text-[11px] text-slate-500">{meta.short}</span></span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form className="space-y-3" onSubmit={handleCheckout}>
              {method === "pix" && (
                <>
                  <label className="block text-xs font-bold text-slate-600">Nome do pagador<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required maxLength={120} className={fieldClass()} placeholder="Nome completo" /></label>
                  <label className="block text-xs font-bold text-slate-600">CPF ou CNPJ<input value={document} onChange={(e) => setDocument(e.target.value)} inputMode="numeric" autoComplete="off" required maxLength={18} className={fieldClass()} placeholder="Somente números" /></label>
                </>
              )}

              {method === "mb_way" && (
                <label className="block text-xs font-bold text-slate-600">Telemóvel MB WAY<input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" required maxLength={20} className={fieldClass()} placeholder="9XX XXX XXX" /></label>
              )}

              {method === "multibanco" && (
                <label className="block text-xs font-bold text-slate-600">Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" inputMode="email" autoComplete="email" required maxLength={160} className={fieldClass()} placeholder="nome@email.pt" /></label>
              )}

              <div className="flex items-center gap-2 rounded-xl bg-mint-soft px-3 py-2.5 text-xs text-grass-dark"><ShieldCheck className="h-4 w-4 shrink-0" /><span>Pagamento processado de forma segura pela XPAYMENTS.</span></div>

              {status === "error" && <div role="alert" className="rounded-xl bg-rose-warn/10 px-3 py-2 text-sm text-rose-warn">{errorMsg}</div>}

              <button type="submit" disabled={status === "loading"} className="twf-btn-green-lg w-full disabled:opacity-60">
                {status === "loading" ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lock className="mr-2 h-4 w-4" aria-hidden="true" />}
                {status === "loading" ? "A preparar pagamento…" : `Continuar com ${METHOD_META[method].label}`}
              </button>
              <p className="text-center text-[11px] leading-relaxed text-slate-400">Sem donativo recorrente automático nesta fase. O valor mostrado é cobrado uma única vez.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
