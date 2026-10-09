import { and, eq, gte } from "drizzle-orm";
import { db, bookings, businesses } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/* Calendar subscription feed (iPhone, Google, Outlook…): the shop's bookings
   as an .ics file. The token in the URL is the only key — regenerate it in
   Settings if it leaks. */

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** iCalendar lines must be folded at 75 octets */
const fold = (line: string) => {
  const out: string[] = [];
  let rest = line;
  while (Buffer.byteLength(rest) > 74) {
    let cut = 74;
    while (Buffer.byteLength(rest.slice(0, cut)) > 74) cut--;
    out.push(rest.slice(0, cut));
    rest = " " + rest.slice(cut);
  }
  out.push(rest);
  return out.join("\r\n");
};

export async function GET(_: Request, ctx: RouteContext<"/api/cal/[token]">) {
  const token = (await ctx.params).token.replace(/\.ics$/, "");
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token)) return new Response("Not found", { status: 404 });
  if (!(await rateLimit(`cal:${await clientIp()}`, 120, 60 * 60))) return new Response("Slow down", { status: 429 });

  const [biz] = await db.select().from(businesses).where(eq(businesses.calendarToken, token)).limit(1);
  if (!biz) return new Response("Not found", { status: 404 });

  const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const list = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.businessId, biz.id), gte(bookings.startsAt, since)));

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RingLoop//Bookings//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(`RingLoop · ${biz.name}`)}`,
    `X-WR-TIMEZONE:${biz.timezone}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT15M",
    "X-PUBLISHED-TTL:PT15M",
  ];
  for (const b of list) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${b.id}@ringloop.net`,
      `DTSTAMP:${stamp(b.createdAt)}`,
      `DTSTART:${stamp(b.startsAt)}`,
      `DTEND:${stamp(b.endsAt)}`,
      `SUMMARY:${esc(`${b.serviceName} – ${b.customerName}`)}`,
      `DESCRIPTION:${esc(`${b.customerPhone}${b.notes ? `\n${b.notes}` : ""}`)}`,
      `STATUS:${b.status === "cancelled" ? "CANCELLED" : "CONFIRMED"}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");

  return new Response(lines.map(fold).join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="ringloop-${biz.slug}.ics"`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
