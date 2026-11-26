/*
 * Vanilla (no React, no three.js) port of ReactBits "LaserFlow" (https://reactbits.dev).
 * Copyright (c) 2026 David Haz. MIT + Commons Clause License Condition v1.0.
 *
 * Changes from the original, all for "never lag":
 *  - non-blocking shader compile (KHR_parallel_shader_compile, polled per frame)
 *  - render scale capped at 1× CSS px and adapted down from measured frame times;
 *    gives up (calls onFail) if the GPU can't hold ~40 fps even at the lowest tier
 *  - stops when off-screen / tab hidden; smooth colour transitions via setColor()
 *  - frame rate capped near 100 fps (120 Hz+ screens draw every other vsync)
 *  - pointer lens only with a fine pointer (`interactive`), so touch scrolling never bends the beam
 *  - reveal-image feature removed
 */
import { FRAGMENT, TINTS, VERTEX } from "./laserflow-shader";

type Options = {
  color: string;
  beamWidth?: number;
  flare?: number;
  spread?: number;
  intensity?: number;
  fog?: number;
  dust?: number;
  streaks?: number;
  dots?: number;
  pulse?: number;
  speed?: number;
  /** Pointer lens effect (mouse only). Default true. */
  interactive?: boolean;
  onReady?: () => void;
  onFail?: () => void;
};

const BASE_SATURATION = 0.78;
const INTRO_DROP = 1.25;
const INTRO_END = 5;
const TIERS = [
  { scale: 1, fog: 1 },
  { scale: 0.75, fog: 1 },
  { scale: 0.6, fog: 0 },
  { scale: 0.5, fog: 0 },
];
const SLOW_MS = 21; // p90 frame interval above this (< ~48 fps) → step down a tier
const WINDOW = 30; // frames per decision
const MIN_FRAME_MS = 9.5; // ~100 fps cap: 60/90 Hz draw every vsync, 120/144 Hz every other one

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
const spring = (t: number) => {
  const w = 8;
  const z = 0.62;
  const d = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(d * t) + ((z * w) / d) * Math.sin(d * t));
};
const toHsv = ([r, g, b]: number[]): [number, number] => {
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  let hue = 0;
  if (delta > 0) {
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
  }
  return [(hue * 60 + 360) % 360, max > 0 ? delta / max : 0];
};
const fromHsv = (hue: number, s: number): number[] => {
  const h = (((hue % 360) + 360) % 360) / 60;
  const x = s * (1 - Math.abs((h % 2) - 1));
  const m = 1 - s;
  const [r, g, b] = h < 1 ? [s, x, 0] : h < 2 ? [x, s, 0] : h < 3 ? [0, s, x] : h < 4 ? [0, x, s] : h < 5 ? [x, 0, s] : [s, 0, x];
  return [r + m, g + m, b + m];
};
const buildTints = (rgb: number[]) => {
  const [hue, sat] = toHsv(rgb);
  const strength = sat / BASE_SATURATION;
  const data = new Float32Array(TINTS.length * 3);
  TINTS.forEach(([shift, scale], i) => data.set(fromHsv(hue + shift, clamp(BASE_SATURATION * scale * strength, 0, 1)), i * 3));
  return data;
};
const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

export type LaserFlowHandle = { setColor: (hex: string) => void; destroy: () => void };

export function mountLaserFlow(container: HTMLElement, surfaceEl: HTMLElement, opts: Options): LaserFlowHandle | null {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.className = "laserflow-canvas";
  // failIfMajorPerformanceCaveat: no context on software rasterisers → caller keeps the CSS beam.
  const context = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
    failIfMajorPerformanceCaveat: true,
  });
  if (!context) return null;
  const gl: WebGL2RenderingContext = context;
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
  if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }

  const s = {
    beamWidth: 1.5,
    flare: 1.5,
    spread: 1.5,
    intensity: 1.8,
    fog: 0.2,
    dust: 1.4,
    streaks: 1.5,
    dots: 1,
    pulse: 1.5,
    speed: 1.2,
    ...opts,
  };

  // ── Non-blocking compile ──────────────────────────────────────────────
  const parallel = gl.getExtension("KHR_parallel_shader_compile");
  const vs = gl.createShader(gl.VERTEX_SHADER)!;
  const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(vs, VERTEX);
  gl.shaderSource(fs, FRAGMENT);
  gl.compileShader(vs);
  gl.compileShader(fs);
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  let vao: WebGLVertexArrayObject | null = null;
  let buffer: WebGLBuffer | null = null;
  let revealTex: WebGLTexture | null = null;
  let ready = false;

  const finishSetup = () => {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    for (const n of ["uResolution", "uDpr", "uScale", "uTime", "uBeamX", "uSurface", "uRadius", "uIntro", "uPour", "uRun", "uLens", "uReveal", "uRevealMap", "uRevealInfo", "uAtmosphere", "uAmount", "uShape", "uExtra", "uTheme", "uTint"])
      uniforms[n] = gl.getUniformLocation(program, n);
    vao = gl.createVertexArray();
    buffer = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    revealTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, revealTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    return true;
  };

  // ── State ─────────────────────────────────────────────────────────────
  const state = {
    time: 0,
    introTime: 0,
    width: 1,
    height: 1,
    ratio: 1,
    tier: 0,
    rgb: hexToRgb(s.color),
    target: hexToRgb(s.color),
    tints: buildTints(hexToRgb(s.color)),
    pointer: { x: 0, y: 0, inside: false },
    lens: { x: 0, y: 0, vx: 0, vy: 0, strength: 0, placed: false },
  };
  let raf = 0;
  let last = 0;
  let visible = true;
  let alive = true;
  const samples: number[] = [];

  const resize = () => {
    state.width = Math.max(1, container.clientWidth);
    state.height = Math.max(1, container.clientHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, 1) * TIERS[state.tier].scale;
    const w = Math.max(1, Math.round(state.width * ratio));
    const h = Math.max(1, Math.round(state.height * ratio));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    state.ratio = canvas.width / state.width;
  };

  const surface = () => {
    const box = container.getBoundingClientRect();
    const r = surfaceEl.getBoundingClientRect();
    const radius = parseFloat(getComputedStyle(surfaceEl).borderTopLeftRadius) || 0;
    return { left: r.left - box.left, top: r.top - box.top, right: r.right - box.left, bottom: r.bottom - box.top, radius: Math.min(radius, r.width / 2, r.height / 2) };
  };
  let surf = surface();

  const render = () => {
    const { width, height } = state;
    const scale = Math.max(0.2, Math.min(width / 585, height / 507));
    const beamX = clamp((surf.left + surf.right) / 2, surf.left + surf.radius + 6, surf.right - surf.radius - 6);
    const startY = -0.15 * height;
    const span = surf.top - startY + 0.3 * height;
    const it = state.introTime;
    const settled = it >= INTRO_END;
    const front = settled ? surf.top + 0.3 * height : startY + span * Math.pow(clamp(it / INTRO_DROP, 0, 1), 1.3);
    const impact = INTRO_DROP * Math.pow(Math.max(0, surf.top - startY) / span, 1 / 1.3);
    const tau = it - impact;
    const bloom = settled ? 1 : tau <= 0 ? 0 : spring(tau);
    const flash = settled || tau <= 0 ? 0 : Math.exp(-tau / 0.35) * (1 - Math.exp(-tau / 0.05));
    const runRange = s.spread * 250 * 1.3 + 80;
    const runFront = settled ? 100000 : tau <= 0 ? -40 : runRange * (1 - Math.exp(-1.15 * tau));
    const bead = settled || tau <= 0 ? 0 : Math.exp(-1.15 * tau) * (1 - Math.exp(-tau / 0.08));
    const pour = (reach: number): [number, number] => {
      if (settled) return [1000, 1];
      if (tau <= 0) return [-reach, 0];
      const target = Math.min(reach, runRange * 0.97);
      const arrival = -Math.log(1 - target / runRange) / 1.15;
      const elapsed = tau - arrival;
      const e = clamp((elapsed + 0.15) / 0.8, 0, 1);
      const fill = e * e * e * (e * (e * 6 - 15) + 10);
      if (elapsed <= 0) return [runFront - target, fill];
      return [1.15 * (runRange - target) * elapsed + 260 * elapsed * elapsed, fill];
    };
    const [frontL, fillL] = pour((beamX - surf.left) / scale);
    const [frontR, fillR] = pour((surf.right - beamX) / scale);
    const atmosphere = settled ? 1 : tau <= 0 ? 0.3 * easeOut(it / INTRO_DROP) : 0.3 + 0.7 * (1 - Math.exp(-1.3 * tau));

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(uniforms.uResolution, width, height);
    gl.uniform1f(uniforms.uDpr, state.ratio);
    gl.uniform1f(uniforms.uScale, scale);
    gl.uniform1f(uniforms.uTime, state.time);
    gl.uniform1f(uniforms.uBeamX, beamX);
    gl.uniform4f(uniforms.uSurface, surf.left, surf.top, surf.right, surf.bottom);
    gl.uniform1f(uniforms.uRadius, surf.radius);
    gl.uniform3f(uniforms.uIntro, front, bloom, flash);
    gl.uniform4f(uniforms.uPour, frontL, frontR, fillL, fillR);
    gl.uniform2f(uniforms.uRun, runFront, bead);
    gl.uniform4f(uniforms.uLens, state.lens.x, state.lens.y, 95 * scale, state.lens.strength);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, revealTex);
    gl.uniform1i(uniforms.uReveal, 0);
    gl.uniform4f(uniforms.uRevealMap, 0, 0, 0, 0);
    gl.uniform2f(uniforms.uRevealInfo, 1, 0);
    gl.uniform1f(uniforms.uAtmosphere, atmosphere);
    gl.uniform4f(uniforms.uAmount, s.intensity, s.fog * TIERS[state.tier].fog, s.dust, s.streaks);
    gl.uniform4f(uniforms.uShape, s.beamWidth, s.flare, s.spread, 1);
    gl.uniform4f(uniforms.uExtra, s.pulse, s.dots, 34.34 + 3 * 7.31, 11.58 + 3 * 3.17);
    gl.uniform1f(uniforms.uTheme, 0);
    gl.uniform3fv(uniforms.uTint, state.tints);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
  };

  // Adaptive quality from rAF intervals (GPU-bound frames stretch them).
  const adapt = (interval: number) => {
    if (state.introTime < 0.5) return; // ignore warm-up
    samples.push(interval);
    if (samples.length < WINDOW) return;
    const p90 = [...samples].sort((a, b) => a - b)[Math.floor(samples.length * 0.9)];
    samples.length = 0;
    if (p90 <= SLOW_MS) return;
    if (state.tier < TIERS.length - 1) {
      state.tier++;
      container.dataset.lfTier = String(state.tier); // visible in devtools for QA
      resize();
    } else {
      opts.onFail?.();
      destroy();
    }
  };

  const frame = (now: number) => {
    raf = 0;
    if (!alive || !visible || document.hidden) return;
    if (!ready) {
      if (parallel && !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) {
        raf = requestAnimationFrame(frame);
        return;
      }
      if (!finishSetup()) {
        opts.onFail?.();
        destroy();
        return;
      }
      ready = true;
      container.appendChild(canvas);
      opts.onReady?.();
    }
    if (last && now - last < MIN_FRAME_MS) {
      raf = requestAnimationFrame(frame);
      return;
    }
    const interval = last ? now - last : 16.7;
    const dt = Math.min(0.05, interval / 1000);
    last = now;
    adapt(interval);
    state.time += dt * s.speed;
    if (state.introTime < INTRO_END) state.introTime = Math.min(INTRO_END, state.introTime + dt);

    // colour easing
    let moving = false;
    for (let i = 0; i < 3; i++) {
      const d = state.target[i] - state.rgb[i];
      if (Math.abs(d) > 0.002) {
        state.rgb[i] += d * (1 - Math.exp(-dt / 0.18));
        moving = true;
      }
    }
    if (moving) state.tints = buildTints(state.rgb);

    const { pointer, lens } = state;
    if (pointer.inside && !lens.placed) Object.assign(lens, { x: pointer.x, y: pointer.y, vx: 0, vy: 0, placed: true });
    lens.vx += (120 * (pointer.x - lens.x) - 19 * lens.vx) * dt;
    lens.vy += (120 * (pointer.y - lens.y) - 19 * lens.vy) * dt;
    lens.x += lens.vx * dt;
    lens.y += lens.vy * dt;
    const goal = pointer.inside ? 1 : 0;
    lens.strength += (goal - lens.strength) * (1 - Math.exp(-dt / (goal > lens.strength ? 0.3 : 0.55)));
    if (lens.strength < 0.001 && !pointer.inside) lens.placed = false;

    render();
    raf = requestAnimationFrame(frame);
  };
  const wake = () => {
    if (!raf && alive && visible && !document.hidden) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  };

  const onPointer = (e: PointerEvent) => {
    const r = container.getBoundingClientRect();
    state.pointer.x = e.clientX - r.left;
    state.pointer.y = e.clientY - r.top;
    state.pointer.inside = state.pointer.x >= 0 && state.pointer.y >= 0 && state.pointer.x <= r.width && state.pointer.y <= r.height;
  };
  const onVisibility = () => wake();
  const ro = new ResizeObserver(() => {
    resize();
    surf = surface();
  });
  ro.observe(container);
  ro.observe(surfaceEl);
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) wake();
  });
  io.observe(container);
  const interactive = opts.interactive !== false;
  if (interactive) window.addEventListener("pointermove", onPointer, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  resize();
  wake();

  function destroy() {
    if (!alive) return;
    alive = false;
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    if (revealTex) gl.deleteTexture(revealTex);
    if (buffer) gl.deleteBuffer(buffer);
    if (vao) gl.deleteVertexArray(vao);
    gl.deleteProgram(program);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    canvas.remove();
  }

  return {
    setColor: (hex) => {
      state.target = hexToRgb(hex);
    },
    destroy,
  };
}
