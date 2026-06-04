import twilio from "twilio";
import { getClinic } from "@/clinics";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const WHATSAPP_FROM = process.env.WHATSAPP_FROM ?? "whatsapp:+14155238886";

export async function POST(request: Request) {
  const body = await request.formData();
  const from = body.get("From")?.toString() ?? "";
  const to = body.get("To")?.toString() ?? "";

  const clinic = getClinic(to);

  console.log(`[CALL] Incoming call to ${clinic.name} from ${from}`);

  // Send WhatsApp AFTER responding to Twilio (non-blocking)
  if (from && from !== "anonymous") {
    twilioClient.messages
      .create({
        from: WHATSAPP_FROM,
        to: `whatsapp:${from}`,
        body: `Hi! Sorry we missed your call. This is ${clinic.name} — how can we help you today? 😊`,
      })
      .then(() => console.log(`[WHATSAPP] Sent follow-up to ${from}`))
      .catch((err: Error) => console.error("[WHATSAPP] Failed:", err.message));
  }

  // Respond to Twilio immediately
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
