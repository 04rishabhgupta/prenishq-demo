import { Picture } from "@/components/media/picture";
import { ButtonLink, QuoteButton } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { productBySlug } from "@/data/products";
import { PALETTE } from "@/data/wavelengths";

const OPAL = productBySlug.opal;

/**
 * Hero: a laser beam (ReactBits LaserFlow, WebGL, mounted lazily by lib/fx) falls onto the
 * OPAL card and cycles through OPAL's five catalogue wavelengths. Server-rendered with a
 * CSS beam as the fallback, so first paint and LCP never wait for WebGL.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      data-hero
      data-laser-scope
      data-wl-cycle
      className="relative isolate overflow-hidden border-b border-line"
      style={{ ["--beam" as string]: PALETTE[405].color }}
    >
      {/* Background: dot matrix + Aceternity spotlight */}
      <div aria-hidden className="dot-grid absolute inset-0 -z-20 [mask-image:radial-gradient(80%_70%_at_30%_30%,#000,transparent)]" />
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="spotlight" />
      </div>
      {/* WebGL beam mounts here on desktop (full hero, behind text, above background). */}
      <div aria-hidden data-laserflow className="pointer-events-none absolute inset-0 z-0" />

      <div className="container-x relative grid gap-10 pb-16 pt-14 sm:pt-20 lg:min-h-[min(820px,calc(100svh-var(--header-h)))] lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-20">
        <div className="relative z-10 lg:col-span-6">
          <p className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-cyan">
            <span className="inline-block size-1.5 rounded-full bg-magenta" aria-hidden />
            IIT Delhi spin-off · National Quantum Mission
          </p>
          <h1 id="hero-title" className="text-[2.6rem] font-medium leading-[1.02] sm:text-6xl lg:text-[4.6rem]">
            Precision diode lasers for the <span className="shine">quantum era.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-fg-2">
            Designed, built and commercialised at IIT Delhi. Narrow-linewidth, fibre-coupled, ready for your optical table.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <span data-magnet className="inline-flex">
              <ButtonLink href="/products" size="lg">
                Explore Products <Icon name="arrow-right" />
              </ButtonLink>
            </span>
            <span data-magnet className="inline-flex">
              <QuoteButton variant="secondary" size="lg" className="moving-border" />
            </span>
          </div>
          <dl className="mt-12 hidden max-w-md grid-cols-3 gap-6 border-t border-line pt-6 sm:grid">
            {[
              ["Linewidth", "< 100 kHz"],
              ["Coverage", "369–1600 nm"],
              ["Output", "> 2 W"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-fg-2">{k}</dt>
                <dd className="mono-num mt-1 text-sm text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The surface the beam lands on. Extra top padding on mobile gives the beam room. */}
        <div className="relative pt-24 lg:col-span-6 lg:pt-40">
          {/* Mobile WebGL stage: only the gap above the card and the card itself (small canvas, never
              behind the text), full-bleed, fading in at the top so the beam emerges from the dark. */}
          <div
            aria-hidden
            data-laserflow-mobile
            className="pointer-events-none absolute -inset-x-4 -top-12 bottom-0 z-0 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_88%,transparent)] lg:hidden"
          />
          <div className="relative mx-auto max-w-[480px] lg:mr-0">
            <div aria-hidden className="beam-impact" />
            <div aria-hidden className="beam-fallback anim-loop" />
            <article
              data-laser-surface
              className="relative overflow-hidden rounded-[10px] border border-line-strong bg-surface/90 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]"
            >
              <div aria-hidden className="beam-edge" />
              <header className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-2">OPAL · compact diode laser</span>
                <span className="flex items-center gap-2 rounded-full border border-line-strong px-2.5 py-1 font-mono text-xs">
                  <span className="size-2 rounded-full transition-colors duration-500" style={{ background: "var(--beam)" }} aria-hidden />
                  <span>
                    <span className="font-sans">λ</span> <span data-wl-label>405</span> nm
                  </span>
                </span>
              </header>
              <div className="relative aspect-[16/10] overflow-hidden">
                <Picture
                  name="opal-fibre"
                  alt={OPAL.imageAlt}
                  sizes="(min-width: 1024px) 480px, 92vw"
                  className="absolute inset-0"
                  imgClassName="!h-full object-cover"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              </div>
              <dl className="grid grid-cols-3 border-t border-line">
                {OPAL.headline.map((s) => (
                  <div key={s.label} className="px-4 py-3 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-line">
                    <dt className="truncate text-[11px] text-fg-2">{s.label}</dt>
                    <dd className="mono-num mt-0.5 text-sm">
                      {s.value}
                      {s.unit && <span className="ml-1 text-fg-2">{s.unit}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
            <p className="mt-3 text-center font-mono text-[11px] text-fg-2">
              <span data-wl-band>Violet</span> · one of five OPAL wavelengths
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
