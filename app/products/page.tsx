import { PageHero } from "@/components/ui/page-hero";
import { ProductCard } from "@/components/products/product-card";
import { Catalogue } from "@/components/products/catalogue";
import { CtaBand } from "@/components/home/closing-sections";
import { products, type ProductSlug } from "@/data/products";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";
import { Icon } from "@/components/icons";
import { systems } from "@/data/product-extras";
import { productBySlug } from "@/data/products";
import { applications } from "@/data/applications";
import { accentVars } from "@/lib/accent";
import { WavelengthExplorerLazy } from "@/components/products/explorer-lazy";

export const metadata = pageMetadata({
  title: "Products: narrow-linewidth diode lasers, ECDLs and tapered amplifiers",
  description:
    "Compare PrenishQ lasers: OPAL compact diode lasers (405–980 nm), AGATE external cavity diode lasers (369–1600 nm, < 100 kHz), DBR and DBR PRO lasers, and > 2 W tapered amplifiers.",
  path: "/products",
});

export default function ProductsPage() {
  const cards = Object.fromEntries(products.map((p) => [p.slug, <ProductCard key={p.slug} product={p} />])) as Record<
    ProductSlug,
    React.ReactNode
  >;

  return (
    <>
      <PageHero
        crumbs={[{ href: "/products", label: "Products" }]}
        eyebrow="Products"
        title="Precision laser systems for research and industry."
        intro="Five instrument families from 369 to 1600 nm. Filter by wavelength, type or application, and compare up to three side by side."
        sections={[
          { id: "catalogue", label: "All products" },
          { id: "find", label: "Find your laser" },
          { id: "systems", label: "Suggested systems" },
          { id: "downloads", label: "Downloads" },
        ]}
      >
        <a href="/datasheets/prenishq-catalogue.pdf" download className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-cyan hover:underline">
          <Icon name="download" className="size-4" /> Download the full catalogue (PDF, 1 MB)
        </a>
      </PageHero>
      <section id="catalogue" aria-labelledby="catalogue-title" className="scroll-mt-24 py-12 sm:py-16">
        <div className="container-x">
          <h2 id="catalogue-title" className="sr-only">
            All products
          </h2>
          <Catalogue cards={cards} />
        </div>
      </section>
      {/* Find your laser: the wavelength explorer (moved here from Home: it is a product-selection tool). */}
      <Section id="find" labelledBy="explorer-title" className="border-t border-line">
        <div className="container-x">
          <SectionHeading
            id="explorer-title"
            eyebrow="Find your laser"
            title="Pick a wavelength. See what lights up."
            intro="Drag across the spectrum, choose a preset or jump to an atomic line to see which instruments cover it and where they're used."
          />
          <WavelengthExplorerLazy />
        </div>
      </Section>

      {/* Suggested systems (Vescent "Solutions" / Santec "System integration") */}
      <Section id="systems" labelledBy="systems-title" className="border-t border-line">
        <div className="container-x">
          <SectionHeading
            id="systems-title"
            eyebrow="Suggested systems"
            title="Instruments that work together."
            intro="Common combinations for complete setups. Every configuration is quoted for your wavelengths and power budget."
          />
          <ul className="grid gap-4 lg:grid-cols-3">
            {systems.map((sys, i) => {
              const app = applications.find((a) => a.slug === sys.application);
              return (
                <li key={sys.title} className="glow-card bench-frame reveal flex flex-col gap-5 p-6" style={{ ["--i" as string]: i }}>
                  <div>
                    <h3 className="text-xl font-medium">{sys.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-2">{sys.body}</p>
                  </div>
                  <ol className="flex flex-col gap-2">
                    {sys.chain.map((c, k) => {
                      const p = productBySlug[c.slug];
                      return (
                        <li key={c.slug} className="flex items-center gap-3" style={accentVars(p.accent)}>
                          <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-[11px] text-fg-2">{k + 1}</span>
                          <Link href={`/products/${p.slug}`} className="flex flex-1 items-center justify-between gap-3 rounded-md border border-line px-3 py-2 transition-colors hover:border-line-strong hover:bg-white/[0.03]">
                            <span className="font-medium">{p.name}</span>
                            <span className="font-mono text-xs" style={{ color: "var(--accent-text)" }}>
                              {c.role}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                  {app && (
                    <Link href={`/technology/${app.slug}`} className="mt-auto inline-flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg">
                      {app.title} <Icon name="arrow-right" className="size-4" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Section>
      {/* Downloads (moved here from the former Resources page) */}
      <Section id="downloads" labelledBy="dl-title" className="border-t border-line">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-4">Downloads</p>
            <h2 id="dl-title" className="text-3xl font-medium">
              Product documents
            </h2>
            <p className="mt-4 text-fg-2">Datasheets, drawings and test reports for individual products are available on request from each product page.</p>
          </div>
          <ul className="divide-y divide-line border-y border-line lg:col-span-8">
            <li>
              <a href="/datasheets/prenishq-catalogue.pdf" download className="group flex items-center justify-between gap-4 py-4">
                <span className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-md border border-line-strong font-mono text-[10px] uppercase text-fg-2">pdf</span>
                  <span>
                    <span className="block">PrenishQ product catalogue</span>
                    <span className="block text-sm text-fg-2">All five product families with specifications and demonstrated results</span>
                  </span>
                </span>
                <span className="flex items-center gap-2 font-mono text-xs text-fg-2 group-hover:text-fg">
                  1 MB <Icon name="download" className="size-4" />
                </span>
              </a>
            </li>
            {products.map((p) => (
              <li key={p.slug} style={accentVars(p.accent)}>
                <Link href={`/products/${p.slug}#downloads`} className="group flex items-center justify-between gap-4 py-4">
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 min-w-16 place-items-center rounded-md border border-line-strong px-2 font-mono text-xs" style={{ color: "var(--accent-text)" }}>
                      {p.name}
                    </span>
                    <span>
                      <span className="block">{p.fullName}</span>
                      <span className="block font-mono text-xs text-fg-2">{p.wavelengthLabel}</span>
                    </span>
                  </span>
                  <Icon name="arrow-right" className="size-4 text-fg-2 group-hover:text-fg" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
