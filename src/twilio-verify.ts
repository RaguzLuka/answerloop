import crypto from "crypto";

/**
 * Validates Twilio webhook requests via the X-Twilio-Signature header,
 * so spoofed POSTs can't trigger calls, replies, or fake bookings.
 * https://www.twilio.com/docs/usage/security#validating-requests
 *
 * Returns the parsed body params when the signature is valid, null when not.
 * If TWILIO_AUTH_TOKEN is unset (local dev), validation is skipped.
 */
export async function verifiedTwilioParams(
  request: Request
): Promise<Record<string, string> | null> {
  let params: Record<string, string> = {};
  if (request.method === "POST") {
    const text = await request.text();
    params = Object.fromEntries(new URLSearchParams(text));
  }

  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!token) return params;

  const signature = request.headers.get("x-twilio-signature");
  if (!signature) return null;

  // Reconstruct the exact public URL Twilio signed (Vercel proxies the host)
  const u = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? u.host;
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const url = `${proto}://${host}${u.pathname}${u.search}`;

  const data =
    url +
    Object.keys(params)
      .sort()
      .map((k) => k + params[k])
      .join("");
  const expected = crypto.createHmac("sha1", token).update(Buffer.from(data, "utf-8")).digest("base64");

  try {
    if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
      return params;
    }
  } catch {
    // length mismatch — fall through to reject
  }
  console.warn(`[TWILIO-VERIFY] Rejected request to ${url} — invalid signature`);
  return null;
}
