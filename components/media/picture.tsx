import { getImageProps } from "next/image";
import manifest from "@/data/media.generated.json";
import { mediaUrl, type MediaName } from "@/lib/image-loader";
import { cn } from "@/lib/cn";

type PictureProps = {
  name: MediaName;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Above-the-fold LCP candidate: eager + high fetch priority. */
  priority?: boolean;
  /** Blur placeholder painted behind the image (skip for transparent logos). */
  blur?: boolean;
};

/**
 * AVIF with WebP fallback, sized from the build-time manifest.
 * Server component: no client JS, no layout shift (intrinsic width/height set).
 */
export function Picture({ name, alt, sizes, className, imgClassName, priority, blur = true }: PictureProps) {
  const meta = manifest[name];
  const common = {
    alt,
    sizes,
    width: meta.width,
    height: meta.height,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    fetchPriority: priority ? ("high" as const) : undefined,
    decoding: "async" as const,
  };
  const avif = getImageProps({ ...common, src: name, loader: ({ width }) => mediaUrl(name, width, "avif") });
  const webp = getImageProps({ ...common, src: name, loader: ({ width }) => mediaUrl(name, width, "webp") });

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={avif.props.srcSet} sizes={sizes} />
      <img
        {...webp.props}
        alt={alt}
        className={cn("h-auto w-full", imgClassName)}
        style={blur ? { backgroundImage: `url(${meta.blur})`, backgroundSize: "cover" } : undefined}
      />
    </picture>
  );
}
