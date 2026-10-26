
/**
 * Aceternity "Background Beams" (falling-beam variant), CSS-only: each beam is a 1px element
 * translating down (compositor-only). Deterministic layout so SSR and client agree.
 * Paused off-screen via [data-loop].
 */
export function BeamRain({ count = 14, fall = 600, className }: { count?: number; fall?: number; className?: string }) {
  // Only the index is inline; position, length, timing and colour derive from it in CSS
  // (.beam-rain i in globals.css), keeping the HTML and RSC payload small.
  return (
    <div aria-hidden data-loop className={`beam-rain ${className ?? ""}`} style={{ ["--n" as string]: count, ["--fall" as string]: `${fall}px` }}>
      {Array.from({ length: count }, (_, i) => (
        <i key={i} style={{ ["--i" as string]: i }} />
      ))}
    </div>
  );
}
