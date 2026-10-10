import { after } from "next/server";
import { eq } from "drizzle-orm";
import { db, businesses } from "@/lib/db";
import { verifiedTwilioParams, twiml } from "@/lib/twilio";
import { appUrl } from "@/lib/email";
import { normalizePhone } from "@/lib/phone";
import { handleMissedCall } from "@/lib/missed-call";

/* Twilio calls this when a missed call is forwarded to a RingLoop number.
   We decline the call (the caller hears "busy", nobody pays for airtime)
   and text the caller the business's message with its booking link. */

// Placeholders Twilio puts in `From` when the caller hides their number
const HIDDEN = new Set(["+266696687", "+7378742833", "+2562533", "+8656696", "+86282452253"]);

export async function POST(req: Request) {
  const params = await verifiedTwilioParams(req, `${appUrl()}/api/twilio/voice`);
  if (!params) return new Response("Forbidden", { status: 403 });

  const to = normalizePhone(params.To ?? "");
  const callSid = params.CallSid ?? "";
  const [biz] = to ? await db.select().from(businesses).where(eq(businesses.ringloopNumber, to)).limit(1) : [];

  if (biz && callSid) {
    const raw = normalizePhone(params.From ?? "");
    const from = raw && !HIDDEN.has(raw) ? raw : null;
    after(() => handleMissedCall(biz, { callSid, from }).catch((err) => console.error("[voice] text-back failed:", err)));
  } else {
    console.warn("[voice] call to an unassigned RingLoop number");
  }
  return twiml(`<Reject reason="busy"/>`);
}
