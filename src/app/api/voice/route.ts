import { getClinic } from "@/clinics";

const BASE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

async function handleCall(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let to = "", from = "", callSid = "";

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const body = await request.formData();
    to = body.get("To")?.toString() ?? "";
    from = body.get("From")?.toString() ?? "";
    callSid = body.get("CallSid")?.toString() ?? "";
  } else {
    const url = new URL(request.url);
    to = url.searchParams.get("To") ?? "";
    from = url.searchParams.get("From") ?? "";
    callSid = url.searchParams.get("CallSid") ?? "";
  }

  const clinic = getClinic(to);

  console.log(`[VOICE] Incoming call to ${clinic.name} from ${from} | SID: ${callSid}`);

  const gatherUrl = `${BASE_URL}/api/voice/gather`;

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">
    Hello! Thank you for calling ${clinic.name}. I'm an AI assistant and I'm here to help you book an appointment. What treatment are you looking for?
  </Say>
  <Gather input="speech" action="${gatherUrl}" method="POST" speechTimeout="3" language="hr-HR" timeout="10">
  </Gather>
  <Say voice="Polly.Joanna">I didn't catch that. Please call back and we'll be happy to help. Goodbye!</Say>
</Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}

export async function POST(request: Request) {
  return handleCall(request);
}

export async function GET(request: Request) {
  return handleCall(request);
}
