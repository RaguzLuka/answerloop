import { getClinic } from "@/clinics";
import { sendWhatsApp } from "@/whatsapp";

export async function POST(request: Request) {
  const body = await request.formData();
  const from = body.get("From")?.toString() ?? "";
  const to = body.get("To")?.toString() ?? "";
  const callStatus = body.get("CallStatus")?.toString() ?? "";

  console.log(`[CALL-COMPLETE] From: ${from} | To: ${to} | Status: ${callStatus}`);

  const clinic = getClinic(to);

  // Only send WhatsApp if the call was not answered by the AI (e.g., caller hung up before speaking)
  // The AI voice agent handles its own messaging — this is a fallback for truly missed calls.
  if (callStatus === "no-answer" || callStatus === "busy" || callStatus === "failed") {
    if (from && from !== "anonymous") {
      await sendWhatsApp(
        from,
        `Hi! Sorry we missed your call. This is ${clinic.name} — feel free to message us here or call back and our AI assistant will book you right in. 😊`
      );
    }
  }

  return new Response("OK");
}
