import Anthropic from "@anthropic-ai/sdk";
import { getClinic } from "@/clinics";

const client = new Anthropic();

// In-memory conversation store keyed by phone number.
// In production replace this with a database (e.g. Vercel KV, Supabase).
const conversations = new Map<
  string,
  Array<{ role: "user" | "assistant"; content: string }>
>();

function buildSystemPrompt(clinicName: string, treatments: string) {
  return `You are an AI receptionist for ${clinicName}, a medical/aesthetic clinic.
Your job is to help clients who missed a call to book a consultation.

Conversation flow — follow this order:
1. Apologize for the missed call and ask what treatment they are interested in.
2. Ask for their full name.
3. Ask if they have a preferred doctor or if any doctor is fine.
4. Ask what date and time works for them.
5. If they confirm a time — confirm the booking.
   If they are unsure or can't find a time — say: "No problem! One of our team members will contact you shortly to find a suitable time."

Rules:
- Keep replies SHORT — 1 to 2 sentences max. This is WhatsApp/SMS.
- Be warm and professional.
- Never skip steps — always collect name, doctor preference, and time before confirming.
- Supported treatments: ${treatments}.
- If the client asks about prices or something outside booking, say you'll pass that to the team and continue with the booking.
- Never make up availability — just say the requested time works unless told otherwise.
- When booking is fully confirmed (you have name + treatment + doctor + time), end your reply with this exact line on its own:
  BOOKING_CONFIRMED: name=<name> treatment=<treatment> doctor=<doctor> time=<time> phone=CALLER_PHONE
- If no time agreement, end your reply with:
  NO_TIME_AGREED: name=<name> treatment=<treatment> phone=CALLER_PHONE
- Respond in the same language the client uses (English, Croatian, etc.).`;
}

function escapeXml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function POST(request: Request) {
  const body = await request.formData();
  const from = body.get("From")?.toString() ?? "unknown";
  const to = body.get("To")?.toString() ?? "";
  const incomingMessage = body.get("Body")?.toString() ?? "";

  const clinic = getClinic(to);

  console.log(`[SMS] Clinic: ${clinic.name} | From: ${from} | Message: ${incomingMessage}`);

  // Conversation key = clinic number + client number (supports multiple clinics)
  const conversationKey = `${to}:${from}`;

  if (!conversations.has(conversationKey)) {
    conversations.set(conversationKey, []);
  }
  const history = conversations.get(conversationKey)!;

  history.push({ role: "user", content: incomingMessage });

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: buildSystemPrompt(clinic.name, clinic.treatments),
    messages: history,
  });

  const reply =
    response.content[0].type === "text" ? response.content[0].text : "";

  history.push({ role: "assistant", content: reply });

  // Parse and log booking confirmation or no-time-agreed
  if (reply.includes("BOOKING_CONFIRMED:")) {
    const bookingLine = reply.split("\n").find((l) => l.startsWith("BOOKING_CONFIRMED:"));
    if (bookingLine) {
      console.log(`[BOOKING] Clinic: ${clinic.name} | ${bookingLine.replace("CALLER_PHONE", from)}`);
      // TODO: wire into Google Calendar
    }
  }

  if (reply.includes("NO_TIME_AGREED:")) {
    const line = reply.split("\n").find((l) => l.startsWith("NO_TIME_AGREED:"));
    if (line) {
      console.log(`[FOLLOW_UP_NEEDED] Clinic: ${clinic.name} | ${line.replace("CALLER_PHONE", from)}`);
      // TODO: notify clinic staff to follow up
    }
  }

  const smsReply = reply
    .split("\n")
    .filter((l) => !l.startsWith("BOOKING_CONFIRMED:") && !l.startsWith("NO_TIME_AGREED:"))
    .join("\n")
    .trim();

  console.log(`[SMS] Reply: ${smsReply}`);

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(smsReply)}</Message>
</Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}

export async function GET() {
  return Response.json({ status: "AnswerLoop SMS endpoint is running" });
}
