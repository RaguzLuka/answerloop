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

Rules:
- Keep replies SHORT — under 2 sentences. This is WhatsApp/SMS.
- Be warm and professional.
- First message to a new client: apologize for the missed call, ask what treatment they want.
- Once you know the treatment, ask when they'd like to come in.
- Once you know the time, confirm the booking and say the clinic will send a confirmation.
- Supported treatments: ${treatments}.
- If the client asks something outside booking (e.g. prices), say you'll pass that to the team and redirect to booking.
- When booking is confirmed, end your reply with this exact line on its own:
  BOOKING_CONFIRMED: treatment=<treatment> time=<time> phone=CALLER_PHONE
- Never make up availability — just say the requested time works unless told otherwise.
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

  // Parse and log booking confirmation
  if (reply.includes("BOOKING_CONFIRMED:")) {
    const bookingLine = reply
      .split("\n")
      .find((l) => l.startsWith("BOOKING_CONFIRMED:"));
    if (bookingLine) {
      const filled = bookingLine.replace("CALLER_PHONE", from);
      console.log(`[BOOKING] Clinic: ${clinic.name} | ${filled}`);
      // TODO: wire into Google Calendar
    }
  }

  const smsReply = reply
    .split("\n")
    .filter((l) => !l.startsWith("BOOKING_CONFIRMED:"))
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
