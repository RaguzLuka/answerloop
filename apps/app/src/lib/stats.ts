import "server-only";
import { and, count, eq, gte, isNotNull, ne } from "drizzle-orm";
import { db, bookings, calls, chats, textbackLinks } from "@/lib/db";

export type Funnel = { missed: number; texted: number; opened: number; booked: number };

/** The pilot numbers: missed calls → texted → link/chat opened → booked. */
export async function missedCallFunnel(businessId: string, days = 30): Promise<Funnel> {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const n = (rows: { n: number }[]) => rows[0]?.n ?? 0;
  const [missed, texted, chatOpened, linkOpened, booked] = await Promise.all([
    db.select({ n: count() }).from(calls).where(and(eq(calls.businessId, businessId), gte(calls.createdAt, since))),
    db
      .select({ n: count() })
      .from(calls)
      .where(and(eq(calls.businessId, businessId), eq(calls.outcome, "texted"), gte(calls.createdAt, since))),
    db
      .select({ n: count() })
      .from(chats)
      .where(and(eq(chats.businessId, businessId), isNotNull(chats.callId), isNotNull(chats.openedAt), gte(chats.createdAt, since))),
    db
      .select({ n: count() })
      .from(textbackLinks)
      .where(
        and(eq(textbackLinks.businessId, businessId), isNotNull(textbackLinks.callId), isNotNull(textbackLinks.openedAt), gte(textbackLinks.createdAt, since)),
      ),
    db
      .select({ n: count() })
      .from(bookings)
      .where(and(eq(bookings.businessId, businessId), isNotNull(bookings.callId), ne(bookings.status, "cancelled"), gte(bookings.createdAt, since))),
  ]);
  return { missed: n(missed), texted: n(texted), opened: n(chatOpened) + n(linkOpened), booked: n(booked) };
}
