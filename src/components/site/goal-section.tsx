"use client";

import { useEffect, useRef, useState } from "react";

const GOAL_ROWS = [
  { label: "Ração", value: 3858.44 },
  { label: "Medicamentos", value: 1815.11 },
  { label: "Veterinário", value: 3549.08 },
  { label: "Renda", value: 1710.4 },
  { label: "Outros", value: 1560.82 },
];

const RAISED = 995.45;
const TOTAL = 12493.85;
const PERCENT = Math.round((RAISED / TOTAL) * 100);

function euro(n: number) {
  return (
    n.toLocaleString("pt-PT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €"
  );
}

export function GoalSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const max = Math.max(...GOAL_ROWS.map((r) => r.value));
  const ringPct = Math.max(PERCENT, 7);

  return (
    <section id="meta" className="bg-white py-14 sm:py-20">
      <div className="twf-container-narrow" ref={ref}>
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-white to-sky-soft p-6 shadow-2xl ring-1 ring-sky-soft sm:p-8">
          <div className="flex items-center gap-6">
            {/* Progress ring */}
            <div
              className="relative grid h-24 w-24 shrink-0 place-items-center sm:h-28 sm:w-28"
              role="img"
              aria-label={`${PERCENT}% da meta angariada`}
            >
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full -rotate-90"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#bfe6fb"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(visible ? ringPct : 0) * 2.64} 264`}
                  style={{ transition: "stroke-dasharray 1.4s ease-out" }}
                />
              </svg>
              <span className="relative font-display text-2xl font-extrabold text-navy-deep">
                {visible ? ringPct : 0}%
              </span>
            </div>

            <div>
              <div className="font-display text-3xl font-extrabold text-navy-deep sm:text-4xl">
                {visible ? euro(RAISED) : "0,00 €"}
              </div>
              <div className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                angariados este mês
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2.5">
            {GOAL_ROWS.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-2.5 text-sm ring-1 ring-sky-soft"
              >
                <span className="font-semibold text-slate-600">
                  {row.label}
                </span>
                <span className="relative ml-3 flex-1">
                  <span className="block h-1.5 overflow-hidden rounded-full bg-sky-soft">
                    <span
                      className="block h-full rounded-full bg-navy transition-[width] duration-1000 ease-out"
                      style={{
                        width: visible
                          ? `${(row.value / max) * 100}%`
                          : "0%",
                      }}
                    />
                  </span>
                </span>
                <b className="ml-3 font-display text-navy-deep">
                  {euro(row.value)}
                </b>
              </div>
            ))}

            <div className="mt-3 flex items-center justify-between rounded-xl bg-navy-deep px-4 py-3 text-white">
              <b className="font-display text-sm font-bold uppercase tracking-[0.14em]">
                Meta do mês
              </b>
              <b className="font-display text-lg font-extrabold">
                {euro(TOTAL)}
              </b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
