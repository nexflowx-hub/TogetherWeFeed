"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";

// Campaign ends 3 days from first visit (persisted) to create urgency
const CAMPAIGN_DAYS = 3;

function getDeadline() {
  if (typeof window === "undefined") return Date.now() + CAMPAIGN_DAYS * 86400000;
  const key = "twf-campaign-deadline";
  let deadline = Number(window.localStorage.getItem(key));
  if (!deadline || deadline < Date.now()) {
    deadline = Date.now() + CAMPAIGN_DAYS * 86400000;
    window.localStorage.setItem(key, String(deadline));
  }
  return deadline;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function MatchCampaign() {
  const { messages } = useLocale();
  // Lazy init from storage (only runs client-side on first render)
  const [deadline] = useState<number>(() => getDeadline());
  const [remaining, setRemaining] = useState<number>(() =>
    Math.max(0, deadline - Date.now())
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (!mounted) return null;

  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <section className="bg-gradient-to-r from-grass to-emerald-500 py-6 text-white">
      <div className="twf-container flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Flame className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="text-left">
            <h2 className="font-display text-lg font-extrabold leading-tight sm:text-xl">
              {messages.funnel.matchTitle}
            </h2>
            <p className="mt-0.5 max-w-xl text-xs text-white/90 sm:text-sm">
              {messages.funnel.matchBody}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">
            {messages.funnel.countdownEnds}
          </span>
          <div className="flex items-center gap-2 font-display font-extrabold" aria-live="polite">
            <TimeBox value={days} label={messages.funnel.days} />
            <span className="text-2xl">:</span>
            <TimeBox value={pad(hours)} label={messages.funnel.hours} />
            <span className="text-2xl">:</span>
            <TimeBox value={pad(minutes)} label={messages.funnel.minutes} />
            <span className="text-2xl">:</span>
            <TimeBox value={pad(seconds)} label={messages.funnel.seconds} highlight />
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeBox({
  value,
  label,
  highlight,
}: {
  value: number | string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={
          "min-w-[2.4rem] rounded-lg px-2 py-1 text-center text-2xl tabular-nums sm:text-3xl " +
          (highlight ? "bg-white text-grass" : "bg-white/15")
        }
      >
        {value}
      </span>
      <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/70">
        {label}
      </span>
    </div>
  );
}
