import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// shadcn/ui Button API, themed to the Neon Laser tokens. Primary text is near-black on cyan (8.5:1, D-19).
export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[background-color,border-color,color,opacity,transform] duration-200 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-cyan text-bg hover:bg-[#33c4f4]",
        secondary: "border border-line-strong bg-white/[0.03] text-fg hover:border-cyan/60 hover:bg-white/[0.06]",
        ghost: "text-fg-2 hover:text-fg",
        link: "text-cyan underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ComponentProps<"button"> & Variants) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function ButtonLink({ className, variant, size, ...props }: ComponentProps<typeof Link> & Variants) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/**
 * Opens the global quote dialog via event delegation (components/quote/quote-dialog.tsx),
 * so it stays a server component.
 */
export function QuoteButton({
  product,
  className,
  variant,
  size,
  children = "Request a Quote",
}: { product?: string; className?: string; children?: React.ReactNode } & Variants) {
  return (
    <button
      type="button"
      data-quote=""
      data-quote-product={product}
      aria-haspopup="dialog"
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </button>
  );
}
