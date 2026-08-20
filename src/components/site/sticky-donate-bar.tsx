"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { DONATION_OPTIONS, useDonate } from "./donate-provider";

export function StickyDonateBar() {
  const { selected, select, openCheckout } = useDonate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past the hero + video area (~700px)
      setVisible(window.scrollY > 700);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={
        "fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 " +
        (visible ? "translate-y-0" : "translate-y-full")
      }
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-3xl px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-sky-soft bg-white/95 p-3 shadow-2xl ring-1 ring-navy/5 backdrop-blur sm:flex-row sm:items-center sm:gap-4 sm:p-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-grass/10 text-grass">
              <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
            </span>
            <span className="font-display text-sm font-bold text-navy-deep">
              Doe agora
            </span>
          </div>

          <div className="flex flex-1 gap-1.5 overflow-x-auto twf-scroll-area">
            {DONATION_OPTIONS.map((opt) => {
              const active = selected.id === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => select(opt.id)}
                  aria-pressed={active}
                  className={
                    "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all " +
                    (active
                      ? "bg-grass text-white shadow-md shadow-grass/30"
                      : "bg-sky-soft text-navy-deep hover:bg-sky-mid")
                  }
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={openCheckout}
            className="twf-btn-green shrink-0"
          >
            Doar {selected.label}
          </button>
        </div>
      </div>
    </div>
  );
}
