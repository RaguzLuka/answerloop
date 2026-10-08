"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { and, eq, gt, isNull } from "drizzle-orm";
import { z } from "zod";
import { db, passwordResets, users } from "@/lib/db";
import { hashPassword, verifyPassword, dummyHash } from "@/lib/auth/password";
import { createSession, destroyAllSessions, destroySession, hashToken } from "@/lib/auth/session";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { appUrl, esc, sendEmail } from "@/lib/email";
import { fieldErrors, formValues, type FormState } from "@/lib/form";
import { homeFor, requireUser } from "@/lib/dal";

const email = z.email("Enter a valid email address").max(254).transform((s) => s.trim().toLowerCase());
const password = z
  .string()
  .min(10, "Use at least 10 characters")
  .max(200, "That password is too long");

const SignupSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  email,
  password,
  terms: z.literal("on", { error: "Please accept the terms to continue" }),
});

export async function signup(_: FormState, fd: FormData): Promise<FormState> {
  const values = formValues(fd);
  const parsed = SignupSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  if (!(await rateLimit(`signup:${await clientIp()}`, 10, 60 * 60))) {
    return { error: "Too many sign-ups from this network. Try again in an hour.", values };
  }

  const { name, email, password } = parsed.data;
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length) {
    return { errors: { email: "There's already an account with this email — sign in instead." }, values };
  }

  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash: await hashPassword(password) })
    .returning({ id: users.id });
  await createSession(user.id);
  redirect(await homeFor({ id: user.id, email }));
}

const LoginSchema = z.object({ email, password: z.string().min(1, "Enter your password").max(200) });

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const values = formValues(fd);
  const parsed = LoginSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const { email, password } = parsed.data;

  const ip = await clientIp();
  const allowed =
    (await rateLimit(`login:ip:${ip}`, 30, 15 * 60)) && (await rateLimit(`login:email:${email}`, 8, 15 * 60));
  if (!allowed) return { error: "Too many attempts. Wait 15 minutes, or reset your password.", values };

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const ok = await verifyPassword(password, user?.passwordHash ?? (await dummyHash()));
  if (!user || !ok) return { error: "That email and password don't match.", values };

  await createSession(user.id);
  const next = String(fd.get("next") ?? "");
  // Only same-site paths: "//x" and "/\x" would leave the site
  if (/^\/(?![\/\\])/.test(next)) redirect(next);
  redirect(await homeFor(user));
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

/* ── Password reset ─────────────────────────────────────────── */

export async function requestReset(_: FormState, fd: FormData): Promise<FormState> {
  const values = formValues(fd);
  const parsed = email.safeParse(fd.get("email"));
  if (!parsed.success) return { errors: { email: "Enter a valid email address" }, values };

  const done: FormState = {
    ok: true,
    message: "If there's an account for that email, a reset link is on its way. It works for 1 hour.",
  };
  if (!(await rateLimit(`reset:${await clientIp()}`, 5, 60 * 60))) return done;
  if (!(await rateLimit(`reset:email:${parsed.data}`, 3, 60 * 60))) return done;

  const [user] = await db.select().from(users).where(eq(users.email, parsed.data)).limit(1);
  if (!user) return done; // same answer either way — don't reveal who has an account

  const token = randomBytes(32).toString("base64url");
  await db.insert(passwordResets).values({ id: hashToken(token), userId: user.id, expiresAt: Date.now() + 60 * 60 * 1000 });
  const link = `${appUrl()}/reset/${token}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your RingLoop password",
    html: `<p>Hi ${esc(user.name)},</p>
      <p>Someone (hopefully you) asked to reset the password for your RingLoop account.</p>
      <p><a href="${link}">Choose a new password</a> — this link works for 1 hour.</p>
      <p>If it wasn't you, ignore this email; your password stays the same.</p>`,
  });
  return done;
}

export async function resetPassword(_: FormState, fd: FormData): Promise<FormState> {
  const token = String(fd.get("token") ?? "");
  const parsed = password.safeParse(fd.get("password"));
  if (!parsed.success) return { errors: { password: parsed.error.issues[0].message } };

  const [reset] = await db
    .select()
    .from(passwordResets)
    .where(and(eq(passwordResets.id, hashToken(token)), gt(passwordResets.expiresAt, Date.now()), isNull(passwordResets.usedAt)))
    .limit(1);
  if (!reset) return { error: "This reset link has expired or was already used. Ask for a new one." };

  await db.update(users).set({ passwordHash: await hashPassword(parsed.data) }).where(eq(users.id, reset.userId));
  await db.update(passwordResets).set({ usedAt: Date.now() }).where(eq(passwordResets.id, reset.id));
  await destroyAllSessions(reset.userId);
  await createSession(reset.userId);
  redirect("/dashboard");
}

/* ── Account settings ───────────────────────────────────────── */

export async function changePassword(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const current = String(fd.get("current") ?? "");
  const parsed = password.safeParse(fd.get("password"));
  if (!parsed.success) return { errors: { password: parsed.error.issues[0].message } };
  if (!(await rateLimit(`pw:${user.id}`, 8, 15 * 60))) return { error: "Too many attempts. Try again later." };

  const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  if (!row || !(await verifyPassword(current, row.passwordHash))) {
    return { errors: { current: "That's not your current password" } };
  }
  await db.update(users).set({ passwordHash: await hashPassword(parsed.data) }).where(eq(users.id, user.id));
  await destroyAllSessions(user.id);
  await createSession(user.id);
  return { ok: true, message: "Password changed. Other devices were signed out." };
}

export async function updateProfile(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const values = formValues(fd);
  const name = z.string().trim().min(2, "Tell us your name").max(80).safeParse(fd.get("name"));
  if (!name.success) return { errors: { name: name.error.issues[0].message }, values };
  await db.update(users).set({ name: name.data }).where(eq(users.id, user.id));
  return { ok: true, message: "Saved", values };
}
