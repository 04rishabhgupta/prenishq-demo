// Mobile Lighthouse (default simulated slow-4G + 4× CPU), median of N runs per route.
// Usage: node scripts/lighthouse.mjs [baseUrl] [route ...]   (serve `out/` first: pnpm serve:out)
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, mkdir } from "node:fs/promises";

const run = promisify(execFile);
const [base = "http://localhost:4321", ...routesArg] = process.argv.slice(2);
const routes = routesArg.length ? routesArg : ["/"];
const RUNS = Number(process.env.LH_RUNS ?? 3);
const OUT = "reports/lighthouse";
await mkdir(OUT, { recursive: true });

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

for (const route of routes) {
  const results = [];
  for (let i = 0; i < RUNS; i++) {
    const file = `${OUT}/${route.replace(/\W+/g, "_") || "home"}${process.env.LH_PRESET === "desktop" ? "-desktop" : ""}-${i}.json`;
    await run(
      "npx",
      [
        "lighthouse",
        base + route,
        "--quiet",
        "--output=json",
        `--output-path=${file}`,
        "--only-categories=performance,accessibility,best-practices,seo",
        "--chrome-flags=--headless=new --no-sandbox",
        // LH_THROTTLE=devtools applies real throttling instead of Lantern simulation.
        ...(process.env.LH_THROTTLE === "devtools" ? ["--throttling-method=devtools"] : []),
        // LH_PRESET=desktop runs the desktop preset (WebGL hero + GSAP story are desktop-only).
        ...(process.env.LH_PRESET === "desktop" ? ["--preset=desktop"] : []),
      ],
      { maxBuffer: 64 * 1024 * 1024 },
    );
    const r = JSON.parse(await readFile(file, "utf8"));
    const a = r.audits;
    results.push({
      perf: r.categories.performance.score * 100,
      a11y: r.categories.accessibility.score * 100,
      bp: r.categories["best-practices"].score * 100,
      seo: r.categories.seo.score * 100,
      fcp: a["first-contentful-paint"].numericValue,
      lcp: a["largest-contentful-paint"].numericValue,
      tbt: a["total-blocking-time"].numericValue,
      cls: a["cumulative-layout-shift"].numericValue,
      si: a["speed-index"].numericValue,
      lcpEl: a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet ?? "",
      failing: Object.values(a)
        .filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== "informative" && x.scoreDisplayMode !== "notApplicable" && x.scoreDisplayMode !== "manual")
        .map((x) => x.id),
    });
  }
  const m = (k) => median(results.map((x) => x[k]));
  console.log(
    `${route.padEnd(22)} perf ${m("perf")}  a11y ${m("a11y")}  bp ${m("bp")}  seo ${m("seo")} | ` +
      `FCP ${(m("fcp") / 1000).toFixed(2)}s  LCP ${(m("lcp") / 1000).toFixed(2)}s  TBT ${Math.round(m("tbt"))}ms  CLS ${m("cls").toFixed(3)}  SI ${(m("si") / 1000).toFixed(2)}s`,
  );
  console.log(`  LCP element: ${results[0].lcpEl.slice(0, 140)}`);
  const fails = [...new Set(results.flatMap((r) => r.failing))];
  if (fails.length) console.log(`  audits < 0.9: ${fails.join(", ")}`);
}
