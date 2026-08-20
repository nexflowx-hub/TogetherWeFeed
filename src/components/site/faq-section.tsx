"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Faq = { q: string; a: string };

const FAQS: Faq[] = [
  {
    q: "Como são utilizados os donativos?",
    a: "Os donativos financiam a alimentação, cuidados veterinários, medicamentos, tratamentos e as despesas básicas do abrigo. Cada valor recebido ajuda diretamente os mais de 500 animais resgatados.",
  },
  {
    q: "Quem mantém e administra o abrigo?",
    a: "O abrigo é mantido por donativos e administrado pela Luana e por uma equipa dedicada de voluntários e colaboradores, que trabalham todos os dias para garantir o bem-estar dos animais.",
  },
  {
    q: "Os donativos fazem realmente a diferença?",
    a: "Sim. Cada contribuição, por mais pequena que pareça, ajuda a manter o abrigo a funcionar — desde a ração diária aos cuidados veterinários. Já salvámos mais de 4.500 vidas graças ao apoio de pessoas como você.",
  },
  {
    q: "Os donativos são seguros?",
    a: "Sim. O pagamento é processado por plataforma segura e auditada, com os mesmos padrões de qualquer compra online.",
  },
  {
    q: "Como acompanho o impacto do meu donativo?",
    a: "Publicamos atualizações com frequência nas redes sociais e no site, mostrando melhorias, conquistas e histórias reais dos animais beneficiados. Transparência e gratidão são pilares da nossa missão.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-sky-soft py-14 sm:py-20">
      <div className="twf-container">
        <h2 className="twf-section-title text-center text-navy-deep">
          Perguntas frequentes 🩵
        </h2>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <article
                key={i}
                className={
                  "overflow-hidden rounded-2xl bg-white shadow-sm ring-1 transition-colors " +
                  (isOpen ? "ring-grass/40" : "ring-sky-soft")
                }
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span className="font-display text-base font-bold text-navy-deep sm:text-lg">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={
                      "h-5 w-5 shrink-0 text-grass transition-transform duration-300 " +
                      (isOpen ? "rotate-180" : "")
                    }
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`faq-panel-${i}`}
                  className={
                    "grid transition-all duration-300 ease-out " +
                    (isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0")
                  }
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-[15px] leading-relaxed text-slate-600 sm:px-6">
                      {item.a}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
