import "server-only";
import { headers } from "next/headers";
import { sql } from "drizzle-orm";
import { db, rateLimits } from "@/lib/db";

/** Fixed-window limiter stored in the database, so it holds across serverless
 *  instances. Returns false once `key` has been hit more than `limit` times. */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  const now = Date.now();
  const resetAt = now + windowSec * 1000;
  const [row] = await db
    .insert(rateLimits)
    .values({ key, count: 1, resetAt })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`CASE WHEN ${rateLimits.resetAt} < ${now} THEN 1 ELSE ${rateLimits.count} + 1 END`,
        resetAt: sql`CASE WHEN ${rateLimits.resetAt} < ${now} THEN ${resetAt} ELSE ${rateLimits.resetAt} END`,
      },
    })
    .returning({ count: rateLimits.count });
  return row.count <= limit;
}

export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
}
