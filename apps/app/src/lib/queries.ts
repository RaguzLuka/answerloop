import "server-only";
import { and, asc, count, desc, eq, gte, inArray, lt } from "drizzle-orm";
import { db, bookings, calls, visitRequests, type Business } from "@/lib/db";
import { addDays, zonedParts, zonedToUtc } from "@/lib/time";

export function dayBounds(biz: Business, date: string) {
  return { start: zonedToUtc(date, "00:00", biz.timezone), end: zonedToUtc(addDays(date, 1), "00:00", biz.timezone) };
}

export function today(biz: Business) {
  return zonedParts(Date.now(), biz.timezone).date;
}

/** Whole days left in a free trial (0 when it's over) */
export function trialDaysLeft(endsAt: number) {
  return Math.max(0, Math.ceil((endsAt - Date.now()) / (24 * 60 * 60 * 1000)));
}

/** The business's local clock right now */
export function localNow(biz: Business) {
  return zonedParts(Date.now(), biz.timezone);
}

export async function upcomingBookings(biz: Business, limit = 200) {
  const { start } = dayBounds(biz, today(biz));
  return db
    .select()
    .from(bookings)
    .where(and(eq(bookings.businessId, biz.id), gte(bookings.startsAt, start), inArray(bookings.status, ["confirmed"])))
    .orderBy(asc(bookings.startsAt))
    .limit(limit);
}

export async function pastBookings(biz: Business, limit = 100) {
  const { start } = dayBounds(biz, today(biz));
  return db
    .select()
    .from(bookings)
    .where(and(eq(bookings.businessId, biz.id), lt(bookings.startsAt, start)))
    .orderBy(desc(bookings.startsAt))
    .limit(limit);
}

export async function cancelledUpcoming(biz: Business, limit = 50) {
  const { start } = dayBounds(biz, today(biz));
  return db
    .select()
    .from(bookings)
    .where(and(eq(bookings.businessId, biz.id), gte(bookings.startsAt, start), inArray(bookings.status, ["cancelled", "no_show", "completed"])))
    .orderBy(asc(bookings.startsAt))
    .limit(limit);
}

export async function linkBookingsInLastDays(biz: Business, days: number) {
  const sinceMs = Date.now() - days * 24 * 60 * 60 * 1000;
  const [row] = await db
    .select({ n: count() })
    .from(bookings)
    .where(and(eq(bookings.businessId, biz.id), eq(bookings.source, "link"), gte(bookings.createdAt, sinceMs)));
  return row?.n ?? 0;
}

export async function textedCallsInLastDays(biz: Business, days: number) {
  const sinceMs = Date.now() - days * 24 * 60 * 60 * 1000;
  const [row] = await db
    .select({ n: count() })
    .from(calls)
    .where(and(eq(calls.businessId, biz.id), eq(calls.outcome, "texted"), gte(calls.createdAt, sinceMs)));
  return row?.n ?? 0;
}

export async function visitsFor(businessId: string) {
  return db.select().from(visitRequests).where(eq(visitRequests.businessId, businessId)).orderBy(desc(visitRequests.createdAt));
}
