import manifest from "@/data/media.generated.json";

export type MediaName = keyof typeof manifest;
export type MediaFormat = "avif" | "webp";

/** Smallest generated width that covers the request, else the largest available. */
export function pickWidth(name: MediaName, width: number) {
  const widths = manifest[name].widths;
  return widths.find((w) => w >= width) ?? widths[widths.length - 1];
}

export function mediaUrl(name: MediaName, width: number, format: MediaFormat = "webp") {
  return `/media/${name}-${pickWidth(name, width)}.${format}`;
}

// Global loader for any plain <Image src="opal-fibre" />: WebP variant.
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (src in manifest) return mediaUrl(src as MediaName, width);
  return src;
}
