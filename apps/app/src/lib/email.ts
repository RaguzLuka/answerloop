import "server-only";

/* Transactional email through Resend's HTTP API. Without RESEND_API_KEY
   (local development) the message is printed to the server console. */

export function esc(s: unknown) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendEmail({
  to, subject, html, replyTo,
}: { to: string; subject: string; html: string; replyTo?: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      console.error("[email] RESEND_API_KEY is not set — email not sent:", subject);
    } else {
      console.log(`\n[email → ${to}] ${subject}\n${html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}\n`);
    }
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "RingLoop <onboarding@resend.dev>",
        to,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) console.error("[email] Resend failed:", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("[email] Resend error:", err);
    return false;
  }
}

export const teamInbox = () => process.env.TEAM_INBOX ?? "hello@ringloop.net";
export const appUrl = () =>
  (
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3100")
  ).replace(/\/$/, "");
