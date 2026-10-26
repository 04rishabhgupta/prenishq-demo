// QA for the effects layer in real (GPU) Chrome: hero laser, story, hover effects.
// Usage: node scripts/fx-check.mjs <outdir>
import puppeteer from "puppeteer-core";
const out = process.argv[2] ?? ".";
const b = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: false,
  args: ["--window-size=1440,960", "--ignore-gpu-blocklist"],
  defaultViewport: { width: 1440, height: 900 },
});
const p = await b.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push(String(e)));
p.on("console", (m) => m.type() === "error" && !m.text().includes("404") && errs.push(m.text()));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await p.goto("http://localhost:4321/", { waitUntil: "networkidle0" });
await p.mouse.move(1000, 300);
await wait(3500);
const gl = await p.evaluate(() => ({
  webgl: document.querySelector("[data-hero]")?.getAttribute("data-webgl"),
  tier: document.querySelector("[data-laserflow]")?.dataset.lfTier ?? "0",
  renderer: (() => { const c = document.createElement("canvas").getContext("webgl2"); const d = c?.getExtension("WEBGL_debug_renderer_info"); return d ? c.getParameter(d.UNMASKED_RENDERER_WEBGL) : "?"; })(),
}));
await p.screenshot({ path: `${out}/fx-hero.png`, captureBeyondViewport: false });
await wait(4300);
await p.screenshot({ path: `${out}/fx-hero2.png`, captureBeyondViewport: false });
// frame pacing over 3 s on the hero
const fps = await p.evaluate(() => new Promise((res) => { const t = []; let s = performance.now(); const f = (n) => { t.push(n); if (n - s < 3000) requestAnimationFrame(f); else { const d = t.slice(1).map((x, i) => x - t[i]).sort((a, b) => a - b); res({ frames: t.length, median: d[d.length >> 1].toFixed(1), p95: d[Math.floor(d.length * 0.95)].toFixed(1) }); } }; requestAnimationFrame(f); }));
// story
await p.evaluate(() => document.querySelector('[data-step="lock"]').scrollIntoView({ block: "center" }));
await wait(1200);
const story = await p.evaluate(() => ({ live: document.querySelector("[data-story]")?.hasAttribute("data-story-live"), active: document.querySelector("[data-scene][data-active]")?.getAttribute("data-scene") }));
await p.screenshot({ path: `${out}/fx-story.png`, captureBeyondViewport: false });
// bento hover
await p.evaluate(() => document.querySelector("#products-title").scrollIntoView({ block: "start" }));
await wait(800);
const card = await p.$(".glow-card [data-tilt]");
const box = await card.boundingBox();
await p.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.3);
await wait(600);
await p.screenshot({ path: `${out}/fx-bento.png`, captureBeyondViewport: false });
console.log(JSON.stringify({ gl, fps, story, errs }, null, 1));
await b.close();
