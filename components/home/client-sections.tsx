// Sections that depend on client-supplied content (data/content.ts). Each renders nothing
// while its data is empty, so the site never shows placeholder holes.
import { Section, SectionHeading } from "@/components/ui/section";
import { events, news, testimonials, usedIn } from "@/data/content";

/** LEOS/Toptica pattern: named researchers, their institution and the paper that used the laser. */
export function Voices() {
  if (!testimonials.length && !usedIn.length) return null;
  return (
    <Section labelledBy="voices-title" className="border-t border-line">
      <div className="container-x">
        <SectionHeading id="voices-title" eyebrow="Used in labs" title="Trusted at the optical table." />
        {testimonials.length > 0 && (
          <ul className="grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <li key={t.name} className="glow-card reveal flex flex-col gap-5 p-6">
                <blockquote className="text-lg leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                <p className="mt-auto text-sm">
                  <span className="block font-medium">{t.name}</span>
                  <span className="block text-fg-2">
                    {t.role}, {t.institution}
                  </span>
                  {t.paper && (
                    <a href={t.paper.url} className="mt-2 block font-mono text-xs text-cyan hover:underline">
                      {t.paper.venue} ({t.paper.year})
                    </a>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
        {usedIn.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-fg-2">
            {usedIn.map((u) => (
              <li key={u.name}>{u.url ? <a href={u.url} className="hover:text-fg">{u.name}</a> : u.name}</li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}

/** Events and news (Toptica/Hamamatsu/Nireos pattern). */
export function Updates() {
  if (!events.length && !news.length) return null;
  return (
    <Section labelledBy="updates-title" className="border-t border-line">
      <div className="container-x grid gap-10 lg:grid-cols-2">
        {events.length > 0 && (
          <div>
            <SectionHeading id="updates-title" eyebrow="Meet us" title="Upcoming events" />
            <ul className="divide-y divide-line border-y border-line">
              {events.map((e) => (
                <li key={e.name} className="grid grid-cols-[110px_1fr] gap-4 py-4">
                  <span className="font-mono text-sm text-cyan">{e.date}</span>
                  <span>
                    {e.url ? <a href={e.url} className="hover:text-cyan">{e.name}</a> : e.name}
                    <span className="block text-sm text-fg-2">{e.place}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {news.length > 0 && (
          <div>
            <SectionHeading id={events.length ? "news-title" : "updates-title"} eyebrow="News" title="What's new" />
            <ul className="space-y-4">
              {news.map((n) => (
                <li key={n.title} className="glow-card p-5">
                  <span className="font-mono text-xs text-fg-2">{n.date}</span>
                  <h3 className="mt-2 font-medium">{n.url ? <a href={n.url} className="hover:text-cyan">{n.title}</a> : n.title}</h3>
                  <p className="mt-1.5 text-sm text-fg-2">{n.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}
