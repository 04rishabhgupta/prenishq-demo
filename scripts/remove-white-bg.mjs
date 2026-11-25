// Makes the white background of a logo transparent: flood-fills near-white pixels connected
// to the image border (white inside the emblem is kept), then un-mattes against white so
// anti-aliased edges blend cleanly on any background.
// Usage: node scripts/remove-white-bg.mjs <in> <out.png> [--all]
//   --all  also clear enclosed white areas (for logos with no meaningful white inside)
import sharp from "sharp";

const [input, output, flag] = process.argv.slice(2);
const all = flag === "--all";
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const LO = 200; // channel floor treated as "background-ish"
const minC = (i) => Math.min(data[i], data[i + 1], data[i + 2]);

const seen = new Uint8Array(w * h);
const stack = [];
for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
while (stack.length) {
  const p = stack.pop();
  if (seen[p]) continue;
  const i = p * 4;
  if (data[i + 3] < 10 || minC(i) < LO) continue;
  seen[p] = 1;
  const x = p % w, y = (p / w) | 0;
  if (x > 0) stack.push(p - 1);
  if (x < w - 1) stack.push(p + 1);
  if (y > 0) stack.push(p - w);
  if (y < h - 1) stack.push(p + w);
}

if (all) for (let p = 0; p < w * h; p++) if (data[p * 4 + 3] >= 10 && minC(p * 4) >= LO) seen[p] = 1;

for (let p = 0; p < w * h; p++) {
  if (!seen[p]) continue;
  const i = p * 4;
  const a = Math.min(1, Math.max(0, (255 - minC(i)) / (255 - LO))); // 255 → 0, LO → 1
  if (a < 0.02) {
    data[i + 3] = 0;
    continue;
  }
  for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, Math.round((data[i + c] - (1 - a) * 255) / a)));
  data[i + 3] = Math.round(a * 255);
}
await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toFile(output);
console.log(`${output}: ${w}x${h}`);
