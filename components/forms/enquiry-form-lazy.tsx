"use client";

import dynamic from "next/dynamic";
import { DotMatrixLoader } from "@/components/brand/loader";

// Form + validation (~17 KB gz) loads as a separate chunk after hydration,
// keeping it out of the route's first-load JS. Placeholder reserves the form height (no CLS).
export const EnquiryFormLazy = dynamic(() => import("@/components/forms/enquiry-form"), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-[560px] place-items-center sm:min-h-[430px]">
      <DotMatrixLoader label="Loading enquiry form" />
    </div>
  ),
});
