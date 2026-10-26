import { ogImage, OG_SIZE } from "@/lib/og";

export const dynamic = "force-static";
export const alt = "PrenishQ: precision diode lasers for the quantum era";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Diode lasers · ECDLs · Tapered amplifiers", title: "Precision diode lasers for the quantum era." });
}
