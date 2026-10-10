import "server-only";
import { and, count, eq, gte, isNull, ne } from "drizzle-orm";
import { db, businesses, calls, smsLog, type Business, type MessageChannel, type SmsKind } from "@/lib/db";
import { ALERT_AT, EXTRA_CALL_CENTS, PLAN, euros } from "@/lib/plans";
import { zonedParts, zonedToUtc } from "@/lib/time";
import { ownerOf } from "@/lib/dal";
import { appUrl, esc, sendEmail } from "@/lib/email";
import { notifyBusiness } from "@/lib/push";

/* Each shop's monthly allowance of missed calls (calendar month, shop's
   time zone). A call counts once when its caller got a message (outcome
   "texted"); the chat, booking, reminder and any SMS fallback are included. At
   the allowance the shop has chosen: pause until next month, or keep going at
   EXTRA_CALL_CENTS per extra missed call. */

const pad = (n: number) => String(n).padStart(2, "0");

export function monthOf(biz: Pick<Business, "timezone">, now = Date.now()) {
  const p = zonedParts(now, biz.timezone);
  return { key: `${p.y}-${pad(p.m)}`, start: zonedToUtc(`${p.y}-${pad(p.m)}-01`, "00:00", biz.timezone) };
}

export const allowanceOf = (biz: Pick<Business, "callLimit">) => biz.callLimit ?? PLAN.missedCalls;

export type Usage = { used: number; extra: number; limit: number; extraCents: number; month: string; stopped: boolean };

export async function usageThisMonth(biz: Business): Promise<Usage> {
  const { key, start } = monthOf(biz);
  const answered = and(eq(calls.businessId, biz.id), eq(calls.outcome, "texted"), gte(calls.createdAt, start));
  const [[all], [over]] = await Promise.all([
    db.select({ n: count() }).from(calls).where(answered),
    // Flagged when answered, so a later change of limit or choice never bills a shop retroactively
    db.select({ n: count() }).from(calls).where(and(answered, eq(calls.extra, true))),
  ]);
  const limit = allowanceOf(biz);
  const used = all?.n ?? 0;
  const extra = over?.n ?? 0;
  return { used, extra, limit, extraCents: extra * EXTRA_CALL_CENTS, month: key, stopped: used >= limit && !biz.allowExtraCalls };
}

/** May RingLoop answer one more missed call for this shop this month? `extra` = it's billed on top. */
export async function mayAnswer(biz: Business): Promise<{ ok: true; extra: boolean } | { ok: false }> {
  const u = await usageThisMonth(biz);
  if (u.used < u.limit) return { ok: true, extra: false };
  return biz.allowExtraCalls ? { ok: true, extra: true } : { ok: false };
}

/** What RingLoop paid to send this month (for the team's cost view in /admin, not billed to the shop). */
export async function messagesThisMonth(biz: Business) {
  const { start } = monthOf(biz);
  const rows = await db
    .select({ channel: smsLog.channel, n: count() })
    .from(smsLog)
    .where(and(eq(smsLog.businessId, biz.id), gte(smsLog.createdAt, start), ne(smsLog.kind, "test"), isNull(smsLog.error)))
    .groupBy(smsLog.channel);
  const of = (c: MessageChannel) => rows.find((r) => r.channel === c)?.n ?? 0;
  return { whatsapp: of("whatsapp"), sms: of("sms") };
}

/** Logs a sent (or failed) message RingLoop pays for. Bodies are never stored. */
export async function recordMessage(
  biz: Business,
  m: { kind: SmsKind; channel: MessageChannel; to: string; sid: string | null; error: string | null; ref?: string },
) {
  await db.insert(smsLog).values({
    businessId: biz.id,
    kind: m.kind,
    channel: m.channel,
    toPhone: m.to,
    sid: m.sid,
    error: m.error,
    ref: m.ref ?? null,
  });
}

/** After a missed call was answered: heads-up to the owner at 80% and 100%. Never throws. */
export async function afterAnswered(biz: Business) {
  await maybeAlert(biz).catch((e) => console.error("[usage] alert:", e));
}

async function maybeAlert(biz: Business) {
  const u = await usageThisMonth(biz);
  const level = [...ALERT_AT].reverse().find((share) => u.used >= Math.ceil(u.limit * share));
  if (!level) return;
  const tag = `${u.month}:${Math.round(level * 100)}`;
  // One heads-up per level per month (and never a lower one after a higher one)
  const [current] = await db.select({ a: businesses.usageAlert }).from(businesses).where(eq(businesses.id, biz.id)).limit(1);
  const prev = current?.a ?? "";
  if (prev === tag || (prev.startsWith(u.month) && Number(prev.split(":")[1]) >= level * 100)) return;
  await db.update(businesses).set({ usageAlert: tag }).where(eq(businesses.id, biz.id));

  const full = level >= 1;
  const title = full ? `All ${u.limit} missed calls used this month` : `${u.used} of ${u.limit} missed calls used this month`;
  const body = full
    ? biz.allowExtraCalls
      ? `RingLoop keeps messaging your missed callers. Each extra missed call is ${euros(EXTRA_CALL_CENTS)}, added to your next bill.`
      : "Missed callers won't get a message until the 1st. You'll still see every missed call in the app, so you can call back."
    : `You've used ${u.used} of the ${u.limit} missed calls in your plan this month.`;
  await notifyBusiness(biz.id, { title, body, url: "/settings?s=plan" });
  const owner = await ownerOf(biz.id);
  if (owner) {
    await sendEmail({
      to: owner.email,
      subject: title,
      html: `<p>Hi ${esc(owner.name)},</p><p>${esc(body)}</p><p><a href="${appUrl()}/settings?s=plan">See your plan</a></p>`,
    });
  }
}
