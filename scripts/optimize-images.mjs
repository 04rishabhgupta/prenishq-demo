// Generates AVIF + WebP variants and a manifest with intrinsic sizes and blur placeholders.
// Run: pnpm media   (outputs are committed so builds don't need the sources)
import sharp from "sharp";
import { mkdir, writeFile, stat } from "node:fs/promises";
import { media, logos, WIDTHS, LOGO_WIDTHS } from "./media.config.mjs";

const OUT = "public/media";
await mkdir(OUT, { recursive: true });

const manifest = {};

async function build(entry, widths, quality) {
  let base = sharp(entry.src).rotate();
  if (entry.crop) {
    const [left, top, width, height] = entry.crop;
    base = base.extract({ left, top, width, height });
  }
  const buf = await base.toBuffer();
  const { width, height } = await sharp(buf).metadata();
  const targets = widths.filter((w) => w < width);
  if (!targets.length || targets.at(-1) < width) targets.push(width);

  for (const w of targets) {
    const r = sharp(buf).resize({ width: w });
    await r.clone().avif({ quality: quality.avif, effort: 6 }).toFile(`${OUT}/${entry.name}-${w}.avif`);
    await r.clone().webp({ quality: quality.webp, effort: 6 }).toFile(`${OUT}/${entry.name}-${w}.webp`);
  }
  const blur = await sharp(buf).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  manifest[entry.name] = {
    width,
    height,
    widths: targets,
    blur: `data:image/webp;base64,${blur.toString("base64")}`,
  };
  const s = await stat(`${OUT}/${entry.name}-${targets.at(-1)}.avif`);
  console.log(`${entry.name.padEnd(28)} ${width}×${height}  ${targets.join("/")}  max avif ${(s.size / 1024).toFixed(0)} KB`);
}

for (const m of media) await build(m, WIDTHS, { avif: 55, webp: 72 });
for (const l of logos) await build(l, LOGO_WIDTHS, { avif: 70, webp: 85 });

await writeFile("data/media.generated.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${Object.keys(manifest).length} images → ${OUT}, manifest → data/media.generated.json`);
