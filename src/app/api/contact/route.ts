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
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { name, business, email, phone, industry, volume, message } = body;

  if (!name || !business || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Log only non-personal fields — contact details don't belong in Vercel
  // logs. The lead itself is delivered to the inbox below.
  console.log("[RingLoop Lead]", { business, industry, volume, ts: new Date().toISOString() });

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
          reply_to: email, // hit Reply in Gmail → answer the lead directly
          subject: `Novi upit: ${name} — ${business}`,
          html: `
            <h2>Novi RingLoop upit</h2>
            <p><strong>Ime:</strong> ${esc(name)}</p>
            <p><strong>Tvrtka:</strong> ${esc(business)}</p>
            <p><strong>Djelatnost:</strong> ${esc(industry) || "—"}</p>
            <p><strong>Email:</strong> ${esc(email)}</p>
            <p><strong>Telefon:</strong> ${esc(phone) || "—"}</p>
            <p><strong>Propušteni pozivi tjedno:</strong> ${esc(volume) || "—"}</p>
            <p><strong>Poruka:</strong><br>${esc(message) || "—"}</p>
            <p><small>${new Date().toLocaleString("hr-HR", { timeZone: "Europe/Zagreb" })}</small></p>
          `,
        }),
      });
      if (!res.ok) {
        console.error("[RingLoop Lead] Resend failed:", res.status, await res.text());
        // Don't fail the form for the visitor — but this lead now exists only in Resend
      }
    } catch (err) {
      console.error("[RingLoop Lead] Resend error:", err);
    }
  } else {
    console.error("[RingLoop Lead] RESEND_API_KEY is not set — lead was not delivered");
  }

  return NextResponse.json({ ok: true });
}
