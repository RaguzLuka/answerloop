import { getClinic } from "@/clinics";
import { maskPhone } from "@/mask-phone";
import { mintStreamToken } from "@/stream-token";
import { verifiedTwilioParams } from "@/twilio-verify";

const VOICE_SERVER_URL = process.env.VOICE_SERVER_URL ?? "";

async function handleCall(request: Request) {
  // Kill switch: no OpenAI usage unless AI_ENABLED=true is set explicitly.
  // Callers hear a short apology instead of reaching the AI.
  if (process.env.AI_ENABLED !== "true") {
    console.warn("[VOICE] AI is disabled (AI_ENABLED is not \"true\") — playing unavailable message");
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hr-HR" voice="Google.hr-HR-Standard-A">Ispričavamo se, ova linija trenutno nije dostupna. Molimo pokušajte kasnije. Doviđenja!</Say>
  <Hangup/>
</Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }

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
  console.log(`[VOICE] Incoming call to ${clinic.name} from ${maskPhone(from)} | SID: ${callSid}`);

  // The voice server only accepts streams carrying this signed token, and
  // derives the clinic config from `to` itself — no config travels via Twilio.
  const token = mintStreamToken({ callSid, to, from });
  if (!token) {
    console.error("[VOICE] VOICE_STREAM_SECRET is not set — cannot authenticate the media stream");
    return new Response("Voice stream not configured", { status: 503 });
  }

  // Use OpenAI Realtime API via Railway WebSocket server
  const wsUrl = VOICE_SERVER_URL.replace(/^https?/, "wss") + "/media-stream";

  // The token is base64url + "." — safe inside an XML attribute as-is
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${wsUrl}">
      <Parameter name="token" value="${token}"/>
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
