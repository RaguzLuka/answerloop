import Link from "next/link";
import Icon from "@/components/Icon";
import CountUp from "@/components/CountUp";

const faqs = [
  {
    q: "Do I need a new phone number?",
    a: "No. You keep your existing clinic number and set up call forwarding — takes about 2 minutes. When a call goes unanswered after a few rings, it forwards to RingLoop's AI. Your patients dial the same number as always.",
  },
  {
    q: "How long does setup take?",
    a: "Most clinics are live within 24 hours. We handle the AI configuration, voice persona, SMS confirmations, and optional calendar integration. You just flip the call forwarding switch.",
  },
  {
    q: "Does the AI really sound natural on the phone?",
    a: "Yes. RingLoop uses advanced AI voices that sound warm and professional — not robotic. Most patients don't realise they're talking to an AI.",
  },
  {
    q: "What languages does the AI speak?",
    a: "Any language your patients speak. Croatian, English, German, Italian, Slovenian — the AI responds in whatever language the caller uses, automatically.",
  },
  {
    q: "Is it GDPR compliant?",
    a: "Yes. RingLoop processes data under legitimate interest and contract performance (Art. 6 GDPR). All third-party processors — Twilio, OpenAI, Vercel — operate under Standard Contractual Clauses. See our Privacy Policy for full details.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contract, no minimum term. Cancel before the next billing date and you won't be charged. We're confident you'll stay because the results speak for themselves.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

/* The conversation that cycles inside the hero call card */
const subtitles = [
  { speaker: "RingLoop", text: "Good evening, Zagreb Dental. How can I help you?" },
  { speaker: "Caller",   text: "Hi — I need a checkup, do you have anything this week?" },
  { speaker: "RingLoop", text: "Of course. May I have your full name?" },
  { speaker: "Caller",   text: "Marko Horvat." },
  { speaker: "RingLoop", text: "Thank you, Marko. What day and time suit you?" },
  { speaker: "Caller",   text: "Tomorrow at ten, if possible." },
  { speaker: "RingLoop", text: "Booked — tomorrow at 10:00. Your SMS confirmation is on its way." },
];

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-40 pb-28 text-center">
        <div className="halo pointer-events-none absolute inset-0" />
        <div className="halo-drift pointer-events-none absolute -top-40 left-1/2 h-[460px] w-[820px] rounded-full bg-blue/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl">
          <p className="animate-fade-up mb-8 inline-flex items-center gap-2.5 rounded-full border border-blue/15 bg-white/70 px-4 py-1.5 text-xs font-semibold text-blue backdrop-blur-sm shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="ring-pulse absolute inline-flex h-full w-full rounded-full bg-blue" />
              <span className="relative h-2 w-2 rounded-full bg-blue" />
            </span>
            Now answering calls for clinics in Europe &amp; the US
          </p>

          <h1 className="font-display animate-fade-up delay-100 mb-7 text-[3.1rem] leading-[1.04] md:text-[4.6rem] lg:text-[5.4rem]">
            Your clinic misses calls.
            <br />
            <em className="text-blue">RingLoop answers them.</em>
          </h1>

          <p className="animate-fade-up delay-200 mx-auto mb-11 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
            The AI receptionist that picks up every forwarded call, books the
            appointment by voice, and confirms it to the patient by SMS —
            automatically, 24/7.
          </p>

          <div className="animate-fade-up delay-300 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact" className="btn-primary group px-9 py-4">
              Book a free demo
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/demo"
              className="rounded-full border border-[var(--line)] bg-white px-9 py-4 font-semibold text-ink shadow-sm transition-all duration-300 hover:border-blue/30 hover:text-blue"
            >
              Talk to the AI right now
            </Link>
          </div>

          <p className="animate-fade-up delay-400 mt-7 text-sm text-muted">
            No contract &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; Setup in 24h &nbsp;·&nbsp; Pricing tailored to your clinic
          </p>

          {/* The live call card */}
          <div className="animate-fade-up delay-500 mx-auto mt-20 w-full max-w-2xl">
          <div className="animate-float card relative overflow-hidden text-left">
            {/* Card head */}
            <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
              <div className="flex items-center gap-3.5">
                <div className="relative flex h-10 w-10 items-center justify-center">
                  <span className="ring-pulse absolute inset-0 rounded-full bg-blue/20" />
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-blue text-white">
                    <Icon name="phone" className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Zagreb Dental Clinic</p>
                  <p className="text-xs text-blue">AI receptionist · live call</p>
                </div>
              </div>
              <div className="flex h-5 items-center gap-[3px]">
                {[10, 16, 7, 13, 9, 15, 8].map((h, i) => (
                  <span
                    key={i}
                    className="wave-bar w-[3px] rounded-full bg-blue/70"
                    style={{ height: `${h}px`, animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </div>
            </div>

            {/* The conversation, one line at a time */}
            <div className="relative flex h-36 items-center justify-center bg-gradient-to-b from-sky/40 to-white px-8">
              {subtitles.map((line, i) => (
                <p
                  key={i}
                  className="subtitle-line absolute inset-x-8 text-center text-[15px] leading-relaxed text-ink-soft md:text-base"
                  style={{ animationDelay: `${i * 3.5}s` }}
                >
                  <span className={`label mr-2.5 ${line.speaker === "RingLoop" ? "text-blue" : "text-muted"}`}>
                    {line.speaker}
                  </span>
                  &ldquo;{line.text}&rdquo;
                </p>
              ))}
            </div>

            {/* Card foot */}
            <div className="flex items-center justify-between border-t border-[var(--line)] px-6 py-3.5">
              <p className="text-xs font-medium text-muted">Answered in under 5 seconds</p>
              <Link href="/demo" className="text-xs font-semibold text-blue transition-colors hover:text-blue-deep">
                Try it yourself →
              </Link>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ── STATS (live counters) ────────────────────────────── */}
      <section className="border-y border-[var(--line)] bg-white py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-10 px-6 md:grid-cols-4">
          {[
            { number: <CountUp end={62} suffix="%" />,           label: "of missed calls never call back" },
            { number: <CountUp end={5} prefix="< " suffix="s" />, label: "RingLoop picks up the call" },
            { number: "24/7",                                     label: "always available" },
            { number: <CountUp end={3} suffix="×" />,             label: "more bookings per month" },
          ].map((stat, i) => (
            <div key={stat.label} data-reveal className={`reveal-pop r-delay-${(i % 3) + 1} text-center`}>
              <p className="font-display mb-2 text-[2.7rem] leading-none text-blue">{stat.number}</p>
              <p className="mx-auto max-w-[180px] text-sm leading-snug text-ink-soft">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SPECIALTY TICKER ─────────────────────────────────── */}
      <div className="marquee-mask border-b border-[var(--line)] bg-white py-5">
        <div className="marquee items-center gap-12 pr-12">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-12">
              {[
                "Dental clinics", "Aesthetic clinics", "General practices", "Ophthalmology",
                "Physiotherapy", "Psychiatry & therapy", "Cardiology", "Dermatology", "Pediatrics",
              ].map((s) => (
                <span key={s} className="flex items-center gap-12 whitespace-nowrap text-sm font-medium text-muted">
                  {s}
                  <span className="h-1 w-1 rounded-full bg-blue/40" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── TRUST BAND ───────────────────────────────────────── */}
      <section className="border-b border-[var(--line)] bg-white py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-6 text-sm font-medium text-ink-soft">
          {[
            { icon: "shield",        label: "GDPR-ready & secure" },
            { icon: "globe",         label: "For clinics in Europe & the US" },
            { icon: "clock",         label: "Answers in under 5 seconds" },
            { icon: "phone",         label: "24/7, every single call" },
            { icon: "calendarCheck", label: "No contract · cancel anytime" },
          ].map((b, i) => (
            <div key={b.label} className="flex items-center gap-2.5">
              {i > 0 && <span className="hidden h-4 w-px bg-[var(--line)] sm:block sm:-ml-4 sm:mr-1.5" />}
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky text-blue">
                <Icon name={b.icon} className="h-4 w-4" />
              </span>
              {b.label}
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-32">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div data-reveal className="reveal-left">
            <p className="label mb-4 text-muted">The cost of a missed call</p>
            <h2 className="font-display mb-6 text-4xl leading-[1.1] md:text-5xl">
              Every unanswered ring is a patient <em className="text-blue">walking away.</em>
            </h2>
            <p className="mb-10 leading-relaxed text-ink-soft">
              When a patient calls and nobody answers, they don&apos;t wait. They call
              the next clinic on Google. That&apos;s a lost patient — and lost
              revenue — every single time.
            </p>
            <ul className="space-y-5">
              {[
                "62% of missed calls never call back",
                "The average clinic misses 15–30 calls per month",
                "Each missed call = €50–500 in lost treatment",
                "Voicemail has less than 20% callback rate",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3.5 text-[15px] text-ink-soft">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Loss ledger */}
          <div data-reveal className="card reveal-right r-delay-1 p-9">
            <p className="label mb-1.5 text-blue">Monthly loss calculator</p>
            <p className="mb-8 text-sm text-muted">For a clinic missing 20 calls a month</p>
            <div>
              {[
                { label: "Missed calls / month",         value: "20 calls", hi: false },
                { label: "Average treatment value",      value: "€150",     hi: false },
                { label: "Patients who don't call back", value: "62% = 12", hi: false },
                { label: "Monthly revenue lost",         value: "€1,800",   hi: true  },
                { label: "Annual revenue lost",          value: "€21,600",  hi: true  },
              ].map((row) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between border-b border-[var(--line)] py-4 text-sm last:border-0 ${row.hi ? "font-semibold" : ""}`}
                >
                  <span className="text-ink-soft">{row.label}</span>
                  <span className={row.hi ? "text-blue" : "text-ink"}>{row.value}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted">RingLoop pays for itself in the first recovered booking.</p>
          </div>
        </div>
      </section>

      {/* ── NIGHT SHIFT (solution, navy) ─────────────────────── */}
      <section className="relative overflow-hidden bg-night py-32 text-white">
        <div className="dot-grid-dark pointer-events-none absolute inset-0" />
        <div className="night-glow pointer-events-none absolute inset-0" />
        <div className="parallax pointer-events-none absolute -top-20 left-1/4 h-[380px] w-[380px] rounded-full bg-[#4074f5]/15 blur-3xl" />
        <div className="parallax-soft pointer-events-none absolute bottom-0 right-1/5 h-[300px] w-[300px] rounded-full bg-[#7fa6f8]/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6">
          <div data-reveal className="mb-20 text-center">
            <p className="label mb-4 text-sky/60">While your front desk sleeps</p>
            <h2 className="font-display text-4xl leading-[1.1] md:text-5xl">
              RingLoop answers every call.
              <br />
              <em className="text-[#7fa6f8]">Even when you can&apos;t.</em>
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-sky/60">
              Your clinic forwards unanswered calls to RingLoop. The AI picks up, has
              a natural voice conversation, and books the appointment — then confirms
              it to the patient by SMS.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: "phone",         step: "01", title: "Patient calls, no answer",    desc: "The call forwards to RingLoop in seconds." },
              { icon: "bot",           step: "02", title: "The AI picks up and talks",   desc: "A natural voice conversation — warm, not robotic." },
              { icon: "calendarCheck", step: "03", title: "Appointment booked by voice", desc: "Name, treatment, doctor and time — all collected." },
              { icon: "message",       step: "04", title: "SMS confirmation, instantly", desc: "The booking lands in the patient's pocket." },
            ].map((s, i) => (
              <div
                key={s.title}
                data-reveal
                className={`card-night reveal-zoom r-delay-${(i % 3) + 1} p-7 transition-colors duration-300 hover:border-[#7fa6f8]/30 hover:-translate-y-1`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7fa6f8]/12 text-[#7fa6f8]">
                    <Icon name={s.icon} className="h-4.5 w-4.5" />
                  </span>
                  <span className="font-display text-2xl text-sky/25">{s.step}</span>
                </div>
                <p className="mb-1.5 font-semibold text-white">{s.title}</p>
                <p className="text-sm leading-relaxed text-sky/55">{s.desc}</p>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-14 text-center">
            <Link
              href="/how-it-works"
              className="group inline-flex items-center gap-2 rounded-full border border-sky/20 px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:border-[#7fa6f8]/60 hover:bg-white/5"
            >
              See exactly how it works
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHAT TO EXPECT ───────────────────────────────────── */}
      <section className="relative overflow-hidden py-32">
        <div className="halo pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-6">
          <div data-reveal className="mb-16 text-center">
            <p className="label mb-4 text-muted">From the very first forwarded call</p>
            <h2 className="font-display text-4xl md:text-5xl">What your clinic can <em className="text-blue">expect.</em></h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: "phone",
                metric: "Every call",
                metricLabel: "answered, 24/7",
                desc: "Forwarded calls are picked up within seconds — evenings, weekends, and while your team is with patients. Nobody hits voicemail again.",
              },
              {
                icon: "calendarCheck",
                metric: "Bookings",
                metricLabel: "captured while you work",
                desc: "The AI collects the treatment, name, doctor preference, and time, then confirms the appointment and sends your team a full summary.",
              },
              {
                icon: "message",
                metric: "Every booking",
                metricLabel: "confirmed by SMS",
                desc: "Patients instantly receive their appointment details by SMS — and bookings can land straight in your Google Calendar.",
              },
            ].map((c, i) => (
              <div
                key={c.metric + c.metricLabel}
                data-reveal
                className={`card reveal-zoom r-delay-${i + 1} flex flex-col gap-5 p-8 transition-all duration-300 hover:-translate-y-1`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky text-blue">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <p className="font-display text-2xl leading-tight">
                  <em className="text-blue">{c.metric}</em> {c.metricLabel}
                </p>
                <p className="text-sm leading-relaxed text-ink-soft">{c.desc}</p>
              </div>
            ))}
          </div>

          <p data-reveal className="mt-12 text-center text-sm text-muted">
            Want to hear it for yourself?{" "}
            <Link href="/contact" className="font-semibold text-blue underline underline-offset-4 transition-colors hover:text-blue-deep">
              Book a free demo
            </Link>{" "}
            and we&apos;ll call you live.
          </p>
        </div>
      </section>

      {/* ── CHANNELS ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-32">
        <div data-reveal className="mb-16 text-center">
          <p className="label mb-4 text-muted">Every channel</p>
          <h2 className="font-display text-4xl md:text-5xl">Book by <em className="text-blue">voice, SMS &amp; WhatsApp.</em></h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-soft">
            However a patient reaches your clinic, RingLoop takes the booking and confirms it.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: "phone",
              title: "Voice booking",
              desc: "Answers every forwarded call and books the appointment in a natural conversation — then confirms by SMS.",
              status: "live",
            },
            {
              icon: "message",
              title: "SMS booking",
              desc: "Patients can book and reschedule entirely by text — a two-way conversation, in their own words.",
              status: "live",
            },
            {
              icon: "chat",
              title: "WhatsApp booking",
              desc: "Book, reschedule, and get reminders over WhatsApp — wherever your patients already chat.",
              status: "soon",
            },
          ].map((c, i) => (
            <div key={c.title} data-reveal className={`card reveal-zoom r-delay-${i + 1} p-8`}>
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky text-blue">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                {c.status === "live" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Live
                  </span>
                ) : (
                  <span className="rounded-full bg-sky px-2.5 py-1 text-[11px] font-semibold text-blue">
                    Coming soon
                  </span>
                )}
              </div>
              <h3 className="mb-2 font-semibold">{c.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXAMPLE CALLS ────────────────────────────────────── */}
      <section className="border-t border-[var(--line)] bg-white py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div data-reveal className="mb-4 text-center">
            <p className="label mb-4 text-muted">Hear how it sounds</p>
            <h2 className="font-display text-4xl md:text-5xl">Real conversations, <em className="text-blue">handled.</em></h2>
          </div>
          <p data-reveal className="mx-auto mb-14 max-w-xl text-center text-sm text-muted">
            Example calls that show exactly how RingLoop talks to your patients.
            Want the real thing?{" "}
            <Link href="/demo" className="font-semibold text-blue underline underline-offset-4 hover:text-blue-deep">
              Talk to the AI live →
            </Link>
          </p>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                tag: "After-hours booking",
                turns: [
                  { who: "ai",  text: "Good evening, you've reached the clinic. How can I help?" },
                  { who: "pt",  text: "I need a checkup this week." },
                  { who: "ai",  text: "Of course — Thursday at 10:00 works. May I have your name?" },
                  { who: "pt",  text: "Marko Horvat." },
                  { who: "ai",  text: "Booked, Marko. Confirmation is on its way by SMS." },
                ],
              },
              {
                tag: "Switches language",
                turns: [
                  { who: "pt",  text: "Dobar dan, trebam termin za čišćenje." },
                  { who: "ai",  text: "Naravno! Imamo slobodno u petak u 14:00." },
                  { who: "pt",  text: "Actually — can we do this in English?" },
                  { who: "ai",  text: "Absolutely. Friday at 2 PM — shall I book it?" },
                  { who: "pt",  text: "Yes, perfect." },
                ],
              },
              {
                tag: "Reschedule",
                turns: [
                  { who: "pt",  text: "I need to move my appointment to next week." },
                  { who: "ai",  text: "No problem. I have Tuesday 9:00 or Wednesday 16:30." },
                  { who: "pt",  text: "Wednesday afternoon." },
                  { who: "ai",  text: "Done — moved to Wednesday 16:30. You'll get a new SMS." },
                ],
              },
            ].map((c, i) => (
              <div key={c.tag} data-reveal className={`card reveal-zoom r-delay-${i + 1} overflow-hidden`}>
                <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3">
                  <span className="flex items-center gap-2 text-xs font-semibold text-blue">
                    <Icon name="phone" className="h-3.5 w-3.5" />
                    {c.tag}
                  </span>
                  <span className="rounded-full bg-sky px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue">Example</span>
                </div>
                <div className="space-y-2 bg-gradient-to-b from-sky/30 to-white p-5">
                  {c.turns.map((t, j) => (
                    <div key={j} className={`flex ${t.who === "pt" ? "justify-end" : ""}`}>
                      <div className={`max-w-[85%] px-3.5 py-2 text-[13px] leading-snug ${
                        t.who === "ai"
                          ? "rounded-2xl rounded-tl-md border border-[var(--line)] bg-white text-ink-soft shadow-sm"
                          : "rounded-2xl rounded-tr-md bg-blue text-white"
                      }`}>
                        {t.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ───────────────────────────────────────── */}
      <section className="border-y border-[var(--line)] bg-white py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div data-reveal className="mb-16 text-center">
            <p className="label mb-4 text-muted">Comparison</p>
            <h2 className="font-display text-4xl md:text-5xl">Why <em className="text-blue">RingLoop?</em></h2>
            <p className="mt-4 text-ink-soft">How it compares to the alternatives.</p>
          </div>

          <div data-reveal className="overflow-x-auto rounded-2xl border border-[var(--line)] shadow-sm">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-[var(--line)] bg-paper">
                  <th className="label px-6 py-5 text-left text-muted">Feature</th>
                  <th className="label border-x border-blue/10 bg-sky/60 px-6 py-5 text-center text-blue">RingLoop</th>
                  <th className="label px-6 py-5 text-center text-muted">Receptionist</th>
                  <th className="label px-6 py-5 text-center text-muted">Voicemail</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Available 24/7",                   rl: true,       rec: false,     vm: true  },
                  { feature: "Answers calls instantly",          rl: true,       rec: false,     vm: true  },
                  { feature: "Books appointments automatically", rl: true,       rec: true,      vm: false },
                  { feature: "Confirms bookings by SMS",         rl: true,       rec: false,     vm: false },
                  { feature: "Google Calendar integration",      rl: true,       rec: true,      vm: false },
                  { feature: "Multi-language support",           rl: true,       rec: false,     vm: false },
                  { feature: "No salary or sick days",           rl: true,       rec: false,     vm: true  },
                  { feature: "Monthly cost",                     rl: "Tailored", rec: "€1,500+", vm: "€0" },
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-[var(--line)] bg-white last:border-0">
                    <td className="px-6 py-4 text-sm font-medium text-ink-soft">{row.feature}</td>
                    <td className="border-x border-blue/10 bg-sky/40 px-6 py-4 text-center">
                      {typeof row.rl === "boolean" ? <Check ok={row.rl} /> : <span className="text-sm font-bold text-blue">{row.rl}</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.rec === "boolean" ? <Check ok={row.rec} /> : <span className="text-sm text-muted">{row.rec}</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.vm === "boolean" ? <Check ok={row.vm} /> : <span className="text-sm text-muted">{row.vm}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section id="features" className="mx-auto max-w-5xl px-6 py-32">
        <div data-reveal className="mb-16 text-center">
          <p className="label mb-4 text-muted">Features</p>
          <h2 className="font-display text-4xl md:text-5xl">Everything your clinic <em className="text-blue">needs.</em></h2>
          <p className="mt-4 text-ink-soft">Built specifically for medical institutes.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            { icon: "phone",         title: "AI voice receptionist", desc: "Answers every forwarded call and has a natural booking conversation." },
            { icon: "sparkles",      title: "Advanced AI",           desc: "Understands any language, any phrasing, any medical request." },
            { icon: "calendarCheck", title: "Auto booking",          desc: "Collects all booking details and confirms the appointment by voice." },
            { icon: "message",       title: "SMS confirmations",     desc: "Every patient instantly receives their booking details by SMS." },
            { icon: "clinic",        title: "Custom AI persona",     desc: "The AI introduces itself as your clinic — not as RingLoop." },
            { icon: "globe",         title: "Multi-language",        desc: "Croatian, English, German — whatever the patient speaks." },
            { icon: "user",          title: "Doctor preference",     desc: "Asks if the patient has a preferred doctor before booking." },
            { icon: "clipboard",     title: "Patient summaries",     desc: "After every booking, your team gets a full patient summary." },
            { icon: "sync",          title: "Calendar integration",  desc: "Google Calendar integration available — bookings land straight in your clinic's calendar." },
          ].map((f, i) => (
            <div
              key={f.title}
              data-reveal
              className={`card r-delay-${(i % 3) + 1} p-7 transition-all duration-300 hover:-translate-y-1`}
            >
              <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-sky text-blue">
                <Icon name={f.icon} className="h-4.5 w-4.5" />
              </span>
              <h3 className="mb-1.5 font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── INDUSTRIES ───────────────────────────────────────── */}
      <section id="industries" className="border-y border-[var(--line)] bg-white py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div data-reveal className="mb-16 text-center">
            <p className="label mb-4 text-muted">Specialties</p>
            <h2 className="font-display text-4xl md:text-5xl">Built for every <em className="text-blue">medical institute.</em></h2>
            <p className="mt-4 text-ink-soft">If your clinic takes appointments, RingLoop works for you.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: "tooth",       name: "Dental Clinics",       desc: "Cleanings, checkups, whitening, implants" },
              { icon: "syringe",     name: "Aesthetic Clinics",    desc: "Botox, fillers, skin treatments, laser" },
              { icon: "stethoscope", name: "General Practices",    desc: "GP visits, specialist referrals, checkups" },
              { icon: "eye",         name: "Ophthalmology",        desc: "Eye exams, vision correction, surgery" },
              { icon: "bone",        name: "Physiotherapy",        desc: "Rehab, injury treatment, sports medicine" },
              { icon: "smile",       name: "Psychiatry & Therapy", desc: "Mental health, counseling, psychotherapy" },
              { icon: "heartPulse",  name: "Cardiology",           desc: "Heart checkups, ECG, consultations" },
              { icon: "droplet",     name: "Dermatology",          desc: "Skin conditions, mole checks, cosmetic" },
              { icon: "baby",        name: "Pediatrics",           desc: "Child health, vaccinations, development" },
            ].map((ind, i) => (
              <div
                key={ind.name}
                data-reveal
                className={`hover-glow r-delay-${(i % 3) + 1} rounded-2xl border border-[var(--line)] bg-paper p-6 hover:bg-sky/40`}
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue shadow-sm">
                  <Icon name={ind.icon} className="h-4.5 w-4.5" />
                </span>
                <h3 className="mb-1 font-semibold">{ind.name}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{ind.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-muted">
            Not in the list?{" "}
            <Link href="/contact" className="font-semibold text-blue underline underline-offset-4 transition-colors hover:text-blue-deep">
              Contact us
            </Link>{" "}
            — RingLoop works for any appointment-based business.
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-32">
        <div data-reveal className="mb-14 text-center">
          <p className="label mb-4 text-muted">FAQ</p>
          <h2 className="font-display text-4xl md:text-5xl">Common questions</h2>
        </div>
        <div data-reveal className="card divide-y divide-[var(--line)] px-8 py-2">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group cursor-pointer py-6">
              <summary className="flex list-none select-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {q}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky text-blue transition-transform duration-300 group-open:rotate-45">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </span>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-relaxed text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── FOUNDING CLINIC ──────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div data-reveal className="card reveal-zoom relative overflow-hidden p-10 text-center md:p-14">
          <div className="halo pointer-events-none absolute inset-0" />
          <div className="relative">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue/20 bg-sky px-4 py-1.5 text-xs font-semibold text-blue">
              <Icon name="star" className="h-3.5 w-3.5" />
              Partner with RingLoop
            </span>
            <h2 className="font-display mx-auto mb-4 max-w-2xl text-3xl leading-tight md:text-4xl">
              Bring RingLoop to <em className="text-blue">your clinic.</em>
            </h2>
            <p className="mx-auto mb-9 max-w-xl leading-relaxed text-ink-soft">
              Priority onboarding, a direct line to our team, and pricing locked
              in for as long as you stay. Live in 24 hours, with no contract.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact" className="btn-primary group px-9 py-4">
                Become a partner
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/demo" className="rounded-full border border-[var(--line)] bg-white px-9 py-4 font-semibold text-ink shadow-sm transition-all duration-300 hover:border-blue/30 hover:text-blue">
                Try the live demo first
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-night py-36 text-center text-white">
        <div className="dot-grid-dark pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_115%,_rgba(64,116,245,0.3),_transparent)]" />

        <div data-reveal className="relative mx-auto max-w-2xl px-6">
          <p className="label mb-5 text-sky/60">The next missed call could be tonight</p>
          <h2 className="font-display mb-6 text-4xl leading-[1.08] md:text-6xl">
            Ready to stop <em className="text-[#7fa6f8]">losing patients?</em>
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-lg leading-relaxed text-sky/60">
            Book a free 20-minute demo and hear your AI receptionist answer a live call.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact" className="btn-primary group px-9 py-4">
              Book a free demo
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-sky/25 px-9 py-4 font-semibold text-white transition-all duration-300 hover:border-[#7fa6f8]/60 hover:bg-white/5"
            >
              See pricing
            </Link>
          </div>
          <p className="mt-8 text-sm text-sky/40">No contract &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; Setup in 24h</p>
          <p className="mt-3 text-sm text-sky/40">
            Or{" "}
            <Link href="/demo" className="font-semibold text-[#7fa6f8] transition-colors hover:text-white">
              talk to her right now
            </Link>{" "}
            — live in your browser.
          </p>
        </div>
      </section>
    </main>
  );
}

function Check({ ok }: { ok: boolean }) {
  return ok
    ? <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky text-[10px] font-bold text-blue">✓</span>
    : <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-paper text-[10px] font-bold text-muted">✕</span>;
}
