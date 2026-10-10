import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db, bookings, chatMessages, chats } from "@/lib/db";
import { requireBusiness } from "@/lib/dal";
import { handBackToHalo, takeOver } from "@/lib/actions/chats";
import { formatDateTime, formatDay, formatTime } from "@/lib/time";
import { formatPhone } from "@/lib/phone";
import Halo from "@/components/Halo";
import Icon from "@/components/Icon";
import { SubmitButton } from "@/components/form";
import OwnerReply from "./OwnerReply";
import AutoRefresh from "./AutoRefresh";

export const metadata: Metadata = { title: "Conversation" };

/* A caller's conversation with Halo (WhatsApp or web chat). On WhatsApp the
   owner can step in and write as the business; Halo then stays quiet. */
export default async function ChatTranscript({ params }: PageProps<"/chats/[id]">) {
  const { business } = await requireBusiness();
  const { id } = await params;
  const [chat] = await db.select().from(chats).where(and(eq(chats.id, id), eq(chats.businessId, business.id))).limit(1);
  if (!chat) notFound();
  const messages = await db.select().from(chatMessages).where(eq(chatMessages.chatId, chat.id)).orderBy(asc(chatMessages.createdAt));
  const [booking] = chat.bookingId ? await db.select().from(bookings).where(eq(bookings.id, chat.bookingId)).limit(1) : [];
  const tz = business.timezone;
  const whatsapp = chat.channel === "whatsapp";
  const time = (ms: number) => formatDateTime(ms, tz, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

  return (
    <div className="space-y-5">
      {whatsapp && <AutoRefresh seconds={8} />}
      <Link href="/dashboard" className="btn btn-quiet btn-sm -ml-2">
        <Icon name="arrowLeft" className="h-4 w-4" /> Home
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">{chat.customerName ?? formatPhone(chat.customerPhone)}</h1>
          <p className="text-sm text-muted">
            {whatsapp ? "WhatsApp" : "Web chat"} · started{" "}
            {formatDateTime(chat.createdAt, tz, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })}
            {chat.smsFallbackAt ? " · no WhatsApp, sent by SMS" : ""}
          </p>
        </div>
        <a href={`tel:${chat.customerPhone}`} className="btn btn-secondary btn-sm">
          <Icon name="phone" className="h-4 w-4" /> Call {formatPhone(chat.customerPhone)}
        </a>
      </div>

      {booking && (
        <div className="flex items-center gap-3 rounded-2xl border border-ok/30 bg-ok-soft px-4 py-3">
          <Icon name="calendarCheck" className="h-5 w-5 text-ok" />
          <p className="text-sm">
            <strong>Booked:</strong> {booking.serviceName}, {formatDay(booking.startsAt, tz)} at {formatTime(booking.startsAt, tz)}
            {booking.status !== "confirmed" && ` (${booking.status.replace("_", "-")})`}
          </p>
        </div>
      )}

      {whatsapp && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3">
          {chat.ownerTookOverAt ? (
            <>
              <p className="text-sm"><strong>You&apos;re answering.</strong> Halo stays quiet in this conversation.</p>
              <form action={handBackToHalo.bind(null, chat.id)}>
                <SubmitButton className="btn btn-secondary btn-sm" pendingText="…">Let Halo answer again</SubmitButton>
              </form>
            </>
          ) : (
            <>
              <p className="flex items-center gap-2 text-sm">
                <Halo pose="avatar" size={22} className="rounded-full" /> <strong>Halo is answering.</strong> Write below to take over.
              </p>
              <form action={takeOver.bind(null, chat.id)}>
                <SubmitButton className="btn btn-quiet btn-sm" pendingText="…">Take over</SubmitButton>
              </form>
            </>
          )}
        </div>
      )}

      <div className="card space-y-2 p-4">
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="max-w-[80%]">
              <p className="whitespace-pre-wrap break-words rounded-2xl rounded-bl-md bg-[#eef1f6] px-3.5 py-2 text-[0.9375rem] leading-snug">
                {m.content}
              </p>
              <p className="mt-0.5 pl-1 text-[11px] text-muted">{time(m.createdAt)}</p>
            </div>
          ) : (
            <div key={m.id} className="ml-auto flex max-w-[80%] flex-col items-end">
              <p
                className={`whitespace-pre-wrap break-words rounded-2xl rounded-br-md px-3.5 py-2 text-[0.9375rem] leading-snug ${
                  m.role === "owner" ? "bg-blue text-white" : "bg-sky text-ink"
                }`}
              >
                {m.content}
              </p>
              <p className="mt-0.5 flex items-center gap-1 pr-1 text-[11px] text-muted">
                {m.role === "owner" ? "You" : <><Halo pose="avatar" size={12} className="rounded-full" /> Halo</>} · {time(m.createdAt)}
              </p>
            </div>
          ),
        )}
      </div>

      {whatsapp && <OwnerReply chatId={chat.id} />}
      <p className="text-xs text-muted">
        Conversations close after 7 days.{whatsapp ? " WhatsApp allows replies within 24 hours of the customer's last message." : ""} To change a
        booking, edit it under Bookings.
      </p>
    </div>
  );
}
