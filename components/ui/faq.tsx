import type { QA } from "@/data/product-extras";
import { Icon } from "@/components/icons";
import { JsonLd } from "@/lib/seo";
import { cn } from "@/lib/cn";

/** FAQ on native <details> (no JS), with FAQPage structured data. */
export function Faq({ items, className, schema = true }: { items: QA[]; className?: string; schema?: boolean }) {
  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((f) => (
        <details key={f.q} className="group/faq">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-[1.05rem] [&::-webkit-details-marker]:hidden">
            {f.q}
            <Icon name="plus" className="size-5 shrink-0 text-fg-2 transition-transform duration-300 group-open/faq:rotate-45" />
          </summary>
          <p className="max-w-3xl pb-5 leading-relaxed text-fg-2">{f.a}</p>
        </details>
      ))}
      {schema && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }}
        />
      )}
    </div>
  );
}
