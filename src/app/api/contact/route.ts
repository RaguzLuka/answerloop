import { NextResponse } from "next/server";

// Escape user input before putting it in the HTML email body
function esc(s: string) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, clinic, email, phone, message } = body;

  if (!name || !clinic || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Always log server-side (visible in Vercel function logs) as a backup
  console.log("[RingLoop Lead]", { name, clinic, email, phone, message, ts: new Date().toISOString() });

  // Email the lead to the inbox via Resend (set RESEND_API_KEY in Vercel to enable)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Override with RESEND_FROM once the domain is verified in Resend.
          from: process.env.RESEND_FROM ?? "RingLoop Leads <onboarding@resend.dev>",
          to: process.env.LEAD_INBOX ?? "hello@ringloop.net",
          reply_to: email, // hit Reply in Gmail → answer the clinic directly
          subject: `Novi upit: ${name} — ${clinic}`,
          html: `
            <h2>Novi RingLoop upit</h2>
            <p><strong>Ime:</strong> ${esc(name)}</p>
            <p><strong>Klinika:</strong> ${esc(clinic)}</p>
            <p><strong>Email:</strong> ${esc(email)}</p>
            <p><strong>Telefon:</strong> ${esc(phone) || "—"}</p>
            <p><strong>Poruka:</strong><br>${esc(message) || "—"}</p>
            <p><small>${new Date().toLocaleString("hr-HR", { timeZone: "Europe/Zagreb" })}</small></p>
          `,
        }),
      });
      if (!res.ok) {
        console.error("[RingLoop Lead] Resend failed:", res.status, await res.text());
        // Lead is still logged above — don't fail the form for the visitor
      }
    } catch (err) {
      console.error("[RingLoop Lead] Resend error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
