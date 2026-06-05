import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, clinic, email, phone, message } = body;

  if (!name || !clinic || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Log the lead server-side (visible in Vercel function logs)
  console.log("[RingLoop Lead]", { name, clinic, email, phone, message, ts: new Date().toISOString() });

  // Optional: send email via Resend (add RESEND_API_KEY to env vars to enable)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "RingLoop Leads <noreply@ringloop.net>",
        to: "hello@ringloop.net",
        subject: `New lead: ${name} — ${clinic}`,
        html: `
          <h2>New RingLoop lead</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Clinic:</strong> ${clinic}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "—"}</p>
          <p><strong>Message:</strong> ${message || "—"}</p>
          <p><small>${new Date().toISOString()}</small></p>
        `,
      }),
    });
  }

  return NextResponse.json({ ok: true });
}
