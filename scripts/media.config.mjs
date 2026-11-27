// Source → published media map. Sources live in assets-src/ (not shipped).
// crop: [left, top, width, height] in source pixels.
const wix = (id, ext = "png") => `assets-src/wix/a197d0_${id}~mv2.${ext}`;

export const WIDTHS = [384, 640, 828, 1200, 1920];
export const LOGO_WIDTHS = [160, 320];

export const media = [
  // Product renders (live site originals; AI-looking, TODO(client): real photography)
  { name: "opal-fibre", src: wix("0d32bca1393f453da542150c1ae94e1d") },
  { name: "opal-fibre-alt", src: wix("6182578233f84d39890f97226993884b") },
  { name: "opal-free-space", src: wix("abc3d31f8add4550967d96fbe6ed4b40") },
  { name: "agate", src: wix("94abf2a81d2c49208f94eb5818e57be1") },
  // Hero video poster (first frame of public/video/hero-lab.*; see assets-src/video/README.md)
  { name: "hero-lab-poster", src: "assets-src/video/hero-lab-poster.png" },
  // Genuine bench photo
  { name: "opal-bench-photo", src: wix("a230be94b5744ba99bbbbc544aa9ccb1", "jpeg") },
  // OPAL validation figures (live site)
  { name: "opal-validation-785", src: wix("1faef72db6ae4d15be30a5ec741ddd14") },
  { name: "opal-validation-405", src: wix("77c31e05c7c64c3199878f266dd65dfd") },
  { name: "opal-linewidth-stability", src: wix("ce51f96218f84978a8415b844e682a48") },
  // Catalogue figures (cropped from flattened PDF pages, watermark trimmed)
  { name: "agate-linewidth-plot", src: "assets-src/pdf/page3.jpeg", crop: [45, 957, 505, 298] },
  { name: "cs-mot-fluorescence", src: "assets-src/pdf/page3.jpeg", crop: [572, 961, 438, 293] },
  { name: "cancer-cell-405", src: "assets-src/pdf/page2.jpeg", crop: [68, 62, 922, 572] },
  { name: "nv-diamond-fluorescence", src: "assets-src/pdf/page7.jpeg", crop: [0, 64, 1055, 644] },
  { name: "dbrpro-cs-sas", src: "assets-src/pdf/page6.jpeg", crop: [36, 1160, 1170, 500] },
];

// Team portraits (client-supplied; square crops for the circular frame on About → Team).
// TODO(client): higher-resolution originals (≥ 600 px) would render sharper on retina screens.
export const team = [
  { name: "team-suranita-kanjilal", src: "assets-src/team/suranita-kanjilal.png", crop: [0, 0, 360, 360] },
  { name: "team-bodhaditya-santra", src: "assets-src/team/bodhaditya-santra.jpg" },
];

export const logos = [
  { name: "logo-iit-delhi", src: wix("0e615c059eac48db99563789b8de1af6") },
  { name: "logo-fitt", src: wix("f1749ef046484ab6a61d0ccc544ee454") },
  { name: "logo-nm-icps", src: wix("7790f023a9d54335874d181473f070c7") },
  { name: "logo-ihub-qtf", src: wix("0ed693c77c5044b69a944e5b4fe6fc2b") },
  { name: "logo-dst-nidhi-prayas", src: wix("ac68d4a463c84ab9a7bb225148ab3db5") },
  { name: "logo-kiet", src: wix("001b7f125e3d4e75827e1ddcf860ea94") },
  { name: "logo-nqm", src: "assets-src/logos/nqm.png" }, // white removed: scripts/remove-white-bg.mjs … --all
  { name: "logo-bits-biocytih", src: "assets-src/logos/bits-biocytih.png" }, // white background removed
];
