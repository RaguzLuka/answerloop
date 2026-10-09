"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";
import { db, businesses, phoneNumbers, visitRequests, type BusinessStatus, type VisitStatus } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";
import { normalizePhone } from "@/lib/phone";
import { canEncrypt, open, seal } from "@/lib/secret-box";
import { waCreateTemplates } from "@/lib/whatsapp";
import { assignNumberTo } from "@/lib/numbers";
import type { FormState } from "@/lib/form";

/* RingLoop team tools. Every action re-checks ADMIN_EMAILS. */

export async function assignNumber(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(fd.get("businessId") ?? "");
  const raw = String(fd.get("number") ?? "").trim();
  const number = raw ? normalizePhone(raw) : null;
  if (raw && !number) return { error: "Not a valid number" };

  const [biz] = await db.select().from(businesses).where(eq(businesses.id, id)).limit(1);
  if (!biz) return { error: "Business not found" };
  try {
    const res = await assignNumberTo(biz, number);
    revalidatePath("/admin");
    return { ok: true, message: res.note ? `Saved. ${res.note}.` : res.routed ? "Saved, routed in Twilio, owner emailed" : "Saved" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't save" };
  }
}

export async function addPoolNumbers(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const raw = String(fd.get("numbers") ?? "")
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const valid = raw.map((r) => normalizePhone(r));
  const bad = raw.filter((_, i) => !valid[i]);
  if (bad.length) return { error: `Not valid: ${bad.join(", ")}`, values: { numbers: raw.join("\n") } };
  if (!valid.length) return { error: "Paste at least one number" };
  await db
    .insert(phoneNumbers)
    .values(valid.map((number) => ({ number: number! })))
    .onConflictDoNothing();
  revalidatePath("/admin");
  return { ok: true, message: `Added ${valid.length} number${valid.length === 1 ? "" : "s"} to the pool` };
}

export async function removePoolNumber(number: string) {
  await requireAdmin();
  await db.delete(phoneNumbers).where(and(eq(phoneNumbers.number, number), isNull(phoneNumbers.businessId)));
  revalidatePath("/admin");
}

export async function setPlan(businessId: string, plan: "start" | "pro") {
  await requireAdmin();
  if (plan !== "start" && plan !== "pro") return;
  await db.update(businesses).set({ plan, updatedAt: Date.now() }).where(eq(businesses.id, businessId));
  revalidatePath("/admin");
}

export async function setStatus(businessId: string, status: BusinessStatus) {
  await requireAdmin();
  if (!["setup", "number_pending", "forwarding", "live", "paused"].includes(status)) return;
  await db.update(businesses).set({ status, updatedAt: Date.now() }).where(eq(businesses.id, businessId));
  revalidatePath("/admin");
}

export async function updateVisit(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(fd.get("visitId") ?? "");
  const status = String(fd.get("status") ?? "") as VisitStatus;
  if (!["requested", "scheduled", "done", "cancelled"].includes(status)) return { error: "Unknown status" };
  const scheduledFor = String(fd.get("scheduledFor") ?? "").trim().slice(0, 80) || null;
  await db.update(visitRequests).set({ status, scheduledFor }).where(eq(visitRequests.id, id));
  revalidatePath("/admin");
  return { ok: true, message: "Saved" };
}

/* ── A shop's own WhatsApp number ───────────────────────────── */

export async function connectWhatsApp(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(fd.get("businessId") ?? "");
  const [biz] = await db.select().from(businesses).where(eq(businesses.id, id)).limit(1);
  if (!biz) return { error: "Business not found" };

  if (fd.get("disconnect")) {
    await db
      .update(businesses)
      .set({ waPhoneNumberId: null, waBusinessAccountId: null, waDisplayPhone: null, waTokenEnc: null, waTemplatesAt: null })
      .where(eq(businesses.id, id));
    revalidatePath("/admin");
    return { ok: true, message: "Disconnected" };
  }

  const phoneNumberId = String(fd.get("phoneNumberId") ?? "").trim();
  const wabaId = String(fd.get("wabaId") ?? "").trim();
  const display = normalizePhone(String(fd.get("displayPhone") ?? ""));
  const token = String(fd.get("token") ?? "").trim();
  if (!/^\d{6,20}$/.test(phoneNumberId)) return { error: "Phone number ID: the long number from WhatsApp Manager → API setup" };
  if (wabaId && !/^\d{6,20}$/.test(wabaId)) return { error: "WhatsApp Business Account ID must be digits" };
  if (token && !canEncrypt()) return { error: "Set APP_ENCRYPTION_KEY on the server before saving tokens" };

  const [taken] = await db.select({ id: businesses.id }).from(businesses).where(eq(businesses.waPhoneNumberId, phoneNumberId)).limit(1);
  if (taken && taken.id !== id) return { error: "That WhatsApp number is already connected to another business" };

  await db
    .update(businesses)
    .set({
      waPhoneNumberId: phoneNumberId,
      waBusinessAccountId: wabaId || null,
      waDisplayPhone: display,
      waOwnApp: fd.get("ownApp") === "on",
      ...(token ? { waTokenEnc: seal(token) } : {}),
      updatedAt: Date.now(),
    })
    .where(eq(businesses.id, id));
  revalidatePath("/admin");
  return { ok: true, message: "Connected" };
}

export async function submitWaTemplates(businessId: string): Promise<FormState> {
  await requireAdmin();
  const [biz] = await db.select().from(businesses).where(eq(businesses.id, businessId)).limit(1);
  if (!biz?.waBusinessAccountId) return { error: "Add the WhatsApp Business Account ID first" };
  const token = (biz.waTokenEnc ? open(biz.waTokenEnc) : null) ?? process.env.WHATSAPP_TOKEN ?? "";
  const results = await waCreateTemplates(biz.waBusinessAccountId, token, biz.name);
  await db.update(businesses).set({ waTemplatesAt: Date.now() }).where(eq(businesses.id, businessId));
  revalidatePath("/admin");
  return { ok: true, message: results.join(" · ") };
}
