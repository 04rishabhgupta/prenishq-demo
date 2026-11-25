import Link from "next/link";
import { Logo, LogoSymbol } from "@/components/brand/logo";
import { NavLinks } from "@/components/site/nav-links";
import { MobileNav } from "@/components/site/mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 h-[var(--header-h)] border-b border-line bg-bg/95 md:bg-bg/70 md:backdrop-blur-md">
      <LogoSymbol />
      <div className="container-x flex h-full items-center justify-between gap-6">
        <Link href="/" className="-m-1 rounded p-1" aria-label="PrenishQ home">
          <Logo className="h-[22px] sm:h-6" title="PrenishQ" />
        </Link>
        <nav aria-label="Primary" className="hidden lg:block">
          <NavLinks />
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}
