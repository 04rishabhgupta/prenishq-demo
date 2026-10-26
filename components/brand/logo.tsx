import logo from "@/data/logo.json";
import { cn } from "@/lib/cn";

const CYAN = "#1EB1ED"; // sampled from the client's logo PNG
const MAGENTA = "#FC1891";

/** Defines the logo once per page (in the header); everything else references it with <use>. */
export function LogoSymbol() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <symbol id="prenishq-logo" viewBox="8 14 2342 392">
          <g fill={CYAN}>
            {logo.circles.map(([cx, cy, r], i) => (
              <circle key={i} cx={Math.round(cx)} cy={Math.round(cy)} r={r} />
            ))}
            <path d={logo.word} />
          </g>
          <path fill={MAGENTA} d={logo.dot} />
        </symbol>
      </defs>
    </svg>
  );
}

export function Logo({ className, title = "PrenishQ" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="8 14 2342 392" className={cn("h-7 w-auto", className)} role="img" aria-label={title}>
      <use href="#prenishq-logo" />
    </svg>
  );
}

/** Dot-matrix mark only (5×5 grid from the logo), for loaders and the favicon. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 330 330" className={className} aria-hidden="true">
      <g fill={CYAN}>
        {logo.grid.flatMap((row, r) =>
          [...row].map((ch, c) => (
            <circle
              key={`${r}-${c}`}
              cx={33 + c * 66}
              cy={33 + r * 66}
              r={logo.radii[ch as keyof typeof logo.radii]}
            />
          )),
        )}
      </g>
    </svg>
  );
}
