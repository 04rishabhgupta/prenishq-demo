"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { nav, site } from "@/data/site";
import { Icon } from "@/components/icons";
import { isActive } from "@/components/site/nav-links";
import { clsx as cn } from "clsx"; // client island: no tailwind-merge (saves ~8 KB gz)

/** Full-height sheet on a native modal <dialog>: focus trap, Esc and inert background for free. */
export function MobileNav() {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => ref.current?.close(), [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="-mr-2 rounded-md p-2 text-fg lg:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
      >
        <Icon name="menu" className="size-6" />
      </button>
      <dialog
        ref={ref}
        aria-label="Site menu"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="sheet m-0 ml-auto h-dvh max-h-none w-[min(360px,88vw)] border-l border-line-strong bg-surface p-0 text-fg backdrop:bg-black/60"
      >
        <div className="flex h-full flex-col p-5">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Menu</span>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="-mr-2 rounded-md p-2 text-fg-2 hover:text-fg"
              aria-label="Close menu"
            >
              <Icon name="close" className="size-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-6">
            <ul className="flex flex-col">
              {nav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between py-4 text-xl",
                        active ? "text-cyan" : "text-fg",
                      )}
                    >
                      {item.label}
                      <Icon name="arrow-right" className="size-5 text-fg-2" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <button
              type="button"
              data-quote=""
              onClick={() => ref.current?.close()}
              className="inline-flex h-12 items-center justify-center rounded-md bg-cyan font-medium text-bg"
            >
              Request a Quote
            </button>
            <a href={`mailto:${site.email}`} className="text-center font-mono text-sm text-fg-2">
              {site.email}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
