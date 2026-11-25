import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { QuoteDialog } from "@/components/quote/quote-dialog";
import { InViewObserver } from "@/components/motion/in-view";
import { FxBoot } from "@/components/motion/fx-boot";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import { site } from "@/data/site";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

// Spec numerals: never swap late (a proportional fallback would reflow chips and tables).
// "optional" keeps system monospace on a slow first view; later pages use the cached font.
const mono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  display: "optional",
  weight: ["400"],
  preload: false,
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "PrenishQ | Precision diode lasers for quantum technologies",
    template: "%s | PrenishQ",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  colorScheme: "dark",
};

// Runs before first paint: enables CSS reveals only with JS, and opts low-power
// devices / reduced-motion users out of non-essential animation (PLAN §5).
const bootScript = `(function(h){h.classList.add('js');try{var n=navigator,c=n.connection||{};if(matchMedia('(prefers-reduced-motion: reduce)').matches||(n.hardwareConcurrency&&n.hardwareConcurrency<=4)||c.saveData)h.setAttribute('data-motion','reduced')}catch(e){}})(document.documentElement)`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior="smooth": Next disables smooth scrolling during route changes, so every
    // page opens at the top instantly; in-page anchor links stay smooth (Next 16 upgrade guide).
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="fixed left-3 top-3 z-50 -translate-y-20 rounded-md bg-cyan px-4 py-2 font-medium text-bg transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <QuoteDialog />
        <InViewObserver />
        <FxBoot />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
