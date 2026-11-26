import Link from "next/link";
import { products, type Product } from "@/data/products";
import { ProductVisual } from "@/components/products/product-visual";
import { CoverageBar } from "@/components/products/coverage-bar";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { accentVars } from "@/lib/accent";
import { cn } from "@/lib/cn";
import { SwipeRow } from "@/components/ui/swipe-row";

// 12-col bento: the two products with real renders lead; the rest are spec-forward.
const LAYOUT: Record<Product["slug"], string> = {
  opal: "lg:col-span-7",
  agate: "lg:col-span-5",
  dbr: "lg:col-span-4",
  "dbr-pro": "lg:col-span-4",
  ta: "lg:col-span-4",
};

function BentoCard({ product, index }: { product: Product; index: number }) {
  const big = Boolean(product.image);
  return (
    <article
      className={cn("glow-card bench-frame reveal group flex flex-col overflow-hidden", LAYOUT[product.slug])}
      style={{ ...accentVars(product.accent), ["--i" as string]: index }}
    >
      {big ? (
        <div data-tilt className="relative aspect-[16/9] overflow-hidden border-b border-line">
          <ProductVisual product={product} sizes="(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 86vw" className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
        </div>
      ) : (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-line md:aspect-auto md:h-28">
          <div className="dot-grid absolute inset-0 opacity-60" />
          <div className="glow-spot absolute -right-10 -top-16 size-56" />
          <div className="absolute inset-x-5 bottom-5">
            <CoverageBar product={product} idSuffix="-bento" />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.12em]" style={{ color: "var(--accent-text)" }}>
            {product.typeLabel}
          </p>
          <p className="font-mono text-xs text-fg-2">{product.wavelengthLabel}</p>
        </div>
        <h3 className="mt-3 text-2xl font-medium">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-2">{product.tagline}</p>
        <dl className={cn("mt-auto grid gap-4 border-t border-line pt-5", big ? "grid-cols-3" : "grid-cols-3")}>
          {product.headline.map((s) => (
            <div key={s.label} className="min-w-0">
              <dt className="truncate text-[11px] text-fg-2">{s.label}</dt>
              <dd className="mono-num mt-1 text-sm text-fg sm:text-base">
                {s.value}
                {s.unit && <span className="ml-1 text-fg-2">{s.unit}</span>}
              </dd>
            </div>
          ))}
        </dl>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-fg-2 transition-colors group-hover:text-fg">
          View {product.name} <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}

export function ProductBento() {
  return (
    <Section labelledBy="products-title">
      <div className="container-x">
        <SectionHeading
          id="products-title"
          eyebrow="Products"
          title="Five instruments, one bench."
          intro="Compact diode lasers, external cavity lasers, frequency-stabilised DBRs and watt-class amplifiers, each colour-coded by wavelength."
        >
          <ButtonLink href="/products" variant="secondary" className="reveal">
            Compare all products <Icon name="columns" />
          </ButtonLink>
        </SectionHeading>
        <SwipeRow count={products.length} label="Products" className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 [&>*]:relative">
          {products.map((p, i) => (
            <BentoCard key={p.slug} product={p} index={i} />
          ))}
        </SwipeRow>
      </div>
    </Section>
  );
}
