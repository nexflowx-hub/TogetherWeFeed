import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";

export default function PaymentCompletePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sky-soft px-4 py-12">
      <section className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-grass/10 text-grass">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-extrabold text-navy-deep">Retorno do pagamento recebido</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          O processador devolveu o controlo ao Together We Feed. Alguns métodos ficam concluídos imediatamente e outros podem permanecer em processamento durante algum tempo.
        </p>
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-sky-soft p-4 text-left text-sm text-slate-600">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-grass" />
          <p>Esta página não assume sucesso financeiro apenas pelo redirecionamento. A confirmação definitiva pertence ao estado registado na XPAYMENTS.</p>
        </div>
        <Link href="/" className="twf-btn-green mt-6 inline-flex min-h-[48px] items-center justify-center px-6">
          Voltar ao Together We Feed
        </Link>
      </section>
    </main>
  );
}
