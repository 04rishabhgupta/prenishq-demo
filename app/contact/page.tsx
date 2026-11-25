import { PageHero } from "@/components/ui/page-hero";
import { EnquiryFormLazy } from "@/components/forms/enquiry-form-lazy";
import { MapFacade } from "@/components/contact/map-facade";
import { Icon } from "@/components/icons";
import { site } from "@/data/site";
import { siteFaq } from "@/data/content";
import { Faq } from "@/components/ui/faq";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact: request a quote",
  description:
    "Request a quote or talk to PrenishQ sales, service or education. 2nd Floor, Synergy Building, TBIU Complex, IIT Delhi, Hauz Khas, New Delhi 110016.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/contact", label: "Contact" }]}
        eyebrow="Contact"
        title="Let's talk about your setup."
        intro="Tell us about your application, wavelength and power requirements. Our team will reply with a recommended configuration and lead time."
        sections={[
          { id: "enquiry", label: "Send an enquiry" },
          { id: "faq", label: "FAQ" },
          { id: "location", label: "Find us" },
        ]}
      />

      <section id="enquiry" aria-labelledby="enquiry-title" className="scroll-mt-24 py-12 sm:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="glow-card bench-frame p-5 sm:p-8 lg:col-span-7">
            <h2 id="enquiry-title" className="mb-6 text-2xl font-medium">
              Send an enquiry
            </h2>
            <EnquiryFormLazy source="contact-page" />
          </div>

          <aside className="flex flex-col gap-4 lg:col-span-5" aria-label="Contact details">
            <ul className="grid gap-3">
              {site.departments.map((d) => (
                <li key={d.name} className="glow-card p-5">
                  <h3 className="font-medium">{d.name}</h3>
                  <p className="mt-1 text-sm text-fg-2">{d.blurb}</p>
                  <a href={`mailto:${d.email}`} className="mt-3 inline-flex items-center gap-2 font-mono text-sm text-cyan hover:underline">
                    <Icon name="mail" className="size-4" /> {d.email}
                  </a>
                </li>
              ))}
            </ul>
            <div className="glow-card p-5">
              <h3 className="font-medium">General enquiries</h3>
              <a href={`mailto:${site.email}`} className="mt-2 inline-flex items-center gap-2 font-mono text-sm text-cyan hover:underline">
                <Icon name="mail" className="size-4" /> {site.email}
              </a>
              <address className="mt-4 flex gap-2 text-sm not-italic leading-relaxed text-fg-2">
                <Icon name="pin" className="mt-0.5 size-4 shrink-0" />
                <span>
                  {site.address.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </span>
              </address>
            </div>
            {/* Buyer routing (Nireos "which product fits my case?") */}
            <div className="glow-card p-5">
              <h3 className="font-medium">Not sure which product fits?</h3>
              <p className="mt-1 text-sm text-fg-2">See which instruments cover your wavelength, or compare specifications side by side.</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <Link href="/products#find" className="inline-flex items-center gap-1.5 text-cyan hover:underline">
                  Find your laser <Icon name="arrow-right" className="size-4" />
                </Link>
                <Link href="/products" className="inline-flex items-center gap-1.5 text-cyan hover:underline">
                  Compare products <Icon name="arrow-right" className="size-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="faq" aria-labelledby="contact-faq-title" className="scroll-mt-24 border-t border-line py-16 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-4">FAQ</p>
            <h2 id="contact-faq-title" className="text-3xl font-medium leading-tight">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-fg-2">Quick answers on products, wavelengths, lead times, support and education.</p>
          </div>
          <Faq items={siteFaq} className="lg:col-span-8" />
        </div>
      </section>

      <section id="location" aria-labelledby="map-title" className="cv-auto border-t border-line py-12 sm:py-16">
        <div className="container-x">
          <h2 id="map-title" className="mb-6 text-2xl font-medium">
            Find us at IIT Delhi
          </h2>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line sm:aspect-[21/9]">
            <MapFacade embedUrl={site.address.mapsEmbed} mapsUrl={site.address.mapsUrl} label="PrenishQ, Synergy Building, TBIU Complex, IIT Delhi" />
          </div>
        </div>
      </section>
    </>
  );
}
