import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, productBySlug, type ProductSlug } from "@/data/products";
import { applications } from "@/data/applications";
import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { QuoteButton, buttonVariants } from "@/components/ui/button";
import { ProductVisual } from "@/components/products/product-visual";
import { CoverageBar } from "@/components/products/coverage-bar";
import { ProductCard } from "@/components/products/product-card";
import { Picture } from "@/components/media/picture";
import { Icon } from "@/components/icons";
import { JsonLd, pageMetadata, productJsonLd } from "@/lib/seo";
import { accentVars } from "@/lib/accent";
import { PALETTE } from "@/data/wavelengths";
import { cn } from "@/lib/cn";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug[slug as ProductSlug];
  if (!p) return {};
  const h = p.headline.map((s) => `${s.value} ${s.unit ?? ""}`.trim()).join(", ");
  return pageMetadata({
    title: `${p.fullName}: ${p.wavelengthLabel}`,
    description: `${p.summary} Key specs: ${h}.`,
    path: `/products/${p.slug}`,
  });
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const p = productBySlug[slug as ProductSlug];
  if (!p) notFound();

  const usedIn = applications.filter((a) => a.products.some((x) => x.slug === p.slug));
  const related = p.related.map((s) => productBySlug[s]);

  return (
    <div style={accentVars(p.accent)}>
      <JsonLd data={productJsonLd(p)} />
      <PageHero
        crumbs={[
          { href: "/products", label: "Products" },
          { href: `/products/${p.slug}`, label: p.name },
        ]}
        eyebrow={p.typeLabel}
        title={p.fullName}
        intro={p.summary}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <QuoteButton product={p.name} size="lg" />
          <a href="/datasheets/prenishq-catalogue.pdf" download className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Datasheet (PDF) <Icon name="download" />
          </a>
        </div>
      </PageHero>

      {/* Visual + headline specs */}
      <section
        aria-label={`${p.name} overview`}
        data-laser-scope
        data-laser-color={PALETTE[p.accent].color}
        className="relative isolate overflow-hidden border-b border-line"
      >
        {/* WebGL beam in the product's wavelength colour lands on the render (desktop, lazy). */}
        <div aria-hidden data-laserflow className="pointer-events-none absolute inset-0 z-10" />
        <div className="container-x grid gap-8 py-12 lg:grid-cols-12 lg:items-center lg:pb-16 lg:pt-36">
          <div data-laser-surface className="bench-frame relative overflow-hidden rounded-[10px] border border-line lg:col-span-7">
            <ProductVisual product={p} sizes="(min-width: 1024px) 58vw, 100vw" priority className="aspect-[16/10] w-full" />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
          </div>
          <dl className="grid gap-px overflow-hidden rounded-lg border border-line bg-line lg:col-span-5">
            {p.headline.map((s) => (
              <div key={s.label} className="bg-bg p-5 sm:p-6">
                <dt className="text-sm text-fg-2">{s.label}</dt>
                <dd className="mt-2 font-mono text-4xl tracking-tight sm:text-5xl">
                  {s.value}
                  {s.unit && (
                    <span className="ml-2 text-xl" style={{ color: "var(--accent-text)" }}>
                      {s.unit}
                    </span>
                  )}
                </dd>
              </div>
            ))}
            <div className="bg-bg p-5 sm:p-6">
              <dt className="mb-3 text-sm text-fg-2">Wavelength coverage · {p.wavelengthLabel}</dt>
              <dd>
                <CoverageBar product={p} showAxis idSuffix="-hero" />
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Specifications */}
      <Section labelledBy="specs-title" lazy={false}>
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-4">Specifications</p>
            <h2 id="specs-title" className="text-3xl font-medium">
              Key specifications
            </h2>
            <p className="mt-4 text-fg-2">From the PrenishQ product catalogue. Contact us for configurations, mechanical drawings and test reports.</p>
          </div>
          <div className="lg:col-span-8">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">{p.fullName} specifications</caption>
              <tbody>
                {p.specs.map((s) => (
                  <tr key={s.label} className="border-b border-line">
                    <th scope="row" className="w-2/5 py-4 pr-4 align-top text-sm font-normal text-fg-2 sm:w-1/3">
                      {s.label}
                    </th>
                    <td className="py-4 align-top">
                      <span className="font-mono text-base sm:text-lg">{s.value}</span>
                      {s.unit && <span className="ml-1.5 font-mono text-fg-2">{s.unit}</span>}
                      {s.note && <span className="block text-sm text-fg-2">{s.note}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Applications */}
      <Section labelledBy="apps-title" className="border-t border-line">
        <div className="container-x">
          <SectionHeading id="apps-title" eyebrow="Applications" title={`Where ${p.name} is used`} />
          <ul className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {p.applications.map((a, i) => (
              <li key={a} className="reveal flex items-center justify-between gap-4 border-b border-r border-line px-5 py-5" style={{ ["--i" as string]: i % 3 }}>
                <span>{a}</span>
                <span className="font-mono text-xs text-fg-2">{String(i + 1).padStart(2, "0")}</span>
              </li>
            ))}
          </ul>
          {usedIn.length > 0 && (
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {usedIn.map((a) => {
                const why = a.products.find((x) => x.slug === p.slug)!.why;
                return (
                  <Link key={a.slug} href={`/applications#${a.slug}`} className="glow-card reveal group flex flex-col gap-3 p-5" style={accentVars(a.accent)}>
                    <span className="text-lg font-medium">{a.title}</span>
                    <span className="text-sm leading-relaxed text-fg-2">{why}</span>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm text-fg-2 group-hover:text-fg">
                      Read more <Icon name="arrow-right" className="size-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </Section>

      {/* Demonstrated results */}
      {(p.figures.length > 0 || p.slug === "opal") && (
        <Section labelledBy="proof-title" className="border-t border-line bg-surface/40">
          <div className="container-x">
            <SectionHeading id="proof-title" eyebrow="Demonstrated" title="Results from the lab" />
            <div className="grid gap-4 md:grid-cols-2">
              {p.figures.map((f) => {
                const paper = f.image === "agate-linewidth-plot" || f.image === "dbrpro-cs-sas";
                return (
                  <figure key={f.image} className={cn("glow-card reveal overflow-hidden", p.figures.length === 1 && "md:col-span-2")}>
                    <div className={cn("relative aspect-[16/9] border-b border-line", paper ? "bg-[#f7f8fa]" : "bg-black")}>
                      <Picture
                        name={f.image}
                        alt={f.alt}
                        sizes={p.figures.length === 1 ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                        className={cn("absolute inset-0", paper && "p-5")}
                        imgClassName="!h-full object-contain"
                        blur={false}
                      />
                    </div>
                    <figcaption className="p-5 text-sm leading-relaxed text-fg-2">
                      {f.caption}
                      {f.credit && <span className="mt-1 block text-xs">{f.credit}</span>}
                    </figcaption>
                  </figure>
                );
              })}
              {p.slug === "opal" && (
                <figure className="glow-card reveal overflow-hidden">
                  <div className="relative aspect-[16/9] border-b border-line bg-black">
                    <Picture
                      name="opal-bench-photo"
                      alt="OPAL laser head mounted on an optical breadboard in the PrenishQ lab, with its driver in the background."
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="absolute inset-0"
                      imgClassName="!h-full object-cover"
                    />
                  </div>
                  <figcaption className="p-5 text-sm leading-relaxed text-fg-2">OPAL on the bench in the PrenishQ lab.</figcaption>
                </figure>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* Laser safety */}
      <section aria-labelledby="safety-title" className="border-t border-line">
        <div className="container-x py-10">
          <div className="flex gap-4 rounded-lg border border-[#f2c230]/30 bg-[#f2c230]/[0.06] p-5 sm:p-6">
            <Icon name="warning" className="mt-0.5 size-6 shrink-0 text-[#f2c230]" />
            <div>
              <h2 id="safety-title" className="font-medium">
                Caution: laser radiation
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-2">
                Avoid eye or skin exposure to direct or scattered radiation. The laser safety class depends on wavelength and output power and is marked on
                each unit&apos;s label. Operate only with appropriate eyewear and interlocks in place, following your institution&apos;s laser safety
                procedures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <Section labelledBy="related-title" className="border-t border-line">
        <div className="container-x">
          <SectionHeading id="related-title" eyebrow="Related" title="Often used together" />
          <ul className="grid gap-4 md:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug} className="reveal">
                <ProductCard product={r} />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <section aria-labelledby="quote-title-band" className="cv-auto border-t border-line py-16 sm:py-20">
        <div className="container-x flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 id="quote-title-band" className="text-2xl font-medium sm:text-3xl">
              Configure {p.name} for your setup
            </h2>
            <p className="mt-2 text-fg-2">Tell us your wavelength, power and integration needs.</p>
          </div>
          <QuoteButton product={p.name} size="lg" className={cn("shrink-0")} />
        </div>
      </section>
    </div>
  );
}
