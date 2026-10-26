import manifest from "@/data/media.generated.json";
import type { MediaName } from "@/lib/image-loader";

/** Small fixed-size logos: one WebP with a 1x/2x srcset (no <picture>, no blur), to keep HTML light. */
export function LogoImg({ name, alt, height, className }: { name: MediaName; alt: string; height: number; className?: string }) {
  const m = manifest[name];
  const w1 = Math.round((m.width / m.height) * height);
  const pick = (w: number) => m.widths.find((x) => x >= w) ?? m.widths[m.widths.length - 1];
  const src = (w: number) => `/media/${name}-${pick(w)}.webp`;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- pre-optimised static asset (DECISIONS D-03)
    <img
      src={src(w1)}
      srcSet={`${src(w1)} 1x, ${src(w1 * 2)} 2x`}
      alt={alt}
      width={w1}
      height={height}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
