"use client";

import { useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { clsx as cn } from "clsx"; // client island: no tailwind-merge
import {
  APPLICATION_GROUPS,
  TYPE_LABELS,
  coversWavelength,
  products,
  type Product,
  type ProductSlug,
  type ProductType,
} from "@/data/products";
import { Icon } from "@/components/icons";

const WAVELENGTHS = [405, 520, 633, 780, 852, 980, 1064, 1550];
const MAX_COMPARE = 3;

type Filters = { wl: number | null; type: ProductType | null; app: string | null };

function matches(p: Product, f: Filters) {
  if (f.wl !== null && !coversWavelength(p, f.wl)) return false;
  if (f.type && p.type !== f.type) return false;
  if (f.app && !p.applications.some((a) => APPLICATION_GROUPS[f.app!].tags.includes(a))) return false;
  return true;
}

// The URL query is the single source of truth for filters (shareable, back-button friendly).
const QUERY_EVENT = "catalogue:query";
function subscribe(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(QUERY_EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(QUERY_EVENT, cb);
  };
}

function parseQuery(search: string): Filters {
  const q = new URLSearchParams(search);
  const wl = Number(q.get("wl"));
  const type = q.get("type") as ProductType | null;
  const app = q.get("app");
  return {
    wl: WAVELENGTHS.includes(wl) ? wl : null,
    type: type && type in TYPE_LABELS ? type : null,
    app: app && app in APPLICATION_GROUPS ? app : null,
  };
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-9 rounded-full border px-3.5 text-sm transition-colors",
        active ? "border-cyan/70 bg-cyan/10 text-fg" : "border-line-strong text-fg-2 hover:border-white/25 hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Filters and compare over server-rendered cards (passed in as `cards`), so card markup,
 * images and blur placeholders never enter the client bundle.
 */
export function Catalogue({ cards }: { cards: Record<ProductSlug, ReactNode> }) {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  const f = useMemo(() => parseQuery(search), [search]);
  const [compare, setCompare] = useState<ProductSlug[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);

  const update = (next: Partial<Filters>) => {
    const merged = { ...f, ...next };
    const q = new URLSearchParams();
    if (merged.wl !== null) q.set("wl", String(merged.wl));
    if (merged.type) q.set("type", merged.type);
    if (merged.app) q.set("app", merged.app);
    const qs = q.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    window.dispatchEvent(new Event(QUERY_EVENT));
  };

  const visible = useMemo(() => products.filter((p) => matches(p, f)), [f]);
  const anyFilter = f.wl !== null || f.type !== null || f.app !== null;

  const toggleCompare = (slug: ProductSlug) =>
    setCompare((c) => (c.includes(slug) ? c.filter((s) => s !== slug) : c.length < MAX_COMPARE ? [...c, slug] : c));

  return (
    <div>
      {/* Filters */}
      <div className="glow-card mb-8 grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto]" role="region" aria-label="Filter products">
        <div className="grid gap-5">
          <fieldset>
            <legend className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-2">Wavelength (nm)</legend>
            <div className="flex flex-wrap gap-2">
              {WAVELENGTHS.map((nm) => (
                <Chip key={nm} active={f.wl === nm} onClick={() => update({ wl: f.wl === nm ? null : nm })}>
                  <span className="font-mono">{nm}</span>
                </Chip>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-5 md:grid-cols-2">
            <fieldset>
              <legend className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-2">Type</legend>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(TYPE_LABELS) as ProductType[]).map((t) => (
                  <Chip key={t} active={f.type === t} onClick={() => update({ type: f.type === t ? null : t })}>
                    {TYPE_LABELS[t]}
                  </Chip>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-2">Application</legend>
              <div className="flex flex-wrap gap-2">
                {Object.entries(APPLICATION_GROUPS).map(([key, g]) => (
                  <Chip key={key} active={f.app === key} onClick={() => update({ app: f.app === key ? null : key })}>
                    {g.label}
                  </Chip>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
        <div className="flex items-end justify-between gap-4 lg:flex-col lg:items-end">
          <p className="text-sm text-fg-2" aria-live="polite">
            <span className="font-mono text-fg">{visible.length}</span> of {products.length} products
          </p>
          {anyFilter && (
            <button type="button" onClick={() => update({ wl: null, type: null, app: null })} className="text-sm text-cyan hover:underline">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {visible.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => {
            const checked = compare.includes(p.slug);
            const disabled = !checked && compare.length >= MAX_COMPARE;
            return (
              <li key={p.slug} className="catalogue-item relative">
                {cards[p.slug]}
                <label
                  className={cn(
                    "absolute right-3 top-3 z-10 flex min-h-9 cursor-pointer items-center gap-2 rounded-full border bg-bg/80 px-3 text-xs backdrop-blur-sm transition-colors",
                    checked ? "border-cyan text-fg" : "border-line-strong text-fg-2 hover:text-fg",
                    disabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggleCompare(p.slug)}
                    className="size-3.5 accent-[var(--cyan)]"
                  />
                  Compare
                  <span className="sr-only"> {p.name}</span>
                </label>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="glow-card p-10 text-center">
          <p className="text-lg">No catalogue product matches these filters.</p>
          <p className="mt-2 text-fg-2">
            We also build custom configurations.{" "}
            <button type="button" data-quote="" className="text-cyan hover:underline">
              Tell us what you need
            </button>
            .
          </p>
        </div>
      )}

      {/* Compare tray */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-line-strong bg-surface/95 transition-transform duration-300 md:backdrop-blur-md",
          compare.length ? "translate-y-0" : "pointer-events-none translate-y-full",
        )}
        aria-hidden={!compare.length}
      >
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
            <span className="shrink-0 text-sm text-fg-2">Compare</span>
            {compare.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleCompare(s)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-line-strong px-3 py-1 font-mono text-xs"
                tabIndex={compare.length ? 0 : -1}
              >
                {products.find((p) => p.slug === s)!.name}
                <Icon name="close" className="size-3" />
                <span className="sr-only">Remove from comparison</span>
              </button>
            ))}
            <span className="shrink-0 font-mono text-xs text-fg-2">{compare.length}/{MAX_COMPARE}</span>
          </div>
          <button
            type="button"
            disabled={compare.length < 2}
            onClick={() => dialog.current?.showModal()}
            tabIndex={compare.length ? 0 : -1}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-cyan px-4 text-sm font-medium text-bg disabled:opacity-40"
          >
            <Icon name="columns" className="size-4" /> Compare{compare.length >= 2 ? ` ${compare.length}` : ""}
          </button>
        </div>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="compare-title"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto max-h-[calc(100dvh-24px)] w-[min(1000px,calc(100vw-24px))] overflow-auto rounded-lg border border-line-strong bg-surface p-0 text-fg backdrop:bg-black/70"
      >
        <CompareTable slugs={compare} onClose={() => dialog.current?.close()} />
      </dialog>
    </div>
  );
}

function CompareTable({ slugs, onClose }: { slugs: ProductSlug[]; onClose: () => void }) {
  const items = slugs.map((s) => products.find((p) => p.slug === s)!);
  const rows = [...new Set(items.flatMap((p) => p.specs.map((s) => s.label)))];
  return (
    <div className="p-5 sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <h2 id="compare-title" className="text-2xl font-medium">
          Compare products
        </h2>
        <button type="button" onClick={onClose} aria-label="Close comparison" className="rounded-md p-2 text-fg-2 hover:text-fg">
          <Icon name="close" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <caption className="sr-only">Specification comparison of {items.map((p) => p.name).join(", ")}</caption>
          <thead>
            <tr>
              <th scope="col" className="w-44 border-b border-line py-3 pr-4 font-normal text-fg-2">
                Specification
              </th>
              {items.map((p) => (
                <th key={p.slug} scope="col" className="border-b border-line px-4 py-3 align-bottom">
                  <span className="block text-base font-medium">{p.name}</span>
                  <span className="block text-xs font-normal text-fg-2">{p.typeLabel}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((label) => (
              <tr key={label}>
                <th scope="row" className="border-b border-line py-3 pr-4 font-normal text-fg-2">
                  {label}
                </th>
                {items.map((p) => {
                  const s = p.specs.find((x) => x.label === label);
                  return (
                    <td key={p.slug} className="border-b border-line px-4 py-3 font-mono">
                      {s ? (
                        <>
                          {s.value}
                          {s.unit && <span className="text-fg-2"> {s.unit}</span>}
                          {s.note && <span className="block font-sans text-xs text-fg-2">{s.note}</span>}
                        </>
                      ) : (
                        <span className="text-fg-2" aria-label="Not specified">
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <th scope="row" className="py-3 pr-4 font-normal text-fg-2">
                Applications
              </th>
              {items.map((p) => (
                <td key={p.slug} className="px-4 py-3 text-xs leading-relaxed text-fg-2">
                  {p.applications.join(", ")}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-fg-2">Values from the PrenishQ product catalogue. &ldquo;—&rdquo; means not specified in the catalogue.</p>
    </div>
  );
}
