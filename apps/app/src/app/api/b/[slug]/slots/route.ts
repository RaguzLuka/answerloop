import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, businesses, services } from "@/lib/db";
import { freeSlots } from "@/lib/slots";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/* Public: free start times for one service on one day of a booking page. */
export async function GET(req: Request, ctx: RouteContext<"/api/b/[slug]/slots">) {
  const { slug } = await ctx.params;
  const url = new URL(req.url);
  const serviceId = url.searchParams.get("service") ?? "";
  const date = url.searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !serviceId) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!(await rateLimit(`slots:${await clientIp()}`, 240, 10 * 60))) {
    return NextResponse.json({ error: "Slow down" }, { status: 429 });
  }

  const [biz] = await db.select().from(businesses).where(eq(businesses.slug, slug)).limit(1);
  if (!biz || !biz.bookingEnabled || biz.status === "setup" || biz.status === "paused") {
    return NextResponse.json({ slots: [] });
  }
  const [service] = await db
    .select()
    .from(services)
    .where(and(eq(services.id, serviceId), eq(services.businessId, biz.id), eq(services.active, true)))
    .limit(1);
  if (!service) return NextResponse.json({ slots: [] });

  const slots = await freeSlots(biz, service.durationMin, date);
  return NextResponse.json({ slots }, { headers: { "Cache-Control": "no-store" } });
}
