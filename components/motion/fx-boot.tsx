"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * ~0.5 KB in first-load JS. After the page is idle, lazy-loads the effects layer (lib/fx),
 * which attaches to server-rendered markup via data attributes. Skipped entirely for
 * reduced-motion / low-power / save-data visitors (html[data-motion="reduced"]).
 */
export function FxBoot() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.motion === "reduced") return;
    // No hardware compositing (blocklisted GPU, VM, remote desktop): even CSS motion would
    // repaint on the CPU, so drop to the reduced profile instead of loading effects.
    if (!hasGpu()) {
      html.setAttribute("data-motion", "reduced");
      return;
    }
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const start = () =>
      import("@/lib/fx").then((fx) => {
        if (!cancelled) cleanup = fx.init();
      });
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 2000 })
      : window.setTimeout(start, 800);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
      cleanup?.();
    };
  }, [pathname]);

  return null;
}

let gpuCache: boolean | undefined;
function hasGpu() {
  if (gpuCache !== undefined) return gpuCache;
  try {
    const gl = document.createElement("canvas").getContext("webgl", { failIfMajorPerformanceCaveat: true });
    if (!gl) return (gpuCache = false);
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return (gpuCache = !/swiftshader|llvmpipe|software|basic render/i.test(renderer));
  } catch {
    return (gpuCache = true);
  }
}
