import { after } from "next/server";
import { verifyMetaSignature } from "@/lib/whatsapp";
import { handleInboundMessage, handleStatus, type InboundMessage, type StatusUpdate } from "@/lib/whatsapp-inbound";

/* Meta's WhatsApp webhook.
   GET  — one-time verification when the webhook URL is saved in the Meta app.
   POST — customers' messages and delivery receipts (signed with the app secret). */

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ok =
    url.searchParams.get("hub.mode") === "subscribe" &&
    !!process.env.WHATSAPP_VERIFY_TOKEN &&
    url.searchParams.get("hub.verify_token") === process.env.WHATSAPP_VERIFY_TOKEN;
  return ok ? new Response(url.searchParams.get("hub.challenge") ?? "") : new Response("Forbidden", { status: 403 });
}

type Payload = {
  entry?: {
    changes?: {
      value?: {
        messages?: { from: string; id: string; type: string; text?: { body?: string } }[];
        statuses?: { id: string; status: string; errors?: { code?: number }[] }[];
      };
    }[];
  }[];
};

export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyMetaSignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new Response("Forbidden", { status: 403 });
  }
  let payload: Payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const messages: InboundMessage[] = [];
  const statuses: StatusUpdate[] = [];
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      for (const m of change.value?.messages ?? []) {
        messages.push({ from: m.from, id: m.id, type: m.type, text: m.text?.body });
      }
      for (const s of change.value?.statuses ?? []) {
        statuses.push({ id: s.id, status: s.status, errorCode: s.errors?.[0]?.code });
      }
    }
  }

  // Answer Meta at once; Halo's reply can take a few seconds
  after(async () => {
    for (const m of messages) await handleInboundMessage(m).catch((err) => console.error("[whatsapp] inbound failed:", err));
    for (const s of statuses) await handleStatus(s).catch((err) => console.error("[whatsapp] status failed:", err));
  });
  return new Response("OK");
}
