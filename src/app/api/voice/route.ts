import { getClinic } from "@/clinics";

const VOICE_SERVER_URL = process.env.VOICE_SERVER_URL ?? "";

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

  // Use OpenAI Realtime API via Railway WebSocket server
  const wsUrl = VOICE_SERVER_URL.replace(/^https?/, "wss") + "/media-stream";

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Please hold while I connect you.</Say>
  <Connect>
    <Stream url="${wsUrl}">
      <Parameter name="clinicName" value="${clinic.name}"/>
      <Parameter name="treatments" value="${clinic.treatments}"/>
      <Parameter name="callerPhone" value="${from}"/>
    </Stream>
  </Connect>
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
