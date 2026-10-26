"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";

export type LightboxItem = { avif: string; webp: string; src: string; alt: string; caption: string; credit?: string; w: number; h: number };

/** One native <dialog> for the grid; thumbnails are server-rendered buttons with [data-lightbox]. */
export function Lightbox({ items }: { items: LightboxItem[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = (e.target as Element | null)?.closest?.<HTMLElement>("[data-lightbox]");
      if (!t) return;
      setI(Number(t.dataset.lightbox));
      ref.current?.showModal();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const go = (d: number) => setI((n) => (n + d + items.length) % items.length);
  const item = items[i];

  return (
    <dialog
      ref={ref}
      aria-label="Image viewer"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        startX.current = null;
      }}
      className="m-auto h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-fg backdrop:bg-black/90"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-3 sm:p-5">
          <span className="font-mono text-xs text-fg-2" aria-live="polite">
            {i + 1} / {items.length}
          </span>
          <button type="button" onClick={() => ref.current?.close()} aria-label="Close viewer" className="rounded-md p-2 text-fg-2 hover:bg-white/10 hover:text-fg">
            <Icon name="close" className="size-6" />
          </button>
        </div>
        <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-3 sm:px-20">
          <picture className="flex min-h-0 flex-1 items-center justify-center">
            <source type="image/avif" srcSet={item.avif} sizes="100vw" />
            <img
              key={item.src}
              src={item.src}
              srcSet={item.webp}
              sizes="100vw"
              alt={item.alt}
              width={item.w}
              height={item.h}
              className="max-h-full w-auto max-w-full rounded-md object-contain"
            />
          </picture>
          <figcaption className="max-w-2xl pb-6 text-center text-sm text-fg-2">
            {item.caption}
            {item.credit && <span className="block text-xs">{item.credit}</span>}
          </figcaption>
        </figure>
        <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-line-strong bg-bg/70 p-3 hover:bg-bg sm:block">
          <Icon name="arrow-right" className="size-5 rotate-180" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next image" className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-line-strong bg-bg/70 p-3 hover:bg-bg sm:block">
          <Icon name="arrow-right" className="size-5" />
        </button>
      </div>
    </dialog>
  );
}
