import Link from "next/link";
import type { Product } from "@/data/products";
import { ProductVisual } from "@/components/products/product-visual";
import { CoverageBar } from "@/components/products/coverage-bar";
import { Icon } from "@/components/icons";
import { accentVars } from "@/lib/accent";

/** Server-rendered listing card; the catalogue overlays its compare checkbox. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="glow-card bench-frame group relative flex h-full flex-col overflow-hidden" style={accentVars(product.accent)}>
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
        <ProductVisual product={product} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-full w-full" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: "var(--accent-text)" }}>
            {product.typeLabel}
          </p>
          <h3 className="mt-2 text-xl font-medium">
            <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0">
              {product.name}
            </Link>
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-fg-2">{product.tagline}</p>
        <CoverageBar product={product} idSuffix="-card" />
        <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-line pt-4">
          {product.headline.map((s) => (
            <div key={s.label} className="min-w-0">
              <dt className="truncate text-[11px] text-fg-2">{s.label}</dt>
              <dd className="mono-num mt-1 text-sm">
                {s.value}
                {s.unit && <span className="ml-1 text-fg-2">{s.unit}</span>}
              </dd>
            </div>
          ))}
        </dl>
        <span className="inline-flex items-center gap-1.5 text-sm text-fg-2 group-hover:text-fg">
          Specifications <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
