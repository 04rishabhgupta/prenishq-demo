# prenishq.com

Marketing site for PrenishQ, an IIT Delhi spin-off making precision diode lasers. It's a fully static Next.js 16 App Router site (`output: 'export'`) with TypeScript and Tailwind CSS 4. Product and application pages render from typed data files.

- **Plan & sitemap:** [PLAN.md](PLAN.md)
- **Library choices, bundle costs, build decisions:** [DECISIONS.md](DECISIONS.md)
- **Source material:** [`reference/`](reference/) (catalogue PDF = source of truth for specs, old-site screenshots)

## Run

Requires Node 20+ and pnpm.

```bash
pnpm install
pnpm dev                  # http://localhost:3000
pnpm build                # static site → out/
pnpm start                # serve out/ on http://localhost:4321 (brotli, clean URLs)
pnpm lint
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_FORM_ENDPOINT` to enable the enquiry and quote forms. Without it, the form tells visitors to email info@prenishq.com.

## Site structure

Five main pages, each answering one visitor question:

| Page | Answers | Sections |
|---|---|---|
| **Home** `/` | Who are you and why should I care? | Hero · backers · key numbers · products · applications · how it works · lab proof · why us · CTA |
| **Products** `/products` | What can I buy? | All products (filter, compare) · Find your laser · Suggested systems · Downloads; product pages `/products/[slug]` |
| **Technology** `/technology` | How does it work and what is it for? | How it works (scroll story) · Applications (detail pages `/technology/[slug]`) · Lab results · Roadmap · Glossary |
| **About** `/about` | Can I trust you? | Story · Mission · What we build · Inside the lab · Education · Backers |
| **Contact** `/contact` | How do I reach you? | Enquiry · departments · FAQ · map |

`/privacy` is linked from the footer and the enquiry form. Retired URLs (`/applications`, `/resources`, `/gallery`, old Wix paths) 301 to their new homes via `public/_redirects` and `vercel.json`.

## Editing content

| What | Where |
|---|---|
| Products, specs, figures | `data/products.ts`. Copy specs **exactly from the catalogue**. Live-site-only values go in `pending` and are not rendered. |
| Application fields (Technology → Applications and `/technology/[slug]`) | `data/applications.ts` |
| Company info, emails, address, funders, mission, "why us" | `data/site.ts` |
| Lab gallery (About → Inside the lab) | `data/gallery.ts` |
| Wavelength colours, atomic lines | `data/wavelengths.ts` |
| Product benefits, wavelength availability, downloads, "works with", product FAQ, models, publications; suggested systems | `data/product-extras.ts` |
| Site FAQ, glossary, technology status; testimonials, labs, publications, app notes, events, news, team, milestones | `data/content.ts` |

Every page, the sitemap, JSON-LD and the OG images render from these files. Search for `TODO(client)` to find open content questions.

**Client-supplied lists are hidden while empty.** Testimonials, "used in" labs, publications, application notes, events, news, team, milestones and product models render nothing until their arrays in `data/content.ts` / `data/product-extras.ts` have entries. Fill an array and the section appears; no layout work needed.

## Images

Source images live in `assets-src/` (Wix originals and crops from the catalogue PDF). To add or replace one:

1. Put the file in `assets-src/`.
2. Add an entry (name, source, optional crop) to `scripts/media.config.mjs`.
3. Run `pnpm media`. This writes AVIF + WebP at 384–1920 w to `public/media/` and updates `data/media.generated.json` (sizes and blur placeholders).
4. Use it with `<Picture name="…" alt="…" sizes="…" />` (`components/media/picture.tsx`). The `name` is type-checked against the manifest.

Commit the generated files so builds don't need `sharp` or the sources.

## QA

```bash
pnpm build && pnpm start            # in one terminal
pnpm report:bundle                  # first-load JS per route (budget: 150 KB gz)
pnpm report:lighthouse              # mobile Lighthouse, median of 3 runs
LH_THROTTLE=devtools pnpm report:lighthouse   # applied throttling instead of simulation
pnpm check:interactions             # quote dialog, validation, explorer keys, mobile nav
node scripts/fx-check.mjs .         # real-GPU Chrome: WebGL tier, frame pacing, story, hover (writes screenshots)
node scripts/scroll-jank.mjs http://localhost:4321/ 1440 900          # frame stats while scrolling the whole page
CPU=4 node scripts/scroll-jank.mjs http://localhost:4321/ 390 844     # …with CPU throttling
ARGS="--disable-gpu --use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader" node scripts/scroll-jank.mjs   # no-GPU path
node scripts/screenshot.mjs http://localhost:4321/products shot.png 390 844
```

Lighthouse and the screenshot script use the local Google Chrome install (macOS path in the scripts; adjust for other OSes).

## Effects layer

Visual effects (WebGL laser beam, GSAP sticky story, spotlight/tilt/magnet, beams) live in `lib/fx/` and load after idle via `components/motion/fx-boot.tsx`. They attach to server-rendered markup through data attributes (`data-laser-scope`, `data-story`, `data-magnet`, `data-tilt`, `data-loop`), so pages work fully without them. See DECISIONS D-34 for gating and measurements. The story diagrams are generated to `public/story/*.svg` by `scripts/build-story-svgs.mjs`, which runs automatically before `pnpm build`.

## Deploy

The output is plain static files in `out/`.

### Cloudflare Pages (recommended)

1. Connect the repo. Use these settings:
   - **Build command:** `pnpm build`
   - **Output directory:** `out`
   - **Environment variable:** `NODE_VERSION=20`
2. Set `NEXT_PUBLIC_FORM_ENDPOINT`. Use a Formspree URL, or `/api/enquiry` to send through Resend via `functions/api/enquiry.ts`. The Resend route also needs `RESEND_API_KEY`, `ENQUIRY_TO` and `ENQUIRY_FROM` as Pages variables.
3. `public/_redirects` (301s from the old Wix URLs) and `public/_headers` (immutable caching, PNG type for OG images) apply automatically.

### Vercel

1. Import the repo. The framework preset is Next.js and the output is detected as `out`.
2. `vercel.json` provides clean URLs, the old-URL redirects and headers.
3. Use Formspree for the form. The Resend function in `functions/` is Cloudflare-specific.

### Domain cut-over

Point `www.prenishq.com` at the new host. The old Wix paths (`/products-1`, `/about-1`, `/events-news`, `/contact-us`, `/opal`) 301 to the new URLs. After launch, submit `https://www.prenishq.com/sitemap.xml` in Google Search Console.

## Structure

```
app/                  routes (all static); opengraph-image.tsx, sitemap.ts, robots.ts
components/
  brand/              logo (SVG symbol), dot-matrix loader
  home/               home sections; wavelength-explorer is the main client island
  products/           cards, coverage bar, catalogue (filters + compare), placeholder renders
  applications/       SVG schematics
  forms/ quote/       enquiry form (lazy), global quote dialog
  ui/                 button (shadcn API), section, page hero
data/                 single source of truth (see above)
lib/                  seo (metadata + JSON-LD), image loader, og, enquiry submit
functions/api/        optional Cloudflare Pages Function for Resend
scripts/              image pipeline, bundle report, Lighthouse, screenshots, interaction check
```
