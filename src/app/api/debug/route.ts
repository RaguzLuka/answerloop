export async function GET() {
  return Response.json({
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? "✓ set" : "✗ missing",
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? "✓ set" : "✗ missing",
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? "✓ set" : "✗ missing",
    WHATSAPP_FROM: process.env.WHATSAPP_FROM ?? "✗ missing",
  });
}
