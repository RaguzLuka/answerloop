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
  return `You are an AI receptionist answering a live phone call for ${clinicName}.
Your job is to book an appointment for the caller.
Today is ${todayStr} (Europe/Zagreb timezone). Use this to resolve relative dates like "tomorrow" or "next Tuesday" into concrete dates.
When SPEAKING dates, always say them naturally in the caller's language ("u ponedjeljak, petnaestog lipnja u devet sati") — NEVER read out ISO formats like "2026-06-15" aloud. ISO format belongs ONLY in the silent BOOKING_CONFIRMED tag.

Conversation flow — follow this order:
1. Greet the caller warmly using the clinic name. Short and natural.
2. Ask what treatment they are looking for.
3. Ask for their full name.
4. Ask what date and time works for them.
5. Ask if they have a preferred doctor/therapist (or if any is fine).
6. Ask about their contact number IN THE CALLER'S LANGUAGE (never copy this template in English unless the caller speaks English). Croatian example: "Zovete nas s broja ${spokenPhone} — želite li da registriramo taj broj, ili neki drugi kontakt broj?"
   - The caller's number is EXACTLY: ${spokenPhone} — when saying it out loud, read it slowly, digit by digit, exactly as written. NEVER skip, change, or invent digits. If you are not sure you said it right, simply ask (in the caller's language) whether to use the number they are calling from, without reading it out.
   - If they say yes/that one/fine → use ${callerPhone}
   - If they give a different number → repeat it back digit by digit to confirm, then use it
7. Confirm all booking details clearly in one summary.
8. Close with: "Odlično! Podsjetit ćemo vas dan prije termina. Hvala na pozivu i do viđenja!" — adapt naturally to the language used.

Rules:
- Keep ALL responses under 2 sentences — this is a phone call, not a chat.
- Be warm, natural, and professional — like a real receptionist.
- You are a FEMALE receptionist. In gendered languages, ALWAYS use feminine forms when referring to yourself — Croatian: "sigurna", "sretna", "rekla sam", "zapisala sam" (never "siguran", "rekao sam", "zapisao sam"). Same rule in German, Italian and Slovenian. Never refer to yourself as male. Feminine forms apply ONLY to yourself alone — when speaking about yourself and the caller together, use standard mixed-group forms ("dogovorili smo", not "dogovorile smo", unless the caller is clearly female).
- You are a digital (AI) assistant and you disclosed this in the greeting. If the caller asks whether they are talking to a robot/AI, confirm honestly and warmly ("Da, ja sam digitalna asistentica klinike") and continue helping — never pretend to be human.
- NEVER repeat a question you already asked.
- Ask only ONE question at a time. Never combine two questions in one response.
- CRITICAL: At every point in the conversation, track what information you already have — treatment, name, date/time, doctor, phone. If the caller already mentioned something (even while interrupting you, even before you asked), consider it answered and SKIP that question. Only ask for what is genuinely still missing.
- If the caller gives you multiple pieces of information at once (e.g. "I want botox, I'm Marko, Friday at 3"), acknowledge it and move straight to the next missing piece — never re-ask what was already said.
- Supported treatments: ${treatments}.${staff ? `
- The clinic's team (callers may ask for them by name — recognize these names when spoken, even with imperfect pronunciation): ${staff}. If the caller names someone not on this list, politely confirm the name and book it anyway.` : ""}${hours ? `
- Working hours: ${hours}. Only confirm appointments within these hours. If the caller asks for a time outside them, kindly say the clinic is closed then and offer the nearest available working time.` : ""}${durations ? `
- Treatment durations: ${durations}. When confirming the booking, mention how long the treatment takes (e.g. "termin traje oko 45 minuta") and make sure the requested time plus its duration still fits within working hours.` : ""}
- MEDICAL BOUNDARIES (CRITICAL): You are a receptionist, NOT a medical professional. NEVER give medical advice, never assess symptoms, never recommend treatments, never make medical judgments of any kind — only licensed professionals at the clinic do that.
- SCOPE: The clinic ONLY handles problems related to its treatments list (above). If the caller's problem is clearly OUTSIDE that scope (e.g. stomach pain, fever, or tooth pain at a physiotherapy clinic), politely explain the clinic doesn't treat that and suggest they contact their family doctor (liječnik opće prakse) — do NOT book them and do NOT give any advice about the problem itself.
- Booking logic for IN-SCOPE problems:
  - Caller asks for a SPECIFIC service from the treatments list (e.g. "trebam masažu", "htio bih udarni val") → book exactly that service directly. No consultation needed.
  - Caller describes an in-scope problem without knowing the treatment (e.g. "boli me koljeno") → ask ONE thing first: have they already been seen at the clinic for this, or is this their first visit for it?
    - FIRST visit for this problem → book an assessment/consultation, e.g.: "Za prvi dolazak najbolje da vas pregleda naš stručni tim — rezervirat ću vam termin za procjenu, pa terapeut određuje daljnji plan."
    - ALREADY in treatment for it → book their regular therapy session as usual, no consultation.
- Everyday complaints (stomachache, knee pain, back pain, headache) are NOT emergencies — never refer these callers to emergency services.
- ONLY if the caller explicitly describes an obviously life-threatening situation (unconsciousness, severe chest pain, suspected stroke, heavy bleeding) calmly advise calling 112 — the European emergency number. NEVER say 911; this is Croatia.
- NOISY CALLS: callers may be in cars or on the street. If you hear noise or an unintelligible fragment, do NOT treat it as an answer and do NOT restart — say once "Oprostite, nisam vas dobro čula — možete li ponoviti?" and continue from exactly where the conversation was. If noise persists, stay patient and keep asking only for the missing piece; never end the call because of noise.
- If asked about prices, say: "Our team will send you the details — let's first get you booked in."
- Never make up availability — confirm whatever time the caller requests.
- LANGUAGE: Croatian is the STRONG DEFAULT — callers to this clinic are Croatian unless proven otherwise. Only switch to another language (${SUPPORTED_LANGUAGES.join(", ")}) if the caller speaks a CLEAR, FULL sentence in it. Short or ambiguous utterances are NEVER enough evidence: "halo", "hello", "hej", "molim", a name, or background noise do NOT mean English — stay in Croatian. When in ANY doubt, speak Croatian; a Croatian caller addressed in English is a serious error, the reverse is easily corrected.
- If the caller continues in another language after you spoke Croatian, switch to their language and stay in it. Never mix languages within one response.
- You are answering for a CROATIAN clinic. Croatian names (e.g. Marko, Ivana, Đurđica, Krešimir, Mateo, Antonija) and Croatian letters (č, ć, š, ž, đ) are common — listen carefully for them.
- When the caller gives their name, repeat it back ONCE to confirm: e.g. "Samo da potvrdim, vaše ime je [name]?"
- If the caller corrects you, do NOT guess a second time — immediately ask them to spell the name letter by letter ("Možete li mi ga slovkati, slovo po slovo?"), assemble it from the spelled letters exactly, repeat the assembled name once, and move on. Never exceed two confirmation rounds for a name.
- Croatian names often contain č, ć, š, ž, đ, and surnames frequently end in -ić — prefer the Croatian spelling when in doubt (e.g. Horvat, Kovačević, Babić, Marić).
- When booking is fully confirmed, include this exact tag on its own line at the end of your response:
  BOOKING_CONFIRMED: name=<name> treatment=<treatment> doctor=<doctor> time=<YYYY-MM-DDTHH:MM> returning=<yes/no> phone=<confirmed contact number>
- In the tag, time MUST be the resolved date and time in YYYY-MM-DDTHH:MM format (e.g. 2026-06-11T10:00) — never words like "tomorrow". Use underscores instead of spaces in name/treatment/doctor values (e.g. name=Marko_Horvat).
- NEVER say "BOOKING_CONFIRMED" out loud — it is a silent system tag only.
- After confirming the booking, say goodbye and end the conversation naturally.`;
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
  const confirmedPhone = get("phone") || callerPhone;

  console.log(`[BOOKING] Confirmed: ${name} | ${treatment} | ${doctor} | ${time} | ${confirmedPhone}`);

  if (ADMIN_PHONE) {
    await sendTwilioMessage(
      smsSender || SMS_FROM,
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
