import { maskPhone } from "@/mask-phone";
import { verifiedTwilioParams } from "@/twilio-verify";

export async function POST(request: Request) {
  const body = await verifiedTwilioParams(request);
  if (body === null) {
    return new Response("Forbidden", { status: 403 });
  }
  const from = body.From ?? "";
  const to = body.To ?? "";
  const callStatus = body.CallStatus ?? "";

  console.log(`[CALL-COMPLETE] From: ${maskPhone(from)} | To: ${to} | Status: ${callStatus}`);

  // WhatsApp is only used for 24h appointment reminders (see /api/cron/reminders).
  // No automatic messages are sent on call completion.

  return new Response("OK");
}
