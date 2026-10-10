import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/* Thin Twilio REST client (no SDK) + webhook signature check.
   Without TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN in development, SMS are
   printed to the console instead of sent, so every flow can be tried locally. */

const API = "https://api.twilio.com/2010-04-01";

export const twilioConfigured = () => !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);

function auth() {
  return "Basic " + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
}

export type SmsResult = { ok: true; sid: string | null } | { ok: false; error: string };

export async function twilioSendSms({ from, to, body }: { from: string; to: string; body: string }): Promise<SmsResult> {
  if (!twilioConfigured()) {
    if (process.env.NODE_ENV === "production") return { ok: false, error: "Twilio is not configured" };
    console.log(`\n[sms ${from} → ${to}]\n${body}\n`);
    return { ok: true, sid: null };
  }
  try {
    const res = await fetch(`${API}/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: "POST",
      headers: { Authorization: auth(), "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ From: from, To: to, Body: body }).toString(),
    });
    const data = (await res.json()) as { sid?: string; message?: string; code?: number };
    if (!res.ok) return { ok: false, error: `${data.code ?? res.status}: ${data.message ?? "Twilio error"}` };
    return { ok: true, sid: data.sid ?? null };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

/** Points a RingLoop number's incoming-call webhook at this app. */
export async function twilioRouteNumber(number: string, voiceUrl: string): Promise<{ ok: boolean; error?: string }> {
  if (!twilioConfigured()) return { ok: false, error: "Twilio is not configured" };
  const base = `${API}/Accounts/${process.env.TWILIO_ACCOUNT_SID}/IncomingPhoneNumbers`;
  try {
    const list = await fetch(`${base}.json?PhoneNumber=${encodeURIComponent(number)}`, { headers: { Authorization: auth() } });
    const data = (await list.json()) as { incoming_phone_numbers?: { sid: string }[] };
    const sid = data.incoming_phone_numbers?.[0]?.sid;
    if (!sid) return { ok: false, error: "This number isn't in the Twilio account" };
    const res = await fetch(`${base}/${sid}.json`, {
      method: "POST",
      headers: { Authorization: auth(), "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ VoiceUrl: voiceUrl, VoiceMethod: "POST" }).toString(),
    });
    return res.ok ? { ok: true } : { ok: false, error: `Twilio refused the update (${res.status})` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

/** Validates X-Twilio-Signature against the public URL Twilio called.
 *  Returns the form params when valid, null otherwise. Fails closed. */
export async function verifiedTwilioParams(request: Request, publicUrl: string): Promise<Record<string, string> | null> {
  const params = Object.fromEntries(new URLSearchParams(await request.text()));
  const token = process.env.TWILIO_AUTH_TOKEN;
  const signature = request.headers.get("x-twilio-signature");
  if (!token || !signature) return null;

  const data = publicUrl + Object.keys(params).sort().map((k) => k + params[k]).join("");
  const expected = createHmac("sha1", token).update(Buffer.from(data, "utf-8")).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b) ? params : null;
}

export function twiml(inner: string) {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response>${inner}</Response>`, {
    headers: { "Content-Type": "text/xml" },
  });
}
