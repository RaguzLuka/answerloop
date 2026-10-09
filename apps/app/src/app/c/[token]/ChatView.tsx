"use client";

import { useEffect, useRef, useState } from "react";
import Halo from "@/components/Halo";
import Icon from "@/components/Icon";

type Msg = { id: string; role: "assistant" | "user" | "owner"; content: string };
type Booked = { service: string; startsAt: number } | null;

const COPY = {
  hr: {
    status: "virtualni asistent · odgovara odmah",
    placeholder: "Napišite poruku…",
    send: "Pošalji",
    typing: "Halo piše",
    booked: "Rezervirano",
    footer: (b: string) => `Odgovara Vam asistent s umjetnom inteligencijom. ${b} vidi ovaj razgovor.`,
    privacy: "Privatnost",
    expired: "Ovaj razgovor je istekao. Nazovite nas ili otvorite novu poruku.",
    slow: "Polako 🙂 Pokušajte za trenutak.",
    offline: "Poruka nije poslana. Provjerite vezu i pokušajte ponovno.",
    at: "u",
    locale: "hr-HR",
  },
  en: {
    status: "AI assistant · replies instantly",
    placeholder: "Type a message…",
    send: "Send",
    typing: "Halo is typing",
    booked: "Booked",
    footer: (b: string) => `You're chatting with an AI assistant. ${b} can see this conversation.`,
    privacy: "Privacy",
    expired: "This chat has expired. Please call us instead.",
    slow: "Easy 🙂 Try again in a moment.",
    offline: "Message not sent. Check your connection and try again.",
    at: "at",
    locale: "en-GB",
  },
};

function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/\S+[^\s.,!?)])/g);
  return (
    <>
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a key={i} href={p} className="underline underline-offset-2" target="_blank" rel="noreferrer">
            {p.replace(/^https?:\/\//, "")}
          </a>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export default function ChatView({
  token, businessName, lang, timezone, initial, suggestions, booking: initialBooking, expired,
}: {
  token: string;
  businessName: string;
  lang: "hr" | "en";
  timezone: string;
  initial: Msg[];
  suggestions: string[];
  booking: Booked;
  expired: boolean;
}) {
  const t = COPY[lang];
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [booking, setBooking] = useState<Booked>(initialBooking);
  const [chips, setChips] = useState(suggestions);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(expired ? t.expired : null);
  const bottom = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending, booking]);

  // Count the chat as opened only when a real browser shows it (not link-preview bots)
  useEffect(() => {
    try {
      navigator.sendBeacon(`/api/opened/${token}`);
    } catch {}
  }, [token]);

  async function send(raw: string) {
    const content = raw.trim();
    if (!content || pending || expired) return;
    setText("");
    setChips([]);
    setNotice(null);
    setMessages((m) => [...m, { id: `local-${Date.now()}`, role: "user", content }]);
    setPending(true);
    try {
      const res = await fetch(`/api/chat/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
      });
      if (res.status === 429) {
        setNotice(t.slow);
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { messages: { role: "assistant" | "user"; content: string }[]; booking: Booked };
      setMessages((m) => [
        ...m,
        ...data.messages
          .filter((x) => x.role === "assistant")
          .map((x, i) => ({ id: `srv-${Date.now()}-${i}`, role: x.role, content: x.content })),
      ]);
      if (data.booking) setBooking(data.booking);
    } catch {
      setNotice(t.offline);
    } finally {
      setPending(false);
      input.current?.focus();
    }
  }

  const when = booking
    ? `${new Intl.DateTimeFormat(t.locale, { timeZone: timezone, weekday: "long", day: "numeric", month: "long" }).format(booking.startsAt)} ${t.at} ${new Intl.DateTimeFormat(t.locale, { timeZone: timezone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(booking.startsAt)}`
    : "";

  return (
    <div className="flex h-dvh flex-col bg-white">
      <header className="pt-safe shrink-0 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-2.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky">
            <Halo pose="avatar" size={44} priority />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{businessName}</p>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-ok" aria-hidden />
              Halo · {t.status}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-xl flex-col gap-2 px-4 py-4" aria-live="polite">
          {messages.map((m) =>
            m.role !== "user" ? (
              <div key={m.id} className="flex items-end gap-2">
                {m.role === "owner" ? (
                  <span className="mb-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-blue text-[11px] font-semibold text-white">
                    {businessName.slice(0, 1)}
                  </span>
                ) : (
                  <Halo pose="avatar" size={26} className="mb-0.5 shrink-0 rounded-full" />
                )}
                <p className="max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-bl-md bg-[#eef1f6] px-3.5 py-2.5 text-[0.9375rem] leading-snug text-ink">
                  <Linkified text={m.content} />
                </p>
              </div>
            ) : (
              <p
                key={m.id}
                className="ml-auto max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-gradient-to-b from-[#3a6cf2] to-[#2156e8] px-3.5 py-2.5 text-[0.9375rem] leading-snug text-white"
              >
                {m.content}
              </p>
            ),
          )}

          {pending && (
            <div className="flex items-end gap-2" role="status" aria-label={t.typing}>
              <Halo pose="avatar" size={26} className="mb-0.5 shrink-0 rounded-full" />
              <span className="flex gap-1 rounded-2xl rounded-bl-md bg-[#eef1f6] px-4 py-3.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="typing-dot h-2 w-2 rounded-full bg-muted" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
            </div>
          )}

          {booking && (
            <div className="mx-auto mt-2 flex w-full max-w-sm items-center gap-3 rounded-2xl border border-ok/30 bg-ok-soft px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ok text-white">
                <Icon name="check" className="h-5 w-5" strokeWidth={2.6} />
              </span>
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-ok">{t.booked}</p>
                <p className="text-ink">
                  {booking.service} · {when}
                </p>
              </div>
            </div>
          )}

          {notice && <p className="mx-auto mt-2 rounded-full bg-paper px-3 py-1.5 text-center text-xs text-muted">{notice}</p>}
          <div ref={bottom} />
        </div>
      </main>

      <footer className="pb-safe shrink-0 border-t border-line bg-white">
        <div className="mx-auto max-w-xl px-3 pt-2">
          {chips.length > 0 && (
            <div className="-mx-3 mb-2 flex gap-2 overflow-x-auto px-3 pb-1">
              {chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => send(c)}
                  className="shrink-0 rounded-full border border-blue/30 bg-sky px-3.5 py-1.5 text-sm font-medium text-blue-deep"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(text);
            }}
          >
            <label htmlFor="chat-input" className="sr-only">{t.placeholder}</label>
            <textarea
              id="chat-input"
              ref={input}
              rows={1}
              value={text}
              disabled={expired}
              maxLength={500}
              placeholder={t.placeholder}
              onChange={(e) => {
                setText(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(text);
                }
              }}
              className="max-h-[120px] min-h-11 flex-1 resize-none rounded-3xl border border-[#d9e1ee] bg-paper px-4 py-2.5 text-base leading-snug outline-none focus:border-blue focus:bg-white"
            />
            <button
              type="submit"
              aria-label={t.send}
              disabled={!text.trim() || pending || expired}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue text-white transition disabled:bg-line disabled:text-muted"
            >
              <Icon name="arrowRight" className="h-5 w-5 -rotate-90" strokeWidth={2.4} />
            </button>
          </form>
          <p className="py-2 text-center text-[11px] text-muted">
            {t.footer(businessName)}{" "}
            <a href="https://www.ringloop.net/privacy" className="underline underline-offset-2" target="_blank" rel="noreferrer">
              {t.privacy}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
