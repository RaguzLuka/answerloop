import OpenAI from "openai";
import { getClinic } from "@/clinics";
import { maskPhone } from "@/mask-phone";
import { verifiedTwilioParams } from "@/twilio-verify";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const conversations = new Map<
  string,
  Array<{ role: "user" | "assistant"; content: string }>
>();

function buildSystemPrompt(clinicName: string, treatments: string, firstReply: boolean) {
  return `You are an AI receptionist for ${clinicName}, a medical clinic.
Your job is to help patients who contacted you on WhatsApp.

You help with:
- Booking appointments
- Answering questions about treatments
- Appointment reminders and rescheduling

Conversation flow for booking:
1. Ask what treatment they are interested in.
2. Ask for their full name.
3. Ask what date and time works for them.
4. Ask if they have a preferred doctor (or if any is fine).
5. Confirm the booking.

Rules:
- Keep replies SHORT — 1 to 2 sentences max. This is WhatsApp.
- Be warm and professional.
- Supported treatments: ${treatments}.
- If asked about prices, say you'll pass that to the team and continue.
- Never make up availability — just say the requested time works.
- Respond in the same language the patient uses.
- You are an AI assistant. Never claim to be human — if asked, confirm honestly that you're ${clinicName}'s automated AI assistant.${firstReply ? `
- This is your FIRST reply in this conversation: begin it by saying you are ${clinicName}'s AI assistant (required by EU law), in the patient's language.` : ""}
- When booking is fully confirmed, end your reply with this exact line:
  BOOKING_CONFIRMED: name=<name> treatment=<treatment> doctor=<doctor> time=<time> phone=CALLER_PHONE
- If no time is agreed, end with:
  NO_TIME_AGREED: name=<name> treatment=<treatment> phone=CALLER_PHONE`;
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
  // Kill switch: no OpenAI usage unless AI_ENABLED=true is set explicitly.
  // Empty TwiML = Twilio sends no reply.
  if (process.env.AI_ENABLED !== "true") {
    console.warn("[SMS] AI is disabled (AI_ENABLED is not \"true\") — not replying");
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<Response></Response>`, {
      headers: { "Content-Type": "text/xml" },
    });
  }

  const body = await verifiedTwilioParams(request);
  if (body === null) {
    return new Response("Forbidden", { status: 403 });
  }
  const from = body.From ?? "unknown";
  const to = body.To ?? "";
  const incomingMessage = body.Body ?? "";

  const clinic = getClinic(to);

  // Never log message content — it holds names, numbers and health details
  console.log(`[SMS] ${clinic.name} | Incoming from ${maskPhone(from)}`);

  const conversationKey = `${to}:${from}`;
  if (!conversations.has(conversationKey)) {
    conversations.set(conversationKey, []);
  }
  const history = conversations.get(conversationKey)!;
  history.push({ role: "user", content: incomingMessage });
  // EU AI Act Art. 50: the first reply of a conversation must disclose the AI
  const firstReply = !history.some((m) => m.role === "assistant");

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 300,
    messages: [
      { role: "system", content: buildSystemPrompt(clinic.name, clinic.treatments, firstReply) },
      ...history,
    ],
  });

  const reply = completion.choices[0]?.message?.content ?? "";
  history.push({ role: "assistant", content: reply });

  if (reply.includes("BOOKING_CONFIRMED:")) {
    const line = reply.split("\n").find((l) => l.startsWith("BOOKING_CONFIRMED:"));
    if (line) {
      console.log(`[BOOKING] ${clinic.name} | Confirmed by SMS | ${maskPhone(from)}`);
    }
  }

  if (reply.includes("NO_TIME_AGREED:")) {
    const line = reply.split("\n").find((l) => l.startsWith("NO_TIME_AGREED:"));
    if (line) {
      console.log(`[FOLLOW_UP] ${clinic.name} | No time agreed | ${maskPhone(from)}`);
    }
  }

  let smsReply = reply
    .split("\n")
    .filter((l) => !l.startsWith("BOOKING_CONFIRMED:") && !l.startsWith("NO_TIME_AGREED:"))
    .join("\n")
    .trim();

  // Backstop for the disclosure in case the model skipped it
  if (firstReply && !/\b(AI|UI|KI|IA)\b/.test(smsReply)) {
    smsReply = `AI asistent ${clinic.name}: ${smsReply}`;
  }

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(smsReply)}</Message>
</Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}

export async function GET() {
  return Response.json({ status: "RingLoop SMS endpoint is running" });
}
