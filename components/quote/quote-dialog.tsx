"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Icon } from "@/components/icons";
import { DotMatrixLoader } from "@/components/brand/loader";

const loadForm = () => import("@/components/forms/enquiry-form");
const EnquiryForm = dynamic(loadForm, {
  ssr: false,
  loading: () => (
    <div className="grid h-80 place-items-center">
      <DotMatrixLoader label="Loading form" />
    </div>
  ),
});

/**
 * One native <dialog> for the whole site. Any element with [data-quote] opens it
 * (optionally pre-filled via data-quote-product), so trigger buttons stay server-rendered.
 */
export function QuoteDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const [product, setProduct] = useState<string | undefined>();
  const [mounted, setMounted] = useState(false);
  const [openCount, setOpenCount] = useState(0);

  useEffect(() => {
    let prefetched = false;
    const prefetch = (e: Event) => {
      if (!prefetched && (e.target as Element | null)?.closest?.("[data-quote]")) {
        prefetched = true;
        void loadForm();
      }
    };
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as Element | null)?.closest?.<HTMLElement>("[data-quote]");
      if (!trigger) return;
      e.preventDefault();
      setProduct(trigger.dataset.quoteProduct || undefined);
      setMounted(true);
      setOpenCount((n) => n + 1);
      ref.current?.showModal();
    };
    document.addEventListener("pointerover", prefetch, { passive: true });
    document.addEventListener("focusin", prefetch);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerover", prefetch);
      document.removeEventListener("focusin", prefetch);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      aria-labelledby="quote-title"
      onClick={(e) => e.target === ref.current && close()}
      className="quote-dialog m-auto w-[min(640px,calc(100vw-24px))] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-lg border border-line-strong bg-surface p-0 text-fg backdrop:bg-black/70"
    >
      <div className="bench-frame p-5 sm:p-7" style={{ ["--accent" as string]: "var(--cyan)" }}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Request a quote</p>
            <h2 id="quote-title" className="text-2xl font-medium">
              {product ? `Quote for ${product}` : "Tell us about your setup"}
            </h2>
            <p className="mt-1.5 text-fg-2">Share your wavelength, power and application. We&apos;ll reply with a configuration and lead time.</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="-m-1 rounded-md p-2 text-fg-2 transition-colors hover:bg-white/5 hover:text-fg"
            aria-label="Close"
          >
            <Icon name="close" />
          </button>
        </div>
        {mounted && <EnquiryForm key={openCount} product={product} source="quote-dialog" compact />}
      </div>
    </dialog>
  );
}
