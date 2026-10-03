"use client";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { PhoneShell, ChatHeader, Bubble, TypingBubble, ThreadNote } from "@/components/Sms";
import useReducedMotion from "@/components/useReducedMotion";
import {
  DEMO_BUSINESSES,
  DEFAULT_DEMO_BUSINESS,
  DEMO_MAX_CHARS,
  EMPTY_BOOKING,
  getDemoBusiness,
  type DemoBooking,
  type DemoBusiness,
  type DemoBusinessId,
  type DemoReply,
  type DemoStatus,
} from "@/demo-businesses";

/* Live SMS demo: the visitor picks a business and plays its customer.
   They call, nobody answers, the text-back arrives, and they book by
   texting a real AI. The panel beside the phone shows what the business
   would see. */

type Phase = "idle" | "calling" | "missed" | "chat";
type Msg = { role: "user" | "assistant"; content: string };

const AFTER_BOOKING = ["Can we move it to another day?", "Thanks! See you then 🙏"];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** ?business=restaurant preselects a business (e.g. from industry links) */
const noSubscribe = () => () => {};
function useUrlBusiness() {
  return useSyncExternalStore(
    noSubscribe,
    () => new URLSearchParams(window.location.search).get("business"),
    () => null,
  );
}

export default function SmsDemo({ aside }: { aside?: React.ReactNode }) {
  const reduced = useReducedMotion();
  const urlBusiness = useUrlBusiness();
  const [picked, setPicked] = useState<DemoBusinessId | null>(null);
  const business = getDemoBusiness(picked ?? urlBusiness ?? DEFAULT_DEMO_BUSINESS);

  const [phase, setPhase] = useState<Phase>("idle");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<{ text: string; retry: boolean } | null>(null);
  const [booking, setBooking] = useState<DemoBooking>(EMPTY_BOOKING);
  const [status, setStatus] = useState<DemoStatus>("chatting");
  const [limitReached, setLimitReached] = useState(false);
  const [input, setInput] = useState("");

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const runId = useRef(0); // ignores late API answers after a restart

  const clearTimers = useCallback(() => {
    timers.current.splice(0).forEach(clearTimeout);
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  // Keep the newest message in view
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, pending, reduced]);

  function startCall() {
    clearTimers();
    runId.current++;
    setMessages([]);
    setBooking(EMPTY_BOOKING);
    setStatus("chatting");
    setError(null);
    setLimitReached(false);
    setPhase("calling");
    const opening = business.opening;
    const k = reduced ? 0.3 : 1;
    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms * k));
    at(3200, () => setPhase("missed"));
    at(4400, () => {
      setPhase("chat");
      setPending(true);
    });
    at(5900, () => {
      setPending(false);
      setMessages([{ role: "assistant", content: opening }]);
      inputRef.current?.focus({ preventScroll: true });
    });
  }

  function reset() {
    clearTimers();
    runId.current++;
    setPhase("idle");
    setMessages([]);
    setPending(false);
    setError(null);
    setBooking(EMPTY_BOOKING);
    setStatus("chatting");
    setLimitReached(false);
    setInput("");
  }

  function choose(id: DemoBusinessId) {
    if (id === business.id) return;
    reset();
    setPicked(id);
  }

  const request = useCallback(async (thread: Msg[], businessId: DemoBusinessId) => {
    const id = runId.current;
    setPending(true);
    setError(null);
    try {
      const [res] = await Promise.all([
        fetch("/api/demo-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: thread, business: businessId }),
        }),
        wait(900), // a natural typing pause, even when the AI is instant
      ]);
      if (id !== runId.current) return;
      if (res.status === 429) throw new Error("rate");
      if (!res.ok) throw new Error("down");
      const data: DemoReply = await res.json();
      if (id !== runId.current) return;
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      setBooking((prev) => ({
        service: data.booking?.service ?? prev.service,
        name: data.booking?.name ?? prev.name,
        time: data.booking?.time ?? prev.time,
        staff: data.booking?.staff ?? prev.staff,
      }));
      // Once booked, a reschedule keeps it booked
      setStatus((prev) => (prev === "booked" && data.status === "chatting" ? prev : data.status));
      if (data.limit) setLimitReached(true);
    } catch (err) {
      if (id !== runId.current) return;
      setError(
        err instanceof Error && err.message === "rate"
          ? { text: "You've reached the demo limit for now. Book a live demo and we'll show you everything.", retry: false }
          : { text: "The demo is taking a breather. Please try again in a moment.", retry: true },
      );
    } finally {
      if (id === runId.current) setPending(false);
    }
  }, []);

  function send(text: string) {
    const content = text.trim().slice(0, DEMO_MAX_CHARS);
    if (!content || pending || limitReached || phase !== "chat" || messages.length === 0) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    void request(next, business.id);
  }

  const customerReplied = messages.some((m) => m.role === "user");
  const booked = status === "booked";
  const handoff = status === "handoff";
  const suggestions = !customerReplied ? business.suggestions : booked ? AFTER_BOOKING : [];
  const canType = phase === "chat" && messages.length > 0 && !limitReached;

  return (
    <div>
      {/* Business picker */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <p className="label text-muted">Pick a business to call</p>
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Demo business">
          {DEMO_BUSINESSES.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => choose(b.id)}
              aria-pressed={b.id === business.id}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                b.id === business.id
                  ? "border-blue bg-blue text-white shadow-[0_10px_24px_-12px_rgba(33,86,232,0.7)]"
                  : "border-line bg-white text-ink-soft hover:border-blue/30 hover:text-ink"
              }`}
            >
              <Icon name={b.icon} className="h-4 w-4" />
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
        {/* ── The customer's phone ── */}
        <div className="mx-auto w-full max-w-[318px]">
          <PhoneShell
            tone={phase === "chat" ? "light" : "dark"}
            time="18:41"
            className="w-full"
            screenClassName={`h-[620px] ${phase === "chat" ? "bg-white" : "bg-gradient-to-b from-[#1b2b58] via-[#0f1c42] to-[#081530]"}`}
          >
            {phase === "chat" ? (
              <>
                <ChatHeader name={business.name} initials={business.initials} />
                <div
                  ref={threadRef}
                  aria-live="polite"
                  className="flex flex-1 flex-col gap-1.5 overflow-y-auto overscroll-contain px-3 pb-2 pt-3"
                >
                  <ThreadNote tone="missed" animate>Missed call · 18:41</ThreadNote>
                  {messages.map((m, i) => (
                    <Bubble key={i} side={m.role === "assistant" ? "in" : "out"} animate>
                      {m.content}
                    </Bubble>
                  ))}
                  {pending && <TypingBubble />}
                  {error && (
                    <div className="bubble mx-auto mt-2 max-w-[92%] rounded-2xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-center text-[12px] leading-snug text-red-600">
                      {error.text}
                      {error.retry && (
                        <button
                          type="button"
                          onClick={() => void request(messages, business.id)}
                          className="mt-1.5 block w-full font-semibold underline underline-offset-2"
                        >
                          Try again
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {suggestions.length > 0 && canType && !pending && (
                  <div className="flex shrink-0 gap-1.5 overflow-x-auto px-3 pb-1.5 pt-1 [scrollbar-width:none]">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="shrink-0 rounded-full border border-blue/20 bg-sky/60 px-3 py-1.5 text-[11.5px] font-medium text-blue transition-colors hover:bg-sky"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex shrink-0 items-center gap-2 px-3 pb-6 pt-1.5"
                >
                  <label htmlFor="demo-input" className="sr-only">Your text message</label>
                  <input
                    id="demo-input"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    maxLength={DEMO_MAX_CHARS}
                    disabled={!canType}
                    autoComplete="off"
                    placeholder={limitReached ? "Demo finished" : "Text Message"}
                    className="min-w-0 flex-1 rounded-full border border-line bg-white px-3.5 py-2 text-[13px] text-ink outline-none transition-colors placeholder:text-muted focus:border-blue/40 disabled:bg-paper"
                  />
                  <button
                    type="submit"
                    aria-label="Send"
                    disabled={!canType || pending || !input.trim()}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue text-white transition-opacity disabled:opacity-35"
                  >
                    <Icon name="arrowRight" className="h-4 w-4 -rotate-90" strokeWidth={2.4} />
                  </button>
                </form>
              </>
            ) : (
              <CallScreen phase={phase} business={business} onCall={startCall} />
            )}
          </PhoneShell>

          <p className="mt-5 text-center text-xs leading-relaxed text-muted">
            Fictional demo business — use a made-up name. Replies are generated by AI; RingLoop doesn&apos;t store demo chats.
          </p>
        </div>

        {/* ── What the business sees ── */}
        <div>
          <BusinessPanel
            business={business}
            phase={phase}
            customerReplied={customerReplied}
            booked={booked}
            handoff={handoff}
            booking={booking}
            onReset={reset}
          />
          {aside}
        </div>
      </div>
    </div>
  );
}

/* ── Call screen shown before the text thread ── */

function CallScreen({ phase, business, onCall }: { phase: Phase; business: DemoBusiness; onCall: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-12 pt-14 text-center text-white">
      <div className="relative flex h-28 w-28 items-center justify-center">
        {phase === "calling" && (
          <>
            <span className="ring-pulse absolute inset-0 rounded-full bg-periwinkle/25" />
            <span className="ring-pulse-2 absolute inset-0 rounded-full bg-periwinkle/15" />
          </>
        )}
        <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-[#a9c1fb] to-[#5f8cf3] text-3xl font-semibold">
          {business.initials}
        </span>
      </div>
      <p className="mt-6 text-2xl font-semibold">{business.name}</p>
      <p className="mt-1.5 text-sm text-sky/60" aria-live="polite">
        {phase === "idle" && `Demo ${business.label.toLowerCase()} · Zagreb`}
        {phase === "calling" && <span className="shimmer-text font-medium">calling…</span>}
        {phase === "missed" && <span className="font-medium text-red-300">No answer</span>}
      </p>

      <div className="mt-auto flex flex-col items-center">
        {phase === "idle" ? (
          <>
            <button
              type="button"
              onClick={onCall}
              aria-label={`Call ${business.name}`}
              className="group relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#28c840] shadow-[0_12px_32px_-8px_rgba(40,200,64,0.7)] transition-transform duration-300 hover:scale-105"
            >
              <span className="ring-pulse absolute inset-0 rounded-full bg-[#28c840]/40" />
              <Icon name="phone" className="phone-ring relative h-7 w-7 fill-white" strokeWidth={0} />
            </button>
            <p className="mt-4 text-sm font-semibold">Call {business.name}</p>
            <p className="mt-1 max-w-[210px] text-xs leading-relaxed text-sky/55">
              Nobody will pick up — that&apos;s the point.
            </p>
          </>
        ) : (
          <>
            <span
              className={`flex h-[72px] w-[72px] items-center justify-center rounded-full ${
                phase === "missed" ? "bg-white/10" : "bg-[#ff3b30]"
              }`}
            >
              <Icon name="phone" className="h-7 w-7 rotate-[135deg] fill-white" strokeWidth={0} />
            </span>
            <p className="mt-4 text-sm font-semibold">{phase === "missed" ? "Call ended" : "Ringing…"}</p>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Business-side panel ── */

function BusinessPanel({
  business, phase, customerReplied, booked, handoff, booking, onReset,
}: {
  business: DemoBusiness;
  phase: Phase;
  customerReplied: boolean;
  booked: boolean;
  handoff: boolean;
  booking: DemoBooking;
  onReset: () => void;
}) {
  const missed = phase === "missed" || phase === "chat";
  const texted = phase === "chat";

  const events = [
    { done: missed, icon: "phoneMissed", title: "Missed call", sub: "+385 91 ••• 4821 · while you were busy" },
    { done: texted, icon: "zap", title: "Text-back sent automatically", sub: "Seconds after the call, from your business name" },
    {
      done: customerReplied,
      icon: "messages",
      title: "AI booking conversation",
      sub: customerReplied ? "The assistant is handling it — no staff needed" : "Waiting for the customer to reply…",
    },
    handoff
      ? { done: true, icon: "userCheck", title: "Handed over to your team", sub: "Full context included — pick it up anytime" }
      : { done: booked, icon: "calendarCheck", title: business.bookedTitle, sub: business.bookedSub },
  ];

  const fields: { label: string; value: string | null }[] = [
    { label: business.fields.service, value: booking.service },
    { label: business.fields.name, value: booking.name },
    { label: "Date & time", value: booking.time },
    { label: business.fields.staff, value: booking.staff },
  ];

  return (
    <div className="card overflow-hidden text-left">
      <div className="flex items-center justify-between gap-4 border-b border-line bg-paper/60 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            {phase !== "idle" && <span className="ring-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400" />}
            <span className={`relative h-2.5 w-2.5 rounded-full ${phase === "idle" ? "bg-line" : "bg-emerald-500"}`} />
          </span>
          <p className="text-sm font-semibold text-ink">What you see</p>
        </div>
        {phase !== "idle" && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-blue/30 hover:text-blue"
          >
            <Icon name="rotate" className="h-3.5 w-3.5" /> Restart
          </button>
        )}
      </div>

      <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8 lg:grid-cols-1 xl:grid-cols-2">
        {/* Activity */}
        <div>
          <p className="label mb-5 text-muted">Activity</p>
          <ol className="space-y-5">
            {events.map((e, i) => (
              <li key={e.title} className="relative flex gap-3.5">
                {i < events.length - 1 && (
                  <span
                    className={`absolute left-[17px] top-10 -bottom-3 w-px transition-colors duration-700 ${
                      e.done ? "bg-blue/35" : "bg-line"
                    }`}
                  />
                )}
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-700 ${
                    e.done
                      ? i === 0
                        ? "bg-red-50 text-red-500"
                        : "bg-blue text-white shadow-[0_8px_20px_-8px_rgba(33,86,232,0.7)]"
                      : "bg-paper text-muted/60"
                  }`}
                >
                  <Icon name={e.icon} className="h-4 w-4" />
                </span>
                <div className={`pt-0.5 transition-opacity duration-700 ${e.done ? "opacity-100" : "opacity-45"}`}>
                  <p className="text-sm font-semibold text-ink">{e.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{e.sub}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Booking card */}
        <div>
          <p className="label mb-5 text-muted">Booking details</p>
          <div
            className={`rounded-2xl border p-5 transition-all duration-700 ${
              booked ? "border-emerald-200 bg-emerald-50/60" : "border-line bg-paper/60"
            }`}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="truncate text-sm font-semibold text-ink">{business.name}</p>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  booked
                    ? "bg-emerald-100 text-emerald-700"
                    : handoff
                      ? "bg-amber-100 text-amber-700"
                      : customerReplied
                        ? "bg-sky text-blue"
                        : "bg-white text-muted"
                }`}
              >
                {booked ? "Booked" : handoff ? "Needs your team" : customerReplied ? "In progress" : "Waiting"}
              </span>
            </div>
            <dl className="space-y-3">
              {fields.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-4 text-sm">
                  <dt className="text-ink-soft">{f.label}</dt>
                  <dd className={`text-right font-medium ${f.value ? "text-ink" : "text-muted/60"}`}>
                    {f.value ? <span key={f.value} className="bubble inline-block">{f.value}</span> : "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {booked ? (
            <div className="bubble mt-5 rounded-2xl bg-night p-5 text-white">
              <p className="font-display text-lg leading-snug">That&apos;s a customer you&apos;d have lost to voicemail.</p>
              <Link href="/contact" className="btn-primary group mt-4 w-full py-3 text-sm">
                Get this for my business <span className="arrow">→</span>
              </Link>
            </div>
          ) : (
            <p className="mt-5 text-xs leading-relaxed text-muted">
              {phase === "idle"
                ? "Press the green button on the phone to start. Everything on this side fills in live."
                : "Details fill in as the assistant collects them — exactly what you'd receive."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
