import { getClinic } from "@/clinics";

const BASE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export async function POST(request: Request) {
  const body = await request.formData();
  const to = body.get("To")?.toString() ?? "";
  const from = body.get("From")?.toString() ?? "";
  const callSid = body.get("CallSid")?.toString() ?? "";

  const clinic = getClinic(to);

  console.log(`[VOICE] Incoming call to ${clinic.name} from ${from} | SID: ${callSid}`);

  const gatherUrl = `${BASE_URL}/api/voice/gather`;

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">
    Hello! Thank you for calling ${clinic.name}. I'm an AI assistant and I'm here to help you book an appointment. What treatment are you looking for?
  </Say>
  <Gather input="speech" action="${gatherUrl}" method="POST" speechTimeout="3" language="en-US" timeout="10">
  </Gather>
  <Say voice="Polly.Joanna">I didn't catch that. Please call back and we'll be happy to help. Goodbye!</Say>
</Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}
