import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LogoImg } from "@/components/media/logo-img";
import { Icon } from "@/components/icons";
import { funders, nav, site } from "@/data/site";
import { products } from "@/data/products";

export function SiteFooter() {
  return (
    <footer className="cv-auto relative border-t border-line bg-surface/60">
      <div className="beam-line" data-observe aria-hidden />
      <div className="container-x grid gap-12 py-14 md:grid-cols-12 md:py-16">
        <div className="md:col-span-4">
          <Logo className="h-6" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-fg-2">
            Precision diode lasers for quantum technologies, spectroscopy and research. Designed and built at IIT Delhi.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 text-xs">
            <li className="rounded-full border border-line-strong px-3 py-1.5 text-fg-2">An IIT Delhi spin-off</li>
            <li className="rounded-full border border-line-strong px-3 py-1.5 text-fg-2">Supported by the National Quantum Mission</li>
          </ul>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-4">
          <div>
            <h2 className="eyebrow mb-4 !text-fg-2">Company</h2>
            <ul className="space-y-2.5 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-fg-2 transition-colors hover:text-fg">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow mb-4 !text-fg-2">Products</h2>
            <ul className="space-y-2.5 text-sm">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`} className="text-fg-2 transition-colors hover:text-fg">
                    {p.name}
                  </Link>
                </li>
              ))}
              <li>
                <a href="/datasheets/prenishq-catalogue.pdf" className="inline-flex items-center gap-1.5 text-fg-2 hover:text-fg">
                  Catalogue (PDF) <Icon name="download" className="size-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <address className="not-italic md:col-span-4">
          <h2 className="eyebrow mb-4 !text-fg-2">Contact</h2>
          <a href={`mailto:${site.email}`} className="font-mono text-fg transition-colors hover:text-cyan">
            {site.email}
          </a>
          <p className="mt-4 text-sm leading-relaxed text-fg-2">
            {site.address.lines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </p>
          <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-cyan hover:underline">
            Open in Google Maps <Icon name="arrow-up-right" className="size-3.5" />
          </a>
        </address>
      </div>

      <div className="border-t border-line">
        <div className="container-x py-8">
          <p className="mb-5 text-xs text-fg-2">Incubated and funded by</p>
          <ul className="flex flex-wrap items-center gap-3">
            {funders.map((f) => (
              <li key={f.logo} className="grid h-14 w-[88px] place-items-center rounded-md bg-white/90 p-2">
                <LogoImg name={f.logo} alt={f.name} height={36} className="h-9 w-auto max-w-[72px] object-contain" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-fg-2 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName} All rights reserved.</p>
          <p>Laser products: observe all safety labels. Avoid eye or skin exposure to direct or scattered radiation.</p>
        </div>
      </div>
    </footer>
  );
}
