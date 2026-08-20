"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Carousel({
  children,
  autoplay = 0,
  ariaLabel,
}: {
  children: ReactNode[];
  autoplay?: number;
  ariaLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = children.length;

  const scrollTo = useCallback((idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = (idx + count) % count;
    const slide = track.children[next] as HTMLElement | undefined;
    if (slide) {
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
  }, [count]);

  const next = useCallback(() => scrollTo(active + 1), [active, scrollTo]);
  const prev = useCallback(() => scrollTo(active - 1), [active, scrollTo]);

  // Track scroll position to update active dot
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const slideWidth = track.scrollWidth / count;
        const idx = Math.round(track.scrollLeft / slideWidth);
        if (idx !== active) setActive(idx);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [count, active]);

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      setActive((a) => {
        const n = (a + 1) % count;
        scrollTo(n);
        return n;
      });
    }, autoplay);
    return () => clearInterval(id);
  }, [autoplay, count, scrollTo]);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="region"
        aria-label={ariaLabel}
        className="twf-carousel-track twf-scroll-area flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="twf-carousel-slide w-full shrink-0 px-1"
            aria-hidden={i === active ? undefined : true}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Hide scrollbar for webkit */}
      <style>{`
        .twf-carousel-track::-webkit-scrollbar { display: none; }
      `}</style>

      {count > 1 && (
        <>
          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                aria-current={i === active}
                onClick={() => scrollTo(i)}
                className={
                  "h-2.5 rounded-full transition-all duration-300 " +
                  (i === active
                    ? "w-8 bg-grass"
                    : "w-2.5 bg-sky-mid hover:bg-grass/60")
                }
              />
            ))}
          </div>

          <button
            type="button"
            onClick={prev}
            aria-label="Slide anterior"
            className="absolute left-1 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 text-navy-deep shadow-lg backdrop-blur transition hover:bg-white sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Próximo slide"
            className="absolute right-1 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 text-navy-deep shadow-lg backdrop-blur transition hover:bg-white sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
