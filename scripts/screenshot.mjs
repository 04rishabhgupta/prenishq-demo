// QA screenshots: scrolls the page so in-view reveals fire, then captures full page.
// Usage: node scripts/screenshot.mjs <url> <outfile> [width=1440] [height=900]
import puppeteer from "puppeteer-core";

const [url, out, w = "1440", h = "900"] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1, isMobile: +w < 600, hasTouch: +w < 600 });
await page.goto(url, { waitUntil: "networkidle0" });
// Full-page capture can't paint content-visibility:auto sections off-screen; QA-only override.
await page.addStyleTag({ content: ".cv-auto{content-visibility:visible!important}.reveal{opacity:1!important;transform:none!important}" });
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
    scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 900));
});
await page.screenshot({ path: out, fullPage: true });
// Also save viewport-height slices for detail review: out-0.png, out-1.png, ...
const total = await page.evaluate(() => document.body.scrollHeight);
const slice = Number(process.env.SLICE ?? 0);
for (let i = 0, y = 0; slice && y < total; i++, y += slice) {
  await page.screenshot({ path: out.replace(/\.png$/, `-${i}.png`), clip: { x: 0, y, width: +w, height: Math.min(slice, total - y) }, captureBeyondViewport: true });
}
const real = errors.filter((e) => !e.includes("404"));
if (real.length) console.log("page errors:\n" + real.join("\n"));
await browser.close();
