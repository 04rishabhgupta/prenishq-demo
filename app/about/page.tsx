import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Picture } from "@/components/media/picture";
import { MissionVision, CtaBand } from "@/components/home/closing-sections";
import { Icon, type IconName } from "@/components/icons";
import { funders } from "@/data/site";
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

// TODO(client): names, roles, photos and short bios.
const TEAM = Array.from({ length: 4 }, (_, i) => ({ id: i }));

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/about", label: "About" }]}
        eyebrow="About PrenishQ"
        title="From an IIT Delhi lab to your optical table."
        intro="PrenishQ is an IIT Delhi spin-off, supported by the National Quantum Mission, that designs, builds and commercialises high-precision diode lasers and quantum sensors."
      />

      {/* Story */}
      <Section labelledBy="story-title" lazy={false}>
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

      {/* What we build */}
      <Section labelledBy="build-title" className="border-t border-line">
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

      <MissionVision />

      {/* Skills */}
      <Section labelledBy="skills-title" className="border-t border-line">
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
      <Section labelledBy="funders-title" className="border-t border-line">
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

      {/* Team */}
      <Section labelledBy="team-title" className="border-t border-line">
        <div className="container-x">
          <SectionHeading id="team-title" eyebrow="Team" title="The people behind the lasers." intro="Team profiles are coming soon." />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((t) => (
              <li key={t.id} className="glow-card flex flex-col gap-4 p-5" aria-label="Team profile coming soon">
                <div className="dot-grid grid aspect-square place-items-center rounded-md border border-line bg-bg">
                  <Icon name="users" className="size-10 text-fg-2/50" />
                </div>
                <div>
                  <div className="h-4 w-2/3 rounded bg-white/[0.07]" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-white/[0.05]" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
