import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, services } from "@/lib/db";
import { chatIsOver, loadChat } from "@/lib/chat";
import ChatView from "./ChatView";

export const metadata: Metadata = { title: "Chat", robots: { index: false, follow: false } };
export const viewport: Viewport = { themeColor: "#ffffff", interactiveWidget: "resizes-content" };

/* The chat a caller opens from the text-back. */
export default async function ChatPage({ params }: PageProps<"/c/[token]">) {
  const { token } = await params;
  const loaded = await loadChat(token);
  if (!loaded) notFound();
  const { chat, biz, messages, booking } = loaded;

  const list = await db.select().from(services).where(eq(services.businessId, biz.id)).orderBy(asc(services.position));
  const userSpoke = messages.some((m) => m.role === "user");

  return (
    <ChatView
      token={token}
      businessName={biz.name}
      lang={biz.smsLanguage}
      timezone={biz.timezone}
      initial={messages.map((m) => ({ id: m.id, role: m.role, content: m.content }))}
      suggestions={userSpoke ? [] : list.filter((s) => s.active).slice(0, 4).map((s) => s.name)}
      booking={booking ? { service: booking.serviceName, startsAt: booking.startsAt } : null}
      expired={chatIsOver(chat)}
    />
  );
}
