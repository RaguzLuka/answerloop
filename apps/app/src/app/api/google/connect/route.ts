import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireBusiness } from "@/lib/dal";
import { googleAuthUrl, googleConfigured } from "@/lib/google-calendar";

/* Starts "Connect Google Calendar": a random state in a short-lived cookie
   (checked on the way back) and off to Google's consent screen. */
export async function GET(req: Request) {
  await requireBusiness({ allowSetup: true });
  const back = new URL(req.url).searchParams.get("back") ?? "/settings?s=connections";
  if (!googleConfigured()) redirect(back);
  const state = randomBytes(16).toString("base64url");
  const jar = await cookies();
  const opts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 600 };
  jar.set("rl_g_state", state, opts);
  jar.set("rl_g_back", back.startsWith("/") && !back.startsWith("//") ? back : "/settings?s=connections", opts);
  redirect(googleAuthUrl(state));
}
