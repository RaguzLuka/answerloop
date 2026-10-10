"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, bookings, businesses, services, textbackLinks, type BookingStatus } from "@/lib/db";
import { requireBusiness } from "@/lib/dal";
import { fieldErrors, formValues, type FormState } from "@/lib/form";
import { normalizePhone } from "@/lib/phone";
import { isSlotFree } from "@/lib/slots";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { formatDay, formatTime, zonedToUtc } from "@/lib/time";
import { sendConfirmation } from "@/lib/sms";
import { afterCustomerBooking } from "@/lib/booking-effects";
import { syncBookingById } from "@/lib/google-calendar";
import { bookingCopy, type Lang } from "@/lib/booking-i18n";

const phone = z
  .string()
  .trim()
  .transform((s, ctx) => {
    const n = normalizePhone(s);
    if (!n) ctx.addIssue({ code: "custom", message: "Enter a mobile number like 091 234 5678" });
    return n ?? "";
  });

/* ── Added by the business in the app ───────────────────────── */

const ManualSchema = z.object({
  serviceId: z.string().min(1, "Pick a service"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Pick a time"),
  customerName: z.string().trim().min(1, "Who is it for?").max(80),
  customerPhone: phone,
  notes: z.string().trim().max(500).optional().default(""),
});

export async function createManualBooking(_: FormState, fd: FormData): Promise<FormState> {
  const { business } = await requireBusiness();
  const values = formValues(fd);
  const parsed = ManualSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const d = parsed.data;

  const [service] = await db
    .select()
    .from(services)
    .where(and(eq(services.id, d.serviceId), eq(services.businessId, business.id)))
    .limit(1);
  if (!service) return { errors: { serviceId: "Pick a service" }, values };

  const startsAt = zonedToUtc(d.date, d.time, business.timezone);
  const [booking] = await db.insert(bookings).values({
    businessId: business.id,
    serviceId: service.id,
    serviceName: service.name,
    customerName: d.customerName,
    customerPhone: d.customerPhone,
    notes: d.notes,
    startsAt,
    endsAt: startsAt + service.durationMin * 60_000,
    source: "manual",
  }).returning();
  after(() => syncBookingById(booking.id));
  const texted = fd.get("textCustomer") === "on" && business.confirmationsEnabled;
  if (texted) after(() => sendConfirmation(business, booking).catch((err) => console.error("[sms] confirmation:", err)));
  revalidatePath("/", "layout");
  return {
    ok: true,
    message: `Booked ${d.customerName} for ${formatDay(startsAt, business.timezone)} at ${d.time}${texted ? ". Confirmation text sent." : ""}`,
  };
}

export async function setBookingStatus(id: string, status: BookingStatus) {
  const { business } = await requireBusiness();
  if (!["confirmed", "cancelled", "completed", "no_show"].includes(status)) return;
  await db
    .update(bookings)
    .set({ status })
    .where(and(eq(bookings.id, id), eq(bookings.businessId, business.id)));
  after(() => syncBookingById(id));
  revalidatePath("/", "layout");
}

/* ── Made by a customer on the public booking page ──────────── */

const publicSchema = (e: ReturnType<typeof bookingCopy>["errors"]) =>
  z.object({
    slug: z.string().min(1).max(60),
    serviceId: z.string().min(1).max(64),
    startsAt: z.coerce.number().int().positive(),
    customerName: z.string().trim().min(2, e.name).max(80),
    customerPhone: z
      .string()
      .trim()
      .transform((s, ctx) => {
        const n = normalizePhone(s);
        if (!n) ctx.addIssue({ code: "custom", message: e.phone });
        return n ?? "";
      }),
    notes: z.string().trim().max(300).optional().default(""),
    consent: z.literal("on", { error: e.consent }),
  });

export type PublicBookingResult =
  | { ok: true; summary: { service: string; day: string; time: string; business: string } }
  | { ok: false; error?: string; errors?: Record<string, string>; slotGone?: boolean };

export async function createPublicBooking(input: Record<string, string>): Promise<PublicBookingResult> {
  const [biz] = await db.select().from(businesses).where(eq(businesses.slug, String(input.slug ?? ""))).limit(1);
  const lang: Lang = biz?.smsLanguage ?? "hr";
  const copy = bookingCopy(lang, biz?.type ?? "other", biz?.name ?? "");
  const e = copy.errors;

  const parsed = publicSchema(e).safeParse(input);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const d = parsed.data;

  const ip = await clientIp();
  const allowed =
    (await rateLimit(`book:ip:${ip}`, 8, 60 * 60)) && (await rateLimit(`book:phone:${d.customerPhone}`, 4, 24 * 60 * 60));
  if (!allowed) return { ok: false, error: e.tooMany };

  if (!biz || !biz.bookingEnabled || biz.status === "setup" || biz.status === "paused") {
    return { ok: false, error: e.closed };
  }
  const [service] = await db
    .select()
    .from(services)
    .where(and(eq(services.id, d.serviceId), eq(services.businessId, biz.id), eq(services.active, true)))
    .limit(1);
  if (!service) return { ok: false, error: e.service };

  if (!(await isSlotFree(biz, service.durationMin, d.startsAt))) {
    return { ok: false, slotGone: true, error: e.taken };
  }

  // Came from a missed call's text-back? (tracked link token in ?r=)
  const ref = String(input.ref ?? "");
  const [link] = /^[A-Za-z0-9_-]{6,20}$/.test(ref)
    ? await db
        .select({ callId: textbackLinks.callId })
        .from(textbackLinks)
        .where(and(eq(textbackLinks.token, ref), eq(textbackLinks.businessId, biz.id)))
        .limit(1)
    : [];

  const [booking] = await db.insert(bookings).values({
    businessId: biz.id,
    serviceId: service.id,
    serviceName: service.name,
    customerName: d.customerName,
    customerPhone: d.customerPhone,
    notes: d.notes,
    startsAt: d.startsAt,
    endsAt: d.startsAt + service.durationMin * 60_000,
    source: "link",
    callId: link?.callId ?? null,
  }).returning();

  const time = formatTime(d.startsAt, biz.timezone);
  after(() => afterCustomerBooking(biz, booking, "link"));
  revalidatePath("/", "layout");
  const customerDay = new Intl.DateTimeFormat(copy.locale, {
    timeZone: biz.timezone, weekday: "long", day: "numeric", month: "long",
  }).format(d.startsAt);
  return { ok: true, summary: { service: service.name, day: customerDay, time, business: biz.name } };
}
