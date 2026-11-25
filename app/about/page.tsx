import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Picture } from "@/components/media/picture";
import { MissionVision, CtaBand } from "@/components/home/closing-sections";
import { Icon, type IconName } from "@/components/icons";
import { funders } from "@/data/site";
import { milestones } from "@/data/content";
import { Team } from "@/components/about/team";
import { LabGallery } from "@/components/about/lab-gallery";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About: an IIT Delhi spin-off building precision diode lasers",
  description:
    "PrenishQ is an IIT Delhi spin-off supported by the National Quantum Mission, designing and building compact, robust, cost-effective lasers, optics, electronics and ultra-high-vacuum systems for quantum technologies.",
  path: "/about",
});

// Live site, "Technology Focus".
const FOCUS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "wave",
    title: "Lasers and optics",
    body: "Narrow-linewidth diode lasers, external cavity lasers, frequency-stabilised DBRs and tapered amplifiers, designed, manufactured, assembled and tested by PrenishQ.",
  },
  {
    icon: "chip",
    title: "Electronics and automation",
    body: "Electronics for experimental control and data acquisition, the layer that sequences and records every run of a quantum experiment.",
  },
  {
    icon: "vacuum",
    title: "Ultra-high vacuum",
    body: "Ultra-high-vacuum chambers for cold-atom experiments, the environment in which laser-cooled atoms are trapped and studied.",
  },
];



export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/about", label: "About" }]}
        eyebrow="About PrenishQ"
        title="From an IIT Delhi lab to your optical table."
        intro="PrenishQ is an IIT Delhi spin-off, supported by the National Quantum Mission, that designs, builds and commercialises high-precision diode lasers and quantum sensors."
        sections={[
          { id: "story", label: "Our story" },
          { id: "mission", label: "Mission" },
          { id: "team", label: "Team" },
          { id: "build", label: "What we build" },
          { id: "lab", label: "Inside the lab" },
          { id: "education", label: "Education" },
          { id: "backers", label: "Backers" },
        ]}
      />

      {/* Story */}
      <Section id="story" labelledBy="story-title" lazy={false}>
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-4">Our story</p>
            <h2 id="story-title" className="text-3xl font-medium leading-tight sm:text-4xl">
              Precision lasers shouldn&apos;t mean long waits and import prices.
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-fg-2">
              <p>
                Instruments such as particle size analysers, Raman spectrometers and optical tweezers depend on precision lasers that are largely
                imported, at high prices and with long delivery times. We set out to make lasers more compact and robust, at a lower price than is
                available in the market.
              </p>
              <p>
                That matters to academic institutes, R&amp;D labs, healthcare, communication and security. Our product line is the result of
                day-and-night work by research students and scientists, who design, manufacture, assemble and test our lasers, vacuum chambers and
                electronics.
              </p>
            </div>
          </div>
          <figure className="bench-frame overflow-hidden rounded-lg border border-line lg:col-span-6">
            <Picture
              name="opal-bench-photo"
              alt="An OPAL laser head on an optical breadboard in the PrenishQ lab."
              sizes="(min-width: 1024px) 50vw, 100vw"
              imgClassName="aspect-[4/3] object-cover"
            />
            <figcaption className="border-t border-line px-4 py-3 font-mono text-xs text-fg-2">OPAL on the bench, PrenishQ lab, IIT Delhi</figcaption>
          </figure>
        </div>
      </Section>

      <MissionVision id="mission" />

      <Team id="team" />

      {/* What we build */}
      <Section id="build" labelledBy="build-title" className="border-t border-line">
        <div className="container-x">
          <SectionHeading
            id="build-title"
            eyebrow="Technology focus"
            title="The building blocks of a quantum experiment."
            intro="We work across the three subsystems every cold-atom or trapped-ion experiment needs."
          />
          <ul className="grid gap-4 md:grid-cols-3">
            {FOCUS.map((f, i) => (
              <li key={f.title} className="glow-card reveal p-6" style={{ ["--i" as string]: i }}>
                <Icon name={f.icon} className="size-8 text-cyan" />
                <h3 className="mt-8 text-xl font-medium">{f.title}</h3>
                <p className="mt-3 leading-relaxed text-fg-2">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>


      <LabGallery id="lab" />

      {/* Skills */}
      <Section id="education" labelledBy="skills-title" className="border-t border-line">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">Education and skills</p>
            <h2 id="skills-title" className="text-3xl font-medium leading-tight sm:text-4xl">
              Training the next generation of quantum engineers.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-fg-2">
              Besides developing the subsystems of a quantum computer, we aim to be a skill-development partner for students who want to become
              future leaders in quantum technologies, through hands-on work with real lasers, optics and vacuum hardware.
            </p>
          </div>
          <div className="glow-card p-6 lg:col-span-5">
            <Icon name="graduation" className="size-8 text-cyan" />
            <p className="mt-5 text-fg-2">Teaching labs, student projects and academic partnerships:</p>
            <a href="mailto:education@prenishq.com" className="mt-2 inline-block font-mono text-lg text-fg hover:text-cyan">
              education@prenishq.com
            </a>
          </div>
        </div>
      </Section>

      {/* Funders */}
      <Section id="backers" labelledBy="funders-title" className="border-t border-line">
        <div className="container-x">
          <SectionHeading id="funders-title" eyebrow="Incubators and funders" title="Backed by India's quantum ecosystem." />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {funders.map((f, i) => (
              <li key={f.logo} className="reveal flex flex-col items-center gap-3 rounded-lg border border-line bg-surface p-4" style={{ ["--i" as string]: i % 4 }}>
                <div className="grid h-24 w-full place-items-center rounded-md bg-white/[0.94] p-3">
                  <Picture name={f.logo} alt="" sizes="120px" blur={false} className="block h-16" imgClassName="!h-16 !w-auto max-w-[140px] object-contain" />
                </div>
                <p className="text-center text-xs leading-snug text-fg-2">{f.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Milestones: rendered only once the client supplies them (data/content.ts). */}
      {milestones.length > 0 && (
        <Section labelledBy="milestones-title" className="border-t border-line">
          <div className="container-x">
            <SectionHeading id="milestones-title" eyebrow="Milestones" title="How we got here." />
            <ol className="relative border-l border-line pl-6">
              {milestones.map((m) => (
                <li key={m.title} className="reveal relative pb-8 last:pb-0">
                  <span aria-hidden className="absolute -left-[29px] top-1.5 size-2.5 rounded-full bg-cyan" />
                  <span className="font-mono text-sm text-cyan">{m.date}</span>
                  <h3 className="mt-1 text-lg font-medium">{m.title}</h3>
                  {m.detail && <p className="mt-1 text-fg-2">{m.detail}</p>}
                </li>
              ))}
            </ol>
          </div>
        </Section>
      )}


      {/* Explore further */}
      <Section labelledBy="more-title" className="border-t border-line">
        <div className="container-x">
          <h2 id="more-title" className="sr-only">
            Explore further
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {[
              { href: "/technology", title: "Our technology", body: "How our lasers work, where they are used, and what we are building next." },
              { href: "/products", title: "Our products", body: "Five instrument families from 369 to 1600 nm." },
              { href: "/contact", title: "Work with us", body: "Quotes, service, teaching labs and partnerships." },
            ].map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="glow-card reveal group flex h-full flex-col gap-2 p-6">
                  <span className="flex items-center justify-between text-lg font-medium">
                    {c.title} <Icon name="arrow-right" className="size-5 text-fg-2 transition-transform group-hover:translate-x-1 group-hover:text-fg" />
                  </span>
                  <span className="text-sm text-fg-2">{c.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
