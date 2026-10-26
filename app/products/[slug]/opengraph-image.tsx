import { ogImage, OG_SIZE } from "@/lib/og";
import { products, productBySlug, type ProductSlug } from "@/data/products";
import { PALETTE } from "@/data/wavelengths";

export const dynamic = "force-static";
export const dynamicParams = false;
export const alt = "PrenishQ product";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = productBySlug[(await params).slug as ProductSlug];
  return ogImage({
    eyebrow: p.typeLabel,
    title: p.fullName,
    specs: p.headline.map((s) => `${s.label}: ${s.value}${s.unit ? ` ${s.unit}` : ""}`),
    accent: PALETTE[p.accent].text === "#F4F7FB" ? PALETTE[p.accent].color : PALETTE[p.accent].text,
  });
}
