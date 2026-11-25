import { Section, SectionHeading } from "@/components/ui/section";
import { team } from "@/data/content";
import { cn } from "@/lib/cn";

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
          intro="The researchers, engineers and scientists designing and building PrenishQ's lasers."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <li
              key={`${m.name}-${i}`}
              className="glow-card reveal flex flex-col overflow-hidden"
              style={{ ["--i" as string]: i % 3 }}
              aria-label={m.placeholder ? "Team profile coming soon" : undefined}
            >
              <div className="dot-grid relative aspect-[4/3] overflow-hidden border-b border-line bg-bg">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- client-supplied portrait
                  <img src={m.photo} alt={`Portrait of ${m.name}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <div aria-hidden className="glow-spot absolute inset-0 opacity-30" />
                    <div className="relative mx-auto h-full w-1/2">
                      <Silhouette />
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-5">
                <h3 className={cn("text-lg font-medium", m.placeholder && "text-fg-2")}>{m.name}</h3>
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-cyan">{m.role}</p>
                {m.bio && <p className={cn("mt-2 text-sm leading-relaxed text-fg-2", m.placeholder && "italic")}>{m.bio}</p>}
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="mt-auto pt-3 text-sm text-cyan hover:underline">
                    LinkedIn ↗
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
