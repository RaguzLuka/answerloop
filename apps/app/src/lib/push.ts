import "server-only";
import webpush from "web-push";
import { eq, inArray } from "drizzle-orm";
import { db, memberships, pushSubscriptions } from "@/lib/db";

/* Web push to the owner's installed app (iPhone needs the app added to the
   home screen, iOS 16.4+). Needs VAPID keys; without them this is a no-op. */

let ready: boolean | undefined;
function configure() {
  if (ready !== undefined) return ready;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  ready = !!(pub && priv);
  if (ready) webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? "mailto:hello@ringloop.net", pub!, priv!);
  return ready;
}

export const pushConfigured = () => configure();

export async function notifyBusiness(businessId: string, msg: { title: string; body: string; url: string }) {
  if (!configure()) return;
  const members = await db.select({ userId: memberships.userId }).from(memberships).where(eq(memberships.businessId, businessId));
  if (!members.length) return;
  const subs = await db
    .select()
    .from(pushSubscriptions)
    .where(inArray(pushSubscriptions.userId, members.map((m) => m.userId)));

  const gone: string[] = [];
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify(msg),
          { TTL: 60 * 60 * 12 },
        );
      } catch (err) {
        const code = (err as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) gone.push(s.endpoint); // unsubscribed / expired
        else console.error("[push] send failed:", code ?? err);
      }
    }),
  );
  if (gone.length) await db.delete(pushSubscriptions).where(inArray(pushSubscriptions.endpoint, gone));
}
