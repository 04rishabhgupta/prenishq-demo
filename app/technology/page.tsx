import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBand } from "@/components/home/closing-sections";
import { Story } from "@/components/home/story";
import { LabProof } from "@/components/home/lab-proof";
import { Schematic } from "@/components/applications/schematic";
import { Icon } from "@/components/icons";
import { applications } from "@/data/applications";
import { glossary, technologyStatus } from "@/data/content";
import { productBySlug } from "@/data/products";
import { applicationAreas } from "@/data/site";
import { accentVars } from "@/lib/accent";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/cn";

export const metadata = pageMetadata({
  title: "Technology: how our lasers work and where they are used",
  description:
    "How PrenishQ diode lasers, external cavity lasers, DBR lasers and tapered amplifiers work together, the quantum and photonics applications they serve, and the results demonstrated in the lab.",
  path: "/technology",
});

// The one page for "how does it work, and what is it for?" (PLAN §11).
export default function TechnologyPage() {
  const terms = [...glossary].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <>
      <PageHero
        crumbs={[{ href: "/technology", label: "Technology" }]}
        eyebrow="Technology"
        title="From a semiconductor junction to cold atoms."
        intro="Quantum experiments ask a lot of their light: the right wavelength, a pure frequency, a stable lock and enough power. Here is how our instruments deliver each one, where they are used, and what we have demonstrated."
        sections={[
          { id: "how", label: "How it works" },
          { id: "applications", label: "Applications" },
          { id: "results", label: "Lab results" },
          { id: "status", label: "Roadmap" },
          { id: "glossary", label: "Glossary" },
        ]}
      />

      {/* 1. How it works: the sticky scroll story (GSAP on desktop). */}
      <Story id="how" bordered={false} />

      {/* 2. Applications */}
      <Section id="applications" labelledBy="apps-title" className="border-t border-line">
        <div className="container-x">
          <SectionHeading
            id="apps-title"
            eyebrow="Applications"
            title="Where precision light does the work."
            intro="Each field asks something different of its light source. Choose one to see the requirements, the instruments that fit and the results we have demonstrated."
          />
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {applications.map((a, i) => (
              <li key={a.slug}>
                <article className="glow-card bench-frame reveal relative flex h-full flex-col overflow-hidden" style={{ ...accentVars(a.accent), ["--i" as string]: i % 3 }}>
                  <div className="hairline-grid relative aspect-[19/10] border-b border-line bg-bg/60 [background-size:24px_24px]">
                    <div aria-hidden className="glow-spot absolute inset-0 opacity-40" />
                    <div className="relative h-full p-3">
                      <Schematic kind={a.schematic} label={a.title} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="text-xl font-medium leading-snug">{a.title}</h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-fg-2">{a.summary}</p>
                    <Link
                      href={`/technology/${a.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 border-t border-line pt-4 text-sm text-fg after:absolute after:inset-0 hover:text-cyan"
                    >
                      Requirements, instruments and results <Icon name="arrow-right" className="size-4" />
                    </Link>
                    <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label="Relevant products">
                      {a.products.map((x) => (
                        <li key={x.slug} className="rounded-full border border-line-strong px-2.5 py-1 font-mono text-[11px] text-fg-2">
                          {productBySlug[x.slug].name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          {/* Catalogue application areas, beyond quantum */}
          <div className="mt-16 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-xl font-medium">Beyond quantum</h3>
              <p className="mt-2 text-sm text-fg-2">The same lasers serve research and industry across these areas.</p>
            </div>
            <ul className="flex flex-wrap gap-2 lg:col-span-8">
              {applicationAreas.map((a) => (
                <li key={a} className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-fg-2">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 3. Lab results (full set) */}
      <LabProof id="results" full />

      {/* 4. Where we are (honest availability) */}
      <Section id="status" labelledBy="status-title">
        <div className="container-x">
          <SectionHeading
            id="status-title"
            eyebrow="Roadmap"
            title="Available today, and what we're building next."
            intro="Our lasers ship today. They are also the foundation for the quantum sensors and quantum computing subsystems we are developing."
          />
          <ul className="divide-y divide-line border-y border-line">
            {technologyStatus.map((t) => (
              <li key={t.area} className="grid gap-2 py-5 sm:grid-cols-12 sm:items-center">
                <span className="text-lg sm:col-span-4">{t.area}</span>
                <span className="text-fg-2 sm:col-span-6">{t.detail}</span>
                <span className="sm:col-span-2 sm:text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs",
                      t.status === "available" ? "border-wl-520/40 text-wl-520" : "border-wl-785/40 text-wl-785",
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", t.status === "available" ? "bg-wl-520" : "bg-wl-785")} aria-hidden />
                    {t.status === "available" ? "Available now" : "In development"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 5. Glossary */}
      <Section id="glossary" labelledBy="glossary-title" className="border-t border-line">
        <div className="container-x">
          <SectionHeading id="glossary-title" eyebrow="Glossary" title="The language of precision light." />
          <dl className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {terms.map((t) => (
              <div key={t.term} className="border-b border-line py-5">
                <dt className="font-medium">{t.term}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-fg-2">{t.def}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
