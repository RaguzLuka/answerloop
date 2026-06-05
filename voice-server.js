const express = require("express");
const http = require("http");
const { WebSocketServer, WebSocket } = require("ws");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/media-stream" });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const WHATSAPP_FROM = process.env.WHATSAPP_FROM ?? "whatsapp:+14155238886";
const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP_NUMBER;

function buildSystemPrompt(clinicName, treatments, callerPhone) {
  return `You are an AI receptionist answering a live phone call for ${clinicName}.
Your job is to book an appointment for the caller.

Conversation flow:
1. Greet the caller warmly using the clinic name.
2. Ask what treatment they are looking for.
3. Ask for their full name.
4. Ask what date and time works for them.
5. Ask if they have a preferred doctor (or if any is fine).
6. Confirm the booking clearly.
7. Close with: "You will receive a WhatsApp reminder before your appointment. If you need anything, feel free to call back. Have a great day!"

Rules:
- Keep ALL responses under 2 sentences — this is a phone call.
- Be warm, natural, and professional.
- Supported treatments: ${treatments}.
- If asked about prices, say the team will follow up with details.
- Never make up availability — confirm whatever time the caller requests.
- Respond in Croatian if the caller speaks Croatian, English otherwise.
- When booking is fully confirmed (name + treatment + time + doctor collected), include this exact line in your response:
  BOOKING_CONFIRMED: name=<name> treatment=<treatment> doctor=<doctor> time=<time> phone=${callerPhone}
- Never say BOOKING_CONFIRMED out loud — it is a silent system tag only.`;
}

async function sendWhatsApp(to, message) {
  const toNumber = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
  const params = new URLSearchParams();
  params.append("From", WHATSAPP_FROM);
  params.append("To", toNumber);
  params.append("Body", message);
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const data = await res.json();
  console.log(`[WHATSAPP] Sent to ${to} | SID: ${data.sid} | Error: ${data.error_message ?? "none"}`);
}

wss.on("connection", (twilioWs, req) => {
  console.log("[VOICE] New Twilio media stream connection");

  let openaiWs = null;
  let streamSid = null;
  let clinicName = "the clinic";
  let treatments = "general consultation";
  let callerPhone = "unknown";
  let fullTranscript = "";
  let bookingHandled = false;

  // Connect to OpenAI Realtime API (GA endpoint)
  openaiWs = new WebSocket(
    "wss://api.openai.com/v1/realtime?model=gpt-realtime",
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );

  openaiWs.on("open", () => {
    console.log("[OPENAI] Connected to Realtime API");

    // Configure session
    openaiWs.send(JSON.stringify({
      type: "session.update",
      session: {
        turn_detection: { type: "server_vad", silence_duration_ms: 800, threshold: 0.5 },
        input_audio_format: "g711_ulaw",
        output_audio_format: "g711_ulaw",
        voice: "shimmer",
        instructions: buildSystemPrompt(clinicName, treatments, callerPhone),
        modalities: ["text", "audio"],
        temperature: 0.7,
      },
    }));

    // Trigger the initial greeting
    openaiWs.send(JSON.stringify({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: "The call just connected. Please greet the caller now." }],
      },
    }));
    openaiWs.send(JSON.stringify({ type: "response.create" }));
  });

  openaiWs.on("message", (data) => {
    const msg = JSON.parse(data.toString());

    // Stream AI audio back to Twilio
    if (msg.type === "response.audio.delta" && streamSid) {
      twilioWs.send(JSON.stringify({
        event: "media",
        streamSid,
        media: { payload: msg.delta },
      }));
    }

    // Accumulate AI text to detect booking confirmation
    if (msg.type === "response.text.delta") {
      fullTranscript += msg.delta;
    }

    if (msg.type === "response.text.done") {
      console.log(`[AI] ${msg.text}`);
      if (!bookingHandled && msg.text && msg.text.includes("BOOKING_CONFIRMED:")) {
        bookingHandled = true;
        const line = msg.text.split("\n").find((l) => l.startsWith("BOOKING_CONFIRMED:"));
        if (line) {
          console.log(`[BOOKING] ${line}`);
          handleBooking(line, clinicName, callerPhone).catch(console.error);
        }
      }
    }

    if (msg.type === "error") {
      console.error("[OPENAI ERROR]", JSON.stringify(msg.error));
    }
  });

  openaiWs.on("close", () => console.log("[OPENAI] Disconnected"));
  openaiWs.on("error", (err) => console.error("[OPENAI] Error:", err.message));

  // Handle messages from Twilio
  twilioWs.on("message", (data) => {
    const msg = JSON.parse(data.toString());

    if (msg.event === "start") {
      streamSid = msg.start.streamSid;
      const params = msg.start.customParameters ?? {};
      clinicName = params.clinicName ?? clinicName;
      treatments = params.treatments ?? treatments;
      callerPhone = params.callerPhone ?? callerPhone;
      console.log(`[VOICE] Stream started | Clinic: ${clinicName} | Caller: ${callerPhone}`);

      // Update OpenAI session with clinic-specific prompt once we have the params
      if (openaiWs?.readyState === WebSocket.OPEN) {
        openaiWs.send(JSON.stringify({
          type: "session.update",
          session: {
            instructions: buildSystemPrompt(clinicName, treatments, callerPhone),
          },
        }));
      }
    }

    if (msg.event === "media" && openaiWs?.readyState === WebSocket.OPEN) {
      openaiWs.send(JSON.stringify({
        type: "input_audio_buffer.append",
        audio: msg.media.payload,
      }));
    }

    if (msg.event === "stop") {
      console.log("[VOICE] Stream stopped");
      openaiWs?.close();
    }
  });

  twilioWs.on("close", () => {
    console.log("[VOICE] Twilio disconnected");
    openaiWs?.close();
  });

  twilioWs.on("error", (err) => console.error("[TWILIO] Error:", err.message));
});

async function handleBooking(line, clinicName, callerPhone) {
  const get = (key) => {
    const match = line.match(new RegExp(`${key}=([^\\s]+)`));
    return match ? match[1] : "";
  };
  const name = get("name");
  const treatment = get("treatment");
  const doctor = get("doctor");
  const time = get("time");

  console.log(`[BOOKING] Confirmed: ${name} | ${treatment} | ${doctor} | ${time} | ${callerPhone}`);

  if (ADMIN_WHATSAPP) {
    await sendWhatsApp(
      ADMIN_WHATSAPP,
      `📅 New booking at ${clinicName}!\nPatient: ${name}\nTreatment: ${treatment}\nDoctor: ${doctor}\nTime: ${time}\nPhone: ${callerPhone}`
    );
  }
}

// Health check endpoint
app.get("/", (req, res) => res.json({ status: "RingLoop voice server running" }));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`[SERVER] Voice server listening on port ${PORT}`));
