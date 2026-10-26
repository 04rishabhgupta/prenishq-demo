// Story scene diagrams, rendered at build time to static SVG files (app/story/[scene]/route.ts)
// so they stay out of the HTML and RSC payload. Schematic, not to scale.
// Self-contained: inline text attributes, embedded keyframes (transform/opacity only).
import type { ReactNode } from "react";

const SVG_CSS = `
.packet{animation:packet-run 1.6s cubic-bezier(.45,0,.6,1) infinite}
@keyframes packet-run{from{transform:translateX(-36px);opacity:0}15%{opacity:1}85%{opacity:1}to{transform:translateX(var(--len));opacity:0}}
.lock-dot{transform-box:fill-box;transform-origin:center;animation:lock-pulse 1.8s ease-in-out infinite}
@keyframes lock-pulse{50%{transform:scale(1.6);opacity:.5}}
.cloud{transform-box:fill-box;transform-origin:center;animation:cloud-breathe 3.2s ease-in-out infinite}
@keyframes cloud-breathe{50%{transform:scale(.82);opacity:.85}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={VB} width="520" height="360">
      <style>{SVG_CSS}</style>
      {children}
    </svg>
  );
}


const VB = "0 0 520 360";
const DIM = "rgb(255 255 255 / 0.22)";
const TXT = { fill: "#9AA7B8", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 11 };

function Packet({ x, y, angle = 0, length, dur = 1.6, delay = 0 }: { x: number; y: number; angle?: number; length: number; dur?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <g className="packet" style={{ ["--len" as string]: `${length}px`, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
        <rect x="0" y="-1.5" width="30" height="3" rx="1.5" fill="var(--accent)" opacity="0.55" />
        <rect x="22" y="-2" width="12" height="4" rx="2" fill="#fff" />
      </g>
    </g>
  );
}

/** Soft glow from stacked circles (no gradient ids, so scenes can be cloned safely). */
function Glow({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g className="cloud">
      {[1, 0.7, 0.45, 0.22].map((k, i) => (
        <circle key={k} cx={cx} cy={cy} r={r * k} fill={i === 3 ? "#fff" : "var(--accent)"} opacity={[0.12, 0.2, 0.35, 0.9][i]} />
      ))}
    </g>
  );
}

function SceneEmit() {
  return (
    <Svg>
      <rect x="70" y="210" width="150" height="40" rx="4" fill="#161c28" stroke={DIM} />
      <rect x="120" y="186" width="70" height="24" rx="2" fill="#222a3a" stroke="rgb(255 255 255 / 0.35)" />
      <rect x="120" y="196" width="70" height="3" fill="var(--accent)" />
      <path d="M190 197 L470 120 L470 276 Z" fill="var(--accent)" opacity="0.13" />
      <line x1="190" y1="197" x2="470" y2="197" stroke="var(--accent)" strokeWidth="2" />
      <Packet x={190} y={197} length={250} />
      <Packet x={190} y={197} length={250} delay={0.8} />
      <text x="155" y="276" textAnchor="middle" {...TXT}>diode chip · heatsink</text>
      <text x="400" y="104" textAnchor="middle" {...TXT}>coherent output</text>
    </Svg>
  );
}

function SceneNarrow() {
  return (
    <Svg>
      <rect x="40" y="168" width="60" height="24" rx="2" fill="#222a3a" stroke="rgb(255 255 255 / 0.35)" />
      <ellipse cx="150" cy="180" rx="6" ry="26" fill="none" stroke="rgb(255 255 255 / 0.5)" />
      <g transform="translate(300 180) rotate(-35)">
        <rect x="-8" y="-48" width="16" height="96" fill="#1c2333" stroke={DIM} />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="-8" x2="8" y1={-44 + i * 8} y2={-44 + i * 8} stroke="rgb(255 255 255 / 0.25)" />
        ))}
      </g>
      <line x1="100" y1="180" x2="300" y2="180" stroke="var(--accent)" strokeWidth="2" />
      <line x1="300" y1="180" x2="470" y2="70" stroke="var(--accent)" strokeWidth="2" />
      <path d="M300 180 C 230 168, 170 172, 100 176" stroke="#fff" strokeOpacity="0.45" strokeDasharray="4 5" fill="none" />
      <Packet x={100} y={180} length={170} />
      <Packet x={300} y={180} angle={-33} length={170} delay={0.6} />
      <text x="300" y="262" textAnchor="middle" {...TXT}>external cavity · feedback</text>
      <text x="70" y="216" textAnchor="middle" {...TXT}>diode</text>
      {/* spectrum inset: broad → narrow */}
      <g transform="translate(360 250)">
        <path d="M0 60 C 30 60 40 20 60 20 C 80 20 90 60 120 60" fill="none" stroke={DIM} />
        <path d="M0 60 L 57 60 L 60 2 L 63 60 L 120 60" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
      </g>
    </Svg>
  );
}

function SceneLock() {
  return (
    <Svg>
      <rect x="150" y="70" width="220" height="56" rx="28" fill="var(--accent)" fillOpacity="0.08" stroke="rgb(255 255 255 / 0.35)" />
      <text x="260" y="58" textAnchor="middle" {...TXT}>Rb / Cs vapour cell</text>
      <line x1="60" y1="92" x2="460" y2="92" stroke="var(--accent)" strokeWidth="2" />
      <line x1="460" y1="104" x2="60" y2="104" stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="1.5" />
      <Packet x={60} y={92} length={380} dur={2} />
      <Packet x={460} y={104} angle={180} length={380} dur={2} delay={1} />
      {/* SAS trace */}
      <g transform="translate(70 170)">
        <line x1="0" y1="140" x2="380" y2="140" stroke={DIM} />
        <path d="M0 20 C 90 20 110 24 140 60 C 152 76 158 100 166 116 L 172 82 L 178 112 L 186 94 L 192 120 C 202 100 214 70 236 46 C 260 22 300 20 380 20" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <circle cx="178" cy="112" r="5" fill="#fff" className="lock-dot" />
        <text x="190" y="160" {...TXT}>locked</text>
      </g>
    </Svg>
  );
}

function SceneAmplify() {
  return (
    <Svg>
      <path d="M170 168 L 350 120 L 350 240 L 170 192 Z" fill="var(--accent)" fillOpacity="0.12" stroke="rgb(255 255 255 / 0.35)" />
      <line x1="40" y1="180" x2="170" y2="180" stroke="var(--accent)" strokeWidth="1.5" />
      <path d="M350 140 L 480 120 L 480 240 L 350 220 Z" fill="var(--accent)" fillOpacity="0.35" />
      <line x1="350" y1="180" x2="480" y2="180" stroke="#fff" strokeWidth="2.5" />
      <Packet x={40} y={180} length={130} dur={1.2} />
      <Packet x={350} y={180} length={130} dur={1.2} delay={0.6} />
      <text x="105" y="160" textAnchor="middle" {...TXT}>seed · mW</text>
      <text x="260" y="270" textAnchor="middle" {...TXT}>tapered gain section</text>
      <text x="430" y="104" textAnchor="middle" {...TXT}>&gt; 2 W out</text>
    </Svg>
  );
}

function SceneCool() {
  const beams = [0, 60, 120];
  return (
    <Svg>
      {beams.map((a) => (
        <g key={a} transform={`translate(260 180) rotate(${a})`}>
          <rect x="-230" y="-9" width="460" height="18" fill="var(--accent)" fillOpacity="0.09" />
          <line x1="-230" x2="230" y1="0" y2="0" stroke="var(--accent)" strokeOpacity="0.6" />
        </g>
      ))}
      <Glow cx={260} cy={180} r={52} />
      <text x="260" y="330" textAnchor="middle" {...TXT}>magneto-optical trap · Cs at 15 µK</text>
    </Svg>
  );
}

export const SCENES = {
  emit: { Scene: SceneEmit, alt: "Schematic: a laser diode chip on a heatsink emitting a diverging beam." },
  narrow: { Scene: SceneNarrow, alt: "Schematic: external cavity diode laser, with feedback selecting a single frequency." },
  lock: { Scene: SceneLock, alt: "Schematic: vapour cell with pump and probe beams, and a saturated absorption spectrum with a lock point." },
  amplify: { Scene: SceneAmplify, alt: "Schematic: tapered amplifier; a narrow seed beam enters and a powerful wide beam exits." },
  cool: { Scene: SceneCool, alt: "Schematic: six intersecting laser beams cooling a cloud of atoms at the centre." },
} as const;

export type SceneKey = keyof typeof SCENES;
