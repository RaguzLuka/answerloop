import { after } from "next/server";
import { verifyMetaSignature } from "@/lib/whatsapp";
import {
  handleEcho, handleInboundMessage, handleStatus,
  type EchoMessage, type InboundMessage, type StatusUpdate,
} from "@/lib/whatsapp-inbound";

/* Meta's WhatsApp webhook (one URL for every shop's number).
   GET  — one-time verification when the webhook URL is saved in the Meta app.
   POST — messages, the owner's own replies (echoes) and delivery receipts,
          signed with the app secret. Subscribe to "messages" and "smb_message_echoes". */

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ok =
    url.searchParams.get("hub.mode") === "subscribe" &&
    !!process.env.WHATSAPP_VERIFY_TOKEN &&
    url.searchParams.get("hub.verify_token") === process.env.WHATSAPP_VERIFY_TOKEN;
  return ok ? new Response(url.searchParams.get("hub.challenge") ?? "") : new Response("Forbidden", { status: 403 });
}

type WaText = { text?: { body?: string } };
type Payload = {
  entry?: {
    changes?: {
      field?: string;
      value?: {
        metadata?: { phone_number_id?: string };
        messages?: ({ from: string; id: string; type: string } & WaText)[];
        message_echoes?: ({ from?: string; to: string; id: string; type?: string } & WaText)[];
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
  const echoes: EchoMessage[] = [];
  const statuses: StatusUpdate[] = [];
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const v = change.value;
      const phoneNumberId = v?.metadata?.phone_number_id ?? "";
      for (const m of v?.messages ?? []) {
        messages.push({ phoneNumberId, from: m.from, id: m.id, type: m.type, text: m.text?.body });
      }
      for (const e of v?.message_echoes ?? []) {
        echoes.push({ phoneNumberId, to: e.to, id: e.id, text: e.text?.body });
      }
      for (const s of v?.statuses ?? []) {
        statuses.push({ id: s.id, status: s.status, errorCode: s.errors?.[0]?.code });
      }
    }
  }

  // Answer Meta at once; Halo's reply can take a few seconds
  after(async () => {
    for (const m of messages) await handleInboundMessage(m).catch((err) => console.error("[whatsapp] inbound failed:", err));
    for (const e of echoes) await handleEcho(e).catch((err) => console.error("[whatsapp] echo failed:", err));
    for (const s of statuses) await handleStatus(s).catch((err) => console.error("[whatsapp] status failed:", err));
  });
  return new Response("OK");
}
