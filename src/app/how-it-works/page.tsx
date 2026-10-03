import Link from "next/link";
import Icon from "@/components/Icon";
import Timeline from "@/components/Timeline";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import { SectionHeading, CheckDot } from "@/components/Section";
import { Bubble, ThreadNote, ChatWindow } from "@/components/Sms";

export const metadata = {
  title: "How it works",
  description:
    "From missed call to booked customer in minutes: how RingLoop texts callers back, books them in by SMS, confirms the booking, and sends reminders.",
};

/** The example business this walkthrough follows */
const BUSINESS = { name: "Studio Mila", initials: "SM" };

/** Chat window with an optional caption underneath */
function Thread({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <div>
      <ChatWindow name={BUSINESS.name} initials={BUSINESS.initials} label="SMS">
        {children}
      </ChatWindow>
      {caption && (
        <p className="mt-3 flex items-center gap-1.5 pl-1 text-xs font-medium text-muted">
          <Icon name="check" className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.6} />
          {caption}
        </p>
      )}
    </div>
  );
}

const steps = [
  {
    title: "A customer calls — nobody can pick up",
    desc: "You're mid-appointment, it's after hours, or the line is busy. Without RingLoop, this caller hangs up and tries the next business on Google.",
    detail: "You keep your existing number. One setting on your line forwards unanswered calls to RingLoop — no new number for customers, no app, no hardware.",
    preview: (
      <div className="card space-y-4 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Icon name="phone" className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Incoming call</p>
            <p className="text-xs text-muted">+385 91 ••• 4821 → {BUSINESS.name}</p>
          </div>
        </div>
        <div className="space-y-2.5 border-t border-line pt-4 text-sm">
          <p className="flex items-center justify-between gap-4">
            <span className="text-ink-soft">Your phone</span>
            <span className="font-medium text-red-500">No answer — you&apos;re mid-cut</span>
          </p>
          <p className="flex items-center justify-between gap-4">
            <span className="text-ink-soft">Unanswered call</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-blue">
              <Icon name="phoneForwarded" className="h-4 w-4" /> Caught by RingLoop
            </span>
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "RingLoop texts back within seconds",
    desc: "Before the caller has even put the phone down, a friendly text arrives from your business — apologising for the missed call and inviting them to book by reply.",
    detail: "The text comes from your business name, in your tone of voice. Customers see you — never RingLoop.",
    preview: (
      <Thread caption="Sent 4 seconds after the call">
        <ThreadNote tone="missed">Missed call · 14:12</ThreadNote>
        <Bubble side="in">
          Hi, it&apos;s Studio Mila ✂️ Sorry we missed your call — we&apos;re with a client right now. Can I help you book by text?
        </Bubble>
      </Thread>
    ),
  },
  {
    title: "The AI books it — by text",
    desc: "The customer replies in their own words, and the assistant takes it from there: what they want, when suits them, and who they'd like to see.",
    detail: "It knows your services, opening hours and team, understands any language and phrasing, and never gives advice it shouldn't. If someone needs a person, it hands over to you.",
    preview: (
      <Thread>
        <Bubble side="out">Hi! Cut &amp; blow-dry this week?</Bubble>
        <Bubble side="in">Of course! Thursday 10:00 with Mila or Friday 16:30 with Petra?</Bubble>
        <Bubble side="out">Friday with Petra</Bubble>
        <Bubble side="in">Friday 16:30 it is. Could I have your full name?</Bubble>
        <Bubble side="out">Ana Horvat</Bubble>
      </Thread>
    ),
  },
  {
    title: "Booked, confirmed — and you know about it",
    desc: "The customer gets an instant confirmation with every detail. At the same moment, you get a summary of the new booking.",
    detail: "With Google Calendar integration, the booking lands straight in your calendar — nothing to copy over.",
    preview: (
      <div className="space-y-4">
        <Thread>
          <Bubble side="in">Booked ✅ Fri 16:30 · Cut &amp; blow-dry with Petra. See you then, Ana!</Bubble>
        </Thread>
        <div className="rounded-2xl border border-blue/15 bg-sky/60 p-4">
          <p className="label mb-2 flex items-center gap-1.5 text-blue">
            <Icon name="bell" className="h-3.5 w-3.5" /> To your phone
          </p>
          <p className="text-sm font-semibold text-ink">New booking — Ana Horvat</p>
          <p className="mt-0.5 text-sm text-ink-soft">Cut &amp; blow-dry · Fri 16:30 · Petra · +385 91 ••• 4821</p>
        </div>
      </div>
    ),
  },
  {
    title: "Reminded the day before",
    desc: "A reminder goes out ahead of the visit. The customer confirms with one letter — or asks to move it, and RingLoop finds a new slot.",
    detail: "Fewer no-shows, and a cancellation becomes a slot you can fill instead of an empty chair.",
    preview: (
      <Thread caption="Confirmed without a phone call">
        <ThreadNote>Thursday 16:30</ThreadNote>
        <Bubble side="in">
          Hi Ana! Reminder: your cut &amp; blow-dry at Studio Mila is tomorrow at 16:30. Reply C to confirm or R to reschedule.
        </Bubble>
        <Bubble side="out">C</Bubble>
        <Bubble side="in">Thanks — you&apos;re confirmed ✅ See you tomorrow!</Bubble>
      </Thread>
    ),
  },
];

const setup = [
  { icon: "calendarCheck",  title: "Book a demo",               desc: "A 20-minute call. We learn how your business works and what customers usually ask for." },
  { icon: "sliders",        title: "We configure everything",   desc: "Services, hours, team, tone of voice and message templates — all set up for you." },
  { icon: "phoneForwarded", title: "Switch on call forwarding", desc: "One setting on your line: forward unanswered calls. It takes about two minutes." },
  { icon: "zap",            title: "You're live",               desc: "The very next missed call gets a text — and a real chance to become a booking." },
];

const weHandle = [
  "An SMS sender with your business name",
  "An assistant trained on your services, hours and team",
  "Confirmation and reminder texts in your customers' languages",
  "Google Calendar connection",
  "Testing everything with you before go-live",
];

const youDo = [
  "Switch on call forwarding (about 2 minutes)",
  "Tell us how you like things done",
  "Watch the bookings come in",
];

export default function HowItWorks() {
  return (
    <main className="overflow-x-clip bg-paper text-ink">
      <PageHero
        eyebrow="How it works"
        icon="zap"
        title={<>From missed call to <em>booked customer.</em></>}
        sub="Here's exactly what happens when a call goes unanswered — told through a busy hair salon, but it works the same for a barbershop, a restaurant or a clinic."
      />

      {/* Steps — a spine of light fills in as you scroll */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-8">
        <Timeline>
          <div className="space-y-24 py-4 md:space-y-32">
            {steps.map((s, i) => (
              <div key={s.title} className="relative grid items-center gap-10 pl-12 md:grid-cols-2 md:gap-20 md:pl-0">
                {/* Marker on the spine */}
                <div className="absolute left-4 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue/30 bg-white text-sm font-bold text-blue shadow-md shadow-blue/10 md:left-1/2">
                  {i + 1}
                </div>

                <div data-reveal className={i % 2 === 1 ? "reveal-right md:order-2" : "reveal-left"}>
                  <p className="label mb-3 text-blue">Step {i + 1}</p>
                  <h2 className="font-display mb-4 text-3xl leading-[1.12] md:text-[2.1rem]">{s.title}</h2>
                  <p className="mb-5 leading-relaxed text-ink-soft">{s.desc}</p>
                  <p className="border-l-2 border-blue/25 pl-5 text-sm leading-relaxed text-muted">{s.detail}</p>
                </div>
                <div data-reveal className={i % 2 === 1 ? "reveal-left md:order-1" : "reveal-right"}>
                  {s.preview}
                </div>
              </div>
            ))}
          </div>
        </Timeline>
      </section>

      {/* Setup */}
      <section className="border-y border-line bg-white px-6 py-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Setup"
            icon="clock"
            title={<>You&apos;re live in <em>24 hours.</em></>}
            sub="We do the heavy lifting. You flip one switch on your phone line."
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {setup.map((s, i) => (
              <div key={s.title} data-reveal className={`card lift r-delay-${(i % 3) + 1} p-7`}>
                <div className="mb-6 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky text-blue">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-display text-3xl text-blue/15">0{i + 1}</span>
                </div>
                <h3 className="mb-2 font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1.4fr_1fr]">
            <div data-reveal className="reveal-left rounded-3xl border border-blue/15 bg-sky/50 p-8">
              <p className="label mb-5 text-blue">We handle</p>
              <ul className="space-y-3.5">
                {weHandle.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] text-ink">
                    <CheckDot />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal className="reveal-right rounded-3xl border border-line bg-paper p-8">
              <p className="label mb-5 text-muted">You do</p>
              <ul className="space-y-3.5">
                {youDo.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] text-ink">
                    <CheckDot />
                    {t}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="group mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-blue">
                Start with a free demo <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="See it with your own eyes"
        title={<>Watch it book <em>a real customer.</em></>}
        sub="Try the live demo right now — or book a free call and we'll set it up with your business name."
        secondary={{ href: "/demo", label: "Try the live demo" }}
      />
    </main>
  );
}
