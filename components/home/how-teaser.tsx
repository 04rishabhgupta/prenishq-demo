import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Icon } from "@/components/icons";
import { productBySlug, type ProductSlug } from "@/data/products";
import { PALETTE, type PaletteNm } from "@/data/wavelengths";

// Compact "how it works" on Home; the full sticky story lives on /technology#how.
const STEPS: { verb: string; line: string; product: ProductSlug; accent: PaletteNm }[] = [
  { verb: "Emit", line: "A diode turns current into coherent light", product: "opal", accent: 405 },
  { verb: "Narrow", line: "An external cavity picks one frequency", product: "agate", accent: 520 },
  { verb: "Lock", line: "Atoms become the reference", product: "dbr-pro", accent: 785 },
  { verb: "Amplify", line: "Clean light at watt level", product: "ta", accent: 633 },
  { verb: "Cool", line: "Atoms slowed to microkelvin", product: "agate", accent: 405 },
];

export function HowTeaser() {
  return (
    <Section labelledBy="how-title" className="border-t border-line">
      <div className="container-x">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow reveal mb-4">How it works</p>
            <h2 id="how-title" className="reveal text-3xl font-medium leading-tight sm:text-[2.6rem]" style={{ ["--i" as string]: 1 }}>
              Five steps from current to cold atoms.
            </h2>
          </div>
          <Link href="/technology#how" className="reveal inline-flex shrink-0 items-center gap-1.5 text-sm text-cyan hover:underline">
            See how it works <Icon name="arrow-right" className="size-4" />
          </Link>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-5">
          {STEPS.map((s, i) => {
            const color = PALETTE[s.accent].text === "#F4F7FB" ? PALETTE[s.accent].color : PALETTE[s.accent].text;
            return (
              <li key={s.verb} className="reveal relative flex flex-col gap-3 bg-bg p-5" style={{ ["--i" as string]: i }}>
                <span aria-hidden className="absolute inset-x-0 top-0 h-0.5" style={{ background: PALETTE[s.accent].color }} />
                <span className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color }}>
                  {String(i + 1).padStart(2, "0")} · {s.verb}
                </span>
                <span className="leading-snug">{s.line}</span>
                <span className="mt-auto font-mono text-xs text-fg-2">{productBySlug[s.product].name}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
