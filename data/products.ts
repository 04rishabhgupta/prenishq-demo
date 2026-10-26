import type { MediaName } from "@/lib/image-loader";
import type { PaletteNm } from "@/data/wavelengths";

export type ProductSlug = "opal" | "agate" | "dbr" | "dbr-pro" | "ta";
export type ProductType = "compact" | "ecdl" | "dbr" | "amplifier";

export type Spec = {
  label: string;
  value: string;
  /** Rendered in mono next to the value. */
  unit?: string;
  note?: string;
};

/** Specs seen only on the live site, not in the catalogue. Never rendered until confirmed. */
export type PendingSpec = Spec & { source: "live-site"; todo: string };

export type Figure = {
  image: MediaName;
  alt: string;
  caption: string;
  credit?: string;
};

export type Wavelengths =
  | { kind: "discrete"; nm: number[] }
  | { kind: "ranges"; ranges: [number, number][]; discrete?: number[] };

export type Product = {
  slug: ProductSlug;
  name: string;
  fullName: string;
  type: ProductType;
  typeLabel: string;
  tagline: string;
  summary: string;
  accent: PaletteNm;
  wavelengths: Wavelengths;
  wavelengthLabel: string;
  headline: [Spec, Spec, Spec];
  specs: Spec[];
  /** Application tags exactly as listed in the catalogue. */
  applications: string[];
  figures: Figure[];
  image: MediaName | null; // null → placeholder render (TODO(client))
  imageAlt: string;
  related: ProductSlug[];
  pending?: PendingSpec[];
};

// Source of truth: reference/Prenishq_Product_Catalog.pdf (pp. 3–6). Do not add specs that are not in it.
export const products: Product[] = [
  {
    slug: "opal",
    name: "OPAL",
    fullName: "OPAL Compact Diode Laser",
    type: "compact",
    typeLabel: "Compact diode laser",
    tagline: "Compact, fibre-coupled diode laser at five visible and NIR wavelengths.",
    summary:
      "A compact diode laser with sub-picometre linewidth and long-term power stability, for biomedical imaging, Raman spectroscopy and quantum technologies.",
    accent: 405,
    wavelengths: { kind: "discrete", nm: [405, 520, 633, 785, 980] },
    wavelengthLabel: "405 · 520 · 633 · 785 · 980 nm",
    headline: [
      { label: "Linewidth", value: "< 0.1", unit: "pm" },
      { label: "Output power", value: "≤ 100", unit: "mW" },
      { label: "Power stability", value: "< 1 %", unit: "/ 10+ h" },
    ],
    specs: [
      { label: "Available wavelengths", value: "405, 520, 633, 785, 980", unit: "nm" },
      { label: "Output power", value: "Up to 100", unit: "mW", note: "Fibre-coupled" },
      { label: "Linewidth", value: "< 0.1", unit: "pm" },
      { label: "Power stability", value: "< 1 % over 10+", unit: "h" },
      { label: "Tunability (coarse)", value: "± 1", unit: "nm" },
      { label: "Polarisation stability", value: "Strong" },
    ],
    applications: ["Biomedical", "Raman spectroscopy", "Quantum technologies"],
    figures: [
      {
        image: "cancer-cell-405",
        alt: "False-colour fluorescence micrograph of cancer tissue with a 200 µm scale bar.",
        caption: "Cancer cell image captured using the 405 nm OPAL laser at BITS Pilani, Hyderabad Campus.",
        credit: "Courtesy of Prof. Sudipta Maiti, BITS Pilani, Hyderabad Campus.",
      },
      {
        image: "nv-diamond-fluorescence",
        alt: "Diamond cube glowing red under green laser excitation, with a green beam entering from the left.",
        caption: "NV centre fluorescence captured using the 520 nm OPAL laser at PrenishQ.",
      },
    ],
    image: "opal-fibre",
    imageAlt: "OPAL compact diode laser on an optical table, with a blue fibre patch cable and a red output at the fibre tip.",
    related: ["dbr", "agate"],
    pending: [
      { label: "Laser safety class", value: "3B", source: "live-site", todo: "Confirm per wavelength/power" },
      { label: "Beam divergence", value: "< 1", unit: "mrad", source: "live-site", todo: "Confirm" },
      { label: "Input voltage", value: "12", unit: "V", source: "live-site", todo: "Confirm" },
      { label: "Operating temperature", value: "10–40", unit: "°C", source: "live-site", todo: "Confirm" },
      { label: "Temperature stabilisation", value: "Internal TEC", source: "live-site", todo: "Confirm" },
      { label: "Dimensions (W × D × H)", value: "120 × 70 × 100", unit: "mm", source: "live-site", todo: "Confirm" },
      { label: "Warranty", value: "1", unit: "year", source: "live-site", todo: "Confirm" },
      { label: "Linewidth (measured)", value: "0.08 ± 0.005", unit: "pm", source: "live-site", todo: "Confirm; catalogue says < 0.1 pm" },
    ],
  },
  {
    slug: "agate",
    name: "AGATE",
    fullName: "AGATE External Cavity Diode Laser (ECDL)",
    type: "ecdl",
    typeLabel: "External cavity diode laser",
    tagline: "Narrow-linewidth ECDL for laser cooling, trapping and atomic clocks.",
    summary:
      "An external cavity diode laser with sub-100 kHz linewidth and 5 GHz mode-hop-free scan, built for atomic and ionic experiments from 369 to 1600 nm.",
    accent: 520,
    wavelengths: { kind: "ranges", ranges: [[369, 1600]] },
    wavelengthLabel: "369–1600 nm",
    headline: [
      { label: "Linewidth", value: "< 100", unit: "kHz" },
      { label: "Mode-hop-free scan", value: "5", unit: "GHz" },
      { label: "Wavelength range", value: "369–1600", unit: "nm" },
    ],
    specs: [
      { label: "Wavelength range", value: "369–1600", unit: "nm" },
      { label: "Linewidth", value: "< 100", unit: "kHz" },
      { label: "Output power", value: "20–50", unit: "mW", note: "Diode dependent" },
      { label: "Mode-hop-free scan", value: "5", unit: "GHz" },
      { label: "Atomic and ionic species", value: "Rb, Cs, K, Sr, Yb⁺, Ca⁺" },
    ],
    applications: ["Quantum computing", "Quantum sensing", "Optical clock"],
    figures: [
      {
        image: "agate-linewidth-plot",
        alt: "Plot of amplitude against frequency from −200 to 200 kHz showing a single peak with FWHM 90 ± 3 kHz.",
        caption: "Ultra-narrow linewidth (FWHM 90 ± 3 kHz) measured using a self-heterodyne setup at IIT Delhi.",
      },
      {
        image: "cs-mot-fluorescence",
        alt: "False-colour fluorescence image of a cloud of caesium atoms, roughly 1 mm across.",
        caption: "Fluorescence image of a magneto-optical trap of Cs atoms, laser-cooled to 15 µK at IIT Delhi.",
      },
    ],
    image: "agate",
    imageAlt: "AGATE external cavity diode laser housing with caution labels and a green fibre connector, on an optical table.",
    related: ["ta", "dbr-pro"],
    pending: [
      { label: "Coarse tuning range", value: "up to 10", unit: "nm", source: "live-site", todo: "Not in catalogue" },
      { label: "Output options", value: "Fibre-coupled and free space", source: "live-site", todo: "Not in catalogue" },
    ],
  },
  {
    slug: "dbr",
    name: "DBR",
    fullName: "DBR Distributed Bragg Reflector Diode Laser",
    type: "dbr",
    typeLabel: "DBR diode laser",
    tagline: "Single-frequency DBR laser, a compact HeNe replacement and spectroscopy source.",
    summary:
      "A distributed Bragg reflector diode laser with sub-500 kHz linewidth and up to 100 mW fibre-coupled, at 633 nm and across 730–1090 nm.",
    accent: 633,
    wavelengths: { kind: "ranges", ranges: [[730, 1090]], discrete: [633] },
    wavelengthLabel: "633 · 730–1090 nm",
    headline: [
      { label: "Linewidth", value: "< 500", unit: "kHz" },
      { label: "Output power", value: "≤ 100", unit: "mW" },
      { label: "Wavelengths", value: "633 · 730–1090", unit: "nm" },
    ],
    specs: [
      { label: "Wavelength range", value: "633, 730–1090", unit: "nm" },
      { label: "Output power", value: "Up to 100", unit: "mW", note: "Fibre-coupled" },
      { label: "Linewidth", value: "< 500", unit: "kHz" },
      { label: "Frequency stability", value: "High", note: "Stable operation" },
      { label: "Package", value: "Compact, robust design" },
    ],
    applications: [
      "Atomic spectroscopy",
      "Gas detection",
      "Interferometry",
      "HeNe laser replacement",
      "Atomic and molecular physics",
      "Scientific research",
    ],
    figures: [],
    image: null,
    imageAlt: "DBR diode laser (product image to come).",
    related: ["dbr-pro", "opal"],
  },
  {
    slug: "dbr-pro",
    name: "DBR PRO",
    fullName: "DBR PRO: DBR Laser with Spectroscopy and Lock-in Detection",
    type: "dbr",
    typeLabel: "Frequency-stabilised DBR",
    tagline: "DBR laser with integrated saturated-absorption spectroscopy and lock-in detection.",
    summary:
      "A DBR laser with built-in spectroscopy and lock-in detection for ultra-stable frequency referencing at the Rb (780 nm) and Cs (852 nm) D2 lines.",
    accent: 785,
    wavelengths: { kind: "discrete", nm: [780, 852] },
    wavelengthLabel: "780 · 852 nm",
    headline: [
      { label: "Linewidth", value: "< 500", unit: "kHz" },
      { label: "Output power", value: "≤ 50", unit: "mW" },
      { label: "Wavelengths", value: "780 · 852", unit: "nm" },
    ],
    specs: [
      { label: "Wavelength range", value: "780, 852", unit: "nm" },
      { label: "Output power", value: "Up to 50", unit: "mW", note: "Fibre-coupled" },
      { label: "Linewidth", value: "< 500", unit: "kHz" },
      { label: "Frequency stability", value: "Very high", note: "Ultra-stable" },
      { label: "Integrated", value: "Spectroscopy and lock-in detection" },
      { label: "Package", value: "Compact, robust design" },
    ],
    applications: [
      "Atomic spectroscopy",
      "Gas detection",
      "Interferometry",
      "HeNe laser replacement",
      "Atomic and molecular physics",
      "Scientific research",
    ],
    figures: [
      {
        image: "dbrpro-cs-sas",
        alt: "Saturated absorption spectrum from 0 to 12 GHz showing the Cs F = 4 and F = 3 dips, with an inset resolving the F′ = 4/5 and 3/5 crossover and F′ = 5 peaks.",
        caption: "Saturated absorption spectrum of ¹³³Cs recorded at IIT Delhi, resolving the F = 4 and F = 3 ground-state manifolds and crossover resonances.",
      },
    ],
    image: null,
    imageAlt: "DBR PRO laser with integrated spectroscopy module (product image to come).",
    related: ["dbr", "agate"],
  },
  {
    slug: "ta",
    name: "TA",
    fullName: "TA Tapered Amplifier",
    type: "amplifier",
    typeLabel: "Tapered amplifier",
    tagline: "Watt-class tapered amplifier that preserves your seed laser's polarisation.",
    summary:
      "A tapered amplifier delivering more than 2 W saturated, fibre-coupled output from 632 to 1590 nm, with low noise and preserved input polarisation.",
    accent: 980,
    wavelengths: { kind: "ranges", ranges: [[632, 1590]] },
    wavelengthLabel: "632–1590 nm",
    headline: [
      { label: "Saturated output", value: "> 2", unit: "W" },
      { label: "Wavelength range", value: "632–1590", unit: "nm" },
      { label: "Polarisation", value: "Maintained" },
    ],
    specs: [
      { label: "Wavelength range", value: "632–1590", unit: "nm" },
      { label: "Saturated output power", value: "> 2", unit: "W", note: "Fibre-coupled" },
      { label: "Polarisation", value: "Maintains input polarisation" },
      { label: "Noise / stability", value: "Low noise, high stability" },
      { label: "Package", value: "Compact, robust design" },
    ],
    applications: [
      "Non-linear spectroscopy",
      "Frequency conversion",
      "LIDAR",
      "Holography",
      "Cold-atom experiments",
      "Quantum technologies",
    ],
    figures: [],
    image: null,
    imageAlt: "Tapered amplifier module (product image to come).",
    related: ["agate", "dbr-pro"],
  },
];

export const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<ProductSlug, Product>;

export const TYPE_LABELS: Record<ProductType, string> = {
  compact: "Compact",
  ecdl: "ECDL",
  dbr: "DBR",
  amplifier: "Amplifier",
};

/** Filter groups over the catalogue's per-product application tags. */
export const APPLICATION_GROUPS: Record<string, { label: string; tags: string[] }> = {
  quantum: {
    label: "Quantum & cold atoms",
    tags: ["Quantum technologies", "Quantum computing", "Quantum sensing", "Optical clock", "Cold-atom experiments"],
  },
  spectroscopy: {
    label: "Spectroscopy",
    tags: ["Raman spectroscopy", "Atomic spectroscopy", "Non-linear spectroscopy", "Atomic and molecular physics"],
  },
  biomedical: { label: "Biomedical", tags: ["Biomedical"] },
  metrology: { label: "Metrology & interferometry", tags: ["Interferometry", "Optical clock", "HeNe laser replacement"] },
  sensing: { label: "Sensing & industrial", tags: ["Gas detection", "LIDAR", "Holography", "Frequency conversion"] },
};

export function coversWavelength(p: Product, nm: number, tolerance = 2) {
  const w = p.wavelengths;
  const hitsDiscrete = (list?: number[]) => (list ?? []).some((d) => Math.abs(d - nm) <= tolerance);
  if (w.kind === "discrete") return hitsDiscrete(w.nm);
  return w.ranges.some(([a, b]) => nm >= a && nm <= b) || hitsDiscrete(w.discrete);
}
