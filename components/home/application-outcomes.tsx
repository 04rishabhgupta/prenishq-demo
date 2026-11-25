import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { applications } from "@/data/applications";
import { productBySlug } from "@/data/products";
import { accentVars } from "@/lib/accent";

// Toptica-style: each field leads with what the light has to achieve, then the instruments.
// Outcomes describe requirements of the field (textbook), not performance claims.
const OUTCOME: Record<string, string> = {
  "neutral-atoms": "Cooling light that stays on the atomic line",
  "trapped-ions": "Violet and near-UV light, narrow enough for ions",
  "nv-centres": "Stable green excitation for diamond sensors",
  "metrology-clocks": "Atoms as the frequency reference",
  "laser-spectroscopy": "Doppler-free resolution across a transition",
  "quantum-memory": "Narrow probe and control light for cold-atom memories",
};

export function ApplicationOutcomes() {
  return (
    <Section labelledBy="outcomes-title">
      <div className="container-x">
        <SectionHeading
          id="outcomes-title"
          eyebrow="Applications"
          title="Built for the physics you're doing."
          intro="Choose your field to see what it asks of the light, which instruments fit, and what we've demonstrated in the lab."
        >
          <ButtonLink href="/technology#applications" variant="secondary" className="reveal">
            All applications <Icon name="arrow-right" />
          </ButtonLink>
        </SectionHeading>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((a, i) => (
            <li key={a.slug} className="glow-card bench-frame reveal group relative flex flex-col p-6" style={{ ...accentVars(a.accent), ["--i" as string]: i % 3 }}>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: "var(--accent-text)" }}>
                {a.title}
              </p>
              <h3 className="mt-3 text-xl font-medium leading-snug">
                <Link href={`/technology/${a.slug}`} className="after:absolute after:inset-0">
                  {OUTCOME[a.slug]}
                </Link>
              </h3>
              <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                <ul className="flex flex-wrap gap-1.5" aria-label="Instruments">
                  {a.products.map((x) => (
                    <li key={x.slug} className="rounded-full border border-line-strong px-2.5 py-1 font-mono text-[11px] text-fg-2">
                      {productBySlug[x.slug].name}
                    </li>
                  ))}
                </ul>
                <Icon name="arrow-up-right" className="size-5 shrink-0 text-fg-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
