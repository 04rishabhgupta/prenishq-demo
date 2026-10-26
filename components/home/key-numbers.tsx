import { CountUp } from "@/components/motion/count-up";

// Each figure is traceable to the catalogue (pp. 3, 5).
const STATS = [
  { value: "369–1600", unit: "nm", label: "Wavelength coverage across the range", accent: "var(--wl-405-text)" },
  { value: "< 100", unit: "kHz", label: "AGATE ECDL linewidth", accent: "var(--wl-520)" },
  { value: "> 2", unit: "W", label: "TA saturated output, fibre-coupled", accent: "var(--wl-785)" },
  { value: "5", unit: "GHz", label: "AGATE mode-hop-free scan", accent: "var(--cyan)" },
];

export function KeyNumbers() {
  return (
    <section aria-label="Key specifications" className="border-b border-line">
      <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="reveal flex flex-col gap-3 border-line py-10 pr-4 max-lg:[&:nth-child(-n+2)]:border-b lg:py-14 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-8 [&:nth-child(even)]:max-lg:border-l [&:nth-child(even)]:max-lg:pl-5"
            style={{ ["--i" as string]: i }}
          >
            <dt className="order-2 max-w-[16ch] text-sm leading-snug text-fg-2">{s.label}</dt>
            <dd className="order-1 flex items-baseline gap-1.5 font-mono">
              <CountUp value={s.value} className="text-[1.6rem] tracking-tight text-fg sm:text-5xl" />
              <span className="text-base sm:text-lg" style={{ color: s.accent }}>
                {s.unit}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
