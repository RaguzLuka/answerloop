"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, pushSubscriptions } from "@/lib/db";
import { getBusinessFor, requireUser } from "@/lib/dal";
import { notifyBusiness } from "@/lib/push";

const Sub = z.object({
  endpoint: z.url().max(1000),
  keys: z.object({ p256dh: z.string().min(1).max(200), auth: z.string().min(1).max(100) }),
});

export async function savePushSubscription(input: unknown) {
  const user = await requireUser();
  const parsed = Sub.safeParse(input);
  if (!parsed.success) return { ok: false };
  const { endpoint, keys } = parsed.data;
  await db
    .insert(pushSubscriptions)
    .values({ endpoint, userId: user.id, p256dh: keys.p256dh, auth: keys.auth })
    .onConflictDoUpdate({ target: pushSubscriptions.endpoint, set: { userId: user.id, p256dh: keys.p256dh, auth: keys.auth } });

  const row = await getBusinessFor(user.id);
  if (row) {
    await notifyBusiness(row.business.id, {
      title: "Notifications are on",
      body: "You'll get a ping here for new bookings and missed calls.",
      url: "/dashboard",
    });
  }
  return { ok: true };
}

export async function removePushSubscription(endpoint: string) {
  const user = await requireUser();
  await db
    .delete(pushSubscriptions)
    .where(and(eq(pushSubscriptions.endpoint, String(endpoint).slice(0, 1000)), eq(pushSubscriptions.userId, user.id)));
  return { ok: true };
}
