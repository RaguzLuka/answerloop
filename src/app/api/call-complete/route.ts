import { getClinic } from "@/clinics";

const WHATSAPP_FROM = process.env.WHATSAPP_FROM ?? "whatsapp:+14155238886";
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID ?? "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ?? "";

export async function POST(request: Request) {
  const body = await request.formData();
  const from = body.get("From")?.toString() ?? "";
  const to = body.get("To")?.toString() ?? "";
  const callStatus = body.get("CallStatus")?.toString() ?? "";

  console.log(`[CALL-COMPLETE] From: ${from} | To: ${to} | Status: ${callStatus}`);

  const clinic = getClinic(to);

  // Send WhatsApp to the caller
  if (from && from !== "anonymous") {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

    const params = new URLSearchParams();
    params.append("From", WHATSAPP_FROM);
    params.append("To", `whatsapp:${from}`);
    params.append("Body", `Hi! Sorry we missed your call. This is ${clinic.name} — how can we help you today? 😊`);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json();
    console.log(`[WHATSAPP] Sent to ${from} | SID: ${data.sid} | Error: ${data.error_message}`);
  }

  return new Response("OK");
}
