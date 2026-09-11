"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, CreditCard, Loader2, Lock, RotateCcw, WalletCards } from "lucide-react";

type StripeElement = {
  mount: (target: HTMLElement) => void;
  destroy: () => void;
};

type StripeElements = {
  create: (type: "payment", options?: Record<string, unknown>) => StripeElement;
};

type StripePaymentIntent = {
  id?: string;
  status?: string;
};

type StripeConfirmResult = {
  error?: { message?: string; type?: string };
  paymentIntent?: StripePaymentIntent;
};

type StripeClient = {
  elements: (options: { clientSecret: string; appearance?: Record<string, unknown> }) => StripeElements;
  confirmPayment: (options: {
    elements: StripeElements;
    confirmParams: { return_url: string };
    redirect: "if_required";
  }) => Promise<StripeConfirmResult>;
};

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeClient;
  }
}

let stripeJsPromise: Promise<void> | null = null;

function loadStripeJs(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Stripe) return Promise.resolve();
  if (stripeJsPromise) return stripeJsPromise;

  stripeJsPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://js.stripe.com/v3/"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Não foi possível carregar o pagamento seguro.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Não foi possível carregar o pagamento seguro."));
    document.head.appendChild(script);
  });

  return stripeJsPromise;
}

type StripeDirectPaymentProps = {
  clientSecret: string;
  publicKey: string;
  reference: string;
  method: "mb_way" | "multibanco" | "card";
  amountLabel: string;
  onBack: () => void;
};

function methodTitle(method: StripeDirectPaymentProps["method"]): string {
  if (method === "mb_way") return "MB WAY";
  if (method === "multibanco") return "Multibanco";
  return "Cartão e carteiras digitais";
}

export function StripeDirectPayment({
  clientSecret,
  publicKey,
  reference,
  method,
  amountLabel,
  onBack,
}: StripeDirectPaymentProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stripeRef = useRef<StripeClient | null>(null);
  const elementsRef = useRef<StripeElements | null>(null);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmedStatus, setConfirmedStatus] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    let paymentElement: StripeElement | null = null;

    const setup = async () => {
      try {
        await loadStripeJs();
        if (disposed || !window.Stripe || !mountRef.current) return;

        const stripe = window.Stripe(publicKey);
        const elements = stripe.elements({
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              borderRadius: "12px",
              fontFamily: "inherit",
            },
          },
        });

        paymentElement = elements.create("payment", { layout: "tabs" });
        paymentElement.mount(mountRef.current);
        stripeRef.current = stripe;
        elementsRef.current = elements;
        setReady(true);
      } catch (cause) {
        if (!disposed) {
          setError(cause instanceof Error ? cause.message : "Não foi possível carregar o pagamento seguro.");
        }
      }
    };

    void setup();

    return () => {
      disposed = true;
      paymentElement?.destroy();
      stripeRef.current = null;
      elementsRef.current = null;
    };
  }, [clientSecret, publicKey]);

  const confirm = async () => {
    const stripe = stripeRef.current;
    const elements = elementsRef.current;
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError("");

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/complete`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message || "Não foi possível confirmar o pagamento.");
        return;
      }

      const status = result.paymentIntent?.status ?? "processing";
      setConfirmedStatus(status);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível confirmar o pagamento.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedStatus) {
    const succeeded = confirmedStatus === "succeeded";
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-grass" />
        <h3 className="font-display text-2xl font-extrabold text-navy-deep">
          {succeeded ? "Pagamento confirmado" : "Pagamento em processamento"}
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-slate-600">
          {succeeded
            ? "A confirmação foi recebida pelo processador de pagamento. Obrigado pelo seu apoio."
            : "O pedido foi aceite e está a ser processado. Alguns métodos podem concluir de forma assíncrona."}
        </p>
        <p className="text-xs text-slate-400">Referência: {reference}</p>
        <button type="button" onClick={onBack} className="twf-btn-green">
          Fechar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 py-1">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-grass/10 text-grass">
          {method === "card" ? <WalletCards className="h-7 w-7" /> : <CreditCard className="h-7 w-7" />}
        </div>
        <h3 className="font-display text-2xl font-extrabold text-navy-deep">{methodTitle(method)}</h3>
        <p className="mt-1 text-sm text-slate-600">
          {method === "card"
            ? "Cartão, Apple Pay, Google Pay, Link e outros métodos elegíveis aparecem automaticamente."
            : `Conclua o pagamento de ${amountLabel} através do método selecionado.`}
        </p>
      </div>

      <div className="rounded-2xl border border-sky-soft bg-white p-3 shadow-sm">
        {!ready && !error && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" /> A carregar opções seguras…
          </div>
        )}
        <div ref={mountRef} />
      </div>

      {method === "card" && (
        <p className="rounded-xl bg-sky-soft px-3 py-2 text-xs leading-relaxed text-slate-600">
          Apple Pay e Google Pay só são mostrados quando o browser/dispositivo, o domínio e a conta Stripe da Store são elegíveis.
        </p>
      )}

      {error && <div role="alert" className="rounded-xl bg-rose-warn/10 px-3 py-2 text-sm text-rose-warn">{error}</div>}

      <button
        type="button"
        onClick={confirm}
        disabled={!ready || submitting}
        className="twf-btn-green-lg w-full disabled:opacity-60"
      >
        {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
        {submitting ? "A confirmar…" : `Confirmar ${amountLabel}`}
      </button>

      <button type="button" onClick={onBack} disabled={submitting} className="flex min-h-[44px] w-full items-center justify-center gap-2 text-sm font-semibold text-slate-500">
        <RotateCcw className="h-4 w-4" /> Escolher outro método
      </button>

      <p className="text-center text-[11px] leading-relaxed text-slate-400">
        Processamento XPAYMENTS Stripe Direct. Os dados de cartão são tratados diretamente pelo Stripe.js e não passam pelo Together We Feed.
      </p>
    </div>
  );
}
