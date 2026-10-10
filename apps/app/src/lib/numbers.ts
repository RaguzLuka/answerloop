import "server-only";
import { and, asc, eq, isNull, ne } from "drizzle-orm";
import { db, businesses, phoneNumbers, type Business, type BusinessStatus } from "@/lib/db";
import { ownerOf } from "@/lib/dal";
import { appUrl, esc, sendEmail } from "@/lib/email";
import { formatPhone } from "@/lib/phone";
import { twilioConfigured, twilioRouteNumber } from "@/lib/twilio";

/* RingLoop numbers: the team loads Twilio numbers into a pool in /admin; each
   business that finishes setup gets the next free one automatically, and the
   number's incoming-call webhook is pointed at this app. */

export type AssignResult = { routed: boolean; note?: string };

async function route(number: string): Promise<AssignResult> {
  const base = appUrl();
  if (!twilioConfigured()) return { routed: false, note: "Twilio keys not set, so the webhook was not configured" };
  if (!base.startsWith("https://")) return { routed: false, note: "Not routed: the app has no public https URL here" };
  const res = await twilioRouteNumber(number, `${base}/api/twilio/voice`);
  return res.ok ? { routed: true } : { routed: false, note: res.error };
}

/** Gives `biz` this number (or takes it away with null), keeping the pool in sync. */
export async function assignNumberTo(biz: Business, number: string | null): Promise<AssignResult> {
  if (number) {
    const [owner] = await db
      .select({ id: businesses.id })
      .from(businesses)
      .where(and(eq(businesses.ringloopNumber, number), ne(businesses.id, biz.id)))
      .limit(1);
    if (owner) throw new Error("That number already belongs to another business");
  }

  const status: BusinessStatus =
    number && biz.status === "number_pending"
      ? "forwarding"
      : !number && (biz.status === "forwarding" || biz.status === "live")
        ? "number_pending"
        : biz.status;

  await db.update(businesses).set({ ringloopNumber: number, status, updatedAt: Date.now() }).where(eq(businesses.id, biz.id));
  await db.update(phoneNumbers).set({ businessId: null }).where(eq(phoneNumbers.businessId, biz.id));
  if (number) {
    await db
      .insert(phoneNumbers)
      .values({ number, businessId: biz.id })
      .onConflictDoUpdate({ target: phoneNumbers.number, set: { businessId: biz.id } });
  }
  if (!number || number === biz.ringloopNumber) return { routed: false };

  const result = await route(number);
  const owner = await ownerOf(biz.id);
  if (owner) {
    await sendEmail({
      to: owner.email,
      subject: "Your RingLoop number is ready: one last step",
      html: `<p>Hi ${esc(owner.name)},</p>
        <p>Your RingLoop number for <strong>${esc(biz.name)}</strong> is <strong>${esc(formatPhone(number))}</strong>.</p>
        <p>The last step takes a minute: forward your missed calls to it. Open the app and follow the steps:
        <a href="${appUrl()}/dashboard">open RingLoop</a>.</p>
        <p>Prefer that we do it with you? Reply to this email or request a visit in the app.</p>`,
    });
  }
  return result;
}

/** Hands the next free pool number to `biz`. Returns the number, or null if the pool is empty. */
export async function claimPoolNumber(biz: Business): Promise<string | null> {
  const [free] = await db
    .select()
    .from(phoneNumbers)
    .where(isNull(phoneNumbers.businessId))
    .orderBy(asc(phoneNumbers.createdAt))
    .limit(1);
  if (!free) return null;
  // Claim atomically so two simultaneous sign-ups can't get the same number
  const claimed = await db
    .update(phoneNumbers)
    .set({ businessId: biz.id })
    .where(and(eq(phoneNumbers.number, free.number), isNull(phoneNumbers.businessId)))
    .returning();
  if (!claimed.length) return null;
  await assignNumberTo(biz, free.number);
  return free.number;
}
