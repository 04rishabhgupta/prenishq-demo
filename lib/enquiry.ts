import * as z from "zod/mini";

export const enquirySchema = z.object({
  name: z.string().check(z.trim(), z.minLength(2, "Please enter your name.")),
  organisation: z.optional(z.string().check(z.trim(), z.maxLength(120))),
  email: z.email("Please enter a valid email address."),
  phone: z.optional(
    z.string().check(z.trim(), z.regex(/^$|^[+()\d\s-]{7,20}$/, "Please enter a valid phone number.")),
  ),
  product: z.string(),
  wavelength: z.optional(z.string().check(z.trim(), z.maxLength(40))),
  message: z.string().check(z.trim(), z.minLength(10, "Please tell us a little more (10+ characters).")),
  // Honeypot: real users never see or fill this.
  website: z.optional(z.string()),
});

export type Enquiry = z.infer<typeof enquirySchema>;

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
const MIN_FILL_MS = 2500;

export type SubmitResult = { ok: true } | { ok: false; reason: "spam" | "config" | "network"; message: string };

/** POSTs JSON to a Formspree-compatible endpoint, or the Resend function in /functions (README). */
export async function submitEnquiry(data: Enquiry, startedAt: number, source: string): Promise<SubmitResult> {
  if (data.website || Date.now() - startedAt < MIN_FILL_MS) {
    // Pretend success so bots get no signal.
    return { ok: true };
  }
  if (!ENDPOINT) {
    return {
      ok: false,
      reason: "config",
      message: "The enquiry service isn't configured yet. Please email info@prenishq.com directly.",
    };
  }
  try {
    const payload: Partial<Enquiry> = { ...data };
    delete payload.website;
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...payload, source, _subject: `Website enquiry: ${data.product}` }),
    });
    if (!res.ok) throw new Error(String(res.status));
    return { ok: true };
  } catch {
    return {
      ok: false,
      reason: "network",
      message: "We couldn't send your message. Please try again, or email info@prenishq.com.",
    };
  }
}
