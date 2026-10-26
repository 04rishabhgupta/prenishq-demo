// Effects layer, loaded after idle by components/motion/fx-boot.tsx (DECISIONS D-34).
// Every effect is progressive: the server-rendered page is complete without it.
import { PALETTE, PRESETS } from "@/data/wavelengths";

type Cleanup = () => void;

const BANDS: Record<number, string> = { 405: "Violet", 520: "Green", 633: "Red", 785: "Near-infrared (false colour)", 980: "Near-infrared (false colour)" };

export function init(): Cleanup {
  const cleanups: Cleanup[] = [];
  const finePointer = matchMedia("(pointer: fine)").matches;
  const desktop = matchMedia("(min-width: 1024px)").matches;

  cleanups.push(pauseOffscreenLoops());
  if (finePointer) cleanups.push(pointerEffects());
  cleanups.push(...lasers(desktop && finePointer));
  if (desktop) cleanups.push(story());

  return () => cleanups.forEach((c) => c());
}

/** CSS loops marked [data-loop] only run while on screen. */
function pauseOffscreenLoops(): Cleanup {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) e.target.toggleAttribute("data-playing", e.isIntersecting);
  });
  document.querySelectorAll("[data-loop]").forEach((el) => io.observe(el));
  return () => io.disconnect();
}

/**
 * One passive pointermove listener, rAF-throttled, drives:
 *  - ReactBits SpotlightCard: --mx/--my on the hovered .glow-card
 *  - ReactBits TiltedCard: --rx/--ry on [data-tilt]
 *  - ReactBits Magnet: Motion springs (WAAPI, off main thread) on [data-magnet]
 */
function pointerEffects(): Cleanup {
  let raf = 0;
  let ev: PointerEvent | null = null;
  let tilted: HTMLElement | null = null;
  const magnets = [...document.querySelectorAll<HTMLElement>("[data-magnet]")];
  const pulled = new Set<HTMLElement>();
  let animate: typeof import("motion/mini").animate | null = null;
  let spring: typeof import("motion").spring | null = null;
  if (magnets.length)
    Promise.all([import("motion/mini"), import("motion")]).then(([mini, full]) => {
      animate = mini.animate;
      spring = full.spring;
    });

  const move = (el: HTMLElement, x: number, y: number) => {
    if (!animate || !spring) return;
    animate(el, { transform: `translate(${x}px, ${y}px)` }, { type: spring, stiffness: 260, damping: 18, mass: 0.6 });
  };

  const tick = () => {
    raf = 0;
    const e = ev;
    if (!e) return;
    const target = e.target as Element | null;

    const card = target?.closest?.<HTMLElement>(".glow-card");
    if (card) {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }

    const tilt = target?.closest?.<HTMLElement>("[data-tilt]") ?? null;
    if (tilted && tilted !== tilt) {
      tilted.style.removeProperty("--rx");
      tilted.style.removeProperty("--ry");
    }
    tilted = tilt;
    if (tilt) {
      const r = tilt.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.setProperty("--rx", `${(-py * 7).toFixed(2)}deg`);
      tilt.style.setProperty("--ry", `${(px * 9).toFixed(2)}deg`);
    }

    for (const m of magnets) {
      const r = m.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const near = Math.abs(dx) < r.width / 2 + 40 && Math.abs(dy) < r.height / 2 + 40;
      if (near) {
        pulled.add(m);
        move(m, dx * 0.22, dy * 0.3);
      } else if (pulled.has(m)) {
        pulled.delete(m);
        move(m, 0, 0);
      }
    }
  };
  const onMove = (e: PointerEvent) => {
    ev = e;
    if (!raf) raf = requestAnimationFrame(tick);
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  return () => {
    window.removeEventListener("pointermove", onMove);
    cancelAnimationFrame(raf);
  };
}

/**
 * [data-laser-scope]: on capable desktops, mounts the WebGL LaserFlow beam (one per page)
 * onto its [data-laser-surface]. With [data-wl-cycle] it also cycles OPAL's five wavelengths
 * (label scramble = ReactBits DecryptedText); otherwise it uses [data-laser-color].
 */
function lasers(webgl: boolean): Cleanup[] {
  const hero = document.querySelector<HTMLElement>("[data-laser-scope]");
  if (!hero) return [];
  const cycling = hero.hasAttribute("data-wl-cycle");
  const fixedColor = hero.dataset.laserColor;
  const label = hero.querySelector<HTMLElement>("[data-wl-label]");
  const band = hero.querySelector<HTMLElement>("[data-wl-band]");
  const out: Cleanup[] = [];
  let laser: import("./laserflow").LaserFlowHandle | null = null;
  let i = 0;
  let scramble = 0;

  const show = (nm: number) => {
    const color = PALETTE[nm as keyof typeof PALETTE].color;
    hero.style.setProperty("--beam", color);
    laser?.setColor(color);
    if (band) band.textContent = BANDS[nm];
    if (label) {
      const target = String(nm);
      let n = 0;
      clearInterval(scramble);
      scramble = window.setInterval(() => {
        n++;
        label.textContent = [...target].map((ch, k) => (k < n - 3 ? ch : String((Math.random() * 10) | 0))).join("");
        if (n > target.length + 3) {
          clearInterval(scramble);
          label.textContent = target;
        }
      }, 45);
    }
  };
  if (cycling) {
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      i = (i + 1) % PRESETS.length;
      show(PRESETS[i]);
    }, 4200);
    out.push(() => {
      clearInterval(timer);
      clearInterval(scramble);
    });
  }

  const stage = hero.querySelector<HTMLElement>("[data-laserflow]");
  const surface = hero.querySelector<HTMLElement>("[data-laser-surface]");
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (webgl && stage && surface && deviceMemory >= 4) {
    let alive = true;
    import("./laserflow").then(({ mountLaserFlow }) => {
      if (!alive) return;
      laser = mountLaserFlow(stage, surface, {
        color: fixedColor ?? PALETTE[PRESETS[i]].color,
        onReady: () => hero.setAttribute("data-webgl", "on"),
        onFail: () => {
          hero.removeAttribute("data-webgl");
          laser = null;
        },
      });
    });
    out.push(() => {
      alive = false;
      laser?.destroy();
      hero.removeAttribute("data-webgl");
    });
  }
  return out;
}

/** Story: GSAP ScrollTrigger, imported only when the section is about to enter the viewport. */
function story(): Cleanup {
  const el = document.querySelector<HTMLElement>("[data-story]");
  if (!el) return () => {};
  let dispose: Cleanup | undefined;
  let alive = true;
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      import("./story").then((m) => {
        if (alive) dispose = m.mountStory(el);
      });
    },
    { rootMargin: "100% 0px" },
  );
  io.observe(el);
  return () => {
    alive = false;
    io.disconnect();
    dispose?.();
  };
}
