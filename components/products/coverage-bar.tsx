import { SPECTRUM, spectrumStops, nmToColor } from "@/data/wavelengths";
import type { Product } from "@/data/products";

const W = 1000;
const TICKS = [400, 600, 800, 1000, 1200, 1400, 1600];
const x = (nm: number) => ((nm - SPECTRUM.min) / (SPECTRUM.max - SPECTRUM.min)) * W;

/** Wavelength coverage drawn from the product's spec data (no hand-placed geometry). */
export function CoverageBar({ product, showAxis = false, idSuffix = "" }: { product: Product; showAxis?: boolean; idSuffix?: string }) {
  const w = product.wavelengths;
  const ranges = w.kind === "ranges" ? w.ranges : [];
  const points = w.kind === "discrete" ? w.nm : (w.discrete ?? []);
  const gid = `cov-${product.slug}${idSuffix}`;

  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${W} ${showAxis ? 32 : 24}`} className="w-full overflow-visible" role="img" aria-label={`Wavelength coverage: ${product.wavelengthLabel}`}>
        <defs>
          <linearGradient id={gid} x1="0" x2={W} gradientUnits="userSpaceOnUse">
            {spectrumStops().map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
        <rect x="0" y="10" width={W} height="4" rx="2" fill="rgb(255 255 255 / 0.07)" />
        {ranges.map(([a, b]) => (
          <rect key={`${a}-${b}`} x={x(a)} y="8" width={x(b) - x(a)} height="8" rx="4" fill={`url(#${gid})`} />
        ))}
        {points.map((nm) => (
          <g key={nm}>
            <line x1={x(nm)} x2={x(nm)} y1="2" y2="22" stroke={nmToColor(nm)} strokeWidth="3" strokeLinecap="round" />
            <circle cx={x(nm)} cy="12" r="5" fill={nmToColor(nm)} />
          </g>
        ))}
        {showAxis &&
          TICKS.map((t) => <line key={t} x1={x(t)} x2={x(t)} y1="26" y2="30" stroke="rgb(255 255 255 / 0.25)" />)}
      </svg>
      {/* Axis labels in HTML so they keep a readable size at any width. */}
      {showAxis && (
        <div className="relative mt-1 h-4 font-mono text-[11px] text-fg-2" aria-hidden>
          {TICKS.map((t, i) => (
            <span key={t} className={i % 2 ? "absolute -translate-x-1/2 max-sm:hidden" : "absolute -translate-x-1/2"} style={{ left: `${(x(t) / W) * 100}%` }}>
              {t}
            </span>
          ))}
        </div>
      )}
    </figure>
  );
}
