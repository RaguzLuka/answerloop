import { getClinic } from "@/clinics";

const BASE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://answerloop-eight.vercel.app";

export async function POST(request: Request) {
  const body = await request.formData();
  const to = body.get("To")?.toString() ?? "";
  const from = body.get("From")?.toString() ?? "";

  const clinic = getClinic(to);

  console.log(`[CALL] Incoming call to ${clinic.name} from ${from}`);

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    Hi, thanks for calling ${clinic.name}. We are currently unavailable, but we will send you a WhatsApp message right away so we can help you. Have a great day!
  </Say>
  <Hangup/>
</Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}
