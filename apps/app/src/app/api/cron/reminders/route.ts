import { timingSafeEqual } from "node:crypto";
import { and, eq, gte, inArray, isNull, lt } from "drizzle-orm";
import { db, bookings, businesses } from "@/lib/db";
import { addDays, zonedParts, zonedToUtc } from "@/lib/time";
import { canReceiveSms, reminderText, sendBusinessSms } from "@/lib/sms";
import { senderFor, waSendTemplate, whatsappReady } from "@/lib/whatsapp";
import { recordMessage } from "@/lib/usage";
import { formatPhone } from "@/lib/phone";
import type { Booking, Business } from "@/lib/db";

/* Daily (Vercel cron, see vercel.json): remind every customer booked for
   tomorrow — on WhatsApp from the shop's own number when it's connected
   (cheaper; SMS if it doesn't arrive), otherwise by SMS. Reminders are included
   in the plan (shops pay per missed call answered). Vercel Hobby allows one run per day. */

async function remindOnWhatsApp(biz: Business, b: Booking) {
  const sender = senderFor(biz);
  if (!sender || !whatsappReady() || !biz.whatsappEnabled) return null; // not available: use SMS
  const time = new Intl.DateTimeFormat("hr-HR", { timeZone: biz.timezone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(b.startsAt);
  const lang = biz.smsLanguage === "en" ? "en" : "hr";
  const res = await waSendTemplate(sender, b.customerPhone, "reminder", lang, [biz.name, time, biz.phone ? formatPhone(biz.phone) : "-"], reminderText(biz, b));
  await recordMessage(biz, {
    kind: "reminder", channel: "whatsapp", to: b.customerPhone, ref: b.id,
    sid: res.ok ? res.id : null, error: res.ok ? null : res.error,
  });
  return { ok: res.ok };
}

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get("authorization") ?? "";
  if (!secret) return false; // fail closed
  const a = Buffer.from(header);
  const b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  if (!authorized(req)) return new Response("Unauthorized", { status: 401 });

  const active = await db
    .select()
    .from(businesses)
    .where(and(eq(businesses.remindersEnabled, true), inArray(businesses.status, ["number_pending", "forwarding", "live"])));

  let sent = 0;
  let failed = 0;
  for (const biz of active) {
    const tomorrow = addDays(zonedParts(Date.now(), biz.timezone).date, 1);
    const start = zonedToUtc(tomorrow, "00:00", biz.timezone);
    const end = zonedToUtc(addDays(tomorrow, 1), "00:00", biz.timezone);
    const due = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.businessId, biz.id),
          eq(bookings.status, "confirmed"),
          isNull(bookings.reminderSentAt),
          gte(bookings.startsAt, start),
          lt(bookings.startsAt, end),
        ),
      );
    for (const b of due) {
      if (!canReceiveSms(b.customerPhone)) continue;
      const res = (await remindOnWhatsApp(biz, b)) ?? (await sendBusinessSms(biz, "reminder", b.customerPhone, reminderText(biz, b), b.id));
      if (res.ok) {
        sent++;
        await db.update(bookings).set({ reminderSentAt: Date.now() }).where(eq(bookings.id, b.id));
      } else failed++;
    }
  }
  return Response.json({ businesses: active.length, sent, failed });
}
