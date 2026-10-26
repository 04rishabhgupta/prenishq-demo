# PrenishQ website rebuild: plan

Status: **Built (2026-10-26).** All pages implemented; see DECISIONS.md "Build log" for what changed from this plan, and `reports/` for measurements.
Sources read: live site (all 7 routes crawled, raw HTML + Wix media), `reference/` (4 screenshots + `Prenishq_Product_Catalog.pdf`, 8 pages).

---

## 0. Discovery findings that shape the plan

| Finding | Consequence |
|---|---|
| Live site is Wix (`/products-1`, `/about-1`, `/events-news` slugs). | Add 301 redirects from old slugs to clean URLs. |
| **Catalogue PDF is 8 flattened JPEG pages (~1055–1240 px wide, no text layer).** | Text cannot be extracted; specs are transcribed by hand into `data/products.ts`. Product crops from the PDF would be only ~600–700 px wide, too low-res for heroes. |
| Wix originals of the product shots are higher-res (OPAL 1619×971, AGATE 1659×948, OPAL hero 1717×916). | Use the Wix originals as the source for OPAL/AGATE renders; use PDF crops only for the lab figures. |
| Most product shots look AI-generated (garbled box labels, e.g. "TRMO", "CPM-…" on the catalogue cover). One genuine bench photo of OPAL exists (`freespace_opal.jpeg`, 1280×960). | Use them for now, flag `TODO(client)`: real product photography strongly recommended for a scientific audience. |
| **No images at all for DBR, DBR PRO, TA.** | Placeholder renders (styled SVG "instrument silhouette" on the optical-table texture), clearly named. |
| Applications page images are AI-generated (filenames `ChatGPT Image Apr 3, 2025…`, a chip labelled "MEMORY"). | Replace with lightweight SVG schematics (atom array, ion chain, NV lattice, etc.). No raster weight. |
| Gallery page is **empty** on the live site; About has **one paragraph**, no team. | Gallery seeded with catalogue lab figures + OPAL photos; needs client imagery. Team = placeholder cards. |
| `/agate` returns **404**; "Explore AGATE" button has no link. | New `/products/agate` fixes it. |
| OPAL live page has measurement figures not in the catalogue (785.034 nm peak, 0.08 pm FWHM histogram, 24 h power-stability trace, beam profiles). | Valuable "proof" content; included as figures, specs gated by `TODO(client)` where they conflict with the PDF (see §8). |
| Catalogue plots (90 ± 3 kHz linewidth, ¹³³Cs SAS) are raster only. | Show as optimised image crops now; redraw as SVG **only if the client supplies raw CSV** (digitising a plot = inventing data points). |

---

## 1. Sitemap and URLs

```
/                         Home
/products                 Listing (filter + compare)
/products/opal            OPAL Compact Diode Laser
/products/agate           AGATE ECDL
/products/dbr             DBR Diode Laser
/products/dbr-pro         DBR PRO
/products/ta              Tapered Amplifier
/applications             Applications (cards + expandable detail)
/about                    About
/gallery                  Gallery (masonry + lightbox)
/contact                  Contact (form + departments + map facade)
/404                      Branded not-found
/sitemap.xml /robots.txt  generated
/datasheets/prenishq-catalogue.pdf   (the catalogue; per-product datasheets = TODO(client))
```

Redirects (host config: `vercel.json` / Cloudflare `_redirects`): `/products-1 → /products`, `/about-1 → /about`, `/events-news → /gallery`, `/contact-us → /contact`, `/opal → /products/opal`.

Rendering: **every route statically generated, `output: 'export'`**. Nothing needs a server (form posts to an external endpoint; see DECISIONS D-11).

---

## 2. Page designs (section order)

### Home
1. **Hero** (server-rendered, CSS/SVG only). Headline + sub + 2 CTAs. Visual: dot-matrix grid (CSS `radial-gradient` background, 0 bytes of image), a single SVG beam that sweeps with `transform` only, and the OPAL render (`priority`, AVIF) "lit" by the beam. Reduced-motion → static poster frame. LCP element = headline text (fast), not the image.
2. **Credibility bar**: "An IIT Delhi Spin-off · Supported by the National Quantum Mission" + 8 funder logos in a pure CSS marquee (duplicated track, `translateX` keyframes, paused on hover/focus and under reduced-motion). Greyscale → colour on hover.
3. **Key numbers**: `369–1600 nm` · `<100 kHz` · `>2 W` · `5 GHz`. Count-up (ReactBits CountUp adapted to Motion `useInView`), final value server-rendered so no CLS and no-JS correct.
4. **Product bento**: OPAL, AGATE, DBR, DBR PRO, TA. Card accent = wavelength colour. 3 mono headline specs each.
5. **Wavelength explorer** (signature): SVG spectrum 350–1650 nm, log-ish scale. Presets 405/520/633/785/980 plus **atomic-line markers** (Yb⁺ 369, Ca⁺ 397, Sr 461, K 767, Rb 780, Cs 852). Hover/tap/arrow keys move a cursor; beam recolours; products whose range covers it light up; applications list updates. Keyboard = `role="slider"`. NIR shown in false colour with a caption saying so.
6. **Proven in the lab**: 4 figure tiles with captions + credits (linewidth plot, Cs MOT, NV cube, cancer-cell image, Prof. Sudipta Maiti / BITS Pilani Hyderabad).
7. **Applications strip**: 9 items, links into `/applications` anchors.
8. **Why PrenishQ**: 4 cards (catalogue p.8 copy).
9. **Mission / Vision** + 4 pillars. Long-term quantum-computing ambition as one vision line.
10. **Final CTA** → Request a Quote. Footer.

Optional scroll story ("diode → quantum sensor", 4 pinned steps: diode chip → external cavity → frequency lock (SAS) → cold atoms/MOT) between 5 and 6: CSS `position: sticky` + Motion `useScroll` (see D-05). Lazy, below fold.

### Products listing
Client-side filter chips (wavelength / type / application) over server-rendered cards; filtering = toggling `hidden` on already-rendered cards, so no layout thrash and no data fetch. Filter state in URL query (`?type=ecdl`). Compare: checkbox on each card (max 3) → sticky compare tray → comparison table (dialog on desktop, full-screen sheet on mobile). Unknown values print "—", never invented.

### Product detail (`/products/[slug]`, `generateStaticParams`)
Hero (render + wavelength-coloured beam + name + tagline) → headline spec strip (big mono numerals) → full spec table → wavelength coverage bar (SVG, derived from data) → applications grid → demonstrated-application figures → laser-safety note → datasheet download + "Request a Quote" (pre-filled product) → related products.

### Applications
6 cards (40–60 words each, rewritten), each expands (accordion on mobile, dialog on desktop) to a ~150-word detail + "Products that serve this" links. SVG schematic per card. Fix the duplicated spectroscopy copy and the factual errors listed in §8.

### About
Story (IIT Delhi spin-off, origin in research students and scientists) → what we build (Lasers & Optics, Electronics & Automation, Ultra-High Vacuum) → mission/vision → skill-development / education → funders & incubators → team (placeholder cards).

### Gallery
CSS-columns masonry (no JS layout), `next/image` thumbnails, lazy lightbox (native `<dialog>`, arrow keys, swipe). Virtualise only if > 24 items (not needed at launch).

### Contact
Form (name, organisation, email, phone, product, wavelength, message) + honeypot + timing check → 3 department cards + general → address → **map facade** (static dark-styled image + "Load map" button injects the iframe on click).

---

## 3. Component inventory

Server components unless marked **(client)**. **(lazy)** = `next/dynamic` / loaded on intent.

**Layout:** `SiteHeader` (glass, sticky) · `NavLinks` · `MobileNav` **(client, lazy on tap)** · `QuoteButton` **(client)** → `QuoteDialog` **(lazy, prefetch on hover/focus)** · `SiteFooter` · `SkipLink` · `Container` · `Section` (`content-visibility: auto`).

**Brand / motifs:** `Logo` (inline SVG) · `DotGrid` (CSS bg) · `DotMatrixLoader` (CSS) · `BeamLine` (SVG divider, CSS draw-in on view) · `BenchFrame` (corner brackets, CSS) · `OpticalTableTexture` (CSS radial-gradient) · `GlowCard` (1px gradient border via pseudo-element opacity).

**Home:** `Hero` · `HeroBeam` (SVG, CSS animation) · `CredibilityMarquee` · `KeyNumbers` + `CountUp` **(client)** · `ProductBento` · `WavelengthExplorer` **(client, lazy)** · `ScrollStory` **(client, lazy, optional)** · `LabProof` · `ApplicationsStrip` · `WhyCards` · `MissionPillars` · `CtaBand`.

**Products:** `ProductCard` · `ProductFilters` **(client)** · `CompareTray` + `CompareTable` **(client, lazy)** · `ProductHero` · `SpecStrip` · `SpecTable` · `CoverageBar` (SVG) · `FigureTile` · `LaserSafetyNote` · `RelatedProducts`.

**Applications:** `ApplicationCard` · `ApplicationDetail` (accordion/dialog) **(client)** · `Schematic*` SVGs.

**Gallery:** `MasonryGrid` · `Lightbox` **(client, lazy)**.

**Contact:** `EnquiryForm` **(client)** (shared with QuoteDialog) · `DepartmentCard` · `MapFacade` **(client, tiny)**.

**UI primitives (shadcn, themed):** Button, Badge, Accordion, Dialog, Sheet, Tabs, Input, Textarea, Select (native `<select>` styled; see D-07), Label, Table, Checkbox.

**Icons:** ~20 inline SVG components in `components/icons/` (see D-09).

---

## 4. Data model (single source of truth)

```
data/
  products.ts       Product[]: slug, name, family, type ('compact'|'ecdl'|'dbr'|'amplifier'),
                    tagline, wavelengths {kind:'discrete', nm[]} | {kind:'range', segments[[min,max]]},
                    accent (wavelength token), specs: Spec[] {label, value, unit, note?, source:'catalogue'|'live'|'TODO(client)'},
                    headlineSpecs (3), applications: AppSlug[], figures: Figure[], images, related[]
  applications.ts   Application[]: slug, title, summary (40–60 w), detail, productSlugs[], schematic
  site.ts           org name, emails, address, funders[], nav, socials (TODO)
  gallery.ts        GalleryItem[]: src, alt, caption, credit, w, h
  wavelengths.ts    palette + atomic-line markers + nm→colour mapping
```

Every spec carries a `source` field, so the build can **fail if any `TODO(client)` spec is rendered** in production unless explicitly allowed. Pages, sitemap, JSON-LD and OG images all render from these files.

---

## 5. Performance budget

| Metric (mobile, Moto-G-class, slow 4G) | Target | Gate |
|---|---|---|
| Lighthouse Performance | ≥ 95 | every page |
| LCP | < 1.8 s | Home, product pages |
| INP | < 100 ms | explorer, filters, dialogs |
| CLS | < 0.02 | all |
| First-load JS per route (gz, excl. lazy chunks) | < 150 KB | build report |
| Hero image | ≤ 60 KB AVIF @ 828w | |
| Fonts | ≤ 2 families, ≤ 4 files, ≤ 90 KB total woff2 | |
| CSS | ≤ 25 KB gz | |

**Expected JS composition (measured, see DECISIONS):** React + React DOM ≈ 67 KB gz, plus the Next.js runtime (≈ 30–35 KB), puts the framework floor near **~100 KB**. That leaves **~50 KB** per route for our code. Motion base ≈ 5.5 KB (features loaded async), cn/cva ≈ 9 KB. Radix-based dialog (≈ 14 KB) and form libs (≈ 17 KB) are **never in first load**: they load on intent.

Techniques: SSG + static export · Server Components by default · `content-visibility: auto` on below-fold sections · CSS-only marquee/beams/grids · Motion `LazyMotion` with async `domAnimation` · IntersectionObserver-gated animation · `prefers-reduced-motion` and low-power (`hardwareConcurrency <= 4` or `saveData`) switch that sets `data-motion="reduced"` on `<html>` · build-time AVIF/WebP + blur placeholders · map iframe behind facade · no third-party scripts at launch (analytics: TODO, recommend Cloudflare Web Analytics or Vercel Analytics, both < 2 KB).

Verification loop per page: `next build` → `@next/bundle-analyzer` report → Lighthouse CI (mobile preset, 3 runs, median) against the static `out/` dir → fix before moving on.

---

## 6. Build order

1. Scaffold (Next 16, TS, Tailwind 4, ESLint), tokens, fonts, logo SVG, image pipeline, layout (header, footer, quote dialog), redirects. → build + Lighthouse.
2. Home. → build + Lighthouse.
3. Data files, Products listing, 5 product pages. → build + Lighthouse.
4. Applications, About, Gallery, Contact, 404. → build + Lighthouse.
5. SEO (metadata, OG images via build-time generation, JSON-LD, sitemap, robots), a11y pass (axe + keyboard), viewport QA at 360 / 768 / 1280 / 1920.
6. Final report: Lighthouse scores, bundle report, discrepancy list, `TODO(client)` list, README.

---

## 7. Asset plan

| Asset | Source | Status |
|---|---|---|
| Logo (dot-matrix + wordmark + magenta dot) | Rebuild as SVG from 3000 px Wix header | **TODO(client): original vector logo** (rebuild ≠ exact brand file) |
| OPAL render | Wix original 1619×971 + catalogue cover | OK (AI-looking, see §0) |
| OPAL bench photo | Wix `freespace_opal.jpeg` 1280×960 | OK, genuine |
| AGATE render | Wix original 1659×948 | OK (AI-looking) |
| DBR / DBR PRO / TA | none | **Placeholder** `media/placeholder-dbr.svg` etc. |
| Linewidth plot 90 ± 3 kHz, Cs MOT image | PDF p.3 crop | Low-res (~430 px); TODO raw data / originals |
| Cancer-cell image, NV cube | PDF p.2/p.4/p.7 crops | p.2 & p.7 crops ~860 px OK |
| Cs SAS spectrum | PDF p.6 crop | Low-res; TODO raw data |
| OPAL validation figures | Wix originals (light-theme infographics) | Re-crop individual plots; TODO raw data for dark-theme SVG |
| Funder logos ×8 | Wix originals (113–800 px PNG) | Some tiny (113×174); TODO SVG logos + usage permission |
| Gallery | none on live site | **TODO(client): lab photos** |
| Team | none | **TODO(client)** |
| Map static image | generate dark-styled static tile | needs Maps Static API key or a hand-drawn SVG location card (no key) |

All rasters → `/public/media` via a `scripts/optimize-images.mjs` (sharp): AVIF + WebP at 384/640/828/1200/1920 widths, ≤ 20 px blur placeholder baked into a manifest.

---

## 8. Catalogue vs live site: discrepancies found so far (PDF wins)

| # | Item | Catalogue (used) | Live site |
|---|---|---|---|
| 1 | OPAL wavelengths | 405, 520, 633, 785, 980 nm (discrete) | OPAL page: "400–1500 nm"; Products page: only 405 nm fibre-coupled and 785 nm free-space |
| 2 | OPAL output power | Up to 100 mW (fibre-coupled) | Fibre-coupled "> 50 mW"; free-space "120 mW" |
| 3 | OPAL tunability | ±1 nm (coarse) | ±3 nm (fibre), ±2 nm (free-space) |
| 4 | OPAL linewidth | < 0.1 pm | 0.08 ± 0.005 pm (consistent, more specific) |
| 5 | OPAL power stability | < 1% over 10+ h | 24 h trace shown, no figure stated |
| 6 | OPAL extra specs (live only) | — | beam Ø "2 ± 0.5 mm²" (*unit error: diameter in mm²*), divergence < 1 mrad, 12 V, 10–40 °C, internal TEC, 120 × 70 × 100 mm³, 1-year warranty, **Class 3B**. Not in PDF, so shown only after client confirms |
| 7 | AGATE tuning | 5 GHz mode-hop-free scan | "Wide tuning range (up to 10 nm)" (not in PDF) |
| 8 | AGATE configs | — | "Fiber coupled & free space options" (not in PDF) |
| 9 | AGATE page | — | `/agate` 404; button unlinked |
| 10 | DBR, DBR PRO, TA | Full spec pages | Absent from live site |
| 11 | Mission | Accessible, cost-effective high-precision lasers | "build large scale quantum computer"; also lists UHV chambers and control electronics as active work |
| 12 | Address | "2nd Floor, Synergy Building, TBIU Complex, IIT, Hauz Khas, Delhi, South Delhi, Delhi, 110016, India" | "…IIT Delhi, Hauz Khas New Delhi, 110016". Using the brief's wording |
| 13 | Name casing | "PRENISHQ" (logo), "Prenishq" (captions) | "PrenishQ", "Prenishq Pvt. Ltd." |
| 14 | Spelling | US ("Fiber", "Polarization") | US. Brief requests UK ("fibre", "polarisation"): **using UK, confirm** |

Content accuracy issues on the live Applications page (to be corrected, not carried over):
- "High-Precision Laser Spectroscopy" text is a copy of the trapped-ion card.
- Neutral-atom card: "ability to operate at room temperature" is misleading (atoms are laser-cooled to µK; only the apparatus runs without cryogenics).
- Clocks card: "Cesium-Rubidium (Cs-Rb) clocks set the global time standard" is wrong. The SI second is defined by the ¹³³Cs hyperfine transition; Rb clocks are secondary standards.
- Trapped-ion card: "Our startup is dedicated to developing scalable, fault-tolerant trapped-ion quantum systems" conflicts with the product positioning; reframed as "our lasers serve…".
- Intro claims "breakthroughs in quantum memory" (unverifiable), so it's removed.

---

## 9. `TODO(client)` items (initial)

1. Vector logo (SVG/AI/PDF) and brand-name casing (PrenishQ vs Prenishq).
2. Real photography of OPAL, AGATE, DBR, DBR PRO, TA (and permission to keep AI renders meanwhile).
3. Confirm OPAL live-only specs (#6 above) and resolve OPAL conflicts #1–#3.
4. AGATE: available centre wavelengths / diodes in stock; coarse tuning range; fibre vs free-space options.
5. DBR / DBR PRO / TA: output power vs wavelength, dimensions, laser class, warranty.
6. Laser safety class per product (only OPAL "3B" known, from the live site).
7. Raw data (CSV) for linewidth, SAS and power-stability plots, so they can be drawn as crisp SVG.
8. Per-product datasheets (PDF). Until then every product links to the full catalogue.
9. Gallery photos (lab, events, team, installations) with captions/credits.
10. Team: names, roles, photos, short bios, LinkedIn.
11. Funder/incubator logos as SVG + permission to display; confirm list (8 on site vs 2 in catalogue).
12. Phone number (form field exists; no company phone published anywhere).
13. Form destination: Formspree account or Resend API key + receiving address per department.
14. Social links (LinkedIn etc.), CIN / legal footer details if desired.
15. Permission and exact credit line for the cancer-cell image (Prof. Sudipta Maiti, BITS Pilani Hyderabad).
16. Production domain + host choice (Vercel vs Cloudflare Pages).
