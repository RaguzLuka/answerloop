import "server-only";
import { and, count, desc, eq, gte } from "drizzle-orm";
import { db, bookings, calls, chats, smsLog, type Booking, type Business, type SmsKind } from "@/lib/db";
import { suggestSender } from "@/lib/business-types";
import { twilioSendSms, type SmsResult } from "@/lib/twilio";
import { appUrl } from "@/lib/email";
import { formatPhone } from "@/lib/phone";

/* Every SMS a business sends goes through here: one sender, one daily cap,
   one log. Message bodies are never stored. */

const DAILY_LIMIT = Number(process.env.SMS_DAILY_LIMIT ?? 150);

export const bookingLink = (biz: Pick<Business, "slug">) => `${appUrl()}/b/${biz.slug}`;

/** Croatian landlines (+385 1…, +385 2x–5x) can't receive SMS; mobiles are +385 9x. */
export const canReceiveSms = (e164: string) => !/^\+385[1-8]/.test(e164);

function senderFor(biz: Business) {
  return suggestSender(biz.senderName) || process.env.TWILIO_SMS_FROM || "RingLoop";
}

export async function sendBusinessSms(biz: Business, kind: SmsKind, to: string, body: string): Promise<SmsResult> {
  const [{ n }] = await db
    .select({ n: count() })
    .from(smsLog)
    .where(and(eq(smsLog.businessId, biz.id), gte(smsLog.createdAt, Date.now() - 24 * 60 * 60 * 1000)));
  if (n >= DAILY_LIMIT) return { ok: false, error: "Daily SMS limit reached" };

  const result = await twilioSendSms({ from: senderFor(biz), to, body });
  await db.insert(smsLog).values({
    businessId: biz.id,
    kind,
    toPhone: to,
    sid: result.ok ? result.sid : null,
    error: result.ok ? null : result.error,
  });
  if (!result.ok) console.error(`[sms] ${kind} for ${biz.slug} failed: ${result.error}`);
  return result;
}

/** Latest missed calls, with the chat each one opened (if any) */
export async function recentCalls(businessId: string, limit = 10) {
  return db
    .select({ call: calls, chatId: chats.id, chatStatus: chats.status, chatUserMessages: chats.userMessages })
    .from(calls)
    .leftJoin(chats, eq(chats.callId, calls.id))
    .where(eq(calls.businessId, businessId))
    .orderBy(desc(calls.createdAt))
    .limit(limit);
}

/* ── Booking confirmations & reminders ──────────────────────── */

function bookingWords(biz: Business) {
  const restaurant = biz.type === "restaurant";
  return biz.smsLanguage === "en"
    ? { thing: restaurant ? "reservation" : "appointment" }
    : { thing: restaurant ? "rezervacija" : "termin" };
}

function when(biz: Business, ms: number) {
  const locale = biz.smsLanguage === "en" ? "en-GB" : "hr-HR";
  const day = new Intl.DateTimeFormat(locale, { timeZone: biz.timezone, weekday: "long", day: "numeric", month: "long" }).format(ms);
  const time = new Intl.DateTimeFormat(locale, { timeZone: biz.timezone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(ms);
  return { day, time };
}

/* Confirmation and reminder leave out the service name (it often has č/š, e.g.
   "Šišanje") and use a numeric date, so they stay a single SMS. */
function shortDate(biz: Business, ms: number) {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: biz.timezone, day: "numeric", month: "numeric" }).formatToParts(ms);
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return `${Number(get("day"))}.${Number(get("month"))}.`;
}

export function confirmationText(biz: Business, b: Pick<Booking, "serviceName" | "startsAt">) {
  const { day, time } = when(biz, b.startsAt);
  const call = biz.phone ? formatPhone(biz.phone) : "";
  const { thing } = bookingWords(biz);
  return biz.smsLanguage === "en"
    ? `${biz.name}: your ${thing} is booked for ${day} at ${time}.${call ? ` To change it, call ${call}.` : ""}`
    : `${biz.name}: ${thing === "rezervacija" ? "stol je rezerviran" : "termin je rezerviran"} za ${shortDate(biz, b.startsAt)} u ${time}.${call ? ` Za promjenu nazovite ${call}.` : ""}`;
}

export function reminderText(biz: Business, b: Pick<Booking, "serviceName" | "startsAt">) {
  const { time } = when(biz, b.startsAt);
  const call = biz.phone ? formatPhone(biz.phone) : "";
  const { thing } = bookingWords(biz);
  return biz.smsLanguage === "en"
    ? `Reminder (${biz.name}): your ${thing} is tomorrow at ${time}.${call ? ` To change or cancel, call ${call}.` : ""}`
    : `Podsjetnik (${biz.name}): sutra u ${time} imate ${thing === "rezervacija" ? "rezerviran stol" : "termin"}.${call ? ` Za promjenu ili otkazivanje nazovite ${call}.` : ""}`;
}

export async function sendConfirmation(biz: Business, b: Booking) {
  if (!biz.confirmationsEnabled || !canReceiveSms(b.customerPhone)) return;
  const res = await sendBusinessSms(biz, "confirmation", b.customerPhone, confirmationText(biz, b));
  if (res.ok) await db.update(bookings).set({ confirmationSentAt: Date.now() }).where(eq(bookings.id, b.id));
}
