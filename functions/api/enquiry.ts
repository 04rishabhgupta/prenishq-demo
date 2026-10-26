// Cloudflare Pages Function: POST /api/enquiry → email via Resend (DECISIONS D-11).
// Used only when NEXT_PUBLIC_FORM_ENDPOINT=/api/enquiry. Not part of the Next.js build.
// Env (Pages → Settings → Variables): RESEND_API_KEY, ENQUIRY_TO, ENQUIRY_FROM.

type Env = { RESEND_API_KEY: string; ENQUIRY_TO: string; ENQUIRY_FROM: string };
type Ctx = { request: Request; env: Env };

const FIELDS = ["name", "organisation", "email", "phone", "product", "wavelength", "message", "source"] as const;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function onRequestPost({ request, env }: Ctx): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const data = Object.fromEntries(FIELDS.map((k) => [k, String(body[k] ?? "").slice(0, 4000).trim()]));
  if (!data.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email) || data.message.length < 10) {
    return Response.json({ ok: false }, { status: 422 });
  }

  const rows = FIELDS.filter((k) => data[k]).map((k) => `<tr><th align="left">${k}</th><td>${esc(data[k])}</td></tr>`).join("");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.ENQUIRY_FROM,
      to: env.ENQUIRY_TO.split(",").map((s) => s.trim()),
      reply_to: data.email,
      subject: `Website enquiry: ${data.product || "General"} (${data.name})`,
      html: `<table cellpadding="6">${rows}</table>`,
    }),
  });
  return Response.json({ ok: res.ok }, { status: res.ok ? 200 : 502 });
}
