// First-load JS per exported route (gzip), as the browser will fetch it from the HTML.
// Run after `next build`: node scripts/bundle-report.mjs [--json]
import { readFile, readdir } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";

const OUT = "out";
const BUDGET_KB = 150;

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "_next") yield* htmlFiles(p);
    } else if (e.name.endsWith(".html")) yield p;
  }
}

const gz = (buf) => gzipSync(buf, { level: 9 }).length;
const kb = (n) => (n / 1024).toFixed(1);
const cache = new Map();

const rows = [];
for await (const file of htmlFiles(OUT)) {
  const html = await readFile(file, "utf8");
  const srcs = [...new Set([...html.matchAll(/<script(?![^>]*noModule)[^>]+src="([^"]+\.js)"/g)].map((m) => m[1]))];
  let js = 0;
  for (const s of srcs) {
    if (!cache.has(s)) cache.set(s, gz(await readFile(path.join(OUT, s.split("?")[0]))));
    js += cache.get(s);
  }
  const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].reduce((n, m) => n + m[1].length, 0);
  const route = "/" + path.relative(OUT, file).replace(/index\.html$|\.html$/, "").replace(/\/$/, "");
  rows.push({ route, chunks: srcs.length, js, html: gz(html), cssRaw: css });
}

rows.sort((a, b) => a.route.localeCompare(b.route));
if (process.argv.includes("--json")) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  console.log("route".padEnd(28), "chunks", "  JS gz", " HTML gz", " inline CSS raw");
  for (const r of rows) {
    const flag = r.js / 1024 > BUDGET_KB ? "  ✗ over budget" : "";
    console.log(r.route.padEnd(28), String(r.chunks).padStart(6), `${kb(r.js)} KB`.padStart(9), `${kb(r.html)} KB`.padStart(9), `${kb(r.cssRaw)} KB`.padStart(10), flag);
  }
}
