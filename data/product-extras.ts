// Editorial content around each product (content-placement round, see PLAN.md §10).
// Every claim here restates a catalogue fact from data/products.ts or textbook physics.
// Arrays marked TODO(client) are empty on purpose: their sections render only once filled.
import type { ProductSlug } from "@/data/products";

export type Benefit = { title: string; body: string };
export type Download = { label: string; href: string; kind: "pdf" | "cad" | "doc"; size?: string };
export type Paper = { title: string; authors: string; venue: string; year: number; url?: string };
export type Model = { code: string; description: string };
export type QA = { q: string; a: string };

export type ProductExtras = {
  /** "Why it matters" block, shown before the specifications (Toptica-style). */
  benefits: Benefit[];
  /** What a buyer should know about wavelength availability. */
  availability: string;
  /** Systems pairing with other PrenishQ products, with the reason. */
  worksWith: { slug: ProductSlug; why: string }[];
  faq: QA[];
  downloads: Download[];
  /** Orderable variants with product codes. TODO(client). */
  models: Model[];
  /** Papers that used this product. TODO(client). */
  publications: Paper[];
};

const CATALOGUE: Download = { label: "PrenishQ product catalogue", href: "/datasheets/prenishq-catalogue.pdf", kind: "pdf", size: "1 MB" };

/** Spec label → group (Vescent-style grouped tables). Unlisted labels fall into "General". */
export const SPEC_GROUPS: Record<string, string> = {
  "Available wavelengths": "Optical",
  "Wavelength range": "Optical",
  "Output power": "Optical",
  "Saturated output power": "Optical",
  Linewidth: "Optical",
  Polarisation: "Optical",
  "Polarisation stability": "Stability",
  "Power stability": "Stability",
  "Frequency stability": "Stability",
  "Noise / stability": "Stability",
  "Tunability (coarse)": "Tuning",
  "Mode-hop-free scan": "Tuning",
  "Atomic and ionic species": "Use",
  Integrated: "Integration",
  Package: "Integration",
};
export const SPEC_GROUP_ORDER = ["Optical", "Tuning", "Stability", "Integration", "Use", "General"];

const OTHER_WL_FAQ: QA = {
  q: "Can I get a wavelength that isn't listed?",
  a: "Tell us your target wavelength and power. Diode availability varies by wavelength, so our team will confirm what is possible and the expected lead time.",
};

export const productExtras: Record<ProductSlug, ProductExtras> = {
  opal: {
    benefits: [
      { title: "Five wavelengths, one platform", body: "405, 520, 633, 785 and 980 nm in the same compact, fibre-coupled package." },
      { title: "Stable for long measurements", body: "Under 1 % power drift over more than 10 hours, with strong polarisation stability." },
      { title: "Spectrally clean", body: "Linewidth below 0.1 pm, suited to Raman spectroscopy and fluorescence excitation." },
      { title: "Proven in the lab", body: "Used for cancer-cell imaging at 405 nm (BITS Pilani) and NV-centre fluorescence at 520 nm." },
    ],
    availability: "Standard wavelengths are 405, 520, 633, 785 and 980 nm, with ±1 nm coarse tunability.",
    worksWith: [
      { slug: "dbr", why: "When you need a single-frequency source with sub-500 kHz linewidth at 633 nm or in the near-infrared." },
      { slug: "agate", why: "When your experiment needs narrow-linewidth, scannable light for atomic transitions." },
    ],
    faq: [
      OTHER_WL_FAQ,
      { q: "Which OPAL wavelength suits Raman spectroscopy?", a: "785 nm is a common choice because it reduces fluorescence background in many samples; 405, 520 and 633 nm are also available. Ask us about your sample and detector." },
      { q: "Is OPAL fibre-coupled?", a: "Yes. The catalogue output power of up to 100 mW is specified fibre-coupled." },
    ],
    downloads: [CATALOGUE],
    models: [],
    publications: [],
  },
  agate: {
    benefits: [
      { title: "Narrow enough for atoms", body: "Linewidth below 100 kHz, measured at 90 ± 3 kHz FWHM by self-heterodyne at IIT Delhi." },
      { title: "Scan across a transition", body: "5 GHz mode-hop-free scan for spectroscopy and locking." },
      { title: "From the UV to telecom", body: "369–1600 nm, covering Rb, Cs, K, Sr, Yb⁺ and Ca⁺ experiments." },
      { title: "Demonstrated cooling", body: "Caesium atoms laser-cooled to 15 µK in a magneto-optical trap at IIT Delhi." },
    ],
    availability: "Available within 369–1600 nm. Output power of 20–50 mW depends on the diode at your wavelength.",
    worksWith: [
      { slug: "ta", why: "Amplify AGATE to more than 2 W for large cooling beams, preserving its polarisation." },
      { slug: "dbr-pro", why: "Use DBR PRO as a spectroscopy-locked Rb or Cs frequency reference alongside AGATE." },
    ],
    faq: [
      OTHER_WL_FAQ,
      { q: "Which atomic species is AGATE used for?", a: "The catalogue lists Rb, Cs, K, Sr, Yb⁺ and Ca⁺ experiments. Tell us the transition and we will confirm diode availability." },
      { q: "What does 5 GHz mode-hop-free mean?", a: "The laser can be tuned continuously over 5 GHz without jumping between cavity modes, enough to scan across hyperfine structure." },
    ],
    downloads: [CATALOGUE],
    models: [],
    publications: [],
  },
  dbr: {
    benefits: [
      { title: "Single-frequency, no external cavity", body: "A Bragg grating on the chip gives sub-500 kHz linewidth in a compact, robust package." },
      { title: "A modern HeNe replacement", body: "Available at 633 nm, plus 730–1090 nm in the near-infrared." },
      { title: "Up to 100 mW, fibre-coupled", body: "High frequency stability for spectroscopy, interferometry and gas detection." },
    ],
    availability: "Available at 633 nm and across 730–1090 nm.",
    worksWith: [
      { slug: "dbr-pro", why: "Add integrated spectroscopy and lock-in detection to hold the laser on the Rb or Cs D2 line." },
      { slug: "ta", why: "Boost the output to watt level for non-linear spectroscopy or frequency conversion." },
    ],
    faq: [
      OTHER_WL_FAQ,
      { q: "How does a DBR laser differ from an ECDL?", a: "A DBR laser selects its frequency with a grating built into the chip, so it is compact and robust. An ECDL such as AGATE uses an external cavity, which gives narrower linewidth and wider mode-hop-free tuning." },
    ],
    downloads: [CATALOGUE],
    models: [],
    publications: [],
  },
  "dbr-pro": {
    benefits: [
      { title: "Locked to atoms", body: "Integrated saturated-absorption spectroscopy and lock-in detection for very high frequency stability." },
      { title: "Rb and Cs ready", body: "780 nm and 852 nm, the D2 lines used in most cold-atom and vapour-cell experiments." },
      { title: "Verified spectroscopy", body: "Saturated absorption spectrum of ¹³³Cs recorded at IIT Delhi, resolving crossover resonances." },
    ],
    availability: "Available at 780 nm (Rb) and 852 nm (Cs).",
    worksWith: [
      { slug: "agate", why: "Reference AGATE cooling and repump lasers against DBR PRO's atomic lock." },
      { slug: "ta", why: "Amplify the locked light to more than 2 W for cooling beams." },
    ],
    faq: [
      { q: "What is integrated in DBR PRO?", a: "A DBR laser with saturated-absorption spectroscopy and lock-in detection, so the laser can be held on an atomic line without a separate spectroscopy setup." },
      { q: "Which lines can it lock to?", a: "The catalogue lists 780 nm and 852 nm, the rubidium and caesium D2 lines." },
    ],
    downloads: [CATALOGUE],
    models: [],
    publications: [],
  },
  ta: {
    benefits: [
      { title: "Watt-class output", body: "More than 2 W saturated, fibre-coupled, from a milliwatt seed." },
      { title: "Keeps your seed's properties", body: "Maintains input polarisation with low noise and high stability." },
      { title: "Broad coverage", body: "632–1590 nm, matching most diode seeds including AGATE and DBR." },
    ],
    availability: "Available across 632–1590 nm; match it to your seed laser's wavelength.",
    worksWith: [
      { slug: "agate", why: "Seed with AGATE for narrow-linewidth light at watt level." },
      { slug: "dbr-pro", why: "Seed with a spectroscopy-locked DBR PRO for stable, high-power cooling light." },
    ],
    faq: [
      { q: "Do I need a seed laser?", a: "Yes. A tapered amplifier amplifies an existing laser beam. AGATE, DBR and DBR PRO are natural seeds." },
      { q: "Does the TA change the linewidth?", a: "A tapered amplifier is designed to preserve the seed's spectral properties and maintains its input polarisation." },
    ],
    downloads: [CATALOGUE],
    models: [],
    publications: [],
  },
};

/** Suggested systems on /products (Vescent "Solutions" / Santec "System integration"). */
export const systems = [
  {
    title: "Rb / Cs laser-cooling chain",
    body: "Narrow-linewidth cooling light, an atomic frequency reference and the power for large MOT beams.",
    chain: [
      { slug: "agate" as ProductSlug, role: "Cooling and repump" },
      { slug: "dbr-pro" as ProductSlug, role: "Atomic reference" },
      { slug: "ta" as ProductSlug, role: "Power" },
    ],
    application: "neutral-atoms",
  },
  {
    title: "NV-centre sensing",
    body: "Green excitation for optically detected magnetic resonance in diamond.",
    chain: [{ slug: "opal" as ProductSlug, role: "520 nm excitation" }],
    application: "nv-centres",
  },
  {
    title: "Spectroscopy and interferometry",
    body: "A single-frequency source, optionally locked to an atomic line, with watt-level power on demand.",
    chain: [
      { slug: "dbr" as ProductSlug, role: "Single-frequency source" },
      { slug: "dbr-pro" as ProductSlug, role: "Locked reference" },
      { slug: "ta" as ProductSlug, role: "Non-linear power" },
    ],
    application: "laser-spectroscopy",
  },
];
