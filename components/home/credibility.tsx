import { LogoImg } from "@/components/media/logo-img";
import { funders } from "@/data/site";

/** Pure-CSS marquee; the duplicate track is hidden from assistive tech. Pauses on hover/focus. */
function Track({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={hidden || undefined}>
      {funders.map((f) => (
        <li key={f.logo} className="logo-plate grid h-20 w-36 shrink-0 place-items-center rounded-md bg-white/[0.92] px-4 py-3">
          <LogoImg name={f.logo} alt={hidden ? "" : f.name} height={48} className="h-12 w-auto max-w-[112px] object-contain" />
        </li>
      ))}
    </ul>
  );
}

export function Credibility() {
  return (
    <section aria-labelledby="cred-title" className="border-b border-line bg-surface/50 py-10">
      <div className="container-x mb-7 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <h2 id="cred-title" className="text-sm text-fg">
          An IIT Delhi spin-off <span className="text-fg-2">·</span> Supported by the National Quantum Mission
        </h2>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-fg-2">Incubated and funded by</p>
      </div>
      <div className="marquee overflow-hidden" tabIndex={0} aria-label="Incubators and funders">
        <div className="marquee-track">
          <Track />
          <Track hidden />
        </div>
      </div>
    </section>
  );
}
