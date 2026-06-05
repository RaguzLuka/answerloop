import OpenAI from "openai";
import { getClinic } from "@/clinics";
import { saveBooking } from "@/bookings";
import { sendWhatsApp } from "@/whatsapp";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const BASE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

// In-memory conversation store keyed by CallSid
const conversations = new Map<
  string,
  Array<{ role: "user" | "assistant"; content: string }>
>();

function buildSystemPrompt(clinicName: string, treatments: string, callerPhone: string) {
  return `You are an AI receptionist answering a live phone call for ${clinicName}.
Your job is to book an appointment for the caller.

Conversation flow — follow this order:
1. Ask what treatment they are looking for.
2. Ask for their full name.
3. Ask what date and time works for them.
4. Ask if they have a preferred doctor (or if any doctor is fine).
5. Confirm the booking clearly.
6. Ask if they have any other questions or need anything else.
7. Close with: "If you ever need to reach us, feel free to call us back or send us a message on WhatsApp. Have a great day!"

Rules:
- Keep ALL responses under 2 sentences — this is a phone call, not text.
- Speak naturally and warmly, like a real receptionist.
- Supported treatments: ${treatments}.
- If asked about prices, say: "Our team will send you the details — let's first get you booked in."
- Never make up availability — just say the requested time works.
- Respond in the same language the caller speaks.
- When the booking is fully confirmed (you have name + treatment + time + doctor), end your response with this exact tag on its own line:
  BOOKING_CONFIRMED: name=<name> treatment=<treatment> doctor=<doctor> time=<time> phone=${callerPhone}
- Never mention BOOKING_CONFIRMED to the caller — it's a system tag only.`;
}

function escapeXml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function handleGather(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let to = "", from = "", callSid = "unknown", speechResult = "";

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const body = await request.formData();
    to = body.get("To")?.toString() ?? "";
    from = body.get("From")?.toString() ?? "";
    callSid = body.get("CallSid")?.toString() ?? "unknown";
    speechResult = body.get("SpeechResult")?.toString() ?? "";
  } else {
    const url = new URL(request.url);
    to = url.searchParams.get("To") ?? "";
    from = url.searchParams.get("From") ?? "";
    callSid = url.searchParams.get("CallSid") ?? "unknown";
    speechResult = url.searchParams.get("SpeechResult") ?? "";
  }

  const clinic = getClinic(to);

  console.log(`[VOICE-GATHER] ${clinic.name} | ${from} | Said: "${speechResult}"`);

  if (!conversations.has(callSid)) {
    conversations.set(callSid, []);
  }
  const history = conversations.get(callSid)!;

  if (!speechResult.trim()) {
    const gatherUrl = `${BASE_URL}/api/voice/gather`;
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Sorry, I didn't catch that. Could you repeat that please?</Say>
  <Gather input="speech" action="${gatherUrl}" method="POST" speechTimeout="1" language="hr-HR" timeout="10">
  </Gather>
</Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }

  history.push({ role: "user", content: speechResult });

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 80,
    messages: [
      { role: "system", content: buildSystemPrompt(clinic.name, clinic.treatments, from) },
      ...history,
    ],
  });

  const reply = completion.choices[0]?.message?.content ?? "I'm sorry, something went wrong. Please call back.";

  history.push({ role: "assistant", content: reply });

  // Check if booking was confirmed
  const isConfirmed = reply.includes("BOOKING_CONFIRMED:");
  const spokenReply = reply
    .split("\n")
    .filter((l) => !l.startsWith("BOOKING_CONFIRMED:"))
    .join(" ")
    .trim();

  if (isConfirmed) {
    const bookingLine = reply.split("\n").find((l) => l.startsWith("BOOKING_CONFIRMED:"));
    if (bookingLine) {
      console.log(`[BOOKING] ${clinic.name} | ${bookingLine}`);
      const booking = parseBookingLine(bookingLine, from);
      await saveBooking({ ...booking, clinicName: clinic.name, clinicNumber: to });

      // Notify clinic via WhatsApp
      const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
      if (adminNumber) {
        await sendWhatsApp(
          adminNumber,
          `📅 New booking at ${clinic.name}!\n` +
          `Patient: ${booking.name}\n` +
          `Treatment: ${booking.treatment}\n` +
          `Doctor: ${booking.doctor}\n` +
          `Time: ${booking.time}\n` +
          `Phone: ${from}`
        );
      }

      // End call after booking confirmed
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${escapeXml(spokenReply)}</Say>
  <Hangup/>
</Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }
  }

  const gatherUrl = `${BASE_URL}/api/voice/gather`;
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${escapeXml(spokenReply)}</Say>
  <Gather input="speech" action="${gatherUrl}" method="POST" speechTimeout="1" language="hr-HR" timeout="10">
  </Gather>
  <Say voice="Polly.Joanna">I didn't catch that. If you need help, please call back or send us a message on WhatsApp. Goodbye!</Say>
</Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}

export async function POST(request: Request) {
  return handleGather(request);
}

export async function GET(request: Request) {
  return handleGather(request);
}

function parseBookingLine(line: string, fallbackPhone: string) {
  const get = (key: string) => {
    const match = line.match(new RegExp(`${key}=([^\\s]+)`));
    return match ? match[1] : "";
  };
  return {
    name: get("name"),
    treatment: get("treatment"),
    doctor: get("doctor"),
    time: get("time"),
    phone: get("phone") || fallbackPhone,
  };
}
