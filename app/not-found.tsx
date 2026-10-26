import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/icons";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="relative grid min-h-[70vh] place-items-center overflow-hidden">
      <div aria-hidden className="dot-grid absolute inset-0 [mask-image:radial-gradient(50%_50%_at_50%_50%,#000,transparent)]" />
      <div className="container-x relative text-center">
        <p className="font-mono text-7xl tracking-tight text-fg sm:text-8xl">
          404<span className="ml-2 text-2xl text-fg-2">nm</span>
        </p>
        <h1 className="mt-6 text-2xl font-medium sm:text-3xl">Beam lost. This page is off the table.</h1>
        <p className="mx-auto mt-3 max-w-md text-fg-2">The page may have moved in our redesign. Try the products, or tell us what you were looking for.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/products">
            Browse products <Icon name="arrow-right" />
          </ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
