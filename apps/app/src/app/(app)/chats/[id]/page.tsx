import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db, bookings, chatMessages, chats } from "@/lib/db";
import { requireBusiness } from "@/lib/dal";
import { formatDateTime, formatDay, formatTime } from "@/lib/time";
import { formatPhone } from "@/lib/phone";
import Halo from "@/components/Halo";
import Icon from "@/components/Icon";

export const metadata: Metadata = { title: "Chat" };

/* Read-only view of a caller's conversation with Halo. */
export default async function ChatTranscript({ params }: PageProps<"/chats/[id]">) {
  const { business } = await requireBusiness();
  const { id } = await params;
  const [chat] = await db.select().from(chats).where(and(eq(chats.id, id), eq(chats.businessId, business.id))).limit(1);
  if (!chat) notFound();
  const messages = await db.select().from(chatMessages).where(eq(chatMessages.chatId, chat.id)).orderBy(asc(chatMessages.createdAt));
  const [booking] = chat.bookingId ? await db.select().from(bookings).where(eq(bookings.id, chat.bookingId)).limit(1) : [];
  const tz = business.timezone;

  return (
    <div className="space-y-5">
      <Link href="/dashboard" className="btn btn-quiet btn-sm -ml-2">
        <Icon name="arrowLeft" className="h-4 w-4" /> Home
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">{chat.customerName ?? formatPhone(chat.customerPhone)}</h1>
          <p className="text-sm text-muted">
            Chat with Halo · started {formatDateTime(chat.createdAt, tz, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })}
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

      <div className="card space-y-2 p-4">
        {messages.map((m) =>
          m.role === "assistant" ? (
            <div key={m.id} className="flex items-end gap-2">
              <Halo pose="avatar" size={24} className="mb-0.5 shrink-0 rounded-full" />
              <p className="max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-bl-md bg-[#eef1f6] px-3.5 py-2 text-[0.9375rem] leading-snug">
                {m.content}
              </p>
            </div>
          ) : (
            <p key={m.id} className="ml-auto max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-blue px-3.5 py-2 text-[0.9375rem] leading-snug text-white">
              {m.content}
            </p>
          ),
        )}
      </div>
      <p className="text-xs text-muted">Chats close after 7 days. To change a booking, edit it under Bookings.</p>
    </div>
  );
}
