import { getClinic } from "@/clinics";
import { verifiedTwilioParams } from "@/twilio-verify";

const VOICE_SERVER_URL = process.env.VOICE_SERVER_URL ?? "";

async function handleCall(request: Request) {
  const params = await verifiedTwilioParams(request);
  if (params === null) {
    return new Response("Forbidden", { status: 403 });
  }

  // POST: params from validated body. GET (redirect fallback): query string.
  const query = new URL(request.url).searchParams;
  const to = params.To ?? query.get("To") ?? "";
  const from = params.From ?? query.get("From") ?? "";
  const callSid = params.CallSid ?? query.get("CallSid") ?? "";

  const clinic = getClinic(to);
  console.log(`[VOICE] Incoming call to ${clinic.name} from ${from} | SID: ${callSid}`);

  // Use OpenAI Realtime API via Railway WebSocket server
  const wsUrl = VOICE_SERVER_URL.replace(/^https?/, "wss") + "/media-stream";

  const esc = (s: string) =>
    s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const param = (name: string, value?: string) =>
    value ? `      <Parameter name="${name}" value="${esc(value)}"/>\n` : "";

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${wsUrl}">
${param("clinicName", clinic.name)}${param("treatments", clinic.treatments)}${param("staff", clinic.staff)}${param("hours", clinic.hours)}${param("durations", clinic.durations)}${param("smsSender", clinic.smsSender)}${param("callerPhone", from)}    </Stream>
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
