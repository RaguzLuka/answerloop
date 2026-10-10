import "server-only";
import { eq } from "drizzle-orm";
import { db, bookings, businesses, type Booking, type Business } from "@/lib/db";
import { appUrl } from "@/lib/email";
import { open, seal } from "@/lib/secret-box";
import { zonedToUtc } from "@/lib/time";

/* The owner's Google Calendar, both ways:
   - their own (timed, "busy") events block those times for bookings
   - every RingLoop booking appears in their calendar (and disappears if cancelled)
   GOOGLE_DRY_RUN=true (development only) fakes Google: a daily 13:00–14:00 "busy"
   event and printed writes, so the whole flow can be tried locally. */

const SCOPES = ["openid", "email", "https://www.googleapis.com/auth/calendar.events"];
const API = "https://www.googleapis.com/calendar/v3";
const dryRun = () => process.env.GOOGLE_DRY_RUN === "true" && process.env.NODE_ENV !== "production";

export const googleConfigured = () => dryRun() || !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const redirectUri = () => `${appUrl()}/api/google/callback`;

type Link = { refreshToken: string; calendarId: string };
const linkOf = (biz: Pick<Business, "googleCalEnc">): Link | null => {
  const raw = biz.googleCalEnc ? open(biz.googleCalEnc) : null;
  try {
    return raw ? (JSON.parse(raw) as Link) : null;
  } catch {
    return null;
  }
};
export const googleLinked = (biz: Pick<Business, "googleCalEnc">) => !!linkOf(biz);

export function googleAuthUrl(state: string) {
  if (dryRun()) return `${appUrl()}/api/google/callback?code=dry-code&state=${encodeURIComponent(state)}`;
  const q = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${q}`;
}

/** Exchanges the OAuth code and saves the link (encrypted) on the business. */
export async function linkGoogle(businessId: string, code: string) {
  let refreshToken = "dry-refresh-token";
  let email = "owner@gmail.example";
  if (!dryRun()) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri(),
        grant_type: "authorization_code",
      }),
    });
    const data = (await res.json()) as { refresh_token?: string; id_token?: string; error?: string };
    if (!res.ok || !data.refresh_token) throw new Error(data.error ?? "Google didn't return access");
    refreshToken = data.refresh_token;
    // The ID token came straight from Google over TLS; we only read the email for display
    const payload = data.id_token?.split(".")[1];
    if (payload) email = (JSON.parse(Buffer.from(payload, "base64url").toString()) as { email?: string }).email ?? email;
  }
  await db
    .update(businesses)
    .set({ googleCalEnc: seal(JSON.stringify({ refreshToken, calendarId: "primary" } satisfies Link)), googleCalEmail: email })
    .where(eq(businesses.id, businessId));
}

export async function unlinkGoogle(businessId: string) {
  await db.update(businesses).set({ googleCalEnc: null, googleCalEmail: null }).where(eq(businesses.id, businessId));
}

const tokenCache = new Map<string, { token: string; until: number }>();

async function accessToken(biz: Business): Promise<{ token: string; calendarId: string } | null> {
  const link = linkOf(biz);
  if (!link) return null;
  if (dryRun()) return { token: "dry", calendarId: link.calendarId };
  const hit = tokenCache.get(biz.id);
  if (hit && hit.until > Date.now()) return { token: hit.token, calendarId: link.calendarId };
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: link.refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!res.ok || !data.access_token) {
    console.error("[google] token refresh failed:", res.status);
    return null;
  }
  tokenCache.set(biz.id, { token: data.access_token, until: Date.now() + ((data.expires_in ?? 3600) - 60) * 1000 });
  return { token: data.access_token, calendarId: link.calendarId };
}

/** Busy intervals from the owner's own calendar (RingLoop's own events excluded). */
export async function googleBusy(biz: Business, fromMs: number, toMs: number): Promise<{ start: number; end: number }[]> {
  const auth = await accessToken(biz);
  if (!auth) return [];
  if (dryRun()) {
    const date = new Intl.DateTimeFormat("en-CA", { timeZone: biz.timezone }).format(fromMs);
    return [{ start: zonedToUtc(date, "13:00", biz.timezone), end: zonedToUtc(date, "14:00", biz.timezone) }];
  }
  const q = new URLSearchParams({
    timeMin: new Date(fromMs).toISOString(),
    timeMax: new Date(toMs).toISOString(),
    singleEvents: "true",
    maxResults: "250",
    fields: "items(start,end,transparency,status,extendedProperties)",
  });
  try {
    const res = await fetch(`${API}/calendars/${encodeURIComponent(auth.calendarId)}/events?${q}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      items?: {
        start?: { dateTime?: string };
        end?: { dateTime?: string };
        transparency?: string;
        status?: string;
        extendedProperties?: { private?: Record<string, string> };
      }[];
    };
    return (data.items ?? [])
      .filter((e) => e.start?.dateTime && e.end?.dateTime) // all-day events (holidays, birthdays) don't block
      .filter((e) => e.transparency !== "transparent" && e.status !== "cancelled")
      .filter((e) => !e.extendedProperties?.private?.ringloopBooking) // our own bookings are already counted
      .map((e) => ({ start: Date.parse(e.start!.dateTime!), end: Date.parse(e.end!.dateTime!) }));
  } catch {
    return []; // never block bookings because Google is slow
  }
}

/** Puts a booking into (or, when cancelled, takes it out of) the owner's Google Calendar. */
export async function syncBookingToGoogle(biz: Business, booking: Booking) {
  const auth = await accessToken(biz);
  if (!auth) return;
  const base = `${API}/calendars/${encodeURIComponent(auth.calendarId)}/events`;
  const active = booking.status === "confirmed" || booking.status === "completed";

  if (!active && booking.googleEventId) {
    if (dryRun()) console.log(`\n[google] delete event ${booking.googleEventId}\n`);
    else await fetch(`${base}/${booking.googleEventId}`, { method: "DELETE", headers: { Authorization: `Bearer ${auth.token}` } }).catch(() => {});
    await db.update(bookings).set({ googleEventId: null }).where(eq(bookings.id, booking.id));
    return;
  }
  if (!active || booking.googleEventId) return;

  const event = {
    summary: `${booking.serviceName} – ${booking.customerName}`,
    description: `${booking.customerPhone}${booking.notes ? `\n${booking.notes}` : ""}\n\nRingLoop`,
    start: { dateTime: new Date(booking.startsAt).toISOString() },
    end: { dateTime: new Date(booking.endsAt).toISOString() },
    extendedProperties: { private: { ringloopBooking: booking.id } },
  };
  let id: string | undefined;
  if (dryRun()) {
    id = `dry-event-${booking.id.slice(0, 8)}`;
    console.log(`\n[google] add "${event.summary}" ${event.start.dateTime}\n`);
  } else {
    const res = await fetch(base, {
      method: "POST",
      headers: { Authorization: `Bearer ${auth.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(event),
    }).catch(() => null);
    if (res?.ok) id = ((await res.json()) as { id?: string }).id;
    else console.error("[google] adding event failed:", res?.status);
  }
  if (id) await db.update(bookings).set({ googleEventId: id }).where(eq(bookings.id, booking.id));
}

/** Convenience for places that only have ids (after() callbacks). */
export async function syncBookingById(bookingId: string) {
  const [row] = await db
    .select({ booking: bookings, biz: businesses })
    .from(bookings)
    .innerJoin(businesses, eq(businesses.id, bookings.businessId))
    .where(eq(bookings.id, bookingId))
    .limit(1);
  if (row && googleLinked(row.biz)) await syncBookingToGoogle(row.biz, row.booking).catch((e) => console.error("[google] sync:", e));
}
