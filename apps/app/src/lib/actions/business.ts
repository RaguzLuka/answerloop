"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, inArray, like, notInArray } from "drizzle-orm";
import { z } from "zod";
import { db, businesses, memberships, services, visitRequests, type Business, type WeekHours } from "@/lib/db";
import { BUSINESS_TYPES, businessType, defaultTextback, suggestSender } from "@/lib/business-types";
import { getBusinessFor, requireBusiness, requireUser } from "@/lib/dal";
import { fieldErrors, formValues, type FormState } from "@/lib/form";
import { formatPhone, normalizePhone } from "@/lib/phone";
import { appUrl, esc, sendEmail, teamInbox } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { claimPoolNumber } from "@/lib/numbers";
import { canReceiveSms, sendBusinessSms } from "@/lib/sms";
import { textbackBody, textbackLink } from "@/lib/missed-call";

/* Each setup step saves through one of these. Submitted from the wizard
   (hidden input `_setup`), they move on to the next step; from Settings they
   just save and report back. */

const SETUP_STEPS = 6;
const TRIAL_DAYS = 30;

async function afterSave(fd: FormData, biz: Pick<Business, "id" | "setupStep">, step: number): Promise<FormState> {
  revalidatePath("/", "layout");
  if (fd.get("_setup")) {
    const next = Math.min(step + 1, SETUP_STEPS);
    if (biz.setupStep < next) await db.update(businesses).set({ setupStep: next }).where(eq(businesses.id, biz.id));
    redirect(`/setup?step=${next}`);
  }
  return { ok: true, message: "Saved" };
}

const touch = () => ({ updatedAt: Date.now() });

/* ── Step 1: the business ───────────────────────────────────── */

const phoneField = z
  .string()
  .trim()
  .transform((s, ctx) => {
    if (!s) return "";
    const n = normalizePhone(s);
    if (!n) ctx.addIssue({ code: "custom", message: "Enter a phone number like 091 234 5678 or +385 1 234 5678" });
    return n ?? "";
  });

const BasicsSchema = z.object({
  name: z.string().trim().min(2, "What's your business called?").max(80),
  type: z.enum(BUSINESS_TYPES.map((t) => t.id) as [string, ...string[]], { error: "Pick the closest match" }),
  city: z.string().trim().max(60),
  address: z.string().trim().max(120).optional().default(""),
  phone: phoneField,
});

function slugify(name: string) {
  return (
    name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[đĐ]/g, "d")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "business"
  );
}

async function uniqueSlug(name: string) {
  const base = slugify(name);
  const taken = new Set(
    (await db.select({ slug: businesses.slug }).from(businesses).where(like(businesses.slug, `${base}%`))).map((r) => r.slug),
  );
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
}

export async function saveBasics(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const values = formValues(fd);
  const parsed = BasicsSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const data = parsed.data;

  const existing = await getBusinessFor(user.id);
  if (existing) {
    await db.update(businesses).set({ ...data, ...touch() }).where(eq(businesses.id, existing.business.id));
    return afterSave(fd, existing.business, 1);
  }

  // First save creates the business, pre-filled from its type's presets
  const preset = businessType(data.type);
  const [biz] = await db
    .insert(businesses)
    .values({
      ...data,
      slug: await uniqueSlug(data.name),
      hours: preset.hours,
      capacity: preset.capacity,
      senderName: suggestSender(data.name),
      textbackMessage: defaultTextback("hr", data.type),
      // Self-service sign-ups try everything (Pro) free for a month
      plan: "pro",
      trialEndsAt: Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000,
      calendarToken: randomBytes(18).toString("base64url"),
    })
    .returning();
  await db.insert(memberships).values({ userId: user.id, businessId: biz.id, role: "owner" });
  await db.insert(services).values(
    preset.services.map((s, i) => ({
      businessId: biz.id,
      name: biz.smsLanguage === "en" ? s.name : s.hr,
      durationMin: s.durationMin,
      priceCents: s.price != null ? s.price * 100 : null,
      position: i,
    })),
  );
  return afterSave(fd, biz, 1);
}

/* ── Step 2: opening hours ──────────────────────────────────── */

const hhmm = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function saveHours(_: FormState, fd: FormData): Promise<FormState> {
  const { business } = await requireBusiness({ allowSetup: true });
  const values = formValues(fd);
  const hours: WeekHours = [];
  const errors: Record<string, string> = {};
  for (let i = 0; i < 7; i++) {
    const open = fd.get(`open_${i}`) === "on";
    const from = String(fd.get(`from_${i}`) ?? "09:00");
    const to = String(fd.get(`to_${i}`) ?? "17:00");
    if (open && (!hhmm.test(from) || !hhmm.test(to) || from >= to)) {
      errors[`day_${i}`] = "Closing time must be after opening time";
    }
    hours.push({ open, from: hhmm.test(from) ? from : "09:00", to: hhmm.test(to) ? to : "17:00" });
  }
  if (!hours.some((h) => h.open)) errors._ = "Open at least one day a week";
  const capacity = Number(fd.get("capacity"));
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 50) errors.capacity = "Between 1 and 50";
  if (Object.keys(errors).length) return { errors, values, error: errors._ };

  await db.update(businesses).set({ hours, capacity, ...touch() }).where(eq(businesses.id, business.id));
  return afterSave(fd, business, 2);
}

/* ── Step 3: services ───────────────────────────────────────── */

const ServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Every service needs a name").max(60),
  durationMin: z.coerce.number().int().min(5, "At least 5 minutes").max(480, "At most 8 hours"),
  price: z.union([z.literal(""), z.coerce.number().min(0).max(10000)]).optional(),
});

export async function saveServices(_: FormState, fd: FormData): Promise<FormState> {
  const { business } = await requireBusiness({ allowSetup: true });
  let raw: unknown;
  try {
    raw = JSON.parse(String(fd.get("services") ?? "[]"));
  } catch {
    return { error: "Couldn't read the list — refresh and try again." };
  }
  const parsed = z.array(ServiceSchema).min(1, "Add at least one service").max(40).safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const own = await db.select({ id: services.id }).from(services).where(eq(services.businessId, business.id));
  const ownIds = new Set(own.map((s) => s.id));
  const keep = parsed.data.filter((s) => s.id && ownIds.has(s.id)).map((s) => s.id!);

  await db.batch([
    keep.length
      ? db.delete(services).where(and(eq(services.businessId, business.id), notInArray(services.id, keep)))
      : db.delete(services).where(eq(services.businessId, business.id)),
    ...parsed.data.map((s, position) => {
      const row = {
        name: s.name,
        durationMin: s.durationMin,
        priceCents: s.price === "" || s.price == null ? null : Math.round(s.price * 100),
        position,
      };
      return s.id && ownIds.has(s.id)
        ? db.update(services).set(row).where(and(eq(services.id, s.id), eq(services.businessId, business.id)))
        : db.insert(services).values({ ...row, businessId: business.id });
    }),
  ]);
  await db.update(businesses).set(touch()).where(eq(businesses.id, business.id));
  return afterSave(fd, business, 3);
}

/* ── Step 4: the text-back message ──────────────────────────── */

const MessageSchema = z.object({
  senderName: z
    .string()
    .trim()
    .min(2, "At least 2 characters")
    .max(11, "SMS sender names can be at most 11 characters")
    .regex(/^[A-Za-z0-9 ]+$/, "Only letters A–Z, numbers and spaces (no č, ć, š, ž, đ)")
    .regex(/[A-Za-z]/, "Must contain at least one letter"),
  textbackMessage: z.string().trim().min(20, "That's a bit short for a message").max(480, "Keep it under 480 characters"),
});

export async function saveMessage(_: FormState, fd: FormData): Promise<FormState> {
  const { business } = await requireBusiness({ allowSetup: true });
  const values = formValues(fd);
  const parsed = MessageSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  await db.update(businesses).set({ ...parsed.data, ...touch() }).where(eq(businesses.id, business.id));
  return afterSave(fd, business, 4);
}

/* ── Step 5: finish ─────────────────────────────────────────── */

export async function finishSetup() {
  const { user, business } = await requireBusiness({ allowSetup: true });
  if (business.status === "setup") {
    const [biz] = await db
      .update(businesses)
      .set({ status: business.ringloopNumber ? "forwarding" : "number_pending", setupStep: SETUP_STEPS, ...touch() })
      .where(eq(businesses.id, business.id))
      .returning();
    // Hand out the next number from the pool, so the owner can go live right away
    const number = biz.ringloopNumber ? null : await claimPoolNumber(biz);
    await sendEmail({
      to: teamInbox(),
      subject: number
        ? `Nova registracija: ${business.name} — dobio broj ${formatPhone(number)}`
        : `Nova registracija: ${business.name} — treba broj`,
      html: `<h2>${esc(business.name)} je završio postavljanje</h2>
        <p><strong>Djelatnost:</strong> ${esc(businessType(business.type).label)} · ${esc(business.city) || "—"}</p>
        <p><strong>Vlasnik:</strong> ${esc(user.name)} &lt;${esc(user.email)}&gt;</p>
        <p><strong>Telefon:</strong> ${esc(business.phone) || "—"}</p>
        <p>${
          number
            ? `Automatski dodijeljen broj iz bazena: <strong>${esc(formatPhone(number))}</strong>.`
            : `Bazen brojeva je prazan — dodaj broj u <a href="${appUrl()}/admin">adminu</a>.`
        }</p>`,
      replyTo: user.email,
    });
  }
  revalidatePath("/", "layout");
  redirect("/dashboard?welcome=1");
}

/* ── Settings-only ──────────────────────────────────────────── */

const BookingSettingsSchema = z.object({
  bookingEnabled: z.literal("on").optional(),
  confirmationsEnabled: z.literal("on").optional(),
  remindersEnabled: z.literal("on").optional(),
  smsLanguage: z.enum(["hr", "en"]),
  linkMode: z.enum(["chat", "page", "custom"]),
  whatsappEnabled: z.literal("on").optional(),
  customBookingUrl: z
    .string()
    .trim()
    .max(300)
    .optional()
    .default("")
    .refine((s) => !s || /^https:\/\/[^\s]+\.[^\s]+$/.test(s), "Paste the full link, starting with https://"),
  leadTimeMin: z.coerce.number().int().min(0).max(7 * 24 * 60),
  horizonDays: z.coerce.number().int().min(1).max(60),
  slotIntervalMin: z.coerce.number().int().refine((n) => [5, 10, 15, 20, 30, 60].includes(n)),
});

export async function saveBookingSettings(_: FormState, fd: FormData): Promise<FormState> {
  const { business } = await requireBusiness();
  const values = formValues(fd);
  const parsed = BookingSettingsSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const { bookingEnabled, confirmationsEnabled, remindersEnabled, linkMode, customBookingUrl, whatsappEnabled, ...rest } = parsed.data;
  if (linkMode === "custom" && !customBookingUrl) {
    return { errors: { customBookingUrl: "Paste the link to your booking page" }, values };
  }
  await db
    .update(businesses)
    .set({
      ...rest,
      bookingEnabled: bookingEnabled === "on",
      confirmationsEnabled: confirmationsEnabled === "on",
      remindersEnabled: remindersEnabled === "on",
      chatEnabled: linkMode === "chat",
      whatsappEnabled: whatsappEnabled === "on",
      customBookingUrl: linkMode === "custom" ? customBookingUrl : null,
      ...touch(),
    })
    .where(eq(businesses.id, business.id));
  revalidatePath("/", "layout");
  return { ok: true, message: "Saved", values };
}

export async function confirmForwarding() {
  const { business } = await requireBusiness();
  if (!business.ringloopNumber) return;
  await db
    .update(businesses)
    .set({ status: "live", forwardingConfirmedAt: Date.now(), ...touch() })
    .where(eq(businesses.id, business.id));
  revalidatePath("/", "layout");
}

export async function setPaused(paused: boolean) {
  const { business } = await requireBusiness();
  const resume = business.forwardingConfirmedAt ? "live" : business.ringloopNumber ? "forwarding" : "number_pending";
  await db
    .update(businesses)
    .set({ status: paused ? "paused" : resume, ...touch() })
    .where(eq(businesses.id, business.id));
  revalidatePath("/", "layout");
}

/* ── "Come over and set it up for me" ───────────────────────── */

const HELP_OPTIONS = ["Call forwarding", "Services & hours", "Booking link", "Training my team", "Everything"] as const;

const VisitSchema = z.object({
  contactName: z.string().trim().min(2, "Who should we ask for?").max(80),
  contactPhone: phoneField.refine((s) => s.length > 0, "We need a number to confirm the visit"),
  address: z.string().trim().min(5, "Where should we come?").max(160),
  preferredTimes: z.string().trim().min(3, "Tell us a few days or times that suit you").max(300),
  notes: z.string().trim().max(1000).optional().default(""),
});

export async function requestVisit(_: FormState, fd: FormData): Promise<FormState> {
  const { user, business } = await requireBusiness({ allowSetup: true });
  const values = formValues(fd);
  const parsed = VisitSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  if (!(await rateLimit(`visit:${business.id}`, 5, 24 * 60 * 60))) {
    return { error: "You've sent a few requests today — we'll be in touch soon.", values };
  }
  const help = fd.getAll("help").map(String).filter((h) => (HELP_OPTIONS as readonly string[]).includes(h));
  const data = { ...parsed.data, help: help.length ? help : ["Everything"] };

  await db.insert(visitRequests).values({ ...data, businessId: business.id, requestedBy: user.id });
  await sendEmail({
    to: teamInbox(),
    replyTo: user.email,
    subject: `Zahtjev za posjet: ${business.name} (${business.city || "—"})`,
    html: `<h2>${esc(business.name)} želi da dođemo</h2>
      <p><strong>Kontakt:</strong> ${esc(data.contactName)} · ${esc(data.contactPhone)} · ${esc(user.email)}</p>
      <p><strong>Adresa:</strong> ${esc(data.address)}</p>
      <p><strong>Termini:</strong> ${esc(data.preferredTimes)}</p>
      <p><strong>Pomoć oko:</strong> ${esc(data.help.join(", "))}</p>
      <p><strong>Napomena:</strong> ${esc(data.notes) || "—"}</p>
      <p><a href="${appUrl()}/admin">Otvori admin</a></p>`,
  });
  revalidatePath("/", "layout");
  return { ok: true, message: "Request sent! We'll call you within 1 business day to confirm a time." };
}

export async function cancelVisit(id: string) {
  const { business } = await requireBusiness({ allowSetup: true });
  await db
    .update(visitRequests)
    .set({ status: "cancelled" })
    .where(
      and(
        eq(visitRequests.id, id),
        eq(visitRequests.businessId, business.id),
        inArray(visitRequests.status, ["requested", "scheduled"]),
      ),
    );
  revalidatePath("/", "layout");
}

/* ── "Send me a test text" ──────────────────────────────────── */

export async function sendTestSms(_: FormState, fd: FormData): Promise<FormState> {
  const { business } = await requireBusiness();
  const values = formValues(fd);
  const to = normalizePhone(String(fd.get("to") ?? ""));
  if (!to) return { errors: { to: "Enter your mobile number, like 091 234 5678" }, values };
  if (!canReceiveSms(to)) return { errors: { to: "That's a landline. Enter a mobile number." }, values };
  if (!(await rateLimit(`testsms:${business.id}`, 5, 24 * 60 * 60))) {
    return { error: "That's 5 test texts today. Try again tomorrow.", values };
  }
  const { link, chat } = await textbackLink(business, to, { isTest: true });
  const res = await sendBusinessSms(business, "test", to, textbackBody(business, link));
  if (!res.ok) return { error: `The text couldn't be sent (${res.error}).`, values };
  return {
    ok: true,
    message: `Sent to ${formatPhone(to)}. It should arrive within a minute.${chat ? " Tap the link to chat with Halo like a customer would." : ""}`,
    values,
  };
}

/** At the monthly allowance: stop sending (false) or keep going and pay per extra message (true). */
export async function setAllowExtra(allow: boolean) {
  const { business } = await requireBusiness();
  await db.update(businesses).set({ allowExtraMessages: !!allow, ...touch() }).where(eq(businesses.id, business.id));
  revalidatePath("/", "layout");
}
