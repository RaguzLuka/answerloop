"use server";

import { revalidatePath } from "next/cache";
import { and, desc, eq } from "drizzle-orm";
import { db, businesses, chatMessages, chats } from "@/lib/db";
import { requireBusiness } from "@/lib/dal";
import { senderFor, waSendText } from "@/lib/whatsapp";
import type { FormState } from "@/lib/form";

const WINDOW_MS = 24 * 60 * 60 * 1000; // WhatsApp allows free-form replies for 24 h after the customer's last message

async function ownChat(chatId: string) {
  const { business } = await requireBusiness();
  const [chat] = await db.select().from(chats).where(and(eq(chats.id, chatId), eq(chats.businessId, business.id))).limit(1);
  return chat ?? null;
}

/** The owner answers personally on WhatsApp; Halo then stays quiet in this conversation. */
export async function ownerReply(chatId: string, _: FormState, fd: FormData): Promise<FormState> {
  const chat = await ownChat(chatId);
  if (!chat) return { error: "Conversation not found" };
  if (chat.channel !== "whatsapp") return { error: "You can only reply to WhatsApp conversations from here." };
  const text = String(fd.get("text") ?? "").trim().slice(0, 1000);
  if (!text) return { error: "Write a message first" };

  const [lastFromCustomer] = await db
    .select({ at: chatMessages.createdAt })
    .from(chatMessages)
    .where(and(eq(chatMessages.chatId, chat.id), eq(chatMessages.role, "user")))
    .orderBy(desc(chatMessages.createdAt))
    .limit(1);
  if (!lastFromCustomer || Date.now() - lastFromCustomer.at > WINDOW_MS) {
    return { error: "WhatsApp only allows replies within 24 hours of the customer's last message. Call them instead." };
  }

  const [biz] = await db.select().from(businesses).where(eq(businesses.id, chat.businessId)).limit(1);
  const sender = biz ? senderFor(biz) : null;
  if (!sender) return { error: "Your WhatsApp number isn't connected." };
  const res = await waSendText(sender, chat.customerPhone, text);
  if (!res.ok) return { error: `WhatsApp didn't accept the message (${res.error}).` };
  await db.insert(chatMessages).values({ chatId: chat.id, role: "owner", content: text, waId: res.id });
  await db.update(chats).set({ ownerTookOverAt: chat.ownerTookOverAt ?? Date.now(), lastMessageAt: Date.now() }).where(eq(chats.id, chat.id));
  revalidatePath(`/chats/${chat.id}`);
  return { ok: true };
}

/** Let Halo answer again. */
export async function handBackToHalo(chatId: string) {
  const chat = await ownChat(chatId);
  if (!chat) return;
  await db.update(chats).set({ ownerTookOverAt: null }).where(eq(chats.id, chat.id));
  revalidatePath(`/chats/${chat.id}`);
}

/** Owner takes over without writing yet (e.g. they'll call the customer). */
export async function takeOver(chatId: string) {
  const chat = await ownChat(chatId);
  if (!chat) return;
  await db.update(chats).set({ ownerTookOverAt: Date.now() }).where(eq(chats.id, chat.id));
  revalidatePath(`/chats/${chat.id}`);
}
