import puppeteer from "puppeteer-core";
const S = process.argv[2];
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 860 });
const errs = []; p.on("pageerror", e => errs.push(String(e))); p.on("console", m => m.type() === "error" && !m.text().includes("404") && errs.push(m.text()));
const wait = (ms) => new Promise(r => setTimeout(r, ms));
await p.goto("http://localhost:4321/", { waitUntil: "networkidle0" });
// 1. Quote dialog from header, submit empty → validation errors
await p.click("header [data-quote]"); await wait(800);
const open = await p.$eval("dialog.quote-dialog", d => d.open);
await p.click("dialog.quote-dialog button[type=submit]"); await wait(300);
const errors = await p.$$eval("dialog.quote-dialog [aria-invalid=true]", els => els.map(e => e.name));
const focused = await p.evaluate(() => document.activeElement?.closest("dialog") ? "inside dialog" : "outside");
await p.screenshot({ path: `${S}/quote.png` });
await p.keyboard.press("Escape"); await wait(200);
const closed = await p.$eval("dialog.quote-dialog", d => !d.open);
console.log({ dialogOpened: open, invalidFields: errors, focus: focused, escCloses: closed });
// 2. Explorer keyboard (on /products#find, lazy-loaded)
await p.goto("http://localhost:4321/products#find", { waitUntil: "networkidle0" });
await p.waitForSelector('[role="slider"]', { timeout: 10000 });
await p.focus('[role="slider"]'); const before = await p.$eval('[role="slider"]', e => e.getAttribute("aria-valuenow"));
await p.keyboard.down("Shift"); await p.keyboard.press("ArrowRight"); await p.keyboard.up("Shift"); await p.keyboard.press("ArrowRight"); await wait(100);
const after = await p.$eval('[role="slider"]', e => e.getAttribute("aria-valuenow"));
await p.click('#find button[aria-pressed]:not([aria-pressed="true"])'); await wait(100);
console.log({ sliderBefore: before, sliderAfterShiftRightPlusRight: after });
// 3. Product page prefill
await p.goto("http://localhost:4321/products/agate", { waitUntil: "networkidle0" });
await p.click("main [data-quote-product]"); await wait(900);
const prod = await p.$eval("dialog.quote-dialog select", s => s.value);
const title = await p.$eval("#quote-title", e => e.textContent);
console.log({ prefilledProduct: prod, title });
// 4. Mobile nav
await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await p.goto("http://localhost:4321/", { waitUntil: "networkidle0" });
await p.click('button[aria-label="Open menu"]'); await wait(300);
const navOpen = await p.$eval('dialog[aria-label="Site menu"]', d => d.open);
await p.screenshot({ path: `${S}/mnav.png` });
await p.keyboard.press("Tab"); const inNav = await p.evaluate(() => !!document.activeElement?.closest('dialog[aria-label="Site menu"]'));
console.log({ mobileNavOpen: navOpen, focusTrapped: inNav, pageErrors: errs });
await b.close();
