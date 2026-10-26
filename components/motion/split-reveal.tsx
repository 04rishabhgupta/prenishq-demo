import { createElement, Fragment } from "react";
import { cn } from "@/lib/cn";

/**
 * ReactBits "SplitText"-style word reveal, without JS: words rise in on scroll via CSS,
 * triggered by the shared in-view observer. The heading keeps its full text as its
 * accessible name (word spans are hidden from assistive tech).
 */
export function SplitReveal({
  as = "h2",
  text,
  id,
  className,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  text: string;
  id?: string;
  className?: string;
}) {
  const words = text.split(" ");
  return createElement(
    as,
    { id, className: cn("split-reveal", className), "data-observe": "", "aria-label": text },
    <span aria-hidden="true">
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" style={{ ["--w" as string]: i }}>
            {w}
          </span>{" "}
        </Fragment>
      ))}
    </span>,
  );
}
