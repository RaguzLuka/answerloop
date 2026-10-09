import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/* WhatsApp through Meta's official Cloud API (no third party in between).
   - A missed call opens with an approved template message (business-initiated).
   - Every reply inside the customer's 24-hour window is a free-form text.
   WHATSAPP_DRY_RUN=true (development only) prints messages instead of sending. */

const dryRun = () => process.env.WHATSAPP_DRY_RUN === "true" && process.env.NODE_ENV !== "production";

export const whatsappConfigured = () =>
  dryRun() || !!(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_APP_SECRET);

/** Approved template names, per language. The text must match what Meta approved (see README). */
export const templateFor = (lang: "hr" | "en") =>
  lang === "en"
    ? { name: process.env.WHATSAPP_TEMPLATE_EN ?? "ringloop_missed_call_en", language: "en" }
    : { name: process.env.WHATSAPP_TEMPLATE_HR ?? "ringloop_missed_call_hr", language: "hr" };

export type WaResult = { ok: true; id: string } | { ok: false; error: string };

async function send(to: string, payload: Record<string, unknown>, preview: string): Promise<WaResult> {
  const digits = to.replace(/^\+/, "");
  if (dryRun()) {
    const id = `wamid.dry-${randomBytes(6).toString("hex")}`;
    console.log(`\n[whatsapp → +${digits}] (${id})\n${preview}\n`);
    return { ok: true, id };
  }
  const version = process.env.WHATSAPP_GRAPH_VERSION ?? "v23.0";
  try {
    const res = await fetch(`https://graph.facebook.com/${version}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: digits, ...payload }),
      signal: AbortSignal.timeout(15_000),
    });
    const data = (await res.json()) as { messages?: { id: string }[]; error?: { code?: number; message?: string } };
    if (!res.ok || !data.messages?.[0]?.id) {
      return { ok: false, error: `${data.error?.code ?? res.status}: ${data.error?.message ?? "WhatsApp error"}` };
    }
    return { ok: true, id: data.messages[0].id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

export function waSendTemplate(to: string, lang: "hr" | "en", params: string[], preview: string) {
  const t = templateFor(lang);
  return send(
    to,
    {
      type: "template",
      template: {
        name: t.name,
        language: { code: t.language },
        components: [{ type: "body", parameters: params.map((text) => ({ type: "text", text })) }],
      },
    },
    preview,
  );
}

export function waSendText(to: string, body: string) {
  return send(to, { type: "text", text: { body, preview_url: true } }, body);
}

/** Meta signs every webhook with the app secret (X-Hub-Signature-256). Fails closed. */
export function verifyMetaSignature(rawBody: string, header: string | null) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = Buffer.from(`sha256=${createHmac("sha256", secret).update(rawBody, "utf8").digest("hex")}`);
  const given = Buffer.from(header);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
