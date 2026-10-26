import { PageHero } from "@/components/ui/page-hero";
import { ProductCard } from "@/components/products/product-card";
import { Catalogue } from "@/components/products/catalogue";
import { CtaBand } from "@/components/home/closing-sections";
import { products, type ProductSlug } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

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
      >
        <a
          href="/datasheets/prenishq-catalogue.pdf"
          download
          className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-cyan hover:underline"
        >
          Download the full catalogue (PDF, 1 MB)
        </a>
      </PageHero>
      <section aria-labelledby="catalogue-title" className="py-12 sm:py-16">
        <div className="container-x">
          <h2 id="catalogue-title" className="sr-only">
            All products
          </h2>
          <Catalogue cards={cards} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
