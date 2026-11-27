import { Section, SectionHeading } from "@/components/ui/section";
import { team } from "@/data/content";
import { cn } from "@/lib/cn";
import { Picture } from "@/components/media/picture";

/** Simple head-and-shoulders silhouette for placeholder portraits. */
function Silhouette() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <circle cx="60" cy="46" r="20" fill="rgb(255 255 255 / 0.10)" />
      <path d="M22 112c3-22 19-36 38-36s35 14 38 36" fill="rgb(255 255 255 / 0.10)" />
    </svg>
  );
}

/** About → Team. Cards render from data/content.ts; placeholders are styled, not blank. */
export function Team({ id }: { id?: string }) {
  if (!team.length) return null;
  return (
    <Section id={id} labelledBy="team-title" className="border-t border-line">
      <div className="container-x">
        <SectionHeading
          id="team-title"
          eyebrow="Team"
          title="The people behind PrenishQ."
          intro="PrenishQ is led by its co-founders."
        />
        {/* Up to two people: a two-up row, so no empty third column on desktop. */}
        <ul className={cn("grid gap-4 sm:grid-cols-2", team.length > 2 ? "lg:grid-cols-3" : "max-w-3xl")}>
          {team.map((m, i) => (
            <li
              key={`${m.name}-${i}`}
              className="glow-card reveal flex flex-col overflow-hidden"
              style={{ ["--i" as string]: i % 3 }}
              aria-label={m.placeholder ? "Team profile coming soon" : undefined}
            >
              <div className="dot-grid relative aspect-[4/3] overflow-hidden border-b border-line bg-bg">
                <div aria-hidden className={cn("glow-spot absolute inset-0", m.photo ? "opacity-60" : "opacity-30")} />
                {m.photo ? (
                  // Circular frame on the same backdrop as the placeholders: consistent across
                  // portraits with different backgrounds, and sharp at small source sizes.
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="relative aspect-square h-[66%] overflow-hidden rounded-full bg-surface shadow-[0_0_0_1px_var(--line-strong),0_0_0_7px_rgb(255_255_255/0.03),0_24px_60px_-24px_rgb(0_180_240/0.55)]">
                      <Picture
                        name={m.photo}
                        alt={`Portrait of ${m.name}`}
                        sizes="200px"
                        className="absolute inset-0"
                        imgClassName="!h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative mx-auto h-full w-1/2">
                    <Silhouette />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-5">
                <h3 className={cn("text-lg font-medium", m.placeholder && "text-fg-2")}>{m.name}</h3>
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-cyan">{m.role}</p>
                {m.bio && <p className={cn("mt-2 text-sm leading-relaxed text-fg-2", m.placeholder && "italic")}>{m.bio}</p>}
                {m.linkedin && (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on LinkedIn (opens in a new tab)`}
                    className="mt-auto inline-flex w-fit items-center gap-2 pt-4 text-sm text-fg-2 transition-colors hover:text-cyan"
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
