import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { db, businesses, chatMessages, chats } from "@/lib/db";
import { chatIsOver, chatLink, loadChatById, respond, startChat } from "@/lib/chat";
import { waSendText } from "@/lib/whatsapp";
import { sendBusinessSms } from "@/lib/sms";
import { textbackBody } from "@/lib/missed-call";
import { notifyBusiness } from "@/lib/push";
import { formatPhone } from "@/lib/phone";

/* What arrives from Meta's webhook: customers' messages and delivery receipts. */

export type InboundMessage = { from: string; id: string; type: string; text?: string };
export type StatusUpdate = { id: string; status: string; errorCode?: number };

const NOT_TEXT = {
  hr: "Za sada mogu čitati samo pisane poruke. Napišite, molim Vas, za koju uslugu želite termin i kada Vam odgovara.",
  en: "For now I can only read written messages. Please type what you'd like to book and when suits you.",
};

const UNKNOWN_SENDER =
  "Pozdrav! Ovo je RingLoop, sustav za rezervacije salona i obrta. Nismo pronašli Vaš razgovor. Za termin, molimo, nazovite salon izravno.";

async function sendAndSave(chatId: string, to: string, role: "assistant", content: string) {
  const res = await waSendText(to, content);
  await db.insert(chatMessages).values({ chatId, role, content, waId: res.ok ? res.id : null });
  if (!res.ok) console.error("[whatsapp] reply failed:", res.error);
}

export async function handleInboundMessage(msg: InboundMessage) {
  // Meta retries webhooks: each message once
  const [seen] = await db.select({ id: chatMessages.id }).from(chatMessages).where(eq(chatMessages.waId, msg.id)).limit(1);
  if (seen) return;

  const phone = `+${msg.from.replace(/\D/g, "")}`;
  // Their latest conversation tells us which business they're talking to
  const [latest] = await db
    .select({ chat: chats, biz: businesses })
    .from(chats)
    .innerJoin(businesses, eq(businesses.id, chats.businessId))
    .where(eq(chats.customerPhone, phone))
    .orderBy(desc(chats.lastMessageAt))
    .limit(1);

  if (!latest) {
    await waSendText(phone, UNKNOWN_SENDER);
    return;
  }

  // Expired or web-only conversation: continue with a fresh WhatsApp one at the same business
  let chatId = latest.chat.id;
  if (chatIsOver(latest.chat) || latest.chat.channel !== "whatsapp") {
    const fresh = await startChat(latest.biz, { phone, channel: "whatsapp", withOpening: false });
    chatId = fresh.id;
  }
  const loaded = await loadChatById(chatId);
  if (!loaded) return;
  const lang = loaded.biz.smsLanguage === "en" ? "en" : "hr";

  if (msg.type !== "text" || !msg.text?.trim()) {
    await db.insert(chatMessages).values({ chatId, role: "user", content: `[${msg.type}]`, waId: msg.id });
    if (!loaded.chat.ownerTookOverAt) await sendAndSave(chatId, phone, "assistant", NOT_TEXT[lang]);
    return;
  }

  const reply = await respond(loaded, msg.text, { waId: msg.id });
  if ("error" in reply) return;

  if (loaded.chat.ownerTookOverAt) {
    // The owner is answering personally — ping them instead of Halo replying
    await notifyBusiness(loaded.biz.id, {
      title: `WhatsApp: ${loaded.chat.customerName ?? formatPhone(phone)}`,
      body: msg.text.slice(0, 120),
      url: `/chats/${chatId}`,
    });
    return;
  }
  // Halo's answer was saved by respond(); send it and attach the WhatsApp id
  for (const m of reply.messages.filter((x) => x.role === "assistant")) {
    const res = await waSendText(phone, m.content);
    if (!res.ok) console.error("[whatsapp] reply failed:", res.error);
    else {
      const [last] = await db
        .select({ id: chatMessages.id })
        .from(chatMessages)
        .where(and(eq(chatMessages.chatId, chatId), eq(chatMessages.role, "assistant")))
        .orderBy(desc(chatMessages.createdAt))
        .limit(1);
      if (last) await db.update(chatMessages).set({ waId: res.id }).where(eq(chatMessages.id, last.id));
    }
  }
}

/** If the opening WhatsApp couldn't be delivered (e.g. no WhatsApp on that number),
 *  send the SMS with the same conversation as a web chat instead. */
export async function handleStatus(st: StatusUpdate) {
  if (st.status !== "failed") return;
  const [m] = await db
    .select({ chatId: chatMessages.chatId })
    .from(chatMessages)
    .where(eq(chatMessages.waId, st.id))
    .limit(1);
  if (!m) return;
  const loaded = await loadChatById(m.chatId);
  if (!loaded || loaded.chat.smsFallbackAt) return;

  // Only the opening message triggers the fallback
  const [first] = await db
    .select({ waId: chatMessages.waId })
    .from(chatMessages)
    .where(eq(chatMessages.chatId, m.chatId))
    .orderBy(asc(chatMessages.createdAt))
    .limit(1);
  if (first?.waId !== st.id) return;

  await db.update(chats).set({ smsFallbackAt: Date.now() }).where(eq(chats.id, loaded.chat.id));
  const res = await sendBusinessSms(loaded.biz, "textback", loaded.chat.customerPhone, textbackBody(loaded.biz, chatLink(loaded.chat.token)));
  if (!res.ok) console.error("[whatsapp] SMS fallback failed:", res.error);
}
