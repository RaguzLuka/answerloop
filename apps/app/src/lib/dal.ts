import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db, businesses, memberships, services, users } from "@/lib/db";
import { readSession } from "@/lib/auth/session";

/* Data access layer: every page and Server Action authorises through these.
   Server Actions are public HTTP endpoints, so they must call them too. */

export const getUser = cache(readSession);

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export const getBusinessFor = cache(async (userId: string) => {
  const rows = await db
    .select({ business: businesses, role: memberships.role })
    .from(memberships)
    .innerJoin(businesses, eq(businesses.id, memberships.businessId))
    .where(eq(memberships.userId, userId))
    .limit(1);
  return rows[0] ?? null;
});

/** Signed-in user + their business. Sends unfinished setups back to the wizard. */
export async function requireBusiness({ allowSetup = false } = {}) {
  const user = await requireUser();
  const row = await getBusinessFor(user.id);
  if (!row) redirect("/setup");
  if (!allowSetup && row.business.status === "setup") redirect("/setup");
  return { user, business: row.business, role: row.role };
}

export const getServices = cache(async (businessId: string) =>
  db.select().from(services).where(eq(services.businessId, businessId)).orderBy(asc(services.position)),
);

export function isAdmin(email: string) {
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

/** Where someone lands after signing in. */
export async function homeFor(user: { id: string; email: string }) {
  const row = await getBusinessFor(user.id);
  if (!row) return isAdmin(user.email) ? "/admin" : "/setup";
  return row.business.status === "setup" ? "/setup" : "/dashboard";
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!isAdmin(user.email)) redirect("/dashboard");
  return user;
}

export async function ownerOf(businessId: string) {
  const [row] = await db
    .select({ email: users.email, name: users.name })
    .from(memberships)
    .innerJoin(users, eq(users.id, memberships.userId))
    .where(and(eq(memberships.businessId, businessId), eq(memberships.role, "owner")))
    .limit(1);
  return row ?? null;
}
