"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { clsx } from "clsx";

/**
 * Below md the children become a native scroll-snap row (one card at a time with the next one
 * peeking); from md up `className` lays them out as usual. The only script is the dots
 * indicator, updated at most once per frame from a passive scroll listener.
 */
export function SwipeRow({ children, count, label, className }: { children: ReactNode; count: number; label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const first = el.firstElementChild as HTMLElement | null;
      if (!first) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
      setActive(atEnd ? count - 1 : Math.round(el.scrollLeft / step));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [count]);

  const go = (i: number) => {
    const el = ref.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    const reduced = document.documentElement.dataset.motion === "reduced";
    el.scrollTo({ left: i * step, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <>
      <div ref={ref} className={clsx("swipe-row", className)} role="group" aria-label={label}>
        {children}
      </div>
      <div className="mt-5 flex items-center justify-center gap-1 md:hidden">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show ${i + 1} of ${count}`}
            aria-current={i === active || undefined}
            className="swipe-dot grid h-6 w-6 place-items-center"
          >
            <span />
          </button>
        ))}
      </div>
    </>
  );
}
