import Link from "next/link";
import { Logo, Wordmark } from "@/components/brand/logo";
import { Icon } from "@/components/icons";
import { FooterContact } from "@/components/site/footer-contact";
import { site } from "@/data/site";
import { products } from "@/data/products";

type FooterLink = { href: string; label: string; external?: boolean; download?: boolean };

// Layout modelled on Q-CTRL's footer: brand and contact capture, four link columns, a giant
// wordmark over the logo's dot-matrix grid, and a legal bar.
const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Products",
    links: [
      ...products.map((p) => ({ href: `/products/${p.slug}`, label: p.name })),
      { href: "/products#find", label: "Find your laser" },
      { href: "/datasheets/prenishq-catalogue.pdf", label: "Catalogue (PDF)", download: true },
    ],
  },
  {
    title: "Technology",
    links: [
      { href: "/technology#how", label: "How it works" },
      { href: "/technology#applications", label: "Applications" },
      { href: "/technology#results", label: "Lab results" },
      { href: "/technology#status", label: "Roadmap" },
      { href: "/technology#glossary", label: "Glossary" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/about#team", label: "Team" },
      { href: "/about#lab", label: "Inside the lab" },
      { href: "/about#backers", label: "Backers" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact#faq", label: "FAQ" },
      ...site.departments.map((d) => ({ href: `mailto:${d.email}`, label: d.name, external: true })),
      { href: "/contact#location", label: "Find us" },
    ],
  },
];

const LEGAL: FooterLink[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/sitemap.xml", label: "Sitemap", external: true },
  { href: "/contact", label: "Contact" },
];

const linkCls = "text-[0.95rem] text-fg-2 transition-colors hover:text-fg";

function FooterLinkItem({ l, className = linkCls }: { l: FooterLink; className?: string }) {
  if (l.external || l.download)
    return (
      <a href={l.href} download={l.download || undefined} className={`${className} inline-flex items-center gap-1.5`}>
        {l.label}
        {l.download && <Icon name="download" className="size-3.5" />}
      </a>
    );
  return (
    <Link href={l.href} className={className}>
      {l.label}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="cv-auto relative overflow-hidden border-t border-line bg-[#06080c]">
      {/* Top: brand + contact capture, link columns */}
      <div className="container-x grid gap-14 pb-4 pt-16 lg:grid-cols-12 lg:pt-20">
        <div className="lg:col-span-4">
          <Link href="/" aria-label="PrenishQ home" className="inline-block">
            <Logo className="h-7" />
          </Link>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-fg">Talk to our team</p>
          <div className="mt-4">
            <FooterContact fallbackEmail={site.email} />
          </div>
          <address className="mt-8 text-sm not-italic leading-relaxed text-fg-2">
            <a href={`mailto:${site.email}`} className="font-mono text-fg transition-colors hover:text-cyan">
              {site.email}
            </a>
            {site.address.lines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4 lg:col-span-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-fg">{col.title}</h2>
              <ul className="mt-6 space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <FooterLinkItem l={l} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Giant wordmark over the logo's dot-matrix grid, with a few cells lighting up */}
      <div aria-hidden className="footer-grid relative" data-loop>
        <div className="footer-cells">
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} style={{ ["--i" as string]: i }} />
          ))}
        </div>
        <div className="container-x relative pb-3 pt-20 sm:pb-2 sm:pt-24">
          <Wordmark className="block w-full text-fg" />
        </div>
      </div>

      {/* Legal bar */}
      <div className="relative border-t border-line bg-[#06080c]">
        <div className="container-x flex flex-col gap-4 py-6 text-sm text-fg-2 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName} All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">
                  {s.label}
                </a>
              </li>
            ))}
            {LEGAL.map((l) => (
              <li key={l.label}>
                <FooterLinkItem l={l} className="transition-colors hover:text-fg" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
