import Link from "next/link";
import { productBySlug, type ProductSlug } from "@/data/products";
import { PALETTE, type PaletteNm } from "@/data/wavelengths";
import { SplitReveal } from "@/components/motion/split-reveal";
import { SCENES, type SceneKey } from "@/components/home/story-scenes";

type Step = {
  key: SceneKey;
  verb: string;
  title: string;
  /** Textbook explanation of the physics (shown first). */
  explain: string;
  /** What the PrenishQ instrument does, from the catalogue. */
  body: string;
  specs: string[];
  products: ProductSlug[];
  accent: PaletteNm;
};

// Copy restricted to catalogue facts plus textbook physics (see PLAN §5 content rules).
const STEPS: Step[] = [
  {
    key: "emit",
    verb: "Emit",
    title: "A diode turns current into coherent light.",
    explain:
      "In a semiconductor diode laser, current through a p–n junction produces photons, and the polished facets of the chip form a short optical cavity that makes it lase.",
    body: "OPAL packages the semiconductor laser into a compact, fibre-coupled source at five wavelengths from 405 to 980 nm, with under 1 % power drift over 10+ hours.",
    specs: ["< 0.1 pm", "≤ 100 mW", "5 wavelengths"],
    products: ["opal", "dbr"],
    accent: 405,
  },
  {
    key: "narrow",
    verb: "Narrow",
    title: "An external cavity picks a single frequency.",
    explain:
      "Atoms respond only to light within a very narrow frequency band. An external cavity feeds a single frequency back into the diode, narrowing its linewidth and letting it tune smoothly.",
    body: "AGATE reaches below 100 kHz and scans 5 GHz without a mode hop, anywhere from 369 to 1600 nm.",
    specs: ["< 100 kHz", "5 GHz MHF", "369–1600 nm"],
    products: ["agate"],
    accent: 520,
  },
  {
    key: "lock",
    verb: "Lock",
    title: "Atoms become the reference.",
    explain:
      "To hold a frequency for hours, the laser is referenced to the atoms themselves: a vapour cell provides narrow, Doppler-free features that feedback can lock to.",
    body: "Saturated-absorption spectroscopy reveals Doppler-free atomic lines, and lock-in detection holds the laser on them. DBR PRO integrates both at the Rb and Cs D2 lines.",
    specs: ["780 nm Rb", "852 nm Cs", "< 500 kHz"],
    products: ["dbr-pro"],
    accent: 785,
  },
  {
    key: "amplify",
    verb: "Amplify",
    title: "Clean light, at watt level.",
    explain:
      "Cooling beams and large traps need far more power than a narrow-linewidth seed provides. A tapered amplifier's gain region widens along its length, boosting the seed to watt level.",
    body: "TA delivers more than 2 W saturated, fibre-coupled, and keeps the seed's polarisation: enough power for large cooling beams.",
    specs: ["> 2 W", "632–1590 nm", "Pol. maintained"],
    products: ["ta"],
    accent: 633,
  },
  {
    key: "cool",
    verb: "Cool",
    title: "Six beams stop atoms in their tracks.",
    explain:
      "Intersecting laser beams and a magnetic field gradient slow a vapour of atoms to microkelvin temperatures in a magneto-optical trap.",
    body: "At IIT Delhi, caesium atoms were laser-cooled to 15 µK with this chain: the starting point for neutral-atom quantum computers, atomic clocks and quantum sensors.",
    specs: ["15 µK", "Cs MOT", "IIT Delhi"],
    products: ["agate", "ta"],
    accent: 405,
  },
];

function StepText({ step, index }: { step: Step; index: number }) {
  const color = PALETTE[step.accent].text === "#F4F7FB" ? PALETTE[step.accent].color : PALETTE[step.accent].text;
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.16em]" style={{ color }}>
        {String(index + 1).padStart(2, "0")} · {step.verb}
      </p>
      <h3 className="mt-3 text-2xl font-medium leading-snug sm:text-3xl">{step.title}</h3>
      <p className="mt-4 leading-relaxed text-fg-2">{step.explain}</p>
      <p className="mt-3 leading-relaxed text-fg">{step.body}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {step.specs.map((s) => (
          <li key={s} className="rounded-full border border-line-strong px-3 py-1 font-mono text-xs text-fg">
            {s}
          </li>
        ))}
      </ul>
      <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {step.products.map((slug) => (
          <Link key={slug} href={`/products/${slug}`} className="text-cyan hover:underline">
            {productBySlug[slug].name} →
          </Link>
        ))}
      </p>
    </div>
  );
}

function ScenePanel({ step }: { step: Step }) {
  return (
    <figure data-scene-src={step.key} className="relative h-full" style={{ ["--accent" as string]: PALETTE[step.accent].color }}>
      <div className="bench-frame relative h-full overflow-hidden rounded-lg border border-line bg-bg/70">
        <div aria-hidden className="hairline-grid absolute inset-0 opacity-50 [background-size:32px_32px]" />
        <div aria-hidden className="glow-spot absolute inset-0 opacity-40" />
        <div className="relative grid h-full place-items-center p-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- build-time static SVG */}
          <img src={`/story/${step.key}.svg`} alt={SCENES[step.key].alt} width={520} height={360} loading="lazy" decoding="async" className="h-auto w-full" />
        </div>
      </div>
    </figure>
  );
}

export function Story({ id, bordered = true }: { id?: string; bordered?: boolean }) {
  return (
    <section id={id} aria-labelledby="story-title" data-story data-loop className={`relative py-20 sm:py-28 ${bordered ? "border-t border-line" : ""}`}>
      <div className="container-x">
        <div className="mb-14 max-w-2xl sm:mb-20">
          <p className="eyebrow mb-4">From diode to quantum sensor</p>
          <SplitReveal as="h2" id="story-title" className="text-3xl font-medium leading-tight sm:text-[2.6rem]" text="Five steps from current to cold atoms." />
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Steps */}
          <ol data-story-steps className="relative lg:col-span-5">
            <span aria-hidden className="absolute -left-5 top-0 hidden h-full w-px bg-line lg:block">
              <span data-story-progress className="absolute inset-0 origin-top bg-gradient-to-b from-[#a78bfa] via-cyan to-wl-520" style={{ transform: "scaleY(0)" }} />
            </span>
            {STEPS.map((s, i) => (
              <li
                key={s.key}
                data-step={s.key}
                data-active={i === 0 ? "" : undefined}
                className="story-step flex flex-col gap-6 border-b border-line py-10 first:pt-0 last:border-0 lg:min-h-[64vh] lg:justify-center lg:border-0 lg:py-0"
              >
                <StepText step={s} index={i} />
                {/* Inline visual: mobile, and desktop until GSAP takes over */}
                <div className="story-inline aspect-[13/9] w-full">
                  <ScenePanel step={s} />
                </div>
              </li>
            ))}
          </ol>

          {/* Sticky stage (desktop): filled with clones of the inline diagrams by lib/fx/story.ts,
              so the diagrams are only in the HTML once. */}
          <div className="story-stage lg:col-span-7">
            <div data-story-stage className="sticky top-[calc(var(--header-h)+8vh)] aspect-[13/9] w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

