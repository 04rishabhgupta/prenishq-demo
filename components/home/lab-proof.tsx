import Link from "next/link";
import { Picture } from "@/components/media/picture";
import { Section, SectionHeading } from "@/components/ui/section";
import { productBySlug, type ProductSlug } from "@/data/products";
import { accentVars } from "@/lib/accent";
import type { MediaName } from "@/lib/image-loader";
import { cn } from "@/lib/cn";
import { SwipeRow } from "@/components/ui/swipe-row";

type Tile = {
  image: MediaName;
  alt: string;
  title: string;
  metric: string;
  caption: string;
  credit?: string;
  product: ProductSlug;
  /** Plots are light-background figures: shown on a "paper" mount, never recoloured. */
  paper?: boolean;
  className?: string;
  /** Only on the full (Technology) variant. */
  full?: boolean;
};

// All captions from the catalogue (pp. 2–4, 7).
const TILES: Tile[] = [
  {
    image: "agate-linewidth-plot",
    alt: "Self-heterodyne beat note: amplitude against frequency from −200 to 200 kHz, single peak with FWHM 90 ± 3 kHz.",
    title: "Ultra-narrow linewidth",
    metric: "90 ± 3 kHz FWHM",
    caption: "Measured using a self-heterodyne setup at IIT Delhi.",
    product: "agate",
    paper: true,
  },
  {
    image: "cs-mot-fluorescence",
    alt: "False-colour fluorescence image of a cloud of laser-cooled caesium atoms, with a 1 mm scale bar.",
    title: "Laser-cooled caesium",
    metric: "15 µK",
    caption:
      "Fluorescence image of a Cs magneto-optical trap obtained by laser cooling at IIT Delhi.",
    product: "agate",
  },
  {
    image: "nv-diamond-fluorescence",
    alt: "Diamond cube fluorescing red under green laser excitation.",
    title: "NV centre fluorescence",
    metric: "520 nm excitation",
    caption: "Captured at PrenishQ using the 520 nm OPAL laser.",
    product: "opal",
  },
  {
    image: "cancer-cell-405",
    alt: "False-colour fluorescence micrograph of cancer tissue with a 200 µm scale bar.",
    title: "Cancer cell imaging",
    metric: "405 nm excitation",
    caption:
      "Captured using the 405 nm OPAL laser at BITS Pilani, Hyderabad Campus.",
    credit:
      "Image courtesy of Prof. Sudipta Maiti, BITS Pilani, Hyderabad Campus.",
    product: "opal",
  },
  {
    image: "dbrpro-cs-sas",
    alt: "Saturated absorption spectrum of caesium-133 showing the F = 4 and F = 3 manifolds and crossover resonances.",
    title: "Doppler-free caesium spectroscopy",
    metric: "¹³³Cs D2",
    caption:
      "Saturated absorption spectrum recorded at IIT Delhi, resolving the F = 4 and F = 3 manifolds and crossover resonances.",
    product: "dbr-pro",
    paper: true,
    full: true,
    className: "md:col-span-2",
  },
];

/** Home shows the four highlights; Technology (`full`) adds the remaining lab results. */
export function LabProof({
  full = false,
  id,
}: {
  full?: boolean;
  id?: string;
}) {
  const tiles = TILES.filter((t) => full || !t.full);
  const grid = "grid gap-4 md:grid-cols-2";
  const cards = tiles.map((t, i) => {
    const p = productBySlug[t.product];
    return (
      <figure
        key={t.image}
        className={cn(
          "glow-card bench-frame reveal flex flex-col overflow-hidden",
          t.className,
        )}
        style={{ ...accentVars(p.accent), ["--i" as string]: i % 2 }}
      >
        {/* Scientific figures are never cropped: scale bars and axes must stay visible. */}
        <div
          className={cn(
            "relative overflow-hidden border-b border-line",
            t.className ? "aspect-[21/8]" : "aspect-[16/10]",
            t.paper ? "bg-[#f7f8fa]" : "bg-black",
          )}
        >
          <Picture
            name={t.image}
            alt={t.alt}
            sizes="(min-width: 768px) 50vw, 86vw"
            className={cn("absolute inset-0", t.paper && "p-5")}
            imgClassName="!h-full object-contain"
            blur={false}
          />
        </div>
        <figcaption className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-medium">{t.title}</h3>
            <span
              className="font-mono text-sm"
              style={{ color: "var(--accent-text)" }}
            >
              {t.metric}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-fg-2">{t.caption}</p>
          {t.credit && <p className="text-xs text-fg-2/80">{t.credit}</p>}
          <Link
            href={`/products/${p.slug}`}
            className="mt-auto pt-2 font-mono text-xs uppercase tracking-wider text-fg-2 hover:text-fg"
          >
            {p.name} →
          </Link>
        </figcaption>
      </figure>
    );
  });
  return (
    <Section
      id={id}
      labelledBy="proof-title"
      className="border-y border-line bg-surface/40"
    >
      <div
        aria-hidden
        className="hairline-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]"
      />
      <div className="container-x relative">
        <SectionHeading
          id="proof-title"
          eyebrow="Proven in the lab"
          title="Measured, not promised."
          intro="Results recorded with PrenishQ lasers at IIT Delhi, BITS Pilani and our own lab."
        />
        {full ? (
          <div className={grid}>{cards}</div>
        ) : (
          <SwipeRow count={tiles.length} label="Lab results" className={grid}>
            {cards}
          </SwipeRow>
        )}
        {!full && (
          <Link
            href="/technology#results"
            className="mt-8 inline-flex items-center gap-1.5 text-sm text-cyan hover:underline"
          >
            All lab results and how they were measured →
          </Link>
        )}
      </div>
    </Section>
  );
}
