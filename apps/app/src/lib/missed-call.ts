import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import { and, eq, gte } from "drizzle-orm";
import { db, calls, chatMessages, chats, textbackLinks, type Business, type CallOutcome } from "@/lib/db";
import { fillTemplate } from "@/lib/business-types";
import { bookingLink, canReceiveSms, sendBusinessSms } from "@/lib/sms";
import { chatAvailable, chatLink, openingMessage, startChat } from "@/lib/chat";
import { waSendTemplate, whatsappConfigured } from "@/lib/whatsapp";
import { formatPhone } from "@/lib/phone";
import { notifyBusiness } from "@/lib/push";
import { appUrl } from "@/lib/email";

const REPEAT_WINDOW_MS = 12 * 60 * 60 * 1000; // don't text the same caller twice in 12 h

/** Where the text-back sends this caller: a private chat with Halo (Pro, AI on),
 *  the business's own booking page (e.g. Buker), or our booking page. */
export async function textbackLink(biz: Business, phone: string, opts: { callId?: string; isTest?: boolean } = {}) {
  if (chatAvailable(biz)) {
    const chat = await startChat(biz, { phone, callId: opts.callId, isTest: opts.isTest });
    return { link: chatLink(chat.token), chat: true };
  }
  // A short tracked link, so the shop can see who actually tapped it
  const token = randomBytes(6).toString("base64url");
  const target = biz.customBookingUrl || `${bookingLink(biz)}?r=${token}`;
  await db.insert(textbackLinks).values({
    token, businessId: biz.id, callId: opts.callId ?? null, target, isTest: !!opts.isTest,
  });
  return { link: `${appUrl()}/r/${token}`, chat: false };
}

export const textbackBody = (biz: Business, link: string) => fillTemplate(biz.textbackMessage, biz.name, link);

/** Pro shops with WhatsApp switched on (and AI on) reach callers on WhatsApp first. */
export const whatsappAvailable = (biz: Business) => whatsappConfigured() && chatAvailable(biz) && biz.whatsappEnabled;

/** Opens the WhatsApp conversation with the approved template. If WhatsApp refuses
 *  straight away, the caller gets the SMS with the same conversation as a web chat. */
async function reachOnWhatsApp(biz: Business, phone: string, callId: string) {
  const chat = await startChat(biz, { phone, callId, channel: "whatsapp" });
  const res = await waSendTemplate(phone, biz.smsLanguage, [biz.name], openingMessage(biz, "whatsapp"));
  if (res.ok) {
    await db.update(chatMessages).set({ waId: res.id }).where(eq(chatMessages.chatId, chat.id));
    await db.update(calls).set({ channel: "whatsapp" }).where(eq(calls.id, callId));
    return { ok: true as const };
  }
  console.error("[whatsapp] template refused, falling back to SMS:", res.error);
  await db.update(chats).set({ smsFallbackAt: Date.now() }).where(eq(chats.id, chat.id));
  return sendBusinessSms(biz, "textback", phone, textbackBody(biz, chatLink(chat.token)));
}

export async function handleMissedCall(biz: Business, { callSid, from }: { callSid: string; from: string | null }) {
  // Twilio retries webhooks — handle each call once
  const [seen] = await db.select({ id: calls.id }).from(calls).where(eq(calls.callSid, callSid)).limit(1);
  if (seen) return;

  let outcome: CallOutcome;
  let chat = false;

  if (!from || from === biz.phone) outcome = "no_caller_id";
  else if (biz.status === "paused" || biz.status === "setup") outcome = "paused";
  else if (!canReceiveSms(from)) outcome = "landline";
  else {
    const [recent] = await db
      .select({ id: calls.id })
      .from(calls)
      .where(
        and(eq(calls.businessId, biz.id), eq(calls.callerPhone, from), eq(calls.outcome, "texted"), gte(calls.createdAt, Date.now() - REPEAT_WINDOW_MS)),
      )
      .limit(1);
    outcome = recent ? "repeat" : "texted";
  }

  const id = randomUUID();
  const inserted = await db
    .insert(calls)
    .values({ id, businessId: biz.id, callSid, callerPhone: from, outcome })
    .onConflictDoNothing()
    .returning({ id: calls.id });
  if (!inserted.length) return; // a parallel retry got here first

  let whatsapp = false;
  if (outcome === "texted" && from) {
    let res: { ok: true } | { ok: false; error: string };
    if (whatsappAvailable(biz)) {
      res = await reachOnWhatsApp(biz, from, id);
      whatsapp = true;
      chat = true;
    } else {
      const target = await textbackLink(biz, from, { callId: id });
      chat = target.chat;
      res = await sendBusinessSms(biz, "textback", from, textbackBody(biz, target.link));
    }
    if (!res.ok) {
      outcome = res.error === "Daily SMS limit reached" ? "limit" : "failed";
      await db.update(calls).set({ outcome, error: res.error }).where(eq(calls.id, id));
    }
  }

  const who = from ? formatPhone(from) : "a hidden number";
  const body =
    outcome === "texted"
      ? whatsapp
        ? `${who} called. Halo messaged them on WhatsApp to book them in.`
        : chat
        ? `${who} called. Halo texted them and can book them by chat.`
        : `${who} called. They got your text with the booking link.`
      : outcome === "repeat"
        ? `${who} called again. They already have your text.`
        : outcome === "landline"
          ? `${who} called from a landline, so they can't get a text. Call them back.`
          : outcome === "no_caller_id"
            ? "Someone called from a hidden number. They couldn't be texted."
            : outcome === "paused"
              ? `${who} called while RingLoop is paused.`
              : `${who} called, but the text didn't go out. Call them back.`;
  await notifyBusiness(biz.id, { title: "Missed call", body, url: "/dashboard" });
}
