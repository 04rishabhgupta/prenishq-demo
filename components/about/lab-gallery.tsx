import { Picture } from "@/components/media/picture";
import { Lightbox, type LightboxItem } from "@/components/gallery/lightbox";
import { Section, SectionHeading } from "@/components/ui/section";
import { gallery } from "@/data/gallery";
import manifest from "@/data/media.generated.json";

/** "Inside the lab" on About (formerly the Gallery page). CSS-columns masonry + native <dialog> lightbox. */
export function LabGallery({ id }: { id?: string }) {
  const items: LightboxItem[] = gallery.map((g) => {
    const m = manifest[g.image];
    const set = (ext: string) => m.widths.map((w) => `/media/${g.image}-${w}.${ext} ${w}w`).join(", ");
    return { avif: set("avif"), webp: set("webp"), src: `/media/${g.image}-${m.widths.at(-1)}.webp`, alt: g.alt, caption: g.caption, credit: g.credit, w: m.width, h: m.height };
  });

  return (
    <Section id={id} labelledBy="lab-title" className="border-t border-line">
      <div className="container-x">
        <SectionHeading id="lab-title" eyebrow="Inside the lab" title="From the bench." intro="Instruments, measurements and moments from the lab. Select an image to view it full size." />
          <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4 [&>li]:break-inside-avoid">
            {gallery.map((g, i) => (
              // Off-screen items skip layout, so their lazy images don't compete with the LCP image.
              <li key={g.image} className={i > 1 ? "[contain-intrinsic-size:auto_320px] [content-visibility:auto]" : undefined}>
                <button
                  type="button"
                  data-lightbox={i}
                  aria-haspopup="dialog"
                  className="group block w-full overflow-hidden rounded-lg border border-line bg-surface text-left transition-colors hover:border-line-strong"
                >
                  <span className="relative block overflow-hidden">
                    <Picture
                      name={g.image}
                      alt={g.alt}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      imgClassName="transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <span className="absolute right-2 top-2 rounded-sm bg-bg/75 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-2">
                      {g.kind === "lab" ? "Lab" : "Product"}
                    </span>
                  </span>
                  <span className="block px-4 py-3 text-sm leading-snug text-fg-2">{g.caption}</span>
                </button>
              </li>
            ))}
          </ul>
      </div>
      <Lightbox items={items} />
    </Section>
  );
}
