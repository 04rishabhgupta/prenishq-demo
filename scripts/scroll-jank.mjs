// Scrolls a page top→bottom at ~24 px/frame in real (GPU) Chrome with all effects live and
// reports frame-interval stats. Usage: node scripts/scroll-jank.mjs [url] [width] [height]
import puppeteer from "puppeteer-core";
const [url = "http://localhost:4321/", w = "1440", h = "900"] = process.argv.slice(2);
const mobile = +w < 600;
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: false, args: [`--window-size=${+w},${+h + 60}`, ...(process.env.ARGS ? process.env.ARGS.split(" ") : [])], defaultViewport: { width: +w, height: +h, isMobile: mobile, hasTouch: mobile } });
const p = await b.newPage();
if (process.env.CPU) { const c = await p.createCDPSession(); await c.send("Emulation.setCPUThrottlingRate", { rate: +process.env.CPU }); }
if (process.env.REDUCED) await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await p.goto(url, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 3500)); // let fx boot, laser intro finish
const r = await p.evaluate(() => new Promise((res) => {
  const d = []; const slow = []; let last = 0;
  const step = (now) => {
    if (last) { d.push(now - last); if (now - last > 33.4) slow.push(`${Math.round(now - last)}ms@y=${Math.round(scrollY)}`); }
    last = now;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (scrollY >= max - 1 || d.length > 4000) {
      const s = [...d].sort((a, b) => a - b);
      res({ frames: d.length, median: +s[s.length >> 1].toFixed(1), p95: +s[Math.floor(s.length * 0.95)].toFixed(1), p99: +s[Math.floor(s.length * 0.99)].toFixed(1), over33ms: d.filter((x) => x > 33.4).length, over50ms: d.filter((x) => x > 50).length, slow: slow.slice(0, 8), webgl: document.querySelector("[data-laser-scope]")?.getAttribute("data-webgl") ?? null, tier: document.querySelector("[data-laserflow]")?.dataset.lfTier ?? "0" });
      return;
    }
    scrollBy({ top: 24, behavior: "instant" }); // bypass html{scroll-behavior:smooth}
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}));
console.log(url, `${w}x${h}`, process.env.CPU ? `cpu×${process.env.CPU}` : "", JSON.stringify(r));
await b.close();
