import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SplitReveal } from "@/components/motion/split-reveal";

export function Section({
  id,
  children,
  className,
  labelledBy,
  lazy = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  /** content-visibility: auto for below-the-fold sections. */
  lazy?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("relative py-20 sm:py-28", lazy && "cv-auto", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  children,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-4 sm:mb-16",
        align === "center" && "items-center text-center",
        children && "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <p className="eyebrow reveal mb-4">{eyebrow}</p>
        {typeof title === "string" ? (
          <SplitReveal id={id} text={title} className="text-3xl font-medium leading-tight sm:text-[2.6rem]" />
        ) : (
          <h2 id={id} className="reveal text-3xl font-medium leading-tight sm:text-[2.6rem]" style={{ ["--i" as string]: 1 }}>
            {title}
          </h2>
        )}
        {intro && (
          <p className="reveal mt-4 text-lg leading-relaxed text-fg-2" style={{ ["--i" as string]: 2 }}>
            {intro}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

/** Thin laser line that draws across when it enters the viewport. */
export function BeamDivider({ accent }: { accent?: string }) {
  return (
    <div className="container-x" aria-hidden>
      <div className="beam-line" data-observe style={accent ? { ["--accent" as string]: accent } : undefined} />
    </div>
  );
}
