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

// Supported languages — extend as needed
// The AI auto-detects the caller's language and responds in kind.
const SUPPORTED_LANGUAGES = ["Croatian", "English", "German", "Italian", "Slovenian"];

function buildSystemPrompt(clinicName, treatments, callerPhone) {
  return `You are an AI receptionist answering a live phone call for ${clinicName}.
Your job is to book an appointment for the caller.

Conversation flow:
1. Greet the caller warmly using the clinic name. Use a short, natural greeting.
2. Ask what treatment they are looking for.
3. Ask for their full name.
4. Ask what date and time works for them.
5. Ask if they have a preferred doctor (or if any is fine).
6. Confirm the booking details clearly.
7. Close with: "Odlično! Podsjetit ćemo vas dan prije termina putem WhatsApp poruke. Hvala na pozivu i do viđenja!" — adapt naturally to the language used.

Rules:
- Keep ALL responses under 2 sentences — this is a phone call, not a chat.
- Be warm, natural, and professional — like a real receptionist.
- Supported treatments: ${treatments}.
- If asked about prices, say: "Our team will send you the details — let's first get you booked in."
- Never make up availability — confirm whatever time the caller requests.
- CRITICAL: Detect the caller's language from their very first words and respond in that same language for the entire conversation. Supported languages: ${SUPPORTED_LANGUAGES.join(", ")}. If the language is unclear, use Croatian.
- Never mix languages mid-conversation.
- When booking is fully confirmed (you have name + treatment + time + doctor), include this exact tag on its own line at the end of your response:
  BOOKING_CONFIRMED: name=<name> treatment=<treatment> doctor=<doctor> time=<time> phone=${callerPhone}
- NEVER say "BOOKING_CONFIRMED" out loud — it is a silent system tag only.
- After confirming the booking, say goodbye and end the conversation naturally.`;
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

wss.on("connection", (twilioWs) => {
  console.log("[VOICE] New Twilio media stream connection");

  let openaiWs = null;
  let streamSid = null;
  let clinicName = "the clinic";
  let treatments = "general consultation";
  let callerPhone = "unknown";
  let currentTurnTranscript = "";
  let bookingHandled = false;
  let sessionReady = false;
  let pendingGreeting = false;

  // Connect to OpenAI Realtime API
  openaiWs = new WebSocket(
    "wss://api.openai.com/v1/realtime?model=gpt-realtime-2",
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );

  openaiWs.on("open", () => {
    console.log("[OPENAI] Connected to Realtime API");
    sessionReady = false;

    // Configure session with correct schema
    openaiWs.send(JSON.stringify({
      type: "session.update",
      session: {
        type: "realtime",
        modalities: ["audio", "text"],
        voice: "nova",
        input_audio_format: "g711_ulaw",
        output_audio_format: "g711_ulaw",
        input_audio_transcription: {
          model: "whisper-1",
        },
        turn_detection: {
          type: "server_vad",
          silence_duration_ms: 600,
          threshold: 0.5,
          prefix_padding_ms: 300,
          create_response: true,
        },
        instructions: buildSystemPrompt(clinicName, treatments, callerPhone),
      },
    }));
  });

  openaiWs.on("message", (data) => {
    const msg = JSON.parse(data.toString());

    // Log all non-audio events for debugging
    if (msg.type !== "response.audio.delta") {
      console.log(`[OPENAI EVT] ${msg.type}`);
    }

    // Session ready — if stream already started, send the greeting now
    if (msg.type === "session.created" || msg.type === "session.updated") {
      sessionReady = true;
      if (pendingGreeting) {
        pendingGreeting = false;
        triggerGreeting();
      }
    }

    // Stream AI audio back to Twilio
    if (msg.type === "response.audio.delta" && streamSid) {
      twilioWs.send(JSON.stringify({
        event: "media",
        streamSid,
        media: { payload: msg.delta },
      }));
    }

    // Accumulate AI transcript for the current response turn
    if (msg.type === "response.audio_transcript.delta") {
      currentTurnTranscript += msg.delta;
    }

    // Also capture text output for booking detection
    if (msg.type === "response.text.delta") {
      currentTurnTranscript += msg.delta;
    }

    // Response turn complete — check for booking and reset transcript
    if (msg.type === "response.done") {
      console.log(`[AI] ${currentTurnTranscript}`);

      if (!bookingHandled && currentTurnTranscript.includes("BOOKING_CONFIRMED:")) {
        bookingHandled = true;
        const line = currentTurnTranscript.split("\n").find((l) => l.trim().startsWith("BOOKING_CONFIRMED:"));
        if (line) {
          console.log(`[BOOKING] ${line.trim()}`);
          handleBooking(line.trim(), clinicName, callerPhone).catch(console.error);
        }
      }

      currentTurnTranscript = ""; // reset after each turn
    }

    // Log user speech transcription
    if (msg.type === "conversation.item.input_audio_transcription.completed") {
      console.log(`[CALLER] ${msg.transcript}`);
    }

    if (msg.type === "error") {
      console.error("[OPENAI ERROR]", JSON.stringify(msg.error));
    }
  });

  openaiWs.on("close", (code, reason) => {
    console.log(`[OPENAI] Disconnected — code: ${code} reason: ${reason?.toString()}`);
  });
  openaiWs.on("error", (err) => console.error("[OPENAI] Error:", err.message));

  function triggerGreeting() {
    if (!openaiWs || openaiWs.readyState !== WebSocket.OPEN) return;

    // Update session with clinic-specific prompt
    openaiWs.send(JSON.stringify({
      type: "session.update",
      session: {
        instructions: buildSystemPrompt(clinicName, treatments, callerPhone),
      },
    }));

    // Trigger a natural Croatian receptionist greeting
    openaiWs.send(JSON.stringify({
      type: "response.create",
      response: {
        instructions: `You are answering the phone at "${clinicName}". Greet the caller exactly like a real Croatian receptionist would. Say something like: "Dobar dan, hvala što ste nazvali ${clinicName}, kako vam mogu pomoći?" — natural, warm, professional. One sentence only. Use Croatian.`,
      },
    }));
  }

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

      if (sessionReady) {
        triggerGreeting();
      } else {
        // Session not ready yet — flag so we greet once it is
        pendingGreeting = true;
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
      `📅 New booking at ${clinicName}!\n` +
      `Patient: ${name}\n` +
      `Treatment: ${treatment}\n` +
      `Doctor: ${doctor}\n` +
      `Time: ${time}\n` +
      `Phone: ${callerPhone}`
    );
  }
}

// Health check
app.get("/", (req, res) => res.json({ status: "RingLoop voice server running" }));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`[SERVER] Voice server listening on port ${PORT}`));
