import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Business } from "@/lib/db";
import { open } from "@/lib/secret-box";

/* WhatsApp through Meta's official Cloud API, from each shop's OWN number —
   so the customer sees the shop's name, not RingLoop's.
   - A missed call opens with an approved template message (business-initiated).
   - Replies inside the customer's 24-hour window are free-form texts.
   WHATSAPP_DRY_RUN=true (development only) prints messages instead of sending. */

const dryRun = () => process.env.WHATSAPP_DRY_RUN === "true" && process.env.NODE_ENV !== "production";
const graph = (path: string) => `https://graph.facebook.com/${process.env.WHATSAPP_GRAPH_VERSION ?? "v23.0"}/${path}`;

/** The webhook can be verified (app secret) — needed before any shop can use WhatsApp. */
export const whatsappReady = () => dryRun() || !!process.env.WHATSAPP_APP_SECRET;

export type WaSender = { phoneNumberId: string; token: string };

/** The shop's own WhatsApp sender, or null if it isn't connected yet. */
export function senderFor(biz: Pick<Business, "waPhoneNumberId" | "waTokenEnc">): WaSender | null {
  if (!biz.waPhoneNumberId) return null;
  const token = (biz.waTokenEnc ? open(biz.waTokenEnc) : null) ?? process.env.WHATSAPP_TOKEN ?? "";
  if (!token && !dryRun()) return null;
  return { phoneNumberId: biz.waPhoneNumberId, token };
}

/** Approved template names, per language. The text must match what Meta approved (TEMPLATE_TEXT). */
export const templateFor = (lang: "hr" | "en") =>
  lang === "en"
    ? { name: process.env.WHATSAPP_TEMPLATE_EN ?? "missed_call_en", language: "en" }
    : { name: process.env.WHATSAPP_TEMPLATE_HR ?? "missed_call_hr", language: "hr" };

/** {{1}} = the shop's name. Must stay identical to chat.ts openingMessage(…, "whatsapp"). */
export const TEMPLATE_TEXT = {
  hr: "Pozdrav, ovdje {{1}}. Oprostite što se nismo stigli javiti na Vaš poziv. Ovdje Vam piše Halo, naš asistent s umjetnom inteligencijom. Za koju uslugu želite termin i kada biste mogli doći?",
  en: "Hello, this is {{1}}. Sorry we couldn't take your call. This is Halo, our AI assistant. What would you like to book, and when could you come in?",
};

export type WaResult = { ok: true; id: string } | { ok: false; error: string };

async function send(from: WaSender, to: string, payload: Record<string, unknown>, preview: string): Promise<WaResult> {
  const digits = to.replace(/^\+/, "");
  if (dryRun()) {
    const id = `wamid.dry-${randomBytes(6).toString("hex")}`;
    console.log(`\n[whatsapp ${from.phoneNumberId} → +${digits}] (${id})\n${preview}\n`);
    return { ok: true, id };
  }
  try {
    const res = await fetch(graph(`${from.phoneNumberId}/messages`), {
      method: "POST",
      headers: { Authorization: `Bearer ${from.token}`, "Content-Type": "application/json" },
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

export function waSendTemplate(from: WaSender, to: string, lang: "hr" | "en", params: string[], preview: string) {
  const t = templateFor(lang);
  return send(
    from,
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

export function waSendText(from: WaSender, to: string, body: string) {
  return send(from, to, { type: "text", text: { body, preview_url: true } }, body);
}

/** Submits both opening templates to the shop's WhatsApp account for Meta's approval. */
export async function waCreateTemplates(wabaId: string, token: string, exampleName: string) {
  const results: string[] = [];
  for (const lang of ["hr", "en"] as const) {
    const t = templateFor(lang);
    const body = {
      name: t.name,
      language: t.language,
      category: "UTILITY",
      components: [{ type: "BODY", text: TEMPLATE_TEXT[lang], example: { body_text: [[exampleName]] } }],
    };
    if (dryRun()) {
      results.push(`${t.name}: submitted (dry run)`);
      continue;
    }
    try {
      const res = await fetch(graph(`${wabaId}/message_templates`), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15_000),
      });
      const data = (await res.json()) as { status?: string; error?: { message?: string } };
      results.push(res.ok ? `${t.name}: ${data.status ?? "submitted"}` : `${t.name}: ${data.error?.message ?? res.status}`);
    } catch (err) {
      results.push(`${t.name}: ${err instanceof Error ? err.message : "network error"}`);
    }
  }
  return results;
}

/** Meta signs every webhook with the app secret (X-Hub-Signature-256). Fails closed. */
export function verifyMetaSignature(rawBody: string, header: string | null) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = Buffer.from(`sha256=${createHmac("sha256", secret).update(rawBody, "utf8").digest("hex")}`);
  const given = Buffer.from(header);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
