"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/data/site";
import { clsx as cn } from "clsx"; // client island: no tailwind-merge (saves ~8 KB gz)

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-1">
      {nav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm transition-colors",
                active ? "text-fg" : "text-fg-2 hover:text-fg",
              )}
            >
              {item.label}
              {active && (
                <span aria-hidden className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
