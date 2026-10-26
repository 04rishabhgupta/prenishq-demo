import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink, QuoteButton, buttonVariants } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/icons";
import { BeamRain } from "@/components/motion/beam-rain";
import { SplitReveal } from "@/components/motion/split-reveal";
import { applicationAreas, mission, whyUs } from "@/data/site";

export function ApplicationsStrip() {
  return (
    <Section labelledBy="areas-title">
      <div className="container-x">
        <SectionHeading
          id="areas-title"
          eyebrow="Applications"
          title="Precision lasers, limitless possibilities."
          intro="From cancer-cell imaging to cold-atom quantum computing, the same requirements recur: a clean spectrum, stable power and a wavelength that matches the physics."
        >
          <ButtonLink href="/applications" variant="secondary" className="reveal">
            Explore applications <Icon name="arrow-right" />
          </ButtonLink>
        </SectionHeading>
        <ol className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {applicationAreas.map((a, i) => (
            <li
              key={a}
              className="reveal group flex items-center justify-between gap-4 border-b border-r border-line px-5 py-6 transition-colors hover:bg-white/[0.02]"
              style={{ ["--i" as string]: i % 3 }}
            >
              <span className="text-lg">{a}</span>
              <span className="font-mono text-xs text-fg-2 group-hover:text-cyan">{String(i + 1).padStart(2, "0")}</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

export function WhyPrenishQ() {
  return (
    <Section labelledBy="why-title" className="border-t border-line">
      <div className="container-x">
        <SectionHeading id="why-title" eyebrow="Why PrenishQ" title="Built in India, for the optical table." align="center" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((w, i) => (
            <li key={w.title} className="glow-card reveal flex flex-col p-6" style={{ ["--i" as string]: i }}>
              <span className="mb-6 grid size-11 place-items-center rounded-md border border-line-strong text-cyan">
                <Icon name={w.icon as IconName} className="size-[22px]" />
              </span>
              <h3 className="text-lg font-medium">{w.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-fg-2">
                {w.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-cyan" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

const PILLAR_ICONS: IconName[] = ["gear", "chart", "infinity", "leaf"];

export function MissionVision() {
  return (
    <Section labelledBy="mission-title" className="border-t border-line">
      <div aria-hidden className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_60%_at_50%_40%,#000,transparent)]" />
      <div className="container-x relative grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow reveal mb-4">Mission & vision</p>
          <h2 id="mission-title" className="reveal text-3xl font-medium leading-tight sm:text-[2.6rem]" style={{ ["--i" as string]: 1 }}>
            {mission.mission}
          </h2>
          <p className="reveal mt-6 max-w-xl text-lg leading-relaxed text-fg-2" style={{ ["--i" as string]: 2 }}>
            We envision {mission.vision.charAt(0).toLowerCase() + mission.vision.slice(1)}
          </p>
          <p className="reveal mt-4 max-w-xl leading-relaxed text-fg-2" style={{ ["--i" as string]: 3 }}>
            {mission.longTerm}
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-px self-end overflow-hidden rounded-lg border border-line bg-line lg:col-span-5">
          {mission.pillars.map((p, i) => (
            <li key={p.title} className="reveal flex flex-col gap-6 bg-bg p-5 sm:p-6" style={{ ["--i" as string]: i }}>
              <Icon name={PILLAR_ICONS[i]} className="size-7 text-cyan" />
              <div>
                <h3 className="font-medium">{p.title}</h3>
                <p className="mt-1 text-sm text-fg-2">{p.sub}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" className="cv-auto relative overflow-hidden border-t border-line py-20 sm:py-28">
      <BeamRain count={18} fall={720} className="[mask-image:radial-gradient(ellipse_42%_62%_at_50%_48%,transparent_55%,#000_80%)]" />
      <div aria-hidden className="glow-spot absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 -translate-y-1/2" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
      <div aria-hidden className="beam-line absolute inset-x-0 top-0" data-observe />
      <div className="container-x relative text-center">
        <p className="eyebrow reveal mb-4">Start a conversation</p>
        <SplitReveal id="cta-title" text="Tell us your wavelength. We’ll recommend the laser." className="mx-auto max-w-3xl text-3xl font-medium leading-tight sm:text-5xl" />
        <p className="reveal mx-auto mt-5 max-w-xl text-lg text-fg-2" style={{ ["--i" as string]: 2 }}>
          Share your application, power and linewidth requirements and our team will suggest a configuration and lead time.
        </p>
        <div className="reveal mt-9 flex flex-wrap justify-center gap-3" style={{ ["--i" as string]: 3 }}>
          <span data-magnet className="inline-flex">
            <QuoteButton size="lg" />
          </span>
          <span data-magnet className="inline-flex">
            <a href="/datasheets/prenishq-catalogue.pdf" download className={`${buttonVariants({ variant: "secondary", size: "lg" })} moving-border`}>
              Download catalogue <Icon name="download" />
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
