"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/i18n/locale-provider";

const RAISED_EUR = 995;
const TOTAL_EUR = 12494;

export function LiveProgress() {
  const { messages, convertFromEur, formatPrice } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [bump, setBump] = useState(RAISED_EUR);

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

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setBump((b) => b + Math.floor(Math.random() * 3) + 1);
    }, 4500);
    return () => clearInterval(id);
  }, [visible]);

  const raisedDisplay = convertFromEur(bump);
  const totalDisplay = convertFromEur(TOTAL_EUR);
  const pct = Math.min(Math.round((bump / TOTAL_EUR) * 100), 100);

  return (
    <section id="ao-vivo" className="bg-navy-deep py-12 text-white sm:py-16">
      <div className="twf-container-narrow" ref={ref}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-warn/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-rose-300">
            <span className="twf-live-dot block h-2 w-2 rounded-full bg-rose-warn" />
            {messages.live.badge}
          </span>
          <span className="text-sm text-white/80 sm:text-base">
            <b className="font-display text-lg text-white sm:text-xl">
              {formatPrice(raisedDisplay)}
            </b>{" "}
            {messages.live.raisedThisMonth}
          </span>
        </div>

        <div
          className="mt-5 h-4 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% ${messages.live.ofGoal}`}
        >
          <div
            className="twf-progress-stripes h-full rounded-full bg-gradient-to-r from-grass to-emerald-400 transition-[width] duration-1000 ease-out"
            style={{ width: visible ? `${Math.max(pct, 7)}%` : "0%" }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-white/80">
          <span>{pct}% {messages.live.ofGoal}</span>
          <span>
            {messages.live.goal}:{" "}
            <strong className="text-white">{formatPrice(totalDisplay)}</strong>
          </span>
        </div>
      </div>
    </section>
  );
}
