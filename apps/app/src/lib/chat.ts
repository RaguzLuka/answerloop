import "server-only";
import { randomBytes } from "node:crypto";
import { and, asc, count, eq, gte, sql } from "drizzle-orm";
import { after } from "next/server";
import {
  db, bookings, businesses, chatMessages, chats, services,
  type Booking, type Business, type Chat, type ChatMessage, type Service,
} from "@/lib/db";
import { aiEnabled, chatCompletion, type AiMessage, type ToolSpec } from "@/lib/ai";
import { appUrl } from "@/lib/email";
import { businessType, WEEKDAYS } from "@/lib/business-types";
import { zonedParts, zonedToUtc } from "@/lib/time";
import { bookableDates, freeSlots, isSlotFree } from "@/lib/slots";
import { formatPhone } from "@/lib/phone";
import { afterCustomerBooking } from "@/lib/booking-effects";

/* Halo's booking chat. A missed call's text-back links to a private chat
   (/c/<token>); the caller tells Halo what they want and Halo books it into
   the business's real calendar through two tools: free_times and book.
   Only Pro businesses, only while AI_ENABLED is on, and with hard limits. */

const CHAT_DAYS = 7;
const MAX_USER_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 500;
const DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT ?? 300); // customer messages per business per day

export const chatAvailable = (biz: Business) => aiEnabled() && biz.plan === "pro" && biz.chatEnabled;
export const chatLink = (token: string) => `${appUrl()}/c/${token}`;
export const chatIsOver = (chat: Chat) => chat.status === "closed" || chat.expiresAt < Date.now();

const isHr = (biz: Business) => biz.smsLanguage !== "en";

export function openingMessage(biz: Business) {
  const restaurant = biz.type === "restaurant";
  return isHr(biz)
    ? `Pozdrav! Ja sam Halo, AI asistent (${biz.name}). Žao nam je što smo propustili vaš poziv. ${
        restaurant ? "Za koliko osoba i kada biste željeli stol?" : "Što biste željeli rezervirati?"
      }`
    : `Hi! I'm Halo, the AI assistant for ${biz.name}. Sorry we missed your call. ${
        restaurant ? "For how many people, and when would you like a table?" : "What would you like to book?"
      }`;
}

export async function startChat(biz: Business, opts: { phone: string; callId?: string | null; isTest?: boolean }) {
  const [chat] = await db
    .insert(chats)
    .values({
      token: randomBytes(9).toString("base64url"),
      businessId: biz.id,
      callId: opts.callId ?? null,
      customerPhone: opts.phone,
      isTest: !!opts.isTest,
      expiresAt: Date.now() + CHAT_DAYS * 24 * 60 * 60 * 1000,
    })
    .returning();
  await db.insert(chatMessages).values({ chatId: chat.id, role: "assistant", content: openingMessage(biz) });
  return chat;
}

export async function loadChat(token: string) {
  const [row] = await db
    .select({ chat: chats, biz: businesses })
    .from(chats)
    .innerJoin(businesses, eq(businesses.id, chats.businessId))
    .where(eq(chats.token, token))
    .limit(1);
  if (!row) return null;
  const messages = await db.select().from(chatMessages).where(eq(chatMessages.chatId, row.chat.id)).orderBy(asc(chatMessages.createdAt));
  const [booking] = row.chat.bookingId
    ? await db.select().from(bookings).where(eq(bookings.id, row.chat.bookingId)).limit(1)
    : [];
  return { ...row, messages, booking: booking ?? null };
}

/* ── The prompt ─────────────────────────────────────────────── */

function systemPrompt(biz: Business, list: Service[], chat: Chat) {
  const type = businessType(biz.type);
  const now = zonedParts(Date.now(), biz.timezone);
  const fmt = (date: string, locale: string) =>
    new Intl.DateTimeFormat(locale, { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(
      new Date(`${date}T12:00:00Z`),
    );
  const days = bookableDates(biz)
    .slice(0, 14)
    .map((d) => `${d.date} = ${fmt(d.date, "hr-HR")} / ${fmt(d.date, "en-GB")}${d.open ? "" : " (closed)"}`)
    .join("\n");
  const hours = biz.hours.map((h, i) => `${WEEKDAYS[i]}: ${h.open ? `${h.from}–${h.to}` : "closed"}`).join("\n");
  const svc = list
    .map((s) => `- id "${s.id}": ${s.name}, ${s.durationMin} min${s.priceCents != null ? `, €${s.priceCents / 100}` : ""}`)
    .join("\n");

  return `You are Halo, the AI booking assistant of "${biz.name}" (${type.label}${biz.city ? `, ${biz.city}` : ""}).
You are chatting with a customer who just called the business and wasn't answered. Their phone number is already known (${formatPhone(chat.customerPhone)}), so never ask for it.

Your only job: book them in.
- Write like a friendly receptionist texting: 1–3 short sentences, plain text, no markdown, at most one emoji.
- Reply in the customer's language. Default: ${isHr(biz) ? "Croatian (use the polite \"Vi\" form)" : "English"}.
- Bookable ${type.words.services} (nothing else can be booked):
${svc}
- Opening hours:
${hours}
- Now: ${now.date} ${now.time} (${biz.timezone}). Next days:
${days}
- ALWAYS call free_times before suggesting times, and only offer times it returned. Suggest 2–3 options, not a long list.
- To book you need: the ${type.words.service}, a day, a time and the customer's first name. Before calling book, confirm it all in one short question (e.g. "Da potvrdim: muško šišanje, utorak 6. 10. u 14:00, na ime Marko?") and call book only after they agree.
- After book succeeds, confirm briefly${biz.remindersEnabled ? " and say they'll get a reminder text the day before" : ""}.
- If they ask something you don't know (parking, a specific person, prices not listed), say the team will call them back. Never invent facts.
- To change or cancel an existing booking, ask them to call ${biz.phone ? formatPhone(biz.phone) : "the business"}.
- Address: ${[biz.address, biz.city].filter(Boolean).join(", ") || "not given"}.
- Politely decline anything unrelated to booking at ${biz.name}.`;
}

const TOOLS: ToolSpec[] = [
  {
    type: "function",
    function: {
      name: "free_times",
      description:
        "Free start times for a service. With a date: that day's free times. Without a date: the next few days that have free times.",
      parameters: {
        type: "object",
        properties: {
          service_id: { type: "string", description: "id of the service" },
          date: { type: "string", description: "YYYY-MM-DD (optional)" },
        },
        required: ["service_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "book",
      description: "Book the customer in. Only after they confirmed service, day, time and name.",
      parameters: {
        type: "object",
        properties: {
          service_id: { type: "string" },
          date: { type: "string", description: "YYYY-MM-DD" },
          time: { type: "string", description: "HH:MM, 24h" },
          customer_name: { type: "string" },
        },
        required: ["service_id", "date", "time", "customer_name"],
      },
    },
  },
];

/* ── Tools ──────────────────────────────────────────────────── */

type Ctx = { biz: Business; chat: Chat; list: Service[]; booked?: Booking };

async function freeTimesTool(ctx: Ctx, args: { service_id?: string; date?: string }) {
  const service = ctx.list.find((s) => s.id === args.service_id);
  if (!service) return { error: "Unknown service_id. Use one from the list." };
  if (args.date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date)) return { error: "date must be YYYY-MM-DD" };
    const slots = await freeSlots(ctx.biz, service.durationMin, args.date);
    return { date: args.date, free_times: slots.map((s) => s.time) };
  }
  const found: { date: string; free_times: string[] }[] = [];
  for (const d of bookableDates(ctx.biz)) {
    if (!d.open) continue;
    const slots = await freeSlots(ctx.biz, service.durationMin, d.date);
    if (slots.length) found.push({ date: d.date, free_times: slots.slice(0, 8).map((s) => s.time) });
    if (found.length === 3) break;
  }
  return found.length ? { days: found } : { error: "No free times in the booking window." };
}

async function bookTool(ctx: Ctx, args: { service_id?: string; date?: string; time?: string; customer_name?: string }) {
  if (ctx.chat.bookingId || ctx.booked) return { error: "This chat already has a booking. For changes, the customer should call." };
  const service = ctx.list.find((s) => s.id === args.service_id);
  const name = String(args.customer_name ?? "").trim().slice(0, 80);
  if (!service) return { error: "Unknown service_id." };
  if (!name) return { error: "Ask for the customer's name first." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date ?? "") || !/^([01]\d|2[0-3]):[0-5]\d$/.test(args.time ?? "")) {
    return { error: "date must be YYYY-MM-DD and time HH:MM" };
  }
  const startsAt = zonedToUtc(args.date!, args.time!, ctx.biz.timezone);
  if (!(await isSlotFree(ctx.biz, service.durationMin, startsAt))) {
    return { error: "That time is no longer free. Call free_times again and offer other times." };
  }
  const [booking] = await db
    .insert(bookings)
    .values({
      businessId: ctx.biz.id,
      serviceId: service.id,
      serviceName: service.name,
      customerName: name,
      customerPhone: ctx.chat.customerPhone,
      startsAt,
      endsAt: startsAt + service.durationMin * 60_000,
      source: "chat",
      callId: ctx.chat.callId,
    })
    .returning();
  await db.update(chats).set({ status: "booked", bookingId: booking.id, customerName: name }).where(eq(chats.id, ctx.chat.id));
  ctx.booked = booking;
  const biz = ctx.biz;
  if (!ctx.chat.isTest) after(() => afterCustomerBooking(biz, booking, "chat"));
  return { ok: true, booked: { service: service.name, date: args.date, time: args.time, name } };
}

/* ── One customer message → Halo's reply ────────────────────── */

export type ChatReply = {
  messages: Pick<ChatMessage, "role" | "content">[];
  booking: { service: string; startsAt: number } | null;
};

function unavailableText(biz: Business) {
  const phone = biz.phone ? formatPhone(biz.phone) : "";
  const link = `${appUrl()}/b/${biz.slug}`;
  return isHr(biz)
    ? `Chat trenutno nije dostupan. Termin možete rezervirati ovdje: ${link}${phone ? ` ili nas nazovite na ${phone}` : ""}.`
    : `Chat isn't available right now. You can book here: ${link}${phone ? ` or call us on ${phone}` : ""}.`;
}

export async function replyToChat(token: string, rawText: string): Promise<ChatReply | { error: string }> {
  const loaded = await loadChat(token);
  if (!loaded) return { error: "not_found" };
  const { chat, biz } = loaded;
  const text = rawText.replace(/\s+/g, " ").trim().slice(0, MAX_MESSAGE_CHARS);
  if (!text) return { error: "empty" };

  const save = async (role: "assistant" | "user", content: string) => {
    await db.insert(chatMessages).values({ chatId: chat.id, role, content });
    return { role, content };
  };
  const done = (msgs: { role: "assistant" | "user"; content: string }[], booking?: Booking | null): ChatReply => ({
    messages: msgs,
    booking: booking ? { service: booking.serviceName, startsAt: booking.startsAt } : null,
  });

  // Closed, expired, over the limits, or AI off: answer without calling the model
  if (chatIsOver(chat) || !chatAvailable(biz) || biz.status === "paused") {
    return done([await save("user", text), await save("assistant", unavailableText(biz))], loaded.booking);
  }
  if (chat.userMessages >= MAX_USER_MESSAGES) {
    const msg = isHr(biz)
      ? `Hvala na strpljenju! Za ostalo nas, molimo, nazovite${biz.phone ? ` na ${formatPhone(biz.phone)}` : ""}.`
      : `Thanks for your patience! For anything else, please call us${biz.phone ? ` on ${formatPhone(biz.phone)}` : ""}.`;
    return done([await save("user", text), await save("assistant", msg)], loaded.booking);
  }
  const [{ n }] = await db
    .select({ n: count() })
    .from(chatMessages)
    .innerJoin(chats, eq(chats.id, chatMessages.chatId))
    .where(
      and(eq(chats.businessId, biz.id), eq(chatMessages.role, "user"), gte(chatMessages.createdAt, Date.now() - 24 * 60 * 60 * 1000)),
    );
  if (n >= DAILY_LIMIT) {
    return done([await save("user", text), await save("assistant", unavailableText(biz))], loaded.booking);
  }

  const userMsg = await save("user", text);
  await db
    .update(chats)
    .set({ userMessages: sql`${chats.userMessages} + 1`, lastMessageAt: Date.now() })
    .where(eq(chats.id, chat.id));

  const list = (await db.select().from(services).where(eq(services.businessId, biz.id)).orderBy(asc(services.position))).filter(
    (s) => s.active,
  );
  const ctx: Ctx = { biz, chat, list };
  const history: AiMessage[] = [...loaded.messages.slice(-30), userMsg].map((m) => ({ role: m.role, content: m.content }));
  const convo: AiMessage[] = [{ role: "system", content: systemPrompt(biz, list, chat) }, ...history];

  let reply = "";
  try {
    for (let round = 0; round < 5 && !reply; round++) {
      const msg = await chatCompletion(convo, TOOLS);
      if (msg.tool_calls?.length) {
        convo.push({ role: "assistant", content: msg.content ?? null, tool_calls: msg.tool_calls });
        for (const call of msg.tool_calls) {
          let args: Record<string, string> = {};
          try {
            args = JSON.parse(call.function.arguments || "{}");
          } catch {}
          const result =
            call.function.name === "free_times"
              ? await freeTimesTool(ctx, args)
              : call.function.name === "book"
                ? await bookTool(ctx, args)
                : { error: "Unknown tool" };
          convo.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
        }
      } else {
        reply = (msg.content ?? "").trim();
      }
    }
  } catch (err) {
    console.error("[chat] AI call failed:", err instanceof Error ? err.message : "unknown"); // never log the conversation
  }
  if (!reply) {
    reply = isHr(biz)
      ? `Oprostite, nešto je zapelo. Rezervirajte ovdje: ${appUrl()}/b/${biz.slug}${biz.phone ? ` ili nazovite ${formatPhone(biz.phone)}` : ""}.`
      : `Sorry, something went wrong. Book here: ${appUrl()}/b/${biz.slug}${biz.phone ? ` or call ${formatPhone(biz.phone)}` : ""}.`;
  }
  return done([await save("assistant", reply)], ctx.booked ?? loaded.booking);
}

