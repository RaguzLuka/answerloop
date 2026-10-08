import { timingSafeEqual } from "node:crypto";
import { and, eq, gte, inArray, isNull, lt } from "drizzle-orm";
import { db, bookings, businesses } from "@/lib/db";
import { addDays, zonedParts, zonedToUtc } from "@/lib/time";
import { canReceiveSms, reminderText, sendBusinessSms } from "@/lib/sms";

/* Daily (Vercel cron, see vercel.json): text every customer booked for
   tomorrow. Vercel Hobby allows one run per day, so it runs mid-afternoon. */

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
      const res = await sendBusinessSms(biz, "reminder", b.customerPhone, reminderText(biz, b));
      if (res.ok) {
        sent++;
        await db.update(bookings).set({ reminderSentAt: Date.now() }).where(eq(bookings.id, b.id));
      } else failed++;
    }
  }
  return Response.json({ businesses: active.length, sent, failed });
}
