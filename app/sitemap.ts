import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { applications } from "@/data/applications";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/products", "/technology", "/about", "/contact", "/privacy"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...products.map((p) => ({ url: `${site.url}/products/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...applications.map((a) => ({ url: `${site.url}/technology/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
