"use client";

import { useEffect, useRef, useState } from "react";

const RAISED = 995;
const TOTAL = 12494;
const PERCENT = Math.round((RAISED / TOTAL) * 100);

export function LiveProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [bump, setBump] = useState(RAISED);

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
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Simulate live activity: small bumps
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setBump((b) => b + Math.floor(Math.random() * 3) + 1);
    }, 4500);
    return () => clearInterval(id);
  }, [visible]);

  const pct = Math.min(Math.round((bump / TOTAL) * 100), 100);

  return (
    <section id="ao-vivo" className="bg-navy-deep py-12 text-white sm:py-16">
      <div className="twf-container-narrow" ref={ref}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-warn/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-rose-300">
            <span className="twf-live-dot block h-2 w-2 rounded-full bg-rose-warn" />
            Em direto
          </span>
          <span className="text-sm text-white/80 sm:text-base">
            <b className="font-display text-lg text-white sm:text-xl">{bump} €</b>{" "}
            angariados este mês
          </span>
        </div>

        <div
          className="mt-5 h-4 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% da meta angariada`}
        >
          <div
            className="twf-progress-stripes h-full rounded-full bg-gradient-to-r from-grass to-emerald-400 transition-[width] duration-1000 ease-out"
            style={{ width: visible ? `${Math.max(pct, 7)}%` : "0%" }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-white/80">
          <span>{pct}% da meta</span>
          <span>
            Meta: <strong className="text-white">{TOTAL.toLocaleString("pt-PT")} €</strong>
          </span>
        </div>
      </div>
    </section>
  );
}
