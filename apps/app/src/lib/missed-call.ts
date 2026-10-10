import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import { and, eq, gte } from "drizzle-orm";
import { db, calls, chatMessages, chats, textbackLinks, type Business, type CallOutcome } from "@/lib/db";
import { fillTemplate } from "@/lib/business-types";
import { bookingLink, canReceiveSms, sendBusinessSms } from "@/lib/sms";
import { afterAnswered, allowanceOf, mayAnswer, recordMessage } from "@/lib/usage";
import { chatAvailable, chatLink, openingMessage, startChat } from "@/lib/chat";
import { senderFor, waSendTemplate, whatsappReady } from "@/lib/whatsapp";
import { formatPhone } from "@/lib/phone";
import { notifyBusiness } from "@/lib/push";
import { appUrl } from "@/lib/email";

const REPEAT_WINDOW_MS = 12 * 60 * 60 * 1000; // don't text the same caller twice in 12 h

/** Where the text-back sends this caller: a private chat with Halo (AI on),
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

/** Shops whose own WhatsApp number is connected (and AI on) reach callers on WhatsApp first. */
export const whatsappAvailable = (biz: Business) =>
  whatsappReady() && chatAvailable(biz) && biz.whatsappEnabled && !!senderFor(biz);

/** Opens the WhatsApp conversation with the approved template. If WhatsApp refuses
 *  straight away, the caller gets the SMS with the same conversation as a web chat. */
async function reachOnWhatsApp(biz: Business, phone: string, callId: string) {
  const chat = await startChat(biz, { phone, callId, channel: "whatsapp" });
  const res = await waSendTemplate(senderFor(biz)!, phone, "missed_call", biz.smsLanguage, [biz.name], openingMessage(biz, "whatsapp"));
  await recordMessage(biz, {
    kind: "textback", channel: "whatsapp", to: phone, ref: chat.id,
    sid: res.ok ? res.id : null, error: res.ok ? null : res.error,
  });
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
  let extra = false;

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
    if (outcome === "texted") {
      const gate = await mayAnswer(biz);
      if (gate.ok) extra = gate.extra;
      else outcome = "limit"; // the month's missed calls are used up and the shop chose to pause
    }
  }

  const id = randomUUID();
  const inserted = await db
    .insert(calls)
    .values({ id, businessId: biz.id, callSid, callerPhone: from, outcome, extra })
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
      outcome = "failed";
      await db.update(calls).set({ outcome, error: res.error }).where(eq(calls.id, id));
    } else await afterAnswered(biz);
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
              : outcome === "limit"
                ? `${who} called. This month's ${allowanceOf(biz)} missed calls are used up, so they didn't get a message. Call them back.`
                : `${who} called, but the text didn't go out. Call them back.`;
  await notifyBusiness(biz.id, { title: "Missed call", body, url: "/dashboard" });
}
