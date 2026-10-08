"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";
import { db, businesses, phoneNumbers, visitRequests, type BusinessStatus, type VisitStatus } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";
import { normalizePhone } from "@/lib/phone";
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
