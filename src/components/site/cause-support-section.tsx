"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  HeartHandshake,
  Loader2,
  PawPrint,
  QrCode,
  ShieldCheck,
  Stethoscope,
  Utensils,
  X,
} from "lucide-react";

import { formatCpf, isValidCpf } from "@/lib/cpf";
import { useLocale } from "@/i18n/locale-provider";
import { useDonate } from "./donate-provider";

type SupportTarget = {
  id: string;
  slug: string;
  title: string;
  category: string;
  type: "cause" | "category" | "campaign";
};

type PixResult = {
  success: boolean;
  reference?: string;
  transactionId?: string | null;
  status?: string;
  action?: {
    copyPaste?: string | null;
    pixString?: string | null;
    qrCode?: string | null;
    qrCodeBase64?: string | null;
    expiresAt?: string | null;
  } | null;
  error?: string;
};

const CATEGORIES = [
  { id: "alimentacao", title: "Alimentação", description: "Apoie alimentação e necessidades essenciais.", icon: Utensils },
  { id: "resgate", title: "Resgate", description: "Ajude ações de proteção e acolhimento imediato.", icon: HeartHandshake },
  { id: "cuidados", title: "Cuidados", description: "Contribua para cuidados e bem-estar animal.", icon: Stethoscope },
  { id: "protecao-animal", title: "Proteção animal", description: "Fortaleça iniciativas dedicadas a animais vulneráveis.", icon: PawPrint },
] as const;

const FEATURED_CAUSE: SupportTarget = {
  id: "together-we-feed",
  slug: "together-we-feed",
  title: "Together We Feed",
  category: "Proteção animal",
  type: "campaign",
};

const PIX_PRESETS = [10, 25, 50, 100, 250];

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function CauseSupportSection() {
  const { currency } = useLocale();
  const { openCheckout } = useDonate();
  const [target, setTarget] = useState<SupportTarget | null>(null);

  const openSupport = (next: SupportTarget) => {
    if (currency !== "BRL") {
      openCheckout();
      return;
    }
    setTarget(next);
  };

  return (
    <section id="causas" className="bg-white py-14 sm:py-20">
      <div className="twf-container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-grass">Escolha como participar</span>
          <h2 className="twf-section-title mt-3 text-navy-deep">Uma causa. Um gesto. Impacto real.</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Apoie diretamente uma causa ou escolha uma área de impacto. No Brasil, o apoio pode ser feito por PIX em poucos passos.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <article className="group relative min-h-[430px] overflow-hidden rounded-[2rem] bg-navy-deep shadow-xl">
            <Image
              src="/media/images/ajuda-hojee.webp"
              alt="Together We Feed"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover opacity-75 transition duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/20">Causa em destaque</span>
              <h3 className="mt-4 font-display text-3xl font-extrabold text-white">Together We Feed</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                Faça parte de uma rede de apoio dedicada à proteção de animais abandonados.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openSupport(FEATURED_CAUSE)}
                  className="twf-btn-green-lg min-w-[190px]"
                >
                  Apoiar agora
                </button>
                <span className="text-sm font-semibold text-white/80">Faça parte desta causa</span>
              </div>
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-2">
            {CATEGORIES.map(({ id, title, description, icon: Icon }) => (
              <article key={id} className="flex min-h-[205px] flex-col rounded-3xl border border-sky-soft bg-sky-soft/45 p-5 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-grass/10 text-grass">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-xl font-extrabold text-navy-deep">{title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
                <button
                  type="button"
                  onClick={() =>
                    openSupport({
                      id: `category-${id}`,
                      slug: id,
                      title,
                      category: title,
                      type: "category",
                    })
                  }
                  className="mt-4 min-h-[44px] rounded-xl bg-navy-deep px-4 text-sm font-extrabold text-white transition hover:bg-navy-deep/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass"
                >
                  Quero ajudar
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>

      {target && <CausePixDialog target={target} onClose={() => setTarget(null)} />}
    </section>
  );
}

function CausePixDialog({ target, onClose }: { target: SupportTarget; onClose: () => void }) {
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PixResult | null>(null);
  const [copied, setCopied] = useState(false);

  const effectiveAmount = useMemo(() => {
    if (!customAmount) return amount;
    const parsed = Number(customAmount.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : 0;
  }, [amount, customAmount]);

  const pixCode = result?.action?.copyPaste ?? result?.action?.pixString ?? "";
  const pixQr = result?.action?.qrCodeBase64 ?? result?.action?.qrCode ?? "";
  const cpfValid = isValidCpf(cpf);
  const canSubmit = effectiveAmount >= 10 && effectiveAmount <= 6000 && name.trim().length >= 3 && cpfValid && ownershipConfirmed;

  const selectAmount = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/checkout/pix", {
        method: "POST",
        cache: "no-store",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          amount: effectiveAmount,
          name: name.trim(),
          cpf,
          ownershipConfirmed,
          target,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as PixResult;
      if (!response.ok || !data.success) throw new Error(data.error || "Não foi possível gerar o PIX.");
      setResult(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível gerar o PIX.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!pixCode) return;
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-navy-deep/70 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label="Apoiar causa com PIX">
      <div className="max-h-[95dvh] w-full overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl sm:max-w-xl sm:rounded-[2rem]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-sky-soft bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-grass">Apoio por PIX</p>
            <h2 className="mt-1 font-display text-xl font-extrabold text-navy-deep">{target.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-soft text-navy-deep" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {result?.success ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-grass/10 text-grass"><QrCode className="h-8 w-8" /></div>
              <div>
                <h3 className="font-display text-2xl font-extrabold text-navy-deep">PIX pronto</h3>
                <p className="mt-1 text-sm text-slate-600">Pague com a conta bancária vinculada ao CPF informado.</p>
              </div>
              {pixQr && (
                <div className="mx-auto w-fit rounded-2xl border border-sky-soft bg-white p-3 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pixQr} alt="QR Code PIX" className="h-56 w-56 max-w-full object-contain" />
                </div>
              )}
              {pixCode && (
                <div className="rounded-2xl bg-sky-soft p-4 text-left">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">PIX Copia e Cola</p>
                  <p className="mt-2 max-h-20 overflow-hidden break-all text-xs text-slate-700">{pixCode}</p>
                  <button type="button" onClick={copy} className="mt-3 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-navy-deep px-4 text-sm font-extrabold text-white">
                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Código copiado" : "Copiar código PIX"}
                  </button>
                </div>
              )}
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-left text-sm leading-relaxed text-amber-950">
                <strong>Importante:</strong> o CPF informado deve ser o mesmo CPF do titular da conta usada para pagar este PIX. Uma titularidade diferente pode impedir a confirmação ou a conciliação do pagamento.
              </div>
              {result.action?.expiresAt && <p className="text-xs text-slate-500">PIX válido até {new Date(result.action.expiresAt).toLocaleString("pt-BR")}.</p>}
              <p className="text-xs text-slate-500">Referência: {result.reference}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <p className="text-sm font-extrabold text-navy-deep">1. Escolha o valor</p>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {PIX_PRESETS.map((value) => (
                    <button key={value} type="button" onClick={() => selectAmount(value)} className={`min-h-[46px] rounded-xl border-2 px-2 text-sm font-extrabold transition ${!customAmount && amount === value ? "border-grass bg-grass text-white" : "border-sky-soft bg-white text-navy-deep hover:border-grass/60"}`}>
                      {money(value)}
                    </button>
                  ))}
                </div>
                <label className="mt-3 block text-xs font-bold text-slate-600">
                  Outro valor
                  <input inputMode="decimal" value={customAmount} onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9.,]/g, "").slice(0, 8))} placeholder="R$ 10 a R$ 6.000" className="mt-1 min-h-[48px] w-full rounded-xl border-2 border-sky-soft px-3.5 text-base text-navy-deep outline-none focus:border-grass" />
                </label>
              </div>

              <div>
                <p className="text-sm font-extrabold text-navy-deep">2. Identifique o pagador</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">Precisamos apenas dos dados necessários para gerar e conciliar o PIX.</p>
                <div className="mt-3 space-y-3">
                  <label className="block text-xs font-bold text-slate-600">
                    Nome completo
                    <input autoComplete="name" value={name} onChange={(e) => setName(e.target.value.slice(0, 120))} required placeholder="Nome do titular da conta" className="mt-1 min-h-[48px] w-full rounded-xl border-2 border-sky-soft px-3.5 text-base text-navy-deep outline-none focus:border-grass" />
                  </label>
                  <label className="block text-xs font-bold text-slate-600">
                    CPF
                    <input inputMode="numeric" autoComplete="off" value={formatCpf(cpf)} onChange={(e) => setCpf(e.target.value.replace(/\D/g, "").slice(0, 11))} required placeholder="000.000.000-00" className={`mt-1 min-h-[48px] w-full rounded-xl border-2 px-3.5 text-base text-navy-deep outline-none ${cpf.length === 11 && !cpfValid ? "border-red-400" : "border-sky-soft focus:border-grass"}`} />
                    {cpf.length === 11 && !cpfValid && <span className="mt-1 block text-xs text-red-600">Verifique o CPF informado.</span>}
                  </label>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-sm leading-relaxed text-amber-950">
                <input type="checkbox" checked={ownershipConfirmed} onChange={(e) => setOwnershipConfirmed(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-emerald-600" required />
                <span><strong>Confirmo que vou pagar usando uma conta bancária vinculada a este mesmo CPF.</strong> Pagamentos de outra titularidade podem falhar ou não ser conciliados corretamente.</span>
              </label>

              {error && <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

              <button type="submit" disabled={!canSubmit || loading} className="twf-btn-green-lg flex min-h-[52px] w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <QrCode className="h-5 w-5" />}
                {loading ? "Gerando PIX..." : `Gerar PIX de ${money(effectiveAmount || 0)}`}
              </button>

              <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-grass" /> Pagamento seguro processado pela XPayments.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
