// Forwards incoming calls to your personal phone so you can hear verification codes
const FORWARD_TO = process.env.FORWARD_TO_PHONE ?? "";

export async function POST() {
  if (FORWARD_TO) {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>${FORWARD_TO}</Dial>
</Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }

  // If no forward number set, just say a message
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Hello, this is Answerloop. Please leave a message after the tone.</Say>
</Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}
