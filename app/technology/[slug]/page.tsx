import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { applications } from "@/data/applications";
import { products, productBySlug } from "@/data/products";
import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { QuoteButton } from "@/components/ui/button";
import { Schematic } from "@/components/applications/schematic";
import { Picture } from "@/components/media/picture";
import { Icon } from "@/components/icons";
import { pageMetadata } from "@/lib/seo";
import { accentVars } from "@/lib/accent";
import { cn } from "@/lib/cn";

export const dynamicParams = false;

export function generateStaticParams() {
  return applications.map((a) => ({ slug: a.slug }));
}

const bySlug = (slug: string) => applications.find((a) => a.slug === slug);
const allFigures = products.flatMap((p) => p.figures.map((f) => ({ ...f, product: p })));

export async function generateMetadata({ params }: PageProps<"/technology/[slug]">): Promise<Metadata> {
  const a = bySlug((await params).slug);
  if (!a) return {};
  return pageMetadata({ title: `Lasers for ${a.title.toLowerCase()}`, description: a.summary, path: `/technology/${a.slug}` });
}

export default async function ApplicationPage({ params }: PageProps<"/technology/[slug]">) {
  const a = bySlug((await params).slug);
  if (!a) notFound();

  const results = a.results.map((img) => allFigures.find((f) => f.image === img)!).filter(Boolean);
  const productSlugs = new Set(a.products.map((x) => x.slug));
  const related = applications.filter((o) => o.slug !== a.slug && o.products.some((x) => productSlugs.has(x.slug))).slice(0, 3);

  return (
    <div style={accentVars(a.accent)}>
      <PageHero
        crumbs={[
          { href: "/technology", label: "Technology" },
          { href: `/technology/${a.slug}`, label: a.title },
        ]}
        eyebrow="Application"
        title={a.title}
        intro={a.summary}
      />

      {/* What the field needs from its light */}
      <Section labelledBy="needs-title" lazy={false}>
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-4">What the light has to do</p>
            <h2 id="needs-title" className="text-3xl font-medium leading-tight sm:text-4xl">
              The requirements
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-fg-2">
              {a.detail.map((d) => (
                <p key={d.slice(0, 24)}>{d}</p>
              ))}
            </div>
          </div>
          <figure className="bench-frame relative overflow-hidden rounded-lg border border-line bg-bg/60 lg:col-span-6">
            <div aria-hidden className="hairline-grid absolute inset-0 opacity-60 [background-size:28px_28px]" />
            <div aria-hidden className="glow-spot absolute inset-0 opacity-50" />
            <div className="relative aspect-[19/10] p-4">
              <Schematic kind={a.schematic} label={a.title} />
            </div>
          </figure>
        </div>
      </Section>

      {/* Products that fit */}
      <Section labelledBy="fit-title" className="border-t border-line">
        <div className="container-x">
          <SectionHeading id="fit-title" eyebrow="Recommended instruments" title="How PrenishQ lasers fit" />
          <ul className={cn("grid gap-4 md:grid-cols-2", a.products.length >= 3 && "lg:grid-cols-3")}>
            {a.products.map((x, i) => {
              const p = productBySlug[x.slug];
              return (
                <li key={x.slug} className="glow-card bench-frame reveal relative flex flex-col gap-4 p-6" style={{ ...accentVars(p.accent), ["--i" as string]: i }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: "var(--accent-text)" }}>
                        {p.typeLabel}
                      </p>
                      <h3 className="mt-2 text-2xl font-medium">
                        <Link href={`/products/${p.slug}`} className="after:absolute after:inset-0">
                          {p.name}
                        </Link>
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-fg-2">{p.wavelengthLabel}</span>
                  </div>
                  <p className="leading-relaxed text-fg-2">{x.why}</p>
                  <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-line pt-4">
                    {p.headline.map((s) => (
                      <div key={s.label} className="min-w-0">
                        <dt className="truncate text-[11px] text-fg-2">{s.label}</dt>
                        <dd className="mono-num mt-1 text-sm">
                          {s.value}
                          {s.unit && <span className="ml-1 text-fg-2">{s.unit}</span>}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* Demonstrated results */}
      {results.length > 0 && (
        <Section labelledBy="results-title" className="border-t border-line bg-surface/40">
          <div className="container-x">
            <SectionHeading id="results-title" eyebrow="Demonstrated" title="Results from the lab" />
            <div className={cn("grid gap-4", results.length > 1 && "md:grid-cols-2")}>
              {results.map((f) => {
                const paper = f.image === "agate-linewidth-plot" || f.image === "dbrpro-cs-sas";
                return (
                  <figure key={f.image} className="glow-card reveal overflow-hidden">
                    <div className={cn("relative aspect-[16/9] border-b border-line", paper ? "bg-[#f7f8fa]" : "bg-black")}>
                      <Picture
                        name={f.image}
                        alt={f.alt}
                        sizes={results.length > 1 ? "(min-width: 768px) 50vw, 100vw" : "100vw"}
                        className={cn("absolute inset-0", paper && "p-5")}
                        imgClassName="!h-full object-contain"
                        blur={false}
                      />
                    </div>
                    <figcaption className="flex items-start justify-between gap-4 p-5 text-sm leading-relaxed text-fg-2">
                      <span>
                        {f.caption}
                        {f.credit && <span className="mt-1 block text-xs">{f.credit}</span>}
                      </span>
                      <Link href={`/products/${f.product.slug}`} className="shrink-0 font-mono text-xs uppercase tracking-wider hover:text-fg">
                        {f.product.name} →
                      </Link>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </Section>
      )}

      {/* Related fields */}
      {related.length > 0 && (
        <Section labelledBy="related-title" className="border-t border-line">
          <div className="container-x">
            <SectionHeading id="related-title" eyebrow="Related applications" title="Same lasers, other fields" />
            <ul className="grid gap-4 md:grid-cols-3">
              {related.map((o) => (
                <li key={o.slug}>
                  <Link href={`/technology/${o.slug}`} className="glow-card reveal group flex h-full flex-col gap-3 p-5" style={accentVars(o.accent)}>
                    <span className="text-lg font-medium leading-snug">{o.title}</span>
                    <span className="line-clamp-3 text-sm leading-relaxed text-fg-2">{o.summary}</span>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm text-fg-2 group-hover:text-fg">
                      Read more <Icon name="arrow-right" className="size-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      <section aria-labelledby="app-cta" className="cv-auto border-t border-line py-16 sm:py-20">
        <div className="container-x flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 id="app-cta" className="text-2xl font-medium sm:text-3xl">
              Planning an experiment in this field?
            </h2>
            <p className="mt-2 text-fg-2">Tell us your species, wavelengths and power budget. We&apos;ll suggest a configuration.</p>
          </div>
          <QuoteButton size="lg" className="shrink-0" />
        </div>
      </section>
    </div>
  );
}
