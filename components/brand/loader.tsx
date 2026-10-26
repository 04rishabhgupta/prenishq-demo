// Same pattern as data/logo.json `grid`, inlined so client bundles don't pull in the wordmark paths.
const GRID = ["SMLMS", "MSMSM", "LMSML", "MSMSM", "SMLMS"];
const SCALE = { S: 0.5, M: 0.78, L: 1 } as const;
const logo = { grid: GRID };

/** 5×5 dot-matrix loader using the logo's dot sizes; pulse ripples out from the centre. */
export function DotMatrixLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3">
      <div className="dm-loader anim-loop" aria-hidden="true">
        {logo.grid.flatMap((row, r) =>
          [...row].map((ch, c) => (
            <i
              key={`${r}${c}`}
              style={{
                ["--s" as string]: SCALE[ch as keyof typeof SCALE],
                ["--d" as string]: Math.abs(r - 2) + Math.abs(c - 2),
              }}
            />
          )),
        )}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
