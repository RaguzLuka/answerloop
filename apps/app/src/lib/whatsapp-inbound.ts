import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { db, bookings, businesses, calls, chatMessages, chats, smsLog, type Business } from "@/lib/db";
import { chatAvailable, chatIsOver, chatLink, loadChatById, respond, startChat } from "@/lib/chat";
import { senderFor, waSendText } from "@/lib/whatsapp";
import { reminderText, sendBusinessSms } from "@/lib/sms";
import { textbackBody } from "@/lib/missed-call";
import { notifyBusiness } from "@/lib/push";
import { formatPhone } from "@/lib/phone";

/* What arrives from Meta's webhook, per shop number (metadata.phone_number_id):
   - customers' messages     → Halo answers (only in missed-call conversations if
                               the number is also the shop's own WhatsApp app)
   - the owner's own replies → "echoes" from the WhatsApp Business app: Halo steps back
   - delivery receipts       → opening message undeliverable: SMS fallback */

export type InboundMessage = { phoneNumberId: string; from: string; id: string; type: string; text?: string };
export type EchoMessage = { phoneNumberId: string; to: string; id: string; text?: string };
export type StatusUpdate = { id: string; status: string; errorCode?: number };

const NOT_TEXT = {
  hr: "Za sada mogu čitati samo pisane poruke. Napišite, molim Vas, za koju uslugu želite termin i kada Vam odgovara.",
  en: "For now I can only read written messages. Please type what you'd like to book and when suits you.",
};

async function shopByNumber(phoneNumberId: string) {
  const [biz] = await db.select().from(businesses).where(eq(businesses.waPhoneNumberId, phoneNumberId)).limit(1);
  return biz ?? null;
}

/** The customer's open WhatsApp conversation with Halo at this shop, if any. */
async function openConversation(biz: Business, phone: string) {
  const [chat] = await db
    .select()
    .from(chats)
    .where(and(eq(chats.businessId, biz.id), eq(chats.customerPhone, phone), eq(chats.channel, "whatsapp")))
    .orderBy(desc(chats.lastMessageAt))
    .limit(1);
  return chat && !chatIsOver(chat) ? chat : null;
}

export async function handleInboundMessage(msg: InboundMessage) {
  // Meta retries webhooks: each message once
  const [seen] = await db.select({ id: chatMessages.id }).from(chatMessages).where(eq(chatMessages.waId, msg.id)).limit(1);
  if (seen) return;

  const biz = await shopByNumber(msg.phoneNumberId);
  const sender = biz ? senderFor(biz) : null;
  if (!biz || !sender) return; // not one of our connected numbers

  const phone = `+${msg.from.replace(/\D/g, "")}`;
  let chat = await openConversation(biz, phone);
  if (!chat) {
    // The shop's own WhatsApp app number: everything outside Halo's missed-call
    // conversations belongs to the owner — don't read or store it.
    if (biz.waOwnApp || !chatAvailable(biz)) return;
    // A number used only for RingLoop: Halo welcomes new conversations too
    chat = await startChat(biz, { phone, channel: "whatsapp", withOpening: false });
  }
  const loaded = await loadChatById(chat.id);
  if (!loaded) return;
  const lang = biz.smsLanguage === "en" ? "en" : "hr";

  if (msg.type !== "text" || !msg.text?.trim()) {
    await db.insert(chatMessages).values({ chatId: chat.id, role: "user", content: `[${msg.type}]`, waId: msg.id });
    if (!loaded.chat.ownerTookOverAt) {
      const res = await waSendText(sender, phone, NOT_TEXT[lang]);
      await db.insert(chatMessages).values({ chatId: chat.id, role: "assistant", content: NOT_TEXT[lang], waId: res.ok ? res.id : null });
    }
    return;
  }

  const reply = await respond(loaded, msg.text, { waId: msg.id });
  if ("error" in reply) return;

  if (loaded.chat.ownerTookOverAt) {
    if (!biz.waOwnApp) {
      // The owner answers from RingLoop — ping them (with their own app they see it there already)
      await notifyBusiness(biz.id, {
        title: `WhatsApp: ${loaded.chat.customerName ?? formatPhone(phone)}`,
        body: msg.text.slice(0, 120),
        url: `/chats/${chat.id}`,
      });
    }
    return;
  }
  // Halo's answer was saved by respond(); send it and attach the WhatsApp id
  for (const m of reply.messages.filter((x) => x.role === "assistant")) {
    const res = await waSendText(sender, phone, m.content);
    if (!res.ok) {
      console.error("[whatsapp] reply failed:", res.error);
      continue;
    }
    const [last] = await db
      .select({ id: chatMessages.id })
      .from(chatMessages)
      .where(and(eq(chatMessages.chatId, chat.id), eq(chatMessages.role, "assistant")))
      .orderBy(desc(chatMessages.createdAt))
      .limit(1);
    if (last) await db.update(chatMessages).set({ waId: res.id }).where(eq(chatMessages.id, last.id));
  }
}

/** The owner wrote from the shop's WhatsApp Business app: record it and let Halo step back. */
export async function handleEcho(echo: EchoMessage) {
  const [seen] = await db.select({ id: chatMessages.id }).from(chatMessages).where(eq(chatMessages.waId, echo.id)).limit(1);
  if (seen) return; // Halo's own message coming back, or already recorded
  const biz = await shopByNumber(echo.phoneNumberId);
  if (!biz) return;
  const chat = await openConversation(biz, `+${echo.to.replace(/\D/g, "")}`);
  if (!chat) return; // not a Halo conversation — not ours to read
  await db.insert(chatMessages).values({ chatId: chat.id, role: "owner", content: echo.text ?? "[message]", waId: echo.id });
  await db
    .update(chats)
    .set({ ownerTookOverAt: chat.ownerTookOverAt ?? Date.now(), lastMessageAt: Date.now() })
    .where(eq(chats.id, chat.id));
}

/** If the opening WhatsApp couldn't be delivered (e.g. no WhatsApp on that number),
 *  send the SMS with the same conversation as a web chat instead. */
export async function handleStatus(st: StatusUpdate) {
  if (st.status !== "failed") return;

  // Meta doesn't charge for undelivered messages, so they leave the cost view
  const [logged] = await db.select().from(smsLog).where(eq(smsLog.sid, st.id)).limit(1);
  if (logged) await db.update(smsLog).set({ error: `undelivered (${st.errorCode ?? "?"})` }).where(eq(smsLog.id, logged.id));

  // A reminder that didn't arrive on WhatsApp goes by SMS instead
  if (logged?.kind === "reminder" && logged.ref) {
    const [row] = await db
      .select({ booking: bookings, biz: businesses })
      .from(bookings)
      .innerJoin(businesses, eq(businesses.id, bookings.businessId))
      .where(eq(bookings.id, logged.ref))
      .limit(1);
    if (row && row.booking.status === "confirmed") {
      await sendBusinessSms(row.biz, "reminder", row.booking.customerPhone, reminderText(row.biz, row.booking), row.booking.id);
    }
    return;
  }

  const [m] = await db.select({ chatId: chatMessages.chatId }).from(chatMessages).where(eq(chatMessages.waId, st.id)).limit(1);
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
  if (res.ok || !loaded.chat.callId) return;
  // Nobody got a message: the call doesn't count, and the owner should call back
  console.error("[whatsapp] SMS fallback failed:", res.error);
  await db.update(calls).set({ outcome: "failed", error: res.error }).where(eq(calls.id, loaded.chat.callId));
  await notifyBusiness(loaded.biz.id, {
    title: "Missed call",
    body: `${formatPhone(loaded.chat.customerPhone)} called, but the message didn't arrive. Call them back.`,
    url: "/dashboard",
  }).catch((err) => console.error("[push] missed call:", err));
}
