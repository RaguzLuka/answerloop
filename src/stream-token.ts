import crypto from "crypto";

/**
 * Short-lived token that authenticates a call's Twilio media stream to the
 * Railway voice server. /api/voice mints it only after verifying Twilio's
 * signature and passes it as a <Stream> <Parameter> (Stream URLs can't carry
 * query strings); voice-server.js checks it in verifyStreamToken() before it
 * opens an OpenAI session, then looks the clinic up itself from `to`.
 *
 * Format: base64url(JSON claims) + "." + base64url(HMAC-SHA256(payload)),
 * keyed with VOICE_STREAM_SECRET — the same value must be set on Vercel and Railway.
 */

const TTL_SECONDS = 120; // Twilio opens the stream right after fetching the TwiML

export interface StreamClaims {
  callSid: string;
  /** The business number that was called — selects the clinic config */
  to: string;
  /** The caller's number */
  from: string;
}

/** Returns null when VOICE_STREAM_SECRET isn't configured. */
export function mintStreamToken(claims: StreamClaims): string | null {
  const secret = process.env.VOICE_STREAM_SECRET;
  if (!secret) return null;
  const payload = Buffer.from(
    JSON.stringify({ ...claims, exp: Math.floor(Date.now() / 1000) + TTL_SECONDS })
  ).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}
