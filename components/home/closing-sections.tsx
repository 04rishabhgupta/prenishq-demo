import { Section, SectionHeading } from "@/components/ui/section";
import { QuoteButton, buttonVariants } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/icons";
import { BeamRain } from "@/components/motion/beam-rain";
import { SplitReveal } from "@/components/motion/split-reveal";
import { mission, whyUs } from "@/data/site";

export function WhyPrenishQ() {
  return (
    <Section labelledBy="why-title" className="border-t border-line">
      <div className="container-x">
        <SectionHeading id="why-title" eyebrow="Why PrenishQ" title="Built in India, for the optical table." align="center" />
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {whyUs.map((w, i) => (
            <li key={w.title} className="glow-card reveal flex flex-col p-4 sm:p-6" style={{ ["--i" as string]: i }}>
              <span className="mb-4 grid size-9 place-items-center rounded-md border border-line-strong text-cyan sm:mb-6 sm:size-11">
                <Icon name={w.icon as IconName} className="size-[18px] sm:size-[22px]" />
              </span>
              <h3 className="text-[0.95rem] font-medium leading-snug sm:text-lg sm:leading-[calc(1.75/1.125)]">{w.title}</h3>
              <ul className="mt-2.5 space-y-1.5 text-[0.8rem] leading-snug text-fg-2 sm:mt-3 sm:space-y-2 sm:text-sm sm:leading-[calc(1.25/0.875)]">
                {w.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-cyan sm:mt-2" aria-hidden />
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

export function MissionVision({ id }: { id?: string }) {
  return (
    <Section id={id} labelledBy="mission-title" className="border-t border-line">
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
