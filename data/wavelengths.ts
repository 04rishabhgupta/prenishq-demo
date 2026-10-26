// Semantic wavelength palette (DECISIONS D-19). NIR is shown in false colour.
export const PALETTE = {
  405: { color: "#8B5CF6", text: "#A78BFA", label: "Violet" },
  520: { color: "#22FF88", text: "#22FF88", label: "Green" },
  633: { color: "#FF2A3D", text: "#FF2A3D", label: "Red" },
  785: { color: "#FFB020", text: "#FFB020", label: "NIR (false colour)" },
  980: { color: "#B3122B", text: "#F4F7FB", label: "NIR (false colour)" },
} as const;

export type PaletteNm = keyof typeof PALETTE;
export const PRESETS = [405, 520, 633, 785, 980] as const satisfies readonly PaletteNm[];

export const SPECTRUM = { min: 350, max: 1650 } as const;

// Interpolation anchors: physical hues in the visible, palette anchors in the NIR.
const ANCHORS: [number, string][] = [
  [350, "#5B21B6"],
  [405, "#8B5CF6"],
  [455, "#3D6BFF"],
  [490, "#00B4F0"],
  [520, "#22FF88"],
  [570, "#D9F23A"],
  [600, "#FF8A1F"],
  [633, "#FF2A3D"],
  [700, "#E0222F"],
  [785, "#FFB020"],
  [980, "#B3122B"],
  [1650, "#5C0A18"],
];

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

export function nmToColor(nm: number): string {
  if (nm <= ANCHORS[0][0]) return ANCHORS[0][1];
  for (let i = 1; i < ANCHORS.length; i++) {
    const [n1, c1] = ANCHORS[i];
    if (nm <= n1) {
      const [n0, c0] = ANCHORS[i - 1];
      const t = (nm - n0) / (n1 - n0);
      const a = hex(c0);
      const b = hex(c1);
      return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * t)).join(" ")})`;
    }
  }
  return ANCHORS[ANCHORS.length - 1][1];
}

/** Gradient stops across the full spectrum bar, for SVG/CSS. */
export function spectrumStops(steps = 24) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const nm = SPECTRUM.min + ((SPECTRUM.max - SPECTRUM.min) * i) / steps;
    return { offset: i / steps, color: nmToColor(nm) };
  });
}

// Reference atomic/ionic transitions (textbook values) for the species named in the catalogue.
export const ATOMIC_LINES = [
  { nm: 369.5, label: "Yb⁺", sup: true, note: "Yb⁺ cooling (²S½–²P½)" },
  { nm: 396.8, label: "Ca⁺", sup: true, note: "Ca⁺ cooling (S½–P½)" },
  { nm: 460.9, label: "Sr", note: "Sr blue MOT (¹S₀–¹P₁)" },
  { nm: 766.7, label: "K", note: "K D2 line" },
  { nm: 780.2, label: "Rb", note: "Rb D2 line" },
  { nm: 852.3, label: "Cs", note: "Cs D2 line" },
] as const;
