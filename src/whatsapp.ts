const WHATSAPP_FROM = process.env.WHATSAPP_FROM ?? "whatsapp:+14155238886";
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID ?? "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ?? "";

export async function sendWhatsApp(to: string, message: string) {
  const toNumber = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

  const params = new URLSearchParams();
  params.append("From", WHATSAPP_FROM);
  params.append("To", toNumber);
  params.append("Body", message);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await res.json();
  if (data.error_message) {
    console.error(`[WHATSAPP] Error sending to ${to}: ${data.error_message}`);
  } else {
    console.log(`[WHATSAPP] Sent to ${to} | SID: ${data.sid}`);
  }
  return data;
}
