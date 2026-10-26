import { Picture } from "@/components/media/picture";
import type { Product } from "@/data/products";
import { cn } from "@/lib/cn";

/**
 * Product render, or, until the client supplies photography (TODO(client)), a clearly
 * labelled instrument silhouette on optical-table texture in the product's accent.
 */
export function ProductVisual({
  product,
  sizes,
  priority,
  className,
}: {
  product: Product;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (product.image) {
    return (
      <Picture
        name={product.image}
        alt={product.imageAlt}
        sizes={sizes}
        priority={priority}
        className={cn("block", className)}
        imgClassName="h-full object-cover"
      />
    );
  }
  return <ProductPlaceholder product={product} className={className} />;
}

export function ProductPlaceholder({ product, className }: { product: Product; className?: string }) {
  const long = product.type === "amplifier";
  return (
    <div className={cn("optical-table relative grid place-items-center overflow-hidden", className)}>
      <svg viewBox="0 0 400 240" className="w-[78%] max-w-md" role="img" aria-label={`${product.name}: product image coming soon`}>
        <defs>
          <linearGradient id={`ph-top-${product.slug}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b2130" />
            <stop offset="1" stopColor="#0e121a" />
          </linearGradient>
          <linearGradient id={`ph-beam-${product.slug}`} x1="0" x2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* isometric housing */}
        <g transform={long ? "translate(40 70)" : "translate(80 60)"}>
          <path d={long ? "M0 40 L180 0 L280 30 L100 70 Z" : "M0 40 L120 10 L210 40 L90 70 Z"} fill={`url(#ph-top-${product.slug})`} stroke="rgb(255 255 255 / 0.12)" />
          <path d={long ? "M0 40 L100 70 L100 140 L0 110 Z" : "M0 40 L90 70 L90 140 L0 110 Z"} fill="#0a0d13" stroke="rgb(255 255 255 / 0.1)" />
          <path d={long ? "M100 70 L280 30 L280 100 L100 140 Z" : "M90 70 L210 40 L210 110 L90 140 Z"} fill="#121722" stroke="rgb(255 255 255 / 0.12)" />
          {/* aperture + beam */}
          <g transform={long ? "translate(250 72)" : "translate(180 82)"}>
            <ellipse rx="9" ry="11" fill="#2a3242" stroke="rgb(255 255 255 / 0.3)" />
            <ellipse rx="3.5" ry="4.5" fill="var(--accent)" />
            <path d="M4 0 L170 -38" stroke={`url(#ph-beam-${product.slug})`} strokeWidth="3" strokeLinecap="round" />
          </g>
          {/* caution label */}
          <rect x={long ? 130 : 110} y={long ? 85 : 85} width="34" height="18" transform="skewY(-14)" fill="#f2c230" opacity="0.85" />
        </g>
      </svg>
      <span className="absolute bottom-3 left-3 rounded-sm border border-line-strong bg-bg/70 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-fg-2">
        Illustration · photo to come
      </span>
    </div>
  );
}
