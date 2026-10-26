import { createElement } from "react";
import type { Metadata } from "next";
import { site, funders } from "@/data/site";
import type { Product } from "@/data/products";
import manifest from "@/data/media.generated.json";

export function JsonLd({ data }: { data: object }) {
  return createElement("script", {
    type: "application/ld+json",
    // Escape "<" so content can never close the script tag.
    dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, "\\u003c") },
  });
}

/** Per-page metadata with canonical + OG/Twitter mirrors. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    email: site.email,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    contactPoint: site.departments.map((d) => ({
      "@type": "ContactPoint",
      contactType: d.name.toLowerCase(),
      email: d.email,
    })),
    funder: funders.map((f) => ({ "@type": "Organization", name: f.name })),
  };
}

export function productJsonLd(p: Product) {
  const image = p.image ? `${site.url}/media/${p.image}-${manifest[p.image].widths.at(-1)}.webp` : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.fullName,
    description: p.summary,
    brand: { "@type": "Brand", name: site.name },
    manufacturer: { "@type": "Organization", name: site.legalName, url: site.url },
    category: p.typeLabel,
    url: `${site.url}/products/${p.slug}`,
    ...(image ? { image } : {}),
    additionalProperty: p.specs.map((s) => ({
      "@type": "PropertyValue",
      name: s.label,
      value: [s.value, s.unit].filter(Boolean).join(" "),
    })),
  };
}
