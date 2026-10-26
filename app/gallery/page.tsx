import { PageHero } from "@/components/ui/page-hero";
import { Picture } from "@/components/media/picture";
import { Lightbox, type LightboxItem } from "@/components/gallery/lightbox";
import { gallery } from "@/data/gallery";
import manifest from "@/data/media.generated.json";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Gallery: lasers and lab results",
  description: "Lab imagery from PrenishQ: OPAL and AGATE lasers, NV centre fluorescence, a laser-cooled caesium MOT and saturated absorption spectroscopy.",
  path: "/gallery",
});

// Masonry is CSS columns (no JS layout). Virtualisation only needed beyond ~24 items (PLAN §2).
export default function GalleryPage() {
  const items: LightboxItem[] = gallery.map((g) => {
    const m = manifest[g.image];
    const set = (ext: string) => m.widths.map((w) => `/media/${g.image}-${w}.${ext} ${w}w`).join(", ");
    return { avif: set("avif"), webp: set("webp"), src: `/media/${g.image}-${m.widths.at(-1)}.webp`, alt: g.alt, caption: g.caption, credit: g.credit, w: m.width, h: m.height };
  });

  return (
    <>
      <PageHero
        crumbs={[{ href: "/gallery", label: "Gallery" }]}
        eyebrow="Gallery"
        title="From the bench."
        intro="Instruments, measurements and moments from the lab. Select an image to view it full size."
      />
      <section aria-label="Image gallery" className="py-12 sm:py-16">
        <div className="container-x">
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
                      priority={i === 0}
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
          <p className="mt-8 text-sm text-fg-2">More photography from the lab and events is on its way.</p>
        </div>
      </section>
      <Lightbox items={items} />
    </>
  );
}
