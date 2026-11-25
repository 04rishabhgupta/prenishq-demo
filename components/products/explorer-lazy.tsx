"use client";

import dynamic from "next/dynamic";
import { DotMatrixLoader } from "@/components/brand/loader";

// Below the fold on /products: load after hydration so the route stays well under the
// 150 KB first-load budget. The placeholder reserves the explorer's height (no CLS).
export const WavelengthExplorerLazy = dynamic(() => import("@/components/home/wavelength-explorer").then((m) => m.WavelengthExplorer), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-[1480px] place-items-center md:min-h-[1080px] lg:min-h-[800px]">
      <DotMatrixLoader label="Loading wavelength explorer" />
    </div>
  ),
});
