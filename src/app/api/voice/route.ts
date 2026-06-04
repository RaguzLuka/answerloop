import { getClinic } from "@/clinics";

const WHATSAPP_FROM = process.env.WHATSAPP_FROM ?? "whatsapp:+14155238886";
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID ?? "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ?? "";

async function sendWhatsApp(to: string, body: string) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

  const params = new URLSearchParams();
  params.append("From", WHATSAPP_FROM);
  params.append("To", `whatsapp:${to}`);
  params.append("Body", body);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await res.json();
  console.log("[WHATSAPP] Sent:", data.sid, "| Error:", data.error_message);
}

export async function POST(request: Request) {
  const body = await request.formData();
  const from = body.get("From")?.toString() ?? "";
  const to = body.get("To")?.toString() ?? "";

  const clinic = getClinic(to);

  console.log(`[CALL] Incoming call to ${clinic.name} from ${from}`);

  // Send WhatsApp non-blocking
  if (from && from !== "anonymous") {
    sendWhatsApp(from, `Hi! Sorry we missed your call. This is ${clinic.name} — how can we help you today? 😊`).catch(
      (err) => console.error("[WHATSAPP] Failed:", err)
    );
  }

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    Hi, thanks for calling ${clinic.name}. We are currently unavailable, but we just sent you a WhatsApp message so we can help you right away. Have a great day!
  </Say>
  <Hangup/>
</Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}
