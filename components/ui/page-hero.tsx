import Link from "next/link";
import type { ReactNode } from "react";
import { BeamRain } from "@/components/motion/beam-rain";

export type Crumb = { href: string; label: string };

/** Inner-page header: breadcrumb, eyebrow, H1, intro over the dot-matrix grid. */
export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
  sections,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
  /** "On this page" anchors for long pages (Toptica/Hamamatsu pattern). */
  sections?: { id: string; label: string }[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="dot-grid absolute inset-0 [mask-image:radial-gradient(80%_100%_at_15%_0%,#000,transparent)]" />
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div className="spotlight" />
      </div>
      <BeamRain count={10} fall={560} className="!left-[52%] [mask-image:linear-gradient(to_left,#000_40%,transparent)]" />
      <div className="container-x relative pb-14 pt-10 sm:pb-20 sm:pt-14">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-fg-2">
              {[{ href: "/", label: "Home" }, ...crumbs].map((c, i, all) => (
                <li key={c.href} className="flex items-center gap-2">
                  {i < all.length - 1 ? (
                    <>
                      <Link href={c.href} className="hover:text-fg">
                        {c.label}
                      </Link>
                      <span aria-hidden>/</span>
                    </>
                  ) : (
                    <span aria-current="page" className="text-fg">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h1 className="max-w-3xl text-4xl font-medium leading-[1.05] sm:text-6xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-2">{intro}</p>}
        {children}
        {sections && (
          <nav aria-label="On this page" className="mt-10 flex flex-wrap items-center gap-2">
            <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-2">On this page</span>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-line-strong bg-bg/60 px-3.5 py-1.5 text-sm text-fg-2 transition-colors hover:border-cyan/60 hover:text-fg"
              >
                {s.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
