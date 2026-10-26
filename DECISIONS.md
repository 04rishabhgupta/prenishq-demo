# Decisions and dependency costs

Bundle numbers below were **measured on 2026-10-26** with esbuild (minified, ESM, `NODE_ENV=production`, React external, `gzip -9`), using realistic tree-shaken imports. Next.js (Turbopack) numbers will differ by a few KB. They will be re-checked with `@next/bundle-analyzer` after scaffolding.

| Package (import shape) | gz | Where it loads |
|---|---|---|
| react + react-dom | 67.2 KB | every route (framework floor, with Next runtime ≈ 100 KB) |
| motion: `LazyMotion` + `m` | 5.5 KB | first load, routes that animate |
| motion: `domAnimation` features | ~22 KB (31.0 KB incl. base) | async chunk after hydration |
| motion: `useScroll`/`useTransform`/`useInView` | 9.0 KB | only components that use them |
| motion: full `motion` component (not used) | 52.6 KB | — |
| gsap + ScrollTrigger | **44.0 KB** | not installed (D-05) |
| lenis | 5.3 KB | not installed (D-06) |
| @radix-ui/react-dialog | 13.8 KB | on intent (quote dialog, mobile nav, compare) |
| @radix-ui/react-accordion | 9.0 KB | /applications |
| @radix-ui/react-tabs | 9.4 KB | product pages, if used |
| dialog + accordion + tabs together | 20.4 KB | shared Radix internals dedupe |
| @radix-ui/react-tooltip | **19.8 KB** | avoided (D-07) |
| clsx + tailwind-merge + cva | 8.8 KB | first load (shadcn `cn()`) |
| react-hook-form (`useForm`) | 12.1 KB | lazy, form only |
| zod/mini (object/string/email/optional) | 5.2 KB | lazy, form only |

---

**D-01 Framework.** Next.js 16.4 (App Router) + React 19.3 + TypeScript + Tailwind CSS 4.3, `output: 'export'`. No route needs a server, so every page is static HTML on a CDN with no cold starts.

**D-02 Fonts.** Space Grotesk (display + body, variable) + JetBrains Mono (specs, wavelengths, units) via `next/font/google`, which self-hosts them at build. `display: swap`, `subsets: ['latin']`, `adjustFontFallback` for zero-CLS swap. Space Grotesk over Sora because its squarer terminals sit closer to the logo's "E" bars and read as instrument-like. The Latin subset lacks U+207A (⁺) and other superscripts, so `Yb⁺`, `Ca⁺` and `¹³³Cs` are written with `<sup>`, not Unicode superscripts.

**D-03 Images.** `next/image`'s default optimiser does not run under static export. Instead: `scripts/optimize-images.mjs` (sharp 0.35, dev-only) pre-generates AVIF + WebP at 384/640/828/1200/1920 widths plus a ≤ 20 px base64 blur. A custom `loader` maps `next/image` requests to those files, and `getImageProps()` + `<picture>` gives an AVIF→WebP fallback on the hero. Runtime cost 0 KB. Chosen over `next-image-export-optimizer` for AVIF control and one less dependency.

**D-04 Animation engine = Motion.** *(Revised during build: see D-24. Motion is installed but not yet shipped on any route.)* `LazyMotion` + `m` only, `features={() => import('./motion-features').then(r => r.default)}` so `domAnimation` arrives after hydration. Never import `motion.*` (52.6 KB). Simple reveals and beams use CSS keyframes and IntersectionObserver (`data-inview` attribute), not Motion. Motion is reserved for interactive state (explorer, filters, compare tray, dialogs).

**D-05 GSAP: recommend NOT installing (pending your OK).** Cost 44 KB gz for one section. The pinned "diode → quantum sensor" story is achievable with CSS `position: sticky` + Motion `useScroll`/`useTransform` (9 KB, mostly shared with Motion already loaded), animating only `transform`/`opacity`. This also honours "don't ship two libraries doing the same job". Fallback: if scrubbing measurably janks on mid-range Android, add GSAP to that one lazy chunk only, with no Motion on the same elements.

**D-06 Lenis: skip.** Native scrolling is already smooth on modern browsers. Lenis intercepts wheel/touch events, which risks INP, breaks some find-in-page and anchor behaviour, and fights reduced-motion users. To be revisited only if you want it after seeing the build.

**D-07 shadcn/ui** (copy-in, themed to tokens). *(Revised during build: see D-25. Radix-backed parts replaced by native elements.)* Use: Button, Badge, Accordion, Dialog, Sheet (Dialog variant), Tabs, Input, Textarea, Label, Table, Checkbox. Instead of Radix Select, use a styled native `<select>` (better on mobile, 0 KB). Instead of Radix Tooltip (19.8 KB), use CSS-only tooltips on `:hover`/`:focus-visible` with `aria-describedby`. All Radix-backed components are kept out of first-load JS: the global "Request a Quote" dialog is `next/dynamic`, prefetched on pointer-enter/focus of the button. `cn()` (8.8 KB): keep for shadcn compatibility, and swap `tailwind-merge` out if the analyzer shows it dominating first load.

**D-08 Aceternity UI** (copy-in, adapted):
- **Spotlight**: SVG + CSS animation. Hero.
- **Background Beams**: rewritten so paths animate via CSS `stroke-dashoffset`/`transform` instead of per-path Motion instances.
- **Bento Grid**: pure Tailwind. Product showcase.
- **Sticky Scroll Reveal**: basis for D-05 scroll story.
- **Moving Border**: the original uses `useAnimationFrame` (a JS loop every frame). Replaced by a CSS `@property --angle` conic-gradient rotation, 0 JS. Supported in all evergreen browsers since 2024; static border elsewhere.

**D-09 Icons: Iconly.** Copy ~20 SVGs (one style: "Light", 1.5 px stroke) into `components/icons/*.tsx` as inline components with `currentColor`. No npm package (`react-iconly` is unmaintained and targets React 16) and no icon font. **Licence check needed:** most of Iconly's set is Pro. If you don't hold a licence, I'll draw the same ~20 glyphs in the same 1.5 px stroke style myself.

**D-10 ReactBits** (cherry-picked, copy-in):
- **CountUp**: rewritten on IntersectionObserver + `requestAnimationFrame` (no spring library). The final value is server-rendered and announced once via `aria-live`.
- **Text reveal**: CSS per-word stagger. ReactBits' SplitText depends on GSAP, so it's not used.
- **Magnet button**: pointer-move → `transform`, disabled on touch and reduced-motion.
- **LaserFlow** (WebGL/three.js, >150 KB): **not used by default**. The CSS/SVG beam covers the brief. Optional later as a desktop-only, lazy, IO-paused, reduced-motion-gated chunk if you specifically want it.

**D-11 Forms.** react-hook-form + zod/mini ≈ 17 KB, loaded only with the form (contact page / quote dialog). The schema is shared by both. Static export has no server actions or route handlers, so the form POSTs JSON to `NEXT_PUBLIC_FORM_ENDPOINT`:
- **Formspree** works as-is.
- **Resend** needs a secret key, so it lives in a tiny host function (`functions/api/enquiry.ts` for Cloudflare Pages, or `api/enquiry.ts` for Vercel) outside the Next export.

Spam defence: honeypot field + minimum fill time + endpoint-side rate limit. No CAPTCHA script.

**D-12 Charts: hand-rolled SVG, not Bklit UI.** The only computed charts are the wavelength coverage bars and the explorer spectrum (both derived from spec ranges). That's under 3 KB of SVG/TS versus an unverified dependency tree. The measured plots (linewidth, SAS, power stability) stay as optimised image crops until the client supplies raw data. Re-plotting by digitising a raster would amount to inventing data points.

**D-13 Untitled UI:** structural reference only for the form layout, comparison table, footer and nav. Not installed: it pulls in `react-aria-components`, which duplicates Radix.

**D-14 Refero / 21st.dev:** reference only. Refero is behind a login, so layout-rhythm study will use public photonics/deep-tech sites, which I'll note in the build log. 21st.dev is consulted only if a component is missing.

**D-15 Lightbox and mobile gallery:** native `<dialog>` + CSS scroll-snap. No library.

**D-16 Map:** click-to-load facade. Default is an inline SVG "location card" (dark grid, pin, address, "Open in Google Maps" link, "Load interactive map" button). A static Maps image would need an API key and billing. The iframe is injected only on click.

**D-17 SEO:** per-route `metadata`, `opengraph-image.tsx` generated at build (supported for static routes under export), JSON-LD `Organization` (layout) + `Product` (product pages, no price/offers, since none are published), `sitemap.ts`, `robots.ts`, canonical URLs, and 301s from the old Wix slugs.

**D-18 Analytics:** none at launch. If wanted, Cloudflare Web Analytics or Vercel Analytics (< 2 KB, no cookies).

**D-19 Accessible colour.** Measured contrast on `--bg #050608` / `--surface-2 #111621`:

| Colour | Contrast on `--bg` / `--surface-2` | Decision |
|---|---|---|
| text `#F4F7FB` | 18.9 / 16.8 | OK |
| text-2 `#9AA7B8` | 8.3 / 7.4 | OK |
| cyan `#00B4F0` | 8.5 / 7.6 | OK |
| magenta `#FF1F8E` | 5.6 / 5.0 | OK |
| 520 `#22FF88` | 15.2 / 13.6 | OK |
| 785 `#FFB020` | 11.1 / 9.9 | OK |
| 633 `#FF2A3D` | 5.5 / 4.9 | OK |
| 405 `#8B5CF6` | 4.8 / **4.3** | **Fails on surface-2.** Adding a `--wl-405-text: #A78BFA` (6.7) for text |
| 980 `#B3122B` | **2.9 / 2.6** | **Fails.** Beams, fills and swatches only, never text; labels use `--text` |
| white on cyan button | **2.4** | **Fails.** Primary buttons use `--bg` text on cyan (8.5) |

**D-20 Not installed (per brief):** 3dicons, Anime.js, Cult-ui, Spectrum UI, WithAnimation, Originkit, plus GSAP (D-05), Lenis (D-06), Bklit (D-12), Untitled UI package (D-13), Radix Tooltip/Select (D-07).

**D-21 Copy conventions:** UK spelling per the brief ("fibre", "polarisation", "commercialised"), although the catalogue uses US spelling. Units with a thin non-breaking space (`100 mW`), `<` for upper bounds (`< 100 kHz`), all in JetBrains Mono.

**D-22 Hosting:** both work with zero config for a static `out/`. Recommendation is **Cloudflare Pages** (free tier with unmetered bandwidth, Indian edge PoPs, `_redirects` + Pages Functions for the Resend option). Vercel is equally fine. The README will cover both.

---

## Build log: decisions made or revised while building (2026-10-26)

**D-23 Measured framework floor.** In this project, Next.js 16.4 App Router + React 19.3 ship **≈ 127 KB gz** of JS on every route before any app code: react-dom ≈ 70 KB, router ≈ 45 KB, runtime ≈ 12 KB. That is higher than the ≈ 100 KB assumed in PLAN §5. Under Lighthouse's default simulated mobile throttling, this JS alone pins LCP at **≈ 2.6–2.9 s**. Even the near-empty 404 page measured LCP 2.68 s. **The < 1.8 s LCP target is therefore not reachable with Next.js App Router under simulated throttling**, whatever the page content. With applied (DevTools) throttling, Home measured LCP 2.19 s, FCP 0.81 s, Performance 99. Every route still scores Performance ≥ 95, because TBT is ≈ 0–5 ms and CLS is ≈ 0. The only lever left that would materially move simulated LCP is a different framework (e.g. Astro with React islands, ≈ 0 KB baseline). That's your call, since the brief mandates Next.js.

**D-24 No Motion on any route (yet).** With a 127 KB floor, each route has ≈ 20 KB of headroom. Every animation in the brief turned out to be achievable with CSS keyframes/transitions (transform + opacity) plus one shared IntersectionObserver (`components/motion/in-view.tsx`, < 1 KB):
- the hero beam, scan line and veil;
- reveals, beam lines and the marquee;
- the explorer cursor, the compare tray and the filter states.

Motion stays in `package.json` for future interactions that genuinely need springs or layout animation, loaded through `LazyMotion`.

**D-25 Native `<dialog>` / `<details>` instead of Radix.** The quote dialog, mobile nav sheet, compare dialog and gallery lightbox use native modal `<dialog>`, which provides a focus trap, Esc to close, an inert background and the top layer for 0 KB. Accordions use `<details>`. Radix packages were removed (they would have cost ≈ 14–20 KB per route). shadcn's API and styling conventions (cva variants, `Button`, form field anatomy) are kept. Focus trapping and Esc were verified in `scripts/interaction-check.mjs`.

**D-26 `tailwind-merge` only on the server.** `cn()` (clsx + tailwind-merge, ≈ 8 KB gz) is used in Server Components only. Client islands import `clsx` directly. This saved ≈ 8 KB on every route.

**D-27 `inlineCss` kept on.** It duplicates the CSS inside the RSC payload (+≈ 9 KB gz HTML). Turning it off halved HTML size but worsened FCP (1.05 → 1.20 s) and didn't change LCP, so it stays on.

**D-28 Fonts.**
- Space Grotesk (`display: swap`) has a metric-adjusted fallback.
- JetBrains Mono uses `display: optional` with a real system-monospace fallback and is not preloaded. A late mono swap had caused CLS 0.018 on `/products` (chips re-wrapping), and this brought it to 0.000.
- The residual CLS on Home (≤ 0.010, under the 0.02 target) comes from Space Grotesk reflowing the hero H1 on a slow first load.

**D-29 Hero layout on mobile.** The product render leads and the headline follows, so font-swap reflow can't shift the LCP image. The LCP image uses `fetchpriority="high"` and is the 828w AVIF (15.5 KB).

**D-30 Lazy below-the-fold work.**
- Sections use `content-visibility: auto`.
- The enquiry form (react-hook-form + zod/mini ≈ 17 KB) is a separate chunk. It loads on intent for the quote dialog (prefetched on hover/focus of any `[data-quote]` element) and after hydration on `/contact`.
- The Google Maps iframe loads only after "Load map" is clicked.
- Off-screen gallery items skip layout, so their lazy images don't compete with LCP.

**D-31 Logo.** Traced from the client's 2353 × 408 PNG with potrace. The 25 dots are exact `<circle>`s, measured from the PNG on a 5×5 grid with three radii. Colours were sampled from the PNG: cyan `#1EB1ED` and magenta `#FC1891`, which differ slightly from the brief's `#00B4F0` / `#FF1F8E`; the UI tokens follow the brief. The logo is defined once per page as an SVG `<symbol>` and reused. The favicon, loader and OG images derive from the same data (`data/logo.json`). TODO(client): replace with the original vector file.

**D-32 Tailwind source scoping.** `@import "tailwindcss" source(none)` scans only `app/`, `components/`, `lib/` and `data/`, so class-like words in docs and assets can't bloat the CSS.

**D-33 Static-export specifics.**
- Redirects and headers live in `public/_redirects`, `public/_headers` (Cloudflare) and `vercel.json`, because `next.config` redirects don't run under export.
- OG images are generated at build time. They're exported without a file extension, so both host configs set `Content-Type: image/png`.

### Final measured first-load JS (gz, excludes lazy chunks and `noModule` polyfills)

See `reports/bundle.txt` (generated by `pnpm report:bundle`). Every route is between ≈ 141 and 148 KB, under the 150 KB budget.

---

## Visual upgrade: effects layer (2026-10-26, round 2)

**D-34 Architecture: "progressive FX".** Every page is complete and fast as server-rendered HTML. A ~0.5 KB client component (`components/motion/fx-boot.tsx`) waits for browser idle, then lazy-loads `lib/fx`, which attaches effects to markup through data attributes. First-load JS rose by only ≈ 0.2 KB; everything below is in lazy chunks.

Gating, in order:
1. **Before first paint:** reduced-motion, ≤ 4 CPU cores or Save-Data set `data-motion="reduced"`, which globally disables decorative animation and transitions.
2. **At idle:** no hardware compositing (blocklisted GPU, VM, remote desktop) is detected with a `failIfMajorPerformanceCaveat` WebGL probe plus a renderer-name check (SwiftShader, llvmpipe, software). These visitors also get the reduced profile, because measured CSS motion repainted on the CPU there.
3. **WebGL and the GSAP story** run only on desktop (≥ 1024 px, fine pointer, ≥ 4 GB device memory).

| Effect | Source library | Implementation | Cost |
|---|---|---|---|
| Hero + product-page laser beam landing on the product card | **ReactBits LaserFlow** | Vanilla WebGL2 port of the original shader (no three.js); see the hardening notes below | ≈ 6 KB gz lazy |
| Hero wavelength cycle (OPAL 405 → 980 nm) with scrambling λ readout | ReactBits DecryptedText | Text swap every 4.2 s; beam colour eased on the GPU | in fx chunk |
| Spotlight sweep in heroes | **Aceternity Spotlight** | Pre-rendered radial gradient, transform + opacity entrance (no blur filter) | CSS |
| Moving light around outline CTAs | **Aceternity Moving Border** | Conic gradient on a pseudo-element rotated by `transform` | CSS |
| Falling beams (CTA band, inner heroes) | **Aceternity Background Beams** | 1.5 px elements translating down; position, length and timing derived from the index with CSS `mod()`; paused off-screen | CSS |
| Bento grid | **Aceternity Bento Grid** | (existing) | — |
| "From diode to quantum sensor" sticky story | **Aceternity Sticky Scroll Reveal** + **GSAP ScrollTrigger** | GSAP sets the active step, scrubs the progress beam and adds parallax; the layout is decided at first paint so mounting never shifts it; diagrams are build-time static SVGs (`public/story/*.svg`) | GSAP ≈ 44 KB gz, lazy, desktop only, loaded one viewport ahead |
| Cursor spotlight on cards | ReactBits SpotlightCard | `--mx/--my` set from one rAF-throttled `pointermove`; gradient on the card background | in fx chunk |
| 3D tilt on product renders | ReactBits TiltedCard | `--rx/--ry` → `transform` | in fx chunk |
| Magnetic CTAs | ReactBits Magnet + **Motion** | `motion/mini` `animate` with spring physics (runs on WAAPI, off the main thread) | ≈ 5 KB gz lazy |
| Word-by-word heading reveals | ReactBits SplitText | Server-split words, CSS transitions on in-view, full text as the heading's `aria-label` | CSS |
| Gradient headline shine | ReactBits ShinyText | `background-position` sweep on the two gradient words only | CSS |

**LaserFlow hardening (in our port, `lib/fx/laserflow.ts`):**
- Shaders compile without blocking the main thread (`KHR_parallel_shader_compile`).
- Render resolution is capped at 1× CSS pixels.
- Four quality tiers adapt from the p90 frame interval over 30-frame windows (100 % → 75 % → 60 % without fog → 50 %). If the lowest tier still can't hold about 48 fps, WebGL is torn down and the CSS beam remains.
- Rendering pauses off-screen and in hidden tabs.
- Only one WebGL context exists per page.
- The ReactBits licence (MIT + Commons Clause) permits use in a website; the copyright notice is kept in both files.

**Measured (real Chrome, `scripts/scroll-jank.mjs`, full-page scroll at 24 px/frame):**

| Setup | WebGL | Median frame | p95 | Frames > 33 ms |
|---|---|---|---|---|
| Apple M5 GPU | on, top tier | 16.7 ms | 17.6 ms | 0 |
| Apple M5 GPU, 4× CPU throttle | on, top tier | 16.7 ms | 17.6 ms | 0 |
| No GPU (SwiftShader) | off, reduced profile | 16.7 ms | 16.8 ms | 0 |
| Mobile 390 px, 6× CPU throttle | n/a | 16.7 ms | 17.6 ms | 0 |

**Load-performance work needed to stay within budget after the upgrade:**
- Story diagrams moved to static SVG files: they were 16 KB raw, duplicated in the HTML and the RSC payload.
- The beam layout moved into CSS.
- Logos use a single WebP srcset.
- The λ glyph uses the display font, avoiding a download of JetBrains Mono's Greek subset.
- JetBrains Mono is down to one weight.

Home mobile Lighthouse is back to 95, with FCP 1.05 s and LCP 2.91 s, identical to before the upgrade.

**Accessibility:** inactive story steps are de-emphasised by colour, not opacity, so all text stays ≥ 4.5:1. The cycling λ label is not announced via `aria-live`. All effects are decorative and `aria-hidden`.
