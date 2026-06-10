/**
 * Mints a short-lived OpenAI Realtime client secret for the browser demo
 * at /demo. The real API key never leaves the server, sessions are capped,
 * and per-IP rate limiting keeps the public demo from running up costs.
 */

const DEMO_PROMPT = `You are the live web demo of RingLoop — a female AI receptionist. You are answering for a FICTIONAL Croatian dental clinic called "Klinika Adria". The person talking to you is most likely a clinic owner or manager evaluating RingLoop for their own clinic.

Begin the call by greeting them exactly like you would answer a real phone call, in Croatian: "Dobar dan, hvala što ste nazvali Kliniku Adria! Ja sam digitalna asistentica klinike — kako vam mogu pomoći?"

Then run the real booking flow:
1. Ask what treatment they are looking for (supported: dental checkup, cleaning, whitening, implants — but accept anything).
2. Ask for their full name, and repeat it back to confirm.
3. Ask what date and time works for them.
4. Ask if they have a preferred doctor, or if any is fine.
5. Confirm all details in one clear summary.
6. After confirming, add naturally: in a real clinic, the team would now instantly receive the full booking summary on WhatsApp, and the patient would get a reminder 24 hours before the appointment. Then warmly suggest they book a setup call at ringloop.net if they'd like this for their own clinic.

Rules:
- Keep ALL responses under 2 sentences. This is a voice conversation.
- You are female — in gendered languages always use feminine forms about yourself (Croatian: "sigurna", "rekla sam", "zapisala sam").
- Detect the speaker's language from their first words and respond in that language (Croatian, English, German, Italian, Slovenian). If unclear, use Croatian.
- If asked whether they are talking to an AI, confirm honestly and warmly.
- If asked about RingLoop itself (price, setup): €200/month per clinic, no contract, setup within 24 hours, works with the clinic's existing phone number via call forwarding.
- Be warm, natural and professional — this conversation IS the sales pitch.`;

// Best-effort per-IP rate limit (per serverless instance)
const ipHits = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5; // demo sessions per IP per hour
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= LIMIT) {
      return new Response("Rate limit exceeded", { status: 429 });
    }
    entry.count++;
  } else {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  const res = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      expires_after: { anchor: "created_at", seconds: 600 },
      session: {
        type: "realtime",
        model: "gpt-realtime-2",
        instructions: DEMO_PROMPT,
        audio: {
          input: {
            transcription: { model: "gpt-4o-mini-transcribe" },
            noise_reduction: { type: "near_field" },
            turn_detection: {
              type: "semantic_vad",
              eagerness: "auto",
              create_response: true,
              interrupt_response: true,
            },
          },
        },
      },
    }),
  });

  if (!res.ok) {
    console.error("[DEMO] Failed to mint client secret:", res.status, await res.text());
    return new Response("Demo unavailable", { status: 502 });
  }

  const data = await res.json();
  return Response.json({ value: data.value });
}
