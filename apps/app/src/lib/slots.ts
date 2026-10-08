import "server-only";
import { and, eq, gt, lt } from "drizzle-orm";
import { db, bookings, type Business } from "@/lib/db";
import { addDays, fromMinutes, toMinutes, weekdayOf, zonedParts, zonedToUtc } from "@/lib/time";

/* Free start times for one service on one day: inside opening hours, after the
   lead time, inside the booking horizon, and with fewer overlapping bookings
   than the business can serve at once (its capacity). */

export function bookableDates(biz: Business, now = Date.now()) {
  const local = zonedParts(now, biz.timezone);
  const out: { date: string; open: boolean }[] = [];
  for (let i = 0; i < Math.min(biz.horizonDays, 60); i++) {
    const date = addDays(local.date, i);
    const day = biz.hours[weekdayOf(date)];
    let open = day?.open ?? false;
    // Today counts as closed once there's no time left to start anything
    if (open && i === 0) {
      const earliest = local.h * 60 + local.min + biz.leadTimeMin;
      open = earliest < toMinutes(day.to);
    }
    out.push({ date, open });
  }
  return out;
}

export async function freeSlots(biz: Business, durationMin: number, date: string, now = Date.now()) {
  const day = biz.hours[weekdayOf(date)];
  if (!day?.open) return [];

  const dates = bookableDates(biz, now).map((d) => d.date);
  if (!dates.includes(date)) return [];

  const open = toMinutes(day.from);
  const close = toMinutes(day.to);
  const step = Math.max(5, biz.slotIntervalMin);
  const earliest = now + biz.leadTimeMin * 60_000;

  const dayStart = zonedToUtc(date, "00:00", biz.timezone);
  const dayEnd = zonedToUtc(addDays(date, 1), "00:00", biz.timezone);
  const taken = await db
    .select({ startsAt: bookings.startsAt, endsAt: bookings.endsAt })
    .from(bookings)
    .where(
      and(
        eq(bookings.businessId, biz.id),
        eq(bookings.status, "confirmed"),
        lt(bookings.startsAt, dayEnd),
        gt(bookings.endsAt, dayStart),
      ),
    );

  const slots: { time: string; startsAt: number }[] = [];
  for (let m = open; m + durationMin <= close; m += step) {
    const time = fromMinutes(m);
    const startsAt = zonedToUtc(date, time, biz.timezone);
    if (startsAt < earliest) continue;
    const endsAt = startsAt + durationMin * 60_000;
    const overlapping = taken.filter((b) => b.startsAt < endsAt && b.endsAt > startsAt).length;
    if (overlapping < Math.max(1, biz.capacity)) slots.push({ time, startsAt });
  }
  return slots;
}

/** Re-checks a single start time right before a booking is written. */
export async function isSlotFree(biz: Business, durationMin: number, startsAt: number, now = Date.now()) {
  const p = zonedParts(startsAt, biz.timezone);
  const slots = await freeSlots(biz, durationMin, p.date, now);
  return slots.some((s) => s.startsAt === startsAt);
}
