"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1400;
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

/**
 * Counts every number inside `value` up from zero when scrolled into view.
 * The final string is server-rendered (no-JS and SEO correct) and an invisible
 * copy reserves its width so the animation can't shift layout.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || document.documentElement.dataset.motion === "reduced") return;
    const parts = value.split(/(\d+(?:\.\d+)?)/);
    const render = (p: number) =>
      parts
        .map((s, i) => {
          if (i % 2 === 0) return s;
          const target = Number(s);
          const decimals = s.includes(".") ? s.split(".")[1].length : 0;
          return (target * p).toFixed(decimals);
        })
        .join("");

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          setDisplay(render(easeOutExpo(t)));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        setDisplay(render(0));
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className={`relative inline-block ${className ?? ""}`}>
      <span className="invisible" aria-hidden>
        {value}
      </span>
      <span className="absolute inset-0" aria-hidden>
        {display}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
