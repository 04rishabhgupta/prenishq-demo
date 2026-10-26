// Renders the story scene components (components/home/story-scenes.tsx) to static SVG files in
// public/story/ so they stay out of the HTML/RSC payload. Runs automatically before `next build`.
import { build } from "esbuild";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const tmp = path.resolve(".story-build.mjs");
await build({
  stdin: {
    contents: `
      import { createElement } from "react";
      import { renderToStaticMarkup } from "react-dom/server";
      import { SCENES } from "@/components/home/story-scenes";
      import { PALETTE } from "@/data/wavelengths";
      const ACCENT = { emit: PALETTE[405].color, narrow: PALETTE[520].color, lock: PALETTE[785].color, amplify: PALETTE[633].color, cool: PALETTE[405].color };
      export const files = Object.entries(SCENES).map(([key, s]) => [key,
        renderToStaticMarkup(createElement(s.Scene)).replace("<svg ", '<svg style="--accent:' + ACCENT[key] + '" ')]);
    `,
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  bundle: true,
  platform: "node",
  format: "esm",
  jsx: "automatic",
  alias: { "@": process.cwd() },
  external: ["react", "react-dom"],
  outfile: tmp,
  logLevel: "error",
});
const { files } = await import(pathToFileURL(tmp).href);
await rm(tmp);
await mkdir("public/story", { recursive: true });
for (const [key, svg] of files) {
  await writeFile(`public/story/${key}.svg`, `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`);
  console.log(`public/story/${key}.svg  ${(svg.length / 1024).toFixed(1)} KB`);
}
