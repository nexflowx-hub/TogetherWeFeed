"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  icon: string;
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
};

const STATS: Stat[] = [
  {
    icon: "🐾",
    value: 4500,
    prefix: "+",
    suffix: "",
    label: "Animais ajudados",
  },
  {
    icon: "🥩",
    value: 150000,
    prefix: "+",
    suffix: "",
    label: "Mil refeições doadas",
  },
];

function formatThousands(n: number) {
  return n.toLocaleString("pt-PT").replace(/,/g, ".");
}

function useCountUp(target: number, run: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, run, duration]);

  return value;
}

function StatCard({ stat, run }: { stat: Stat; run: boolean }) {
  const v = useCountUp(stat.value, run);
  return (
    <article className="flex flex-col items-center gap-2 rounded-3xl bg-white px-6 py-8 text-center shadow-lg shadow-sky-soft/60 ring-1 ring-sky-soft">
      <div className="text-4xl" aria-hidden="true">
        {stat.icon}
      </div>
      <div className="font-display text-4xl font-extrabold text-navy-deep sm:text-5xl">
        {stat.prefix}
        {formatThousands(v)}
        {stat.suffix}
      </div>
      <div className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
        {stat.label}
      </div>
    </article>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRun(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="impacto" className="bg-sky-soft py-14 sm:py-20">
      <div className="twf-container" ref={ref}>
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {STATS.map((s) => (
            <StatCard key={s.label} stat={s} run={run} />
          ))}
        </div>
      </div>
    </section>
  );
}
