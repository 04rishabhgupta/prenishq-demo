import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { Schematic } from "@/components/applications/schematic";
import { CtaBand } from "@/components/home/closing-sections";
import { Icon } from "@/components/icons";
import { applications } from "@/data/applications";
import { productBySlug } from "@/data/products";
import { applicationAreas } from "@/data/site";
import { accentVars } from "@/lib/accent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Applications: lasers for cold atoms, trapped ions, NV centres and spectroscopy",
  description:
    "How narrow-linewidth diode lasers enable neutral-atom and trapped-ion quantum computing, NV-centre sensing, atomic clocks, laser spectroscopy and quantum memory, and which PrenishQ lasers fit each.",
  path: "/applications",
});

export default function ApplicationsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/applications", label: "Applications" }]}
        eyebrow="Applications"
        title="Where precision light does the work."
        intro="Quantum technologies run on lasers that cool, trap, probe and read out atoms. Here is what each field needs from its light source, and which PrenishQ instruments meet it."
      />

      <Section labelledBy="fields-title" lazy={false} className="!pt-14">
        <div className="container-x">
          <h2 id="fields-title" className="sr-only">
            Application fields
          </h2>
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {applications.map((a, i) => (
              <li key={a.slug} id={a.slug} className="scroll-mt-24">
                <article className="glow-card bench-frame reveal flex h-full flex-col overflow-hidden" style={{ ...accentVars(a.accent), ["--i" as string]: i % 3 }}>
                  <div className="hairline-grid relative aspect-[19/10] border-b border-line bg-bg/60 [background-size:24px_24px]">
                    <div aria-hidden className="glow-spot absolute inset-0 opacity-40" />
                    <div className="relative h-full p-3">
                      <Schematic kind={a.schematic} label={a.title} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="text-xl font-medium leading-snug">{a.title}</h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-fg-2">{a.summary}</p>

                    <details className="group/d mt-5 border-t border-line pt-4">
                      <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 text-sm text-fg [&::-webkit-details-marker]:hidden">
                        <span>How PrenishQ lasers fit</span>
                        <Icon name="chevron" className="size-4 text-fg-2 transition-transform group-open/d:rotate-180" />
                      </summary>
                      <div className="space-y-3 pt-3 text-sm leading-relaxed text-fg-2">
                        {a.detail.map((d) => (
                          <p key={d.slice(0, 24)}>{d}</p>
                        ))}
                      </div>
                      <ul className="mt-4 space-y-2">
                        {a.products.map((x) => {
                          const p = productBySlug[x.slug];
                          return (
                            <li key={x.slug}>
                              <Link
                                href={`/products/${p.slug}`}
                                className="flex flex-col gap-1 rounded-md border border-line px-3.5 py-3 transition-colors hover:border-line-strong hover:bg-white/[0.03]"
                                style={accentVars(p.accent)}
                              >
                                <span className="flex items-center justify-between font-medium">
                                  {p.name}
                                  <span className="font-mono text-xs font-normal text-fg-2">{p.wavelengthLabel}</span>
                                </span>
                                <span className="text-xs leading-relaxed text-fg-2">{x.why}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </details>

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
        </div>
      </Section>

      <Section labelledBy="areas-title" className="border-t border-line">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-4">Beyond quantum</p>
            <h2 id="areas-title" className="text-3xl font-medium leading-tight sm:text-4xl">
              The same lasers, across research and industry.
            </h2>
            <p className="mt-4 text-fg-2">
              Application areas from the PrenishQ catalogue, from biomedical imaging to particle size analysis.
            </p>
          </div>
          <ul className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:col-span-7">
            {applicationAreas.map((a, i) => (
              <li key={a} className="flex items-center justify-between border-b border-r border-line px-5 py-4">
                <span>{a}</span>
                <span className="font-mono text-xs text-fg-2">{String(i + 1).padStart(2, "0")}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
