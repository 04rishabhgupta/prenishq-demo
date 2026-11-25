"use client";

import { useState } from "react";

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

/**
 * Footer "talk to our team" capture (in the spot where Q-CTRL has its newsletter; PrenishQ has
 * no newsletter). Sends the email through the same endpoint as the enquiry form. Tiny on
 * purpose: native validation, honeypot, no form library.
 */
export function FooterContact({ fallbackEmail }: { fallbackEmail: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("website")) return setState("sent"); // bot
    if (!ENDPOINT) return setState("error");
    setState("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          message: "Please get in touch (request from the website footer).",
          source: "footer",
          _subject: "Website: callback request",
        }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <p role="status" className="text-sm text-wl-520">
        Thanks. Our team will be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <div className="flex overflow-hidden rounded-md border border-line-strong bg-bg/60 focus-within:border-cyan">
        <input
          id="footer-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[0.95rem] text-fg placeholder:text-fg-2/70 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          aria-label="Send"
          className="grid w-12 shrink-0 place-items-center border-l border-line-strong text-fg transition-colors hover:bg-cyan hover:text-bg disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      {/* Honeypot */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px" />
      {state === "error" && (
        <p role="alert" className="mt-2 text-sm text-fg-2">
          Couldn&apos;t send right now. Please email{" "}
          <a href={`mailto:${fallbackEmail}`} className="text-cyan underline underline-offset-4">
            {fallbackEmail}
          </a>
          .
        </p>
      )}
    </form>
  );
}
