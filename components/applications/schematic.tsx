import type { Schematic as Kind } from "@/data/applications";

// Lightweight explanatory schematics (replace the live site's AI-generated images).
// Colours come from the card's --accent; these are diagrams, not data.
const S = { stroke: "var(--accent)", fill: "none", strokeWidth: 1.5 } as const;
const DIM = "rgb(255 255 255 / 0.18)";

function Atoms() {
  const cols = [70, 110, 150, 190, 230, 270, 310];
  const rows = [60, 100, 140];
  return (
    <>
      {cols.map((x) => (
        <line key={x} x1={x} y1="10" x2={x} y2="190" stroke={DIM} strokeWidth="1" strokeDasharray="2 6" />
      ))}
      {rows.flatMap((y) => cols.map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="var(--accent)" opacity={(x + y) % 3 ? 0.9 : 0.35} />))}
      <circle cx="190" cy="100" r="34" {...S} strokeDasharray="4 4" opacity="0.7" />
      <text x="190" y="178" textAnchor="middle" className="fill-fg-2 font-mono text-[10px]">
        tweezer array · Rydberg blockade
      </text>
    </>
  );
}

function Ions() {
  const xs = [110, 140, 170, 200, 230, 260];
  return (
    <>
      <rect x="60" y="56" width="260" height="10" rx="2" fill={DIM} />
      <rect x="60" y="134" width="260" height="10" rx="2" fill={DIM} />
      <line x1="60" y1="100" x2="320" y2="100" stroke={DIM} strokeDasharray="3 5" />
      {xs.map((x) => (
        <circle key={x} cx={x} cy="100" r="6" fill="var(--accent)" />
      ))}
      <line x1="200" y1="10" x2="200" y2="88" stroke="var(--accent)" strokeWidth="2.5" opacity="0.85" />
      <circle cx="200" cy="100" r="13" {...S} />
      <text x="190" y="178" textAnchor="middle" className="fill-fg-2 font-mono text-[10px]">
        ion chain · addressing beam
      </text>
    </>
  );
}

function Nv() {
  const pts: [number, number][] = [
    [130, 60], [190, 40], [250, 60], [130, 120], [190, 100], [250, 120], [190, 160],
  ];
  return (
    <>
      {[[0, 1], [1, 2], [0, 4], [2, 4], [3, 4], [4, 5], [3, 6], [5, 6], [0, 3], [2, 5]].map(([a, b]) => (
        <line key={`${a}${b}`} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke={DIM} />
      ))}
      {pts.map(([x, y], i) =>
        i === 4 ? null : <circle key={i} cx={x} cy={y} r="5" fill={i === 1 ? "var(--accent)" : "rgb(255 255 255 / 0.5)"} />,
      )}
      <circle cx="190" cy="100" r="8" fill="none" stroke="#FF2A3D" strokeDasharray="2 3" />
      <text x="198" y="36" className="fill-fg font-mono text-[11px]">N</text>
      <text x="200" y="97" className="fill-fg font-mono text-[11px]">V</text>
      <line x1="20" y1="150" x2="176" y2="106" stroke="var(--accent)" strokeWidth="2.5" />
      <circle cx="190" cy="100" r="30" fill="url(#nv-glow)" />
      <defs>
        <radialGradient id="nv-glow">
          <stop offset="0" stopColor="#FF2A3D" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FF2A3D" stopOpacity="0" />
        </radialGradient>
      </defs>
    </>
  );
}

function Clock() {
  return (
    <>
      <circle cx="120" cy="100" r="58" stroke={DIM} fill="none" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={120 + Math.cos(a) * 50} y1={100 + Math.sin(a) * 50} x2={120 + Math.cos(a) * 58} y2={100 + Math.sin(a) * 58} stroke="rgb(255 255 255 / 0.4)" />;
      })}
      <line x1="120" y1="100" x2="120" y2="58" stroke="var(--accent)" strokeWidth="2" />
      <line x1="120" y1="100" x2="150" y2="112" stroke="rgb(255 255 255 / 0.6)" strokeWidth="1.5" />
      <path d="M200 100 q 10 -40 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0" {...S} />
      <text x="260" y="160" textAnchor="middle" className="fill-fg-2 font-mono text-[10px]">
        laser locked to atomic line
      </text>
    </>
  );
}

function Spectroscopy() {
  return (
    <>
      <line x1="40" y1="150" x2="340" y2="150" stroke={DIM} />
      <line x1="40" y1="30" x2="40" y2="150" stroke={DIM} />
      {/* Stylised Doppler-broadened dip with sub-Doppler features (schematic, not data). */}
      <path
        d="M40 50 C 120 50 140 52 160 80 C 170 96 172 120 180 132 L 186 104 L 192 130 L 198 112 L 204 134 C 214 118 220 92 232 76 C 250 54 290 50 340 50"
        {...S}
      />
      <text x="190" y="176" textAnchor="middle" className="fill-fg-2 font-mono text-[10px]">
        saturated absorption · schematic
      </text>
    </>
  );
}

function Memory() {
  return (
    <>
      <path d="M30 100 q 6 -22 12 0 t 12 0 t 12 0 t 12 0 t 12 0" {...S} />
      <line x1="96" y1="100" x2="140" y2="100" stroke="var(--accent)" strokeDasharray="3 4" />
      {Array.from({ length: 34 }, (_, i) => {
        const a = i * 2.4;
        const r = 6 + (i % 7) * 5;
        return <circle key={i} cx={190 + Math.cos(a) * r} cy={100 + Math.sin(a) * r * 0.7} r="3" fill="rgb(255 255 255 / 0.55)" />;
      })}
      <line x1="240" y1="100" x2="284" y2="100" stroke="var(--accent)" strokeDasharray="3 4" />
      <path d="M290 100 q 6 -22 12 0 t 12 0 t 12 0 t 12 0" {...S} />
      <line x1="190" y1="20" x2="190" y2="58" stroke="rgb(255 255 255 / 0.45)" strokeWidth="2" />
      <text x="190" y="176" textAnchor="middle" className="fill-fg-2 font-mono text-[10px]">
        store → release on demand
      </text>
    </>
  );
}

const MAP: Record<Kind, () => React.ReactElement> = {
  atoms: Atoms,
  ions: Ions,
  nv: Nv,
  clock: Clock,
  spectroscopy: Spectroscopy,
  memory: Memory,
};

export function Schematic({ kind, label }: { kind: Kind; label: string }) {
  const Body = MAP[kind];
  return (
    <svg viewBox="0 0 380 200" className="h-full w-full" role="img" aria-label={`Schematic: ${label}`}>
      <Body />
    </svg>
  );
}
