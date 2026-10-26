"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, submitEnquiry, type Enquiry } from "@/lib/enquiry";
import { products } from "@/data/products";
import { PRESETS } from "@/data/wavelengths";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { clsx as cn } from "clsx"; // client island: no tailwind-merge (saves ~8 KB gz)

const PRODUCT_OPTIONS = [...products.map((p) => p.fullName), "Not sure yet / custom"];

const inputCls =
  "w-full rounded-md border border-line-strong bg-bg/60 px-3.5 py-2.5 text-[0.95rem] text-fg placeholder:text-fg-2/60 transition-colors hover:border-white/25 focus:border-cyan focus:outline-none aria-[invalid=true]:border-wl-633";

function Field({
  label,
  error,
  optional,
  children,
  id,
  className,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: (describedBy?: string) => React.ReactNode;
  id: string;
  className?: string;
}) {
  const errId = `${id}-err`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm text-fg">
        {label}
        {optional && <span className="ml-1.5 text-fg-2">(optional)</span>}
      </label>
      {children(error ? errId : undefined)}
      {error && (
        <p id={errId} className="text-sm text-[#ff7a86]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function EnquiryForm({ product, source, compact }: { product?: string; source: string; compact?: boolean }) {
  const uid = useId();
  // Fill-time spam check: set on mount, read only in the submit handler.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [status, setStatus] = useState<{ kind: "idle" | "sent" | "error"; message?: string }>({ kind: "idle" });
  const defaultProduct = PRODUCT_OPTIONS.find((o) => product && o.startsWith(product)) ?? PRODUCT_OPTIONS.at(-1)!;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Enquiry>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { product: defaultProduct },
    mode: "onTouched",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    handleSubmit(async (data) => {
      const result = await submitEnquiry(data, startedAt.current, source);
      if (result.ok) {
        setStatus({ kind: "sent" });
        reset({ product: defaultProduct });
      } else {
        setStatus({ kind: "error", message: result.message });
      }
    })(e);

  if (status.kind === "sent") {
    return (
      <div role="status" className="flex flex-col items-start gap-3 py-6">
        <span className="grid size-10 place-items-center rounded-full bg-wl-520/15 text-wl-520">
          <Icon name="check" />
        </span>
        <p className="text-lg text-fg">Thank you. Your enquiry has been sent.</p>
        <p className="text-fg-2">Our team usually replies within two working days.</p>
        <Button variant="secondary" size="sm" onClick={() => setStatus({ kind: "idle" })}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  const f = (name: keyof Enquiry) => `${uid}-${name}`;
  const reg = (name: keyof Enquiry, describedBy?: string): UseFormRegisterReturn & Record<string, unknown> => ({
    ...register(name),
    id: f(name),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": describedBy,
  });

  return (
    <form onSubmit={onSubmit} noValidate className={cn("grid gap-4", !compact && "sm:grid-cols-2 sm:gap-5")}>
      <Field id={f("name")} label="Name" error={errors.name?.message}>
        {(d) => <input {...reg("name", d)} autoComplete="name" className={inputCls} />}
      </Field>
      <Field id={f("organisation")} label="Organisation" optional>
        {(d) => <input {...reg("organisation", d)} autoComplete="organization" className={inputCls} />}
      </Field>
      <Field id={f("email")} label="Email" error={errors.email?.message}>
        {(d) => <input {...reg("email", d)} type="email" autoComplete="email" inputMode="email" className={inputCls} />}
      </Field>
      <Field id={f("phone")} label="Phone" optional error={errors.phone?.message}>
        {(d) => <input {...reg("phone", d)} type="tel" autoComplete="tel" inputMode="tel" className={inputCls} />}
      </Field>
      <Field id={f("product")} label="Product of interest">
        {(d) => (
          <select {...reg("product", d)} className={cn(inputCls, "appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10")} style={{ backgroundImage: SELECT_CHEVRON }}>
            {PRODUCT_OPTIONS.map((o) => (
              <option key={o} value={o} className="bg-surface">
                {o}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field id={f("wavelength")} label="Wavelength" optional>
        {(d) => (
          <>
            <input {...reg("wavelength", d)} list={`${uid}-wl`} placeholder="e.g. 780 nm" className={cn(inputCls, "font-mono")} />
            <datalist id={`${uid}-wl`}>
              {[...PRESETS, 780, 852].map((nm) => (
                <option key={nm} value={`${nm} nm`} />
              ))}
            </datalist>
          </>
        )}
      </Field>
      <Field id={f("message")} label="Message" error={errors.message?.message} className={cn(!compact && "sm:col-span-2")}>
        {(d) => (
          <textarea
            {...reg("message", d)}
            rows={compact ? 4 : 5}
            placeholder="Application, required power, linewidth, timeline…"
            className={cn(inputCls, "resize-y")}
          />
        )}
      </Field>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className={cn("flex flex-col gap-3 pt-1", !compact && "sm:col-span-2 sm:flex-row sm:items-center sm:justify-between")}>
        <p className="text-sm text-fg-2">We use your details only to reply to this enquiry.</p>
        <Button type="submit" disabled={isSubmitting} className="min-w-40">
          {isSubmitting ? "Sending…" : "Send enquiry"}
          {!isSubmitting && <Icon name="arrow-right" />}
        </Button>
      </div>
      {status.kind === "error" && (
        <p role="alert" className={cn("rounded-md border border-wl-633/40 bg-wl-633/10 px-3.5 py-2.5 text-sm text-fg", !compact && "sm:col-span-2")}>
          {status.message}
        </p>
      )}
    </form>
  );
}

const SELECT_CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239AA7B8' stroke-width='1.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;
