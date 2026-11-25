import { PageHero } from "@/components/ui/page-hero";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy notice",
  description: "How PrenishQ handles the personal data you share through this website.",
  path: "/privacy",
});

// TODO(client): legal review (India DPDP Act 2023 and, for EU/UK visitors, GDPR); confirm form
// processor, retention period and grievance officer. Statements below describe only what this
// website actually does today.
const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Who we are",
    body: [
      `${site.legalName} ("PrenishQ", "we") operates this website. You can reach us at ${site.email} or at ${site.address.lines.join(", ")}.`,
    ],
  },
  {
    title: "What we collect",
    body: [
      "When you send an enquiry or request a quote, we receive the details you enter: your name, email address and message, and optionally your organisation, phone number, product of interest and wavelength.",
      "We do not use cookies, advertising trackers or analytics on this website.",
    ],
  },
  {
    title: "Why we use it",
    body: [
      "We use your details only to reply to your enquiry, prepare a quotation and follow up on that request. We do not sell your data or use it for unrelated marketing.",
    ],
  },
  {
    title: "Who processes it",
    body: [
      "Enquiries are delivered to our team through a third-party form-handling service acting on our behalf, which processes the data only to deliver your message to us.",
      "The map on our contact page loads from Google only if you choose to load it, and Google's own privacy policy then applies.",
    ],
  },
  {
    title: "How long we keep it",
    body: ["We keep enquiry details only as long as needed to respond and to maintain a record of quotations, unless the law requires longer."],
  },
  {
    title: "Your choices",
    body: [
      `You can ask us to access, correct or delete the personal data you have shared with us, or withdraw your consent, by writing to ${site.email}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ href: "/privacy", label: "Privacy" }]} eyebrow="Legal" title="Privacy notice" intro="How we handle the personal data you share through this website." />
      <section className="py-14 sm:py-20">
        <div className="container-x max-w-3xl space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="text-xl font-medium">{s.title}</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-fg-2">
                {s.body.map((b) => (
                  <p key={b.slice(0, 30)}>{b}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
