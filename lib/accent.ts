import type { PaletteNm } from "@/data/wavelengths";

/** CSS custom properties for a wavelength-tinted component (D-19: 980 nm never used as text). */
export function accentVars(nm: PaletteNm) {
  return {
    "--accent": `var(--wl-${nm})`,
    "--accent-text": nm === 405 ? "var(--wl-405-text)" : nm === 980 ? "var(--fg)" : `var(--wl-${nm})`,
  } as React.CSSProperties;
}
