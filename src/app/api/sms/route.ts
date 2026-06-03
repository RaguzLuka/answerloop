import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// In-memory conversation store keyed by phone number.
// In production you'd replace this with a database (e.g. Vercel KV, Supabase).
const conversations = new Map<
  string,
  Array<{ role: "user" | "assistant"; content: string }>
>();

const CLINIC_NAME = process.env.CLINIC_NAME ?? "the clinic";

const SYSTEM_PROMPT = `You are an AI receptionist for ${CLINIC_NAME}, a medical/aesthetic clinic.
Your job is to help clients who missed a call to book a consultation.

Rules:
- Keep replies SHORT — under 2 sentences. This is SMS.
- Be warm and professional.
- First message to a new client: apologize for the missed call, ask what treatment they want.
- Once you know the treatment, ask when they'd like to come in.
- Once you know the time, confirm the booking and say the clinic will send a confirmation.
- Supported treatments: Botox, fillers, skin consultation, dental cleaning, dental checkup, teeth whitening, hair treatment, general consultation.
- If the client asks something outside booking (e.g. prices), say you'll pass that to the team and redirect to booking.
- When booking is confirmed, end your reply with this exact line on its own:
  BOOKING_CONFIRMED: treatment=<treatment> time=<time> phone=<phone>
  Replace <phone> with the word CALLER_PHONE (the system will fill it in).
- Never make up availability — just say the requested time works unless told otherwise.
- Respond in the same language the client uses (English, Croatian, etc.).`;

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
  const incomingMessage = body.get("Body")?.toString() ?? "";

  console.log(`[SMS] From: ${from} | Message: ${incomingMessage}`);

  // Get or create conversation history for this phone number
  if (!conversations.has(from)) {
    conversations.set(from, []);
  }
  const history = conversations.get(from)!;

  // Add the user's message
  history.push({ role: "user", content: incomingMessage });

  // Call Claude
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: history,
  });

  const reply =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Add assistant reply to history
  history.push({ role: "assistant", content: reply });

  // Parse booking confirmation if present
  if (reply.includes("BOOKING_CONFIRMED:")) {
    const bookingLine = reply
      .split("\n")
      .find((l) => l.startsWith("BOOKING_CONFIRMED:"));
    if (bookingLine) {
      const filled = bookingLine.replace("CALLER_PHONE", from);
      console.log(`[BOOKING] ${filled}`);
      // TODO: wire this into Google Calendar / your booking system
    }
  }

  // Strip the internal booking line before sending to client
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
