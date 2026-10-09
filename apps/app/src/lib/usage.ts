import "server-only";
import { and, count, eq, gte, isNull, ne } from "drizzle-orm";
import { db, businesses, smsLog, type Business, type MessageChannel, type SmsKind } from "@/lib/db";
import { ALERT_AT, EXTRA_MESSAGE_CENTS, PLANS, euros } from "@/lib/plans";
import { zonedParts, zonedToUtc } from "@/lib/time";
import { ownerOf } from "@/lib/dal";
import { appUrl, esc, sendEmail } from "@/lib/email";
import { notifyBusiness } from "@/lib/push";

/* Each shop's monthly message allowance (calendar month, shop's time zone).
   At the allowance the shop has chosen: stop sending until next month, or keep
   going and pay EXTRA_MESSAGE_CENTS per extra message. Test texts don't count. */

const pad = (n: number) => String(n).padStart(2, "0");

export function monthOf(biz: Pick<Business, "timezone">, now = Date.now()) {
  const p = zonedParts(now, biz.timezone);
  return { key: `${p.y}-${pad(p.m)}`, start: zonedToUtc(`${p.y}-${pad(p.m)}-01`, "00:00", biz.timezone) };
}

export const allowanceOf = (biz: Pick<Business, "messageLimit" | "plan">) => biz.messageLimit ?? PLANS[biz.plan].messages;

export type Usage = { used: number; extra: number; limit: number; extraCents: number; month: string; stopped: boolean };

export async function usageThisMonth(biz: Business): Promise<Usage> {
  const { key, start } = monthOf(biz);
  const counted = and(eq(smsLog.businessId, biz.id), gte(smsLog.createdAt, start), ne(smsLog.kind, "test"), isNull(smsLog.error));
  const [[all], [over]] = await Promise.all([
    db.select({ n: count() }).from(smsLog).where(counted),
    db.select({ n: count() }).from(smsLog).where(and(counted, eq(smsLog.extra, true))),
  ]);
  const limit = allowanceOf(biz);
  const used = all?.n ?? 0;
  const extra = over?.n ?? 0;
  return { used, extra, limit, extraCents: extra * EXTRA_MESSAGE_CENTS, month: key, stopped: used >= limit && !biz.allowExtraMessages };
}

/** May this shop send one more paid message now? `extra` = it will be billed on top. */
export async function mayReach(biz: Business): Promise<{ ok: true; extra: boolean } | { ok: false }> {
  const u = await usageThisMonth(biz);
  if (u.used < u.limit) return { ok: true, extra: false };
  return biz.allowExtraMessages ? { ok: true, extra: true } : { ok: false };
}

/** Logs a sent (or failed) paid message and sends the owner a heads-up when needed. */
export async function recordMessage(
  biz: Business,
  m: { kind: SmsKind; channel: MessageChannel; to: string; sid: string | null; error: string | null; extra: boolean; ref?: string },
) {
  await db.insert(smsLog).values({
    businessId: biz.id,
    kind: m.kind,
    channel: m.channel,
    toPhone: m.to,
    sid: m.sid,
    error: m.error,
    extra: m.extra,
    ref: m.ref ?? null,
  });
  if (!m.error && m.kind !== "test") await maybeAlert(biz).catch((e) => console.error("[usage] alert:", e));
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
  const title = full ? "You've used this month's messages" : "80% of this month's messages used";
  const body = full
    ? biz.allowExtraMessages
      ? `${u.used} of ${u.limit} used. RingLoop keeps going at ${euros(EXTRA_MESSAGE_CENTS)} per extra message.`
      : `${u.used} of ${u.limit} used. Missed callers won't get messages until next month; you'll still see them in the app.`
    : `${u.used} of ${u.limit} messages used this month.`;
  await notifyBusiness(biz.id, { title, body, url: "/settings?s=plan" });
  const owner = await ownerOf(biz.id);
  if (owner) {
    await sendEmail({
      to: owner.email,
      subject: title,
      html: `<p>Hi ${esc(owner.name)},</p><p>${esc(body)}</p><p><a href="${appUrl()}/settings?s=plan">See your plan and messages</a></p>`,
    });
  }
}
