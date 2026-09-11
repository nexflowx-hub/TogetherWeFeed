"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, CreditCard, Loader2, Lock, RotateCcw, WalletCards } from "lucide-react";

type PaymentElement = {
  mount: (target: HTMLElement) => void;
  destroy: () => void;
};

type PaymentElements = {
  create: (type: "payment", options?: Record<string, unknown>) => PaymentElement;
};

type PaymentIntent = {
  id?: string;
  status?: string;
};

type ConfirmResult = {
  error?: { message?: string; type?: string };
  paymentIntent?: PaymentIntent;
};

type PaymentClient = {
  elements: (options: { clientSecret: string; appearance?: Record<string, unknown> }) => PaymentElements;
  confirmPayment: (options: {
    elements: PaymentElements;
    confirmParams: { return_url: string };
    redirect: "if_required";
  }) => Promise<ConfirmResult>;
};

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => PaymentClient;
  }
}

let paymentJsPromise: Promise<void> | null = null;

function loadPaymentJs(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Stripe) return Promise.resolve();
  if (paymentJsPromise) return paymentJsPromise;

  paymentJsPromise = new Promise<void>((resolve, reject) => {
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

  return paymentJsPromise;
}

type SecurePaymentProps = {
  clientSecret: string;
  publicKey: string;
  reference: string;
  method: "card" | "other";
  amountLabel: string;
  onBack: () => void;
};

function methodTitle(method: SecurePaymentProps["method"]): string {
  return method === "card" ? "Pagar com cartão" : "Outros meios de pagamento";
}

export function XPaymentsSecurePayment({
  clientSecret,
  publicKey,
  reference,
  method,
  amountLabel,
  onBack,
}: SecurePaymentProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<PaymentClient | null>(null);
  const elementsRef = useRef<PaymentElements | null>(null);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmedStatus, setConfirmedStatus] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    let paymentElement: PaymentElement | null = null;

    const setup = async () => {
      try {
        await loadPaymentJs();
        if (disposed || !window.Stripe || !mountRef.current) return;

        const client = window.Stripe(publicKey);
        const elements = client.elements({
          clientSecret,
          appearance: {
            theme: "flat",
            variables: {
              borderRadius: "12px",
              fontFamily: "inherit",
            },
          },
        });

        paymentElement = elements.create("payment", { layout: "tabs" });
        paymentElement.mount(mountRef.current);
        clientRef.current = client;
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
      clientRef.current = null;
      elementsRef.current = null;
    };
  }, [clientSecret, publicKey]);

  const confirm = async () => {
    const client = clientRef.current;
    const elements = elementsRef.current;
    if (!client || !elements) return;

    setSubmitting(true);
    setError("");

    try {
      const result = await client.confirmPayment({
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

      setConfirmedStatus(result.paymentIntent?.status ?? "processing");
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
            ? "Recebemos a confirmação do pagamento. Obrigado pelo seu apoio."
            : "O pedido foi aceite e está a ser processado. Alguns meios de pagamento podem concluir de forma assíncrona."}
        </p>
        <p className="text-xs text-slate-400">Referência: {reference}</p>
        <button type="button" onClick={onBack} className="twf-btn-green">Fechar</button>
      </div>
    );
  }

  return (
    <div className="space-y-5 py-1">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-grass/10 text-grass">
          {method === "card" ? <CreditCard className="h-7 w-7" /> : <WalletCards className="h-7 w-7" />}
        </div>
        <h3 className="font-display text-2xl font-extrabold text-navy-deep">{methodTitle(method)}</h3>
        <p className="mt-1 text-sm text-slate-600">
          {method === "card"
            ? "Introduza os dados do cartão no formulário seguro abaixo."
            : "Escolha uma das opções de pagamento disponíveis para si."}
        </p>
      </div>

      <div className="rounded-2xl border border-sky-soft bg-white p-3 shadow-sm">
        {!ready && !error && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" /> A carregar pagamento seguro…
          </div>
        )}
        <div ref={mountRef} />
      </div>

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
        Pagamento seguro processado pela XPAYMENTS. Os dados sensíveis são tratados no formulário protegido e não passam pelo Together We Feed.
      </p>
    </div>
  );
}
