"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { products, coversWavelength } from "@/data/products";
import { ATOMIC_LINES, PALETTE, PRESETS, SPECTRUM, nmToColor, spectrumStops, type PaletteNm } from "@/data/wavelengths";
import { clsx as cn } from "clsx"; // client island: no tailwind-merge (saves ~8 KB gz)

const SPAN = SPECTRUM.max - SPECTRUM.min;
const pct = (nm: number) => ((nm - SPECTRUM.min) / SPAN) * 100;
const STOPS = spectrumStops();
const TICKS = [400, 600, 800, 1000, 1200, 1400, 1600];

/** Text colour for a wavelength that keeps ≥ 4.5:1 on the page background (D-19). */
function readable(nm: number) {
  if (nm in PALETTE) return PALETTE[nm as PaletteNm].text;
  if (nm > 900) return "#F4F7FB";
  if (nm < 430) return "#A78BFA";
  return nmToColor(nm);
}

function bandName(nm: number) {
  if (nm < 380) return "Near-UV";
  if (nm < 450) return "Violet";
  if (nm < 495) return "Blue";
  if (nm < 570) return "Green";
  if (nm < 590) return "Yellow";
  if (nm < 620) return "Orange";
  if (nm < 750) return "Red";
  return "Near-infrared (false colour)";
}

export function WavelengthExplorer() {
  const [nm, setNm] = useState(785);
  const trackRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const dragging = useRef(false);

  const fromPointer = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const next = Math.round(SPECTRUM.min + t * SPAN);
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setNm(next));
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    const map: Record<string, number> = {
      ArrowRight: nm + step,
      ArrowUp: nm + step,
      ArrowLeft: nm - step,
      ArrowDown: nm - step,
      PageUp: nm + 50,
      PageDown: nm - 50,
      Home: SPECTRUM.min,
      End: SPECTRUM.max,
    };
    if (e.key in map) {
      e.preventDefault();
      setNm(Math.min(SPECTRUM.max, Math.max(SPECTRUM.min, map[e.key])));
    }
  };

  const matches = useMemo(() => products.filter((p) => coversWavelength(p, nm)), [nm]);
  const apps = useMemo(() => [...new Set(matches.flatMap((p) => p.applications))], [matches]);
  const nearLine = ATOMIC_LINES.find((l) => Math.abs(l.nm - nm) <= 1.5);
  const color = nmToColor(nm);

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10" style={{ ["--beam" as string]: color }}>
      {/* Spectrum + coverage */}
      <div className="lg:col-span-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div aria-live="polite">
            <p className="font-mono text-6xl tracking-tight sm:text-7xl" style={{ color: readable(nm) }}>
              {nm}
              <span className="ml-2 text-2xl text-fg-2">nm</span>
            </p>
            <p className="mt-2 text-sm text-fg-2">
              {bandName(nm)}
              {nearLine && <span className="ml-2 text-fg">· {nearLine.note}</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Preset wavelengths">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setNm(p)}
                aria-pressed={nm === p}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-sm transition-colors",
                  nm === p ? "border-white/40 bg-white/10 text-fg" : "border-line-strong text-fg-2 hover:text-fg",
                )}
              >
                <span className="size-2.5 rounded-full" style={{ background: PALETTE[p].color }} />
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Atomic reference lines: full-size targets in a row (positional labels below are decorative). */}
        <div className="mb-5 flex flex-wrap items-center gap-1.5" role="group" aria-label="Atomic reference lines">
          <span className="mr-1 text-xs text-fg-2">Atomic lines</span>
          {ATOMIC_LINES.map((l) => (
            <button
              key={l.label}
              type="button"
              onClick={() => setNm(Math.round(l.nm))}
              aria-pressed={Math.abs(nm - l.nm) <= 1.5}
              className={cn(
                "min-h-8 rounded-md border px-2.5 font-mono text-xs transition-colors",
                Math.abs(nm - l.nm) <= 1.5 ? "border-white/40 bg-white/10 text-fg" : "border-line text-fg-2 hover:text-fg",
              )}
            >
              {l.label} <span className="text-fg-2">{l.nm}</span>
              <span className="sr-only"> nm, {l.note}</span>
            </button>
          ))}
        </div>

        <div className="relative select-none">
          <div className="relative mb-1.5 h-9 font-mono text-[11px] text-fg-2" aria-hidden>
            {ATOMIC_LINES.map((l) => (
              <span
                key={l.label}
                className={cn("absolute -translate-x-1/2", l.label === "K" || l.label === "Ca⁺" ? "top-0" : "bottom-0")}
                style={{ left: `${pct(l.nm)}%` }}
              >
                {l.label}
              </span>
            ))}
          </div>

          {/* Track (slider) */}
          <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label="Wavelength"
            aria-valuemin={SPECTRUM.min}
            aria-valuemax={SPECTRUM.max}
            aria-valuenow={nm}
            aria-valuetext={`${nm} nanometres, ${matches.length} matching products`}
            onKeyDown={onKey}
            onPointerDown={(e) => {
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              fromPointer(e.clientX);
            }}
            onPointerMove={(e) => {
              if (dragging.current || e.pointerType === "mouse") fromPointer(e.clientX);
            }}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
            className="relative h-14 cursor-crosshair touch-none rounded-md border border-line-strong"
            style={{
              background: `linear-gradient(90deg, ${STOPS.map((s) => `${s.color} ${s.offset * 100}%`).join(",")})`,
            }}
          >
            <div className="absolute inset-0 rounded-md bg-gradient-to-b from-black/10 via-transparent to-black/50" />
            {ATOMIC_LINES.map((l) => (
              <span key={l.label} className="absolute inset-y-0 w-px bg-white/35" style={{ left: `${pct(l.nm)}%` }} aria-hidden />
            ))}
          </div>

          {/* Axis */}
          <div className="relative mt-2 h-5 font-mono text-[11px] text-fg-2" aria-hidden>
            {TICKS.map((t) => (
              <span key={t} className="absolute -translate-x-1/2" style={{ left: `${pct(t)}%` }}>
                {t}
              </span>
            ))}
          </div>

          {/* Coverage rows */}
          <ul className="mt-5 space-y-2.5">
            {products.map((p) => {
              const on = coversWavelength(p, nm);
              const w = p.wavelengths;
              const ranges = w.kind === "ranges" ? w.ranges : [];
              const points = w.kind === "discrete" ? w.nm : (w.discrete ?? []);
              return (
                <li key={p.slug} className={cn("grid grid-cols-[72px_1fr] items-center gap-3 transition-opacity duration-300", on ? "opacity-100" : "opacity-40")}>
                  <span className="font-mono text-xs text-fg">{p.name}</span>
                  <span className="relative h-2.5 rounded-full bg-white/[0.05]">
                    {ranges.map(([a, b]) => (
                      <span
                        key={a}
                        className="absolute inset-y-0 rounded-full"
                        style={{ left: `${pct(a)}%`, width: `${pct(b) - pct(a)}%`, background: `var(--wl-${p.accent})` }}
                      />
                    ))}
                    {points.map((d) => (
                      <span key={d} className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${pct(d)}%`, background: nmToColor(d) }} />
                    ))}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Beam cursor: one full-width layer moved with transform only. */}
          <div className="pointer-events-none absolute inset-x-0 top-9 bottom-0" aria-hidden>
            <div className="h-full w-full transition-transform duration-150 ease-out will-change-transform" style={{ transform: `translateX(${pct(nm)}%)` }}>
              <div className="explorer-beam absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-4">
        <div className="glow-card h-full p-5 sm:p-6" style={{ ["--accent" as string]: color }}>
          <h3 className="eyebrow !text-fg-2">Products at {nm} nm</h3>
          {matches.length ? (
            <ul className="mt-4 space-y-2">
              {matches.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="flex items-center justify-between gap-3 rounded-md border border-line px-3.5 py-3 transition-colors hover:border-line-strong hover:bg-white/[0.03]"
                  >
                    <span>
                      <span className="block font-medium">{p.name}</span>
                      <span className="block text-xs text-fg-2">{p.typeLabel}</span>
                    </span>
                    <span className="font-mono text-xs text-fg-2">{p.wavelengthLabel}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-fg-2">
              No catalogue product covers {nm} nm.{" "}
              <button type="button" data-quote="" className="text-cyan underline-offset-4 hover:underline">
                Ask about a custom configuration
              </button>
              .
            </p>
          )}
          {apps.length > 0 && (
            <>
              <h3 className="eyebrow mt-6 !text-fg-2">Applications</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {apps.map((a) => (
                  <li key={a} className="rounded-full border border-line-strong px-2.5 py-1 text-xs text-fg-2">
                    {a}
                  </li>
                ))}
              </ul>
            </>
          )}
          {matches.some((p) => p.wavelengths.kind === "ranges") && (
            <p className="mt-5 text-xs leading-relaxed text-fg-2">
              Within a wavelength range, output power is diode dependent. Contact us to confirm availability at your wavelength.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
