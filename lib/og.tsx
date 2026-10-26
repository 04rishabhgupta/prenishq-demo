import { ImageResponse } from "next/og";
import logo from "@/data/logo.json";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared Open Graph card, rendered at build time (static export). */
export function ogImage({ eyebrow, title, specs, accent = "#00B4F0" }: { eyebrow: string; title: string; specs?: string[]; accent?: string }) {
  const circles = logo.circles.map(([cx, cy, r]) => `<circle cx="${Math.round(cx)}" cy="${Math.round(cy)}" r="${r}"/>`).join("");
  const wordmark = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="8 14 2342 392"><g fill="#1EB1ED">${circles}<path d="${logo.word}"/></g><path fill="#FC1891" d="${logo.dot}"/></svg>`,
  )}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#050608", color: "#F4F7FB", padding: 72, position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, height: 2, background: `linear-gradient(90deg, transparent, ${accent}, #ffffff, ${accent}, transparent)` }} />
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser */}
        <img src={wordmark} width={340} height={57} alt="PrenishQ" />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: accent }}>{eyebrow}</span>
          <span style={{ fontSize: 68, lineHeight: 1.05, maxWidth: 980 }}>{title}</span>
        </div>
        <div style={{ display: "flex", gap: 40, fontSize: 26, color: "#9AA7B8" }}>
          {(specs ?? ["IIT Delhi spin-off", "Supported by the National Quantum Mission"]).map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
