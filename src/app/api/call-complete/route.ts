import { getClinic } from "@/clinics";
import { sendWhatsApp } from "@/whatsapp";

export async function POST(request: Request) {
  const body = await request.formData();
  const from = body.get("From")?.toString() ?? "";
  const to = body.get("To")?.toString() ?? "";
  const callStatus = body.get("CallStatus")?.toString() ?? "";

  console.log(`[CALL-COMPLETE] From: ${from} | To: ${to} | Status: ${callStatus}`);

  const clinic = getClinic(to);

  // WhatsApp is only used for 24h appointment reminders (see /api/cron/reminders).
  // No automatic messages are sent on call completion.

  return new Response("OK");
}
