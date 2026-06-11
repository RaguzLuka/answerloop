const express = require("express");
const http = require("http");
const { WebSocketServer, WebSocket } = require("ws");

// === µ-law ↔ PCM16 24kHz audio conversion helpers ===
// Twilio uses g711 µ-law 8kHz. Preferred mode is NATIVE µ-law passthrough
// (audio/pcmu) — OpenAI ingests phone audio directly, no lossy resampling.
// These helpers remain only for the PCM fallback mode if the native format
// is ever rejected by the API.

function ulawDecode(u) {
  u = ~u & 0xFF;
  const sign = u & 0x80;
  const exp = (u >> 4) & 0x07;
  const mantissa = u & 0x0F;
  let sample = ((mantissa << 1) | 0x21) << exp;
  sample -= 33;
  return sign ? -sample : sample;
}

function ulawEncode(sample) {
  const BIAS = 33;
  const MAX = 32767;
  const sign = sample < 0 ? 0x80 : 0;
  if (sign) sample = -sample;
  if (sample > MAX) sample = MAX;
  sample += BIAS;
  let exp = 7;
  for (let m = 0x4000; (sample & m) === 0 && exp > 0; m >>= 1) exp--;
  const mantissa = (sample >> (exp + 3)) & 0x0F;
  return (~(sign | (exp << 4) | mantissa)) & 0xFF;
}

// base64 g711 µ-law (8kHz) → base64 PCM16 LE (24kHz)
// Uses linear interpolation for smoother audio → better speech recognition
function ulawB64ToPcm24kB64(b64) {
  const ulaw = Buffer.from(b64, "base64");
  const n = ulaw.length;
  if (n === 0) return "";
  // Decode µ-law → PCM16 8kHz
  const pcm8k = new Int16Array(n);
  for (let i = 0; i < n; i++) {
    pcm8k[i] = ulawDecode(ulaw[i]);
  }
  // Upsample 8kHz → 24kHz with linear interpolation (3× factor)
  const pcm24k = Buffer.alloc(n * 6);
  for (let i = 0; i < n; i++) {
    const cur = pcm8k[i];
    const next = i + 1 < n ? pcm8k[i + 1] : cur;
    // 3 interpolated samples per source sample
    pcm24k.writeInt16LE(cur, (i * 3) * 2);
    pcm24k.writeInt16LE(Math.round(cur + (next - cur) / 3), (i * 3 + 1) * 2);
    pcm24k.writeInt16LE(Math.round(cur + (2 * (next - cur)) / 3), (i * 3 + 2) * 2);
  }
  return pcm24k.toString("base64");
}

// base64 PCM16 LE (24kHz) → base64 g711 µ-law (8kHz)
function pcm24kB64ToUlawB64(b64) {
  const pcm24k = Buffer.from(b64, "base64");
  const samples24k = pcm24k.length / 2;
  const samples8k = Math.floor(samples24k / 3);
  const ulaw = Buffer.alloc(samples8k);
  for (let i = 0; i < samples8k; i++) {
    // Average 3 samples to reduce aliasing
    const s1 = pcm24k.readInt16LE((i * 3) * 2);
    const s2 = pcm24k.readInt16LE((i * 3 + 1) * 2);
    const s3 = pcm24k.readInt16LE((i * 3 + 2) * 2);
    ulaw[i] = ulawEncode(Math.round((s1 + s2 + s3) / 3));
  }
  return ulaw.toString("base64");
}

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/media-stream" });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
// Booking notifications go by plain SMS — no WhatsApp Business verification needed.
// Default sender is the alphanumeric ID "RingLoop" (works for outbound SMS to
// Croatia without owning an SMS-capable number; verified delivered 2026-06-11).
const SMS_FROM = process.env.SMS_FROM ?? "RingLoop";
// Admin phone: reuses the old ADMIN_WHATSAPP_NUMBER env var if ADMIN_PHONE_NUMBER isn't set.
const ADMIN_PHONE = (process.env.ADMIN_PHONE_NUMBER ?? process.env.ADMIN_WHATSAPP_NUMBER ?? "").replace("whatsapp:", "");

// Supported languages — extend as needed
// The AI auto-detects the caller's language and responds in kind.
const SUPPORTED_LANGUAGES = ["Croatian", "English", "German", "Italian", "Slovenian"];

function buildSystemPrompt(clinicName, treatments, callerPhone, staff = "", hours = "", durations = "") {
  // Spaced digits so the model reads the number digit by digit instead of
  // improvising it as one big number (e.g. "+385911234567" → "+ 3 8 5 9 1 …")
  const spokenPhone = callerPhone === "unknown"
    ? "unknown"
    : callerPhone.split("").join(" ");
  const now = new Date();
  const todayStr = now.toLocaleDateString("en-GB", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    timeZone: "Europe/Zagreb",
  });
  return `You are the receptionist of ${clinicName}, answering a live phone call. You are a woman, a digital (AI) assistant, and you speak like a native Croatian. Your only job: warmly and efficiently book the caller's appointment.

Today is ${todayStr} (Europe/Zagreb). Resolve relative dates ("sutra", "idući utorak") into concrete dates.

HOW TO SPEAK
- 1–2 short sentences per turn. Ask one question at a time.
- Briefly acknowledge what the caller just said, then ask for the next missing piece.
- Track what you already know (treatment, name, date/time, therapist, phone). Never re-ask anything already answered, even if it came out of order or while interrupting you.
- Say dates and times naturally in words. Never read ISO formats like "2026-06-15" aloud.
- Use feminine forms about yourself ("zapisala sam", "sigurna"); about yourself and the caller together, standard mixed forms ("dogovorili smo").
- Pronounce all Croatian names with authentic native pronunciation, never anglicized (Željko, Šimunić, Baček, Kercel).
- Croatian names use č ć š ž đ and surnames often end in -ić — prefer Croatian spellings when unsure what you heard.
- NOTE: any quoted sentences in these instructions show tone and pattern ONLY — never reuse their specific details. Everything you say must reflect this caller's actual details.

LANGUAGE
- Croatian is the strong default. Switch only if the caller speaks a clear, full sentence in English, German, Italian or Slovenian — a short "halo"/"hello", a name, or noise is NOT evidence. When in any doubt, speak Croatian.
- Once the language is established, stay in it consistently.

BOOKING FLOW (you already greeted the caller and disclosed you are a digital assistant)
1. Treatment they need. Supported: ${treatments}.
   - Until the caller has SAID what they need or what's bothering them, ask only an open question ("Kako vam mogu pomoći?" / "Koji tretman trebate?"). NEVER suggest, offer, or assume any specific treatment before the caller expresses a need — if they're silent or vague, ask again openly, don't fill the silence with a suggestion.
   - NEVER decide or rename the treatment on your own: if their wording doesn't exactly match a service (e.g. they say "konzultacija"), propose your interpretation as a QUESTION and wait for their yes before recording it.
2. Their full name — confirm it back once. If they correct you, do NOT guess again: ask them to spell it letter by letter, assemble it exactly from the letters, confirm once, move on.
3. Date and time.
4. Preferred doctor/therapist, or any.
5. Contact number — ask, in the caller's language, whether to register the number they are calling from or a different one. Their number is exactly: ${spokenPhone}. If you say it aloud, read it digit by digit exactly as written — never invent digits. If they give a different number, repeat it back digit by digit to confirm.
6. One spoken summary of all details, then close warmly: thank them, tell them they'll receive a reminder the day before, and say goodbye.

CLINIC RULES${staff ? `
- Team (callers may ask for them by name — recognize these names even with imperfect pronunciation): ${staff}. If they name someone not listed, confirm the name politely and book it anyway.` : ""}${hours ? `
- Working hours: ${hours}. Only confirm appointments inside these hours; otherwise kindly say the clinic is closed then and offer the nearest working time.` : ""}${durations ? `
- Treatment durations: ${durations}. Mention the duration when confirming, and make sure the appointment fits within working hours.` : ""}
- A specific requested service from the list is booked directly — a massage needs no consultation.
- An in-scope problem without a known treatment ("boli me koljeno"): first ask whether this is their first visit for it. First visit → PROPOSE an assessment (the therapist determines the plan) and ask if that suits them — never assign it without their agreement. Already in treatment → book their regular session.
- A problem outside the clinic's scope: politely say the clinic doesn't treat that and suggest their family doctor. Do not book it, do not give advice about it.
- You NEVER give medical advice, assess symptoms, or recommend treatments — only the clinic's professionals do. Ordinary complaints are not emergencies; only for an explicitly life-threatening emergency calmly mention 112 (never 911 — this is Croatia).
- Prices: say the team will send the details, and continue the booking.
- Never invent availability — accept the requested time if it's within working hours.

DIFFICULT MOMENTS
- Noise or an unintelligible fragment is not an answer: ask once to repeat, then continue exactly where you were. Never restart the flow, never hang up because of noise.
- If asked whether you are an AI/robot: confirm honestly and warmly, then continue helping.

SILENT BOOKING TAG
When the booking is fully confirmed, end your final response with this tag on its own line, after your spoken summary and goodbye:
BOOKING_CONFIRMED: name=<Ime_Prezime> treatment=<treatment> doctor=<doctor> time=<YYYY-MM-DDTHH:MM> returning=<yes/no> phone=<number>
- Values use underscores instead of spaces; time is the fully resolved date and time.
- phone= must be the COMPACT number with no spaces: ${callerPhone} if they kept their own number, otherwise the alternative number they confirmed, written compactly.
- Never speak or mention this tag. It is machine-readable English by design — it must NOT affect your spoken language: the summary and goodbye stay in the caller's language.`;
}

async function sendTwilioMessage(from, to, message) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
  const params = new URLSearchParams();
  params.append("From", from);
  params.append("To", to);
  params.append("Body", message);
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const data = await res.json();
  console.log(`[SMS] Sent to ${to} | SID: ${data.sid} | Error: ${data.error_message ?? "none"}`);
}

wss.on("connection", (twilioWs) => {
  console.log("[VOICE] New Twilio media stream connection");

  let openaiWs = null;
  let streamSid = null;
  let callSid = null;
  let callEnded = false;
  let clinicName = "the clinic";
  let treatments = "general consultation";
  let staff = "";
  let hours = "";
  let durations = "";
  let smsSender = "";
  let callerPhone = "unknown";
  let pendingClearTimer = null;
  let currentTurnTranscript = "";
  let bookingHandled = false;
  let sessionReady = false;
  let pendingGreeting = false;
  // "ulaw" = native G.711 passthrough (best recognition, no transcoding).
  // Falls back to "pcm" (legacy transcode pipeline) if the API rejects it.
  let audioMode = "ulaw";
  let nativeConfirmed = false;

  function sessionConfig() {
    if (audioMode === "ulaw") {
      return {
        type: "realtime",
        output_modalities: ["audio"],
        audio: {
          input: {
            format: { type: "audio/pcmu" },
            noise_reduction: { type: "near_field" },
            // Async transcription of caller audio — used for logs/debugging.
            transcription: {
              model: "gpt-4o-mini-transcribe",
              prompt: `Phone call to a Croatian medical clinic (${clinicName}). Likely languages: Croatian, English, German, Italian, Slovenian. Croatian names (Marko, Ivana, Krešimir, Đurđica) and letters č ć š ž đ are common.`,
            },
            // Semantic VAD: ends the turn when the caller has finished their
            // thought, not after a fixed silence — fewer mid-sentence cutoffs.
            turn_detection: {
              type: "semantic_vad",
              eagerness: "auto",
              create_response: true,
              interrupt_response: true,
            },
          },
          output: {
            format: { type: "audio/pcmu" },
          },
        },
        instructions: buildSystemPrompt(clinicName, treatments, callerPhone, staff, hours, durations),
      };
    }
    // Legacy PCM fallback — exactly the configuration that shipped before.
    return {
      type: "realtime",
      turn_detection: {
        type: "server_vad",
        silence_duration_ms: 800,
        threshold: 0.6,
        prefix_padding_ms: 200,
        create_response: true,
      },
      instructions: buildSystemPrompt(clinicName, treatments, callerPhone, staff, hours, durations),
    };
  }

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
    openaiWs.send(JSON.stringify({ type: "session.update", session: sessionConfig() }));
  });

  openaiWs.on("message", (data) => {
    let msg;
    try {
      msg = JSON.parse(data.toString());
    } catch {
      console.error("[OPENAI] Ignoring malformed message");
      return;
    }

    // Log all non-audio events for debugging
    if (msg.type !== "response.audio.delta" && msg.type !== "response.output_audio.delta" && msg.type !== "response.output_audio_transcript.delta") {
      console.log(`[OPENAI EVT] ${msg.type}`);
    }

    // Session ready ONLY once our session.update is applied (session.updated).
    // Greeting or audio before that would run against the default PCM16 config
    // and come out as static in µ-law mode.
    if (msg.type === "session.updated") {
      nativeConfirmed = audioMode === "ulaw";
      console.log(`[OPENAI] Session configured | audio mode: ${audioMode}`);
      sessionReady = true;
      if (pendingGreeting) {
        pendingGreeting = false;
        triggerGreeting();
      }
    }

    // Caller interrupted the AI — flush Twilio's buffered audio so she stops
    // talking instead of finishing the queued sentence. DEBOUNCED: noise bursts
    // (traffic, wind) also trigger speech_started, so we only flush if the
    // "speech" is still going after 300ms. A real interruption barely notices
    // the delay; a noise blip (speech_stopped arrives quickly) never flushes.
    if (msg.type === "input_audio_buffer.speech_started" && streamSid) {
      if (pendingClearTimer) clearTimeout(pendingClearTimer);
      pendingClearTimer = setTimeout(() => {
        pendingClearTimer = null;
        if (twilioWs.readyState === WebSocket.OPEN && streamSid) {
          twilioWs.send(JSON.stringify({ event: "clear", streamSid }));
        }
      }, 300);
    }
    if (msg.type === "input_audio_buffer.speech_stopped" && pendingClearTimer) {
      // Speech ended within the debounce window — treat it as noise, keep talking
      clearTimeout(pendingClearTimer);
      pendingClearTimer = null;
    }

    // Stream AI audio back to Twilio (native µ-law passthrough, or PCM→µ-law in fallback mode)
    if ((msg.type === "response.audio.delta" || msg.type === "response.output_audio.delta") && streamSid && msg.delta) {
      const ulawPayload = audioMode === "ulaw" ? msg.delta : pcm24kB64ToUlawB64(msg.delta);
      twilioWs.send(JSON.stringify({
        event: "media",
        streamSid,
        media: { payload: ulawPayload },
      }));
    }

    // Accumulate AI transcript for the current response turn
    if (msg.type === "response.audio_transcript.delta" || msg.type === "response.output_audio_transcript.delta") {
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
          handleBooking(line.trim(), clinicName, callerPhone, smsSender).catch(console.error);
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
      // If the native µ-law session config was rejected, fall back to the
      // legacy PCM transcode pipeline so the call still works.
      if (audioMode === "ulaw" && !nativeConfirmed) {
        console.warn("[OPENAI] Native µ-law config rejected — falling back to PCM transcode mode");
        audioMode = "pcm";
        openaiWs.send(JSON.stringify({ type: "input_audio_buffer.clear" }));
        openaiWs.send(JSON.stringify({ type: "session.update", session: sessionConfig() }));
      }
    }
  });

  openaiWs.on("close", (code, reason) => {
    console.log(`[OPENAI] Disconnected — code: ${code} reason: ${reason?.toString()}`);
    // OpenAI dropped while the caller is still on the line → don't leave them
    // in dead air; apologise and hang up via Twilio's REST API.
    if (!callEnded && callSid) {
      failCallGracefully(callSid);
    }
  });
  openaiWs.on("error", (err) => {
    console.error("[OPENAI] Error:", err.message);
    if (!callEnded && callSid) {
      failCallGracefully(callSid);
    }
  });

  function failCallGracefully(sid) {
    callEnded = true; // prevent double-fire from close following error
    console.warn(`[VOICE] AI connection lost mid-call — playing apology to ${sid}`);
    const twiml =
      `<?xml version="1.0" encoding="UTF-8"?><Response>` +
      `<Say language="hr-HR" voice="Google.hr-HR-Standard-A">Ispričavamo se, trenutno imamo tehničkih poteškoća. Molimo nazovite ponovno za nekoliko minuta. Hvala i doviđenja!</Say>` +
      `<Hangup/></Response>`;
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls/${sid}.json`;
    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
    const params = new URLSearchParams();
    params.append("Twiml", twiml);
    fetch(url, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    })
      .then((res) => console.log(`[VOICE] Apology TwiML pushed — HTTP ${res.status}`))
      .catch((err) => console.error("[VOICE] Failed to push apology TwiML:", err.message));
  }

  function triggerGreeting() {
    if (!openaiWs || openaiWs.readyState !== WebSocket.OPEN) return;

    // Update session with clinic-specific prompt
    openaiWs.send(JSON.stringify({
      type: "session.update",
      session: {
        type: "realtime",
        instructions: buildSystemPrompt(clinicName, treatments, callerPhone, staff, hours, durations),
      },
    }));

    // Trigger a natural Croatian receptionist greeting
    openaiWs.send(JSON.stringify({
      type: "response.create",
      response: {
        instructions: `You are answering the phone at "${clinicName}". Greet the caller exactly like a real Croatian receptionist would — you are a woman, so use feminine forms about yourself. In the greeting, naturally disclose that you are a digital assistant (required by EU law). Say something like: "Dobar dan, hvala što ste nazvali ${clinicName}. Ja sam digitalna asistentica klinike — kako vam mogu pomoći?" — natural, warm, professional. One sentence only. Use Croatian.`,
      },
    }));
  }

  // Handle messages from Twilio
  twilioWs.on("message", (data) => {
    let msg;
    try {
      msg = JSON.parse(data.toString());
    } catch {
      console.error("[TWILIO] Ignoring malformed message");
      return;
    }

    if (msg.event === "start") {
      streamSid = msg.start.streamSid;
      callSid = msg.start.callSid ?? null;
      const params = msg.start.customParameters ?? {};
      clinicName = params.clinicName ?? clinicName;
      treatments = params.treatments ?? treatments;
      staff = params.staff ?? staff;
      hours = params.hours ?? hours;
      durations = params.durations ?? durations;
      smsSender = params.smsSender ?? smsSender;
      callerPhone = params.callerPhone ?? callerPhone;
      console.log(`[VOICE] Stream started | Clinic: ${clinicName} | Caller: ${callerPhone}`);

      if (sessionReady) {
        triggerGreeting();
      } else {
        // Session not ready yet — flag so we greet once it is
        pendingGreeting = true;
      }
    }

    // Drop audio frames until the µ-law session config is confirmed — appending
    // µ-law into the default PCM16 buffer would feed the model garbage. The
    // caller only misses a few ms of silence before the greeting.
    if (msg.event === "media" && !sessionReady) return;

    if (msg.event === "media" && openaiWs?.readyState === WebSocket.OPEN) {
      // Native mode: pass Twilio's µ-law straight through (no lossy resampling).
      // Fallback mode: convert g711 µ-law 8kHz → PCM16 24kHz.
      const audio = audioMode === "ulaw" ? msg.media.payload : ulawB64ToPcm24kB64(msg.media.payload);
      openaiWs.send(JSON.stringify({
        type: "input_audio_buffer.append",
        audio,
      }));
    }

    if (msg.event === "stop") {
      console.log("[VOICE] Stream stopped");
      callEnded = true;
      openaiWs?.close();
    }
  });

  twilioWs.on("close", () => {
    console.log("[VOICE] Twilio disconnected");
    callEnded = true;
    if (pendingClearTimer) { clearTimeout(pendingClearTimer); pendingClearTimer = null; }
    openaiWs?.close();
  });

  twilioWs.on("error", (err) => console.error("[TWILIO] Error:", err.message));
});

async function handleBooking(line, clinicName, callerPhone, smsSender = "") {
  const get = (key) => {
    const match = line.match(new RegExp(`${key}=([^\\s]+)`));
    return match ? match[1] : "";
  };
  // Multi-word values use underscores in the tag — restore spaces for display
  const pretty = (v) => v.replace(/_/g, " ");
  const name = pretty(get("name"));
  const treatment = pretty(get("treatment"));
  const doctor = pretty(get("doctor"));
  const time = get("time").replace("T", " "); // ISO tag → readable "2026-06-11 10:00"
  const returning = get("returning");
  // Guard against a malformed/truncated phone in the tag (e.g. "+" from a
  // spaced number) — the caller's real number is always a safe fallback.
  const tagPhone = get("phone");
  const confirmedPhone = (tagPhone.replace(/\D/g, "").length >= 6 ? tagPhone : "") || callerPhone;

  console.log(`[BOOKING] Confirmed: ${name} | ${treatment} | ${doctor} | ${time} | ${confirmedPhone}`);

  // Sender priority: per-clinic name → clinic name trimmed to the 11-char
  // sender-ID limit → "RingLoop" only when no clinic context exists at all.
  // Messages for a clinic's line must never carry the RingLoop brand.
  const clinicFallback = (clinicName && clinicName !== "the clinic" ? clinicName : "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .trim()
    .slice(0, 11)
    .trim();

  const sender = smsSender || clinicFallback || SMS_FROM;

  // Confirmation SMS to the PATIENT who just booked
  const patientPhone = confirmedPhone.replace(/\s/g, "");
  if (/^\+\d{8,15}$/.test(patientPhone)) {
    const doctorPart = doctor && !/^(any|bilo|svejedno|nema)/i.test(doctor) ? ` (${doctor})` : "";
    await sendTwilioMessage(
      sender,
      patientPhone,
      `Poštovani, vaš termin u ${clinicName} je potvrđen:\n` +
      `${treatment}${doctorPart}\n${time}\n\n` +
      `Vidimo se!`
    ).catch((err) => console.error("[SMS] Patient confirmation failed:", err.message));
  } else {
    console.warn(`[SMS] Skipping patient confirmation — invalid phone: ${confirmedPhone}`);
  }

  // Notification to the clinic/admin
  if (ADMIN_PHONE) {
    await sendTwilioMessage(
      sender,
      ADMIN_PHONE,
      `📅 New booking at ${clinicName}!\n` +
      `Patient: ${name}\n` +
      `Treatment: ${treatment}\n` +
      `Doctor: ${doctor}\n` +
      `Time: ${time}\n` +
      `Returning patient: ${returning === "yes" ? "Yes" : "No"}\n` +
      `Contact: ${confirmedPhone}`
    );
  }
}

// Safety net: one bad message or rejected promise must never take down the
// whole server (and every live call with it). Log loudly, keep serving.
process.on("uncaughtException", (err) => {
  console.error("[FATAL-CAUGHT] Uncaught exception (server stays up):", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[FATAL-CAUGHT] Unhandled rejection (server stays up):", reason);
});

// Health check
app.get("/", (req, res) => res.json({ status: "RingLoop voice server running" }));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`[SERVER] Voice server listening on port ${PORT}`));
