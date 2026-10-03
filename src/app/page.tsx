import Link from "next/link";
import Icon from "@/components/Icon";
import LogoMark from "@/components/LogoMark";
import HeroChat from "@/components/HeroChat";
import RoiCalculator from "@/components/RoiCalculator";
import CtaBand from "@/components/CtaBand";
import Faq, { faqJsonLd, type FaqItem } from "@/components/Faq";
import { Eyebrow, SectionHeading, CheckDot } from "@/components/Section";
import { TextBackVisual, BookingVisual, ReminderVisual } from "@/components/FeatureVisuals";
import Industries from "@/components/Industries";
import Halo from "@/components/Halo";

const industries = [
  { icon: "scissors",    name: "Hair salons" },
  { icon: "barberPole",  name: "Barbershops" },
  { icon: "nailPolish",  name: "Nail studios" },
  { icon: "utensils",    name: "Restaurants" },
  { icon: "sparkles",    name: "Beauty & spa" },
  { icon: "tooth",       name: "Dental clinics" },
  { icon: "stethoscope", name: "Medical practices" },
  { icon: "bone",        name: "Physiotherapy" },
  { icon: "dumbbell",    name: "Fitness studios" },
  { icon: "leaf",        name: "Massage & wellness" },
  { icon: "wrench",      name: "Car services" },
  { icon: "pawPrint",    name: "Pet grooming" },
];

const withoutUs = [
  { time: "18:41", icon: "phone",       text: "The phone rings while you're with a customer" },
  { time: "18:42", icon: "phoneMissed", text: "Nobody can answer — it goes to voicemail" },
  { time: "18:42", icon: "x",           text: "The caller hangs up without a message" },
  { time: "18:49", icon: "store",       text: "They book with a competitor down the street" },
];

const withUs = [
  { time: "18:41", icon: "phone",         text: "The phone rings while you're with a customer" },
  { time: "18:41", icon: "messageText",   text: "Halo texts the caller within seconds" },
  { time: "18:44", icon: "calendarCheck", text: "They book Friday 14:30 just by replying" },
  { time: "Thu",   icon: "bell",          text: "Reminded the day before — and they show up" },
];

const steps = [
  {
    icon: "phoneMissed",
    title: "A call goes unanswered",
    desc: "Busy, closed or mid-service — calls you can't take are caught by RingLoop through simple call forwarding on your existing number.",
  },
  {
    icon: "messageText",
    title: "Halo texts back in seconds",
    desc: "The caller gets a friendly SMS from your business name, inviting them to book by reply — before they dial anyone else.",
  },
  {
    icon: "calendarCheck",
    title: "Halo books it",
    desc: "A natural two-way text conversation finds the right service and time, confirms it, and lets you know.",
  },
];

const stepPoses = ["listen", "talk", "booking"] as const;

const features = [
  {
    kicker: "Recover",
    icon: "phoneMissed",
    title: "Every missed call gets a reply in seconds.",
    desc: "RingLoop notices the call you couldn't take and texts the caller straight away — while they're still holding the phone. No voicemail, no phone tag, no customer lost to the competitor down the street.",
    points: [
      "Sent within seconds, day and night",
      "Arrives from your business name — not a random number",
      "Works with your existing landline or mobile",
    ],
    visual: <TextBackVisual />,
  },
  {
    kicker: "Book",
    icon: "messages",
    title: "A booking conversation that runs itself.",
    desc: "The AI understands how people actually text — typos, voice dictation, any language — and books them in a natural back-and-forth. It knows your services, opening hours and team, and hands over to a person whenever it should.",
    points: [
      "Books, reschedules and cancels by text",
      "You're notified the moment something's booked",
      "Bookings can land straight in your Google Calendar",
    ],
    visual: <BookingVisual />,
  },
  {
    kicker: "Keep",
    icon: "bell",
    title: "Fewer no-shows. Fuller days.",
    desc: "Every booking gets an instant confirmation and a reminder before the visit. Customers confirm or reschedule with a one-word reply — so a cancellation becomes a slot you can fill, not an empty chair or table.",
    points: [
      "Instant confirmation after every booking",
      "Day-before reminders with reply-to-confirm",
      "Reschedules handled without a single phone call",
    ],
    visual: <ReminderVisual />,
  },
];

const extras = [
  { icon: "userCheck", title: "Human handoff",          desc: "When a customer needs a person, the conversation comes to you — with the full context." },
  { icon: "store",     title: "Your name, your tone",   desc: "Texts arrive under your business name and sound like you — RingLoop stays invisible." },
  { icon: "languages", title: "Speaks their language",  desc: "Croatian, English, German, Italian, Slovenian and more — replies in the customer's language." },
  { icon: "calendar",  title: "Calendar sync",          desc: "Google Calendar integration, so bookings appear where you already look." },
  { icon: "history",   title: "Win-back campaigns",     desc: "Bring back regulars when they're due — for a trim, a check-up or a table — automatically.", soon: true },
  { icon: "star",      title: "Review requests",        desc: "Ask happy customers for a Google review a few hours after their visit.",                    soon: true },
];

const comparison: { feature: string; rl: string | boolean; vm: string | boolean; rec: string | boolean }[] = [
  { feature: "Replies to every missed call",       rl: true,       vm: false, rec: false     },
  { feature: "Works evenings & weekends",          rl: true,       vm: true,  rec: false     },
  { feature: "Takes bookings",                     rl: true,       vm: false, rec: true      },
  { feature: "Confirmations & reminders",          rl: true,       vm: false, rec: "Manual"  },
  { feature: "Speaks your customers' languages",   rl: true,       vm: false, rec: "Some"    },
  { feature: "Monthly cost",                       rl: "From €59", vm: "€0",  rec: "€1,500+" },
];

const trust = [
  { icon: "shieldCheck", title: "GDPR-ready",             desc: "EU-based, with a Data Processing Agreement for every business and data kept to the minimum." },
  { icon: "lock",        title: "Secure by default",      desc: "Encrypted in transit, strict access controls — and customer data is never sold." },
  { icon: "userCheck",   title: "Honest with customers",  desc: "The assistant never pretends to be human, and hands over the moment it should." },
  { icon: "shield",      title: "Knows its limits",       desc: "It books and answers questions about your business. Anything else — like medical advice — goes to you." },
];

const faqs: FaqItem[] = [
  {
    q: "What kinds of businesses is RingLoop for?",
    a: "Any business that takes bookings by phone: hair salons, barbershops, nail and beauty studios, restaurants, dental and medical practices, physiotherapists, fitness studios, spas, car services and more. If people call you to book, RingLoop can text them back.",
  },
  {
    q: "Do I need a new phone number?",
    a: "No. Customers keep calling the number they already know. You switch on call forwarding for unanswered calls once — it takes about two minutes — and RingLoop takes it from there.",
  },
  {
    q: "What exactly happens when I miss a call?",
    a: "RingLoop catches the unanswered call and, within seconds, texts the caller from your business name inviting them to book by reply. The AI handles the conversation, confirms the booking, and you're notified the moment it's done.",
  },
  {
    q: "Will customers know they're texting an automated assistant?",
    a: "RingLoop writes as your business's text assistant and never pretends to be a person. If someone asks, it says so honestly — and you can take over any conversation at any time.",
  },
  {
    q: "What languages does it speak?",
    a: "Croatian, English, German, Italian, Slovenian and many more. It replies in whatever language the customer writes in, automatically.",
  },
  {
    q: "Does it work with my calendar or booking system?",
    a: "Bookings can land straight in your Google Calendar. Already using a booking system? Tell us which one in the demo and we'll work out the right setup with you.",
  },
  {
    q: "Is it GDPR compliant?",
    a: "Yes. We're an EU-based company, we process customer data only on your behalf under a Data Processing Agreement, and our processors operate under EU Standard Contractual Clauses. See our Privacy Policy for details.",
  },
  {
    q: "How long does setup take?",
    a: "Most businesses are live within 24 hours. We configure everything — your services, hours, team and message templates. You just switch on call forwarding.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contract and no minimum term — cancel before your next billing date and you won't be charged again.",
  },
];

export default function Home() {
  return (
    <main className="overflow-x-clip bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative px-6 pb-20 pt-32 md:pt-40 lg:pb-28">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="halo pointer-events-none absolute inset-0" />
        <div className="halo-drift pointer-events-none absolute -top-40 left-1/2 h-[460px] w-[820px] rounded-full bg-blue/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
          <div className="text-center lg:text-left">
            <Link
              href="/demo"
              className="animate-fade-up group inline-flex items-center gap-2.5 rounded-full border border-blue/15 bg-white/80 py-1 pl-1 pr-3.5 text-xs font-semibold text-ink-soft shadow-sm backdrop-blur transition-colors hover:border-blue/30 hover:text-ink"
            >
              <span className="flex items-center gap-1.5 rounded-full bg-blue py-0.5 pl-0.5 pr-2 text-[10px] font-bold uppercase tracking-wider text-white">
                <Halo pose="avatar" size={18} decorative className="h-[18px] w-[18px] rounded-full bg-white" />
                Live
              </span>
              Text Halo, our AI receptionist<span className="hidden sm:inline">, right now</span>
              <span className="arrow text-blue">→</span>
            </Link>

            <h1 className="font-display animate-fade-up anim-d1 mt-7 text-[2.85rem] leading-[1.03] sm:text-6xl lg:text-[3.75rem] xl:text-[4.35rem]">
              Turn missed calls into <em>booked customers.</em>
            </h1>

            <p className="animate-fade-up anim-d2 mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl lg:mx-0">
              Busy with a client, closed, or mid-service? RingLoop texts every missed caller back
              within seconds, books them in a friendly two-way SMS chat, and sends reminders that
              cut no-shows — 24/7, under your business name.
            </p>

            <div className="animate-fade-up anim-d3 mt-10 flex flex-col items-center gap-3.5 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/contact" className="btn-primary group w-full px-8 py-4 sm:w-auto">
                Book a free demo <span className="arrow">→</span>
              </Link>
              <Link href="/demo" className="btn-secondary w-full px-8 py-4 sm:w-auto">
                <Icon name="messageText" className="h-4.5 w-4.5 text-blue" />
                Try the live demo
              </Link>
            </div>

            <ul className="animate-fade-up anim-d4 mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-sm text-ink-soft lg:justify-start">
              {["Keep your number", "Live in 24 hours", "No contract"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-up anim-d3">
            <HeroChat />
          </div>
        </div>
      </section>

      {/* ── SPECIALTY TICKER ─────────────────────────────────── */}
      <section className="border-y border-line bg-white py-7">
        <p className="label mb-5 text-center text-muted">Built for every business that runs on bookings</p>
        <div className="marquee-mask">
          <div className="marquee items-center gap-12 pr-12">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-12">
                {industries.map((s) => (
                  <span key={s.name} className="flex items-center gap-2.5 whitespace-nowrap text-[15px] font-medium text-ink-soft">
                    <Icon name={s.icon} className="h-4.5 w-4.5 text-blue/70" />
                    {s.name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEET HALO ────────────────────────────────────────── */}
      <section className="relative px-6 pt-24 md:pt-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div data-reveal className="reveal-left relative mx-auto w-full max-w-[420px]">
            <div className="halo pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/15 blur-3xl" />
            <Halo pose="wave" size={420} decorative className="animate-float relative mx-auto w-[78%] drop-shadow-[0_40px_50px_rgba(33,86,232,0.28)]" />
            <div className="absolute right-0 top-[8%] rounded-2xl rounded-bl-md border border-line bg-white px-4 py-2.5 text-[15px] font-semibold text-ink shadow-[0_18px_40px_-20px_rgba(12,27,56,0.35)] sm:right-2">
              Halo? 👋
            </div>
            <div className="absolute bottom-[10%] left-0 flex items-center gap-2.5 rounded-2xl border border-line bg-white py-2 pl-2 pr-4 shadow-[0_18px_40px_-20px_rgba(12,27,56,0.35)]">
              <Halo pose="booking" size={40} decorative className="h-10 w-10" />
              <span>
                <span className="block text-[11px] font-medium text-muted">Booked while you worked</span>
                <span className="block text-[13.5px] font-semibold text-ink">Fri 16:30 · Cut &amp; blow-dry</span>
              </span>
            </div>
          </div>

          <div data-reveal className="reveal-right text-center lg:text-left">
            <Eyebrow icon="sparkles">Meet Halo</Eyebrow>
            <h2 className="font-display mt-5 text-[2.4rem] leading-[1.08] md:text-5xl">
              Your new receptionist <em>never misses a call.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft lg:mx-0">
              In Croatia we pick up the phone with a friendly <span className="font-semibold text-ink">&ldquo;Halo?&rdquo;</span> —
              so that&apos;s what we named the AI inside RingLoop. Halo answers every caller you can&apos;t,
              books them by text, and closes the loop while you get on with your day.
            </p>
            <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2 lg:mx-0">
              {[
                ["clock",       "Up at 3am, on Sundays, on holidays"],
                ["languages",   "Replies in your customer's language"],
                ["store",       "Writes under your business name"],
                ["userCheck",   "Hands over to you when it should"],
              ].map(([icon, text]) => (
                <li key={text} className="flex items-center gap-3 rounded-2xl border border-line bg-white/70 px-4 py-3 text-[15px] font-medium text-ink">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky text-blue">
                    <Icon name={icon} className="h-4 w-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <Link href="/demo" className="btn-secondary group mt-9 inline-flex px-7 py-3.5">
              <Icon name="messageText" className="h-4.5 w-4.5 text-blue" />
              Say hi to Halo <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM: BEFORE / AFTER ──────────────────────── */}
      <section className="px-6 py-24 md:py-32">
        <SectionHeading
          eyebrow="The missed-call problem"
          icon="phoneMissed"
          title={<>Voicemail is where <em>bookings go to die.</em></>}
          sub="You're with a client, the kitchen is slammed, or it's after hours. The phone rings out — and the caller doesn't leave a message. They just book with the next business on Google."
        />

        <div className="mx-auto mt-16 grid max-w-5xl gap-5 md:grid-cols-2">
          <div data-reveal className="reveal-left rounded-3xl border border-line bg-white/50 p-7 md:p-9">
            <div className="mb-8 flex items-center justify-between">
              <p className="label text-muted">Without RingLoop</p>
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-500">Customer lost</span>
            </div>
            <Journey items={withoutUs} tone="lost" />
          </div>

          <div
            data-reveal
            className="reveal-right card relative overflow-hidden p-7 ring-1 ring-blue/10 shadow-[0_30px_70px_-35px_rgba(33,86,232,0.45)] md:p-9"
          >
            <div className="halo pointer-events-none absolute inset-0" />
            <div className="relative">
              <div className="mb-8 flex items-center justify-between">
                <p className="label flex items-center gap-2 text-blue">
                  <Halo pose="happy" size={28} decorative className="-my-1 h-7 w-7" /> With RingLoop
                </p>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">Customer booked</span>
              </div>
              <Journey items={withUs} tone="won" />
            </div>
          </div>
        </div>

        <p data-reveal className="mt-10 text-center text-ink-soft">
          Same missed call. <span className="font-semibold text-ink">A completely different outcome.</span>
        </p>
      </section>

      {/* ── HOW IT WORKS (navy) ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-night px-6 py-24 text-white md:py-32">
        <div className="grid-bg-dark pointer-events-none absolute inset-0" />
        <div className="night-glow pointer-events-none absolute inset-0" />
        <div className="parallax pointer-events-none absolute -top-20 left-1/4 h-[380px] w-[380px] rounded-full bg-[#4074f5]/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            dark
            eyebrow="How it works"
            icon="zap"
            title={<>Set up once. <em>Runs on autopilot.</em></>}
            sub="No new number, no app for your customers, and no extra work for you or your team."
          />

          <div className="relative mt-16 grid gap-5 md:grid-cols-3">
            <div className="pointer-events-none absolute left-[17%] right-[17%] top-[58px] hidden h-px bg-gradient-to-r from-periwinkle/0 via-periwinkle/40 to-periwinkle/0 md:block" />
            {steps.map((s, i) => (
              <div key={s.title} data-reveal className={`card-night lift r-delay-${i + 1} relative p-8`}>
                <div className="mb-8 flex items-center justify-between">
                  <Halo pose={stepPoses[i]} size={72} decorative className="-my-3 -ml-2 h-[72px] w-[72px] drop-shadow-[0_12px_24px_rgba(33,86,232,0.5)]" />
                  <span className="font-display text-sm text-sky/35">Step {i + 1}</span>
                </div>
                <h3 className="mb-2.5 text-lg font-semibold">{s.title}</h3>
                <p className="text-[15px] leading-relaxed text-sky/60">{s.desc}</p>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-12 text-center">
            <Link href="/how-it-works" className="btn-ghost group px-7 py-3.5">
              See the full walkthrough <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ───────────────────────────────────────── */}
      <section id="industries" className="scroll-mt-16 px-6 pt-24 md:pt-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Industries"
            icon="store"
            title={<>Made for <em>your kind of business.</em></>}
            sub="Salons, barbershops, restaurants, clinics and more — RingLoop learns your services, hours and team, and books customers the way you would."
          />
          <div data-reveal className="mt-12">
            <Industries />
          </div>
        </div>
      </section>

      {/* ── FEATURE DEEP-DIVES ───────────────────────────────── */}
      <section id="features" className="scroll-mt-16 px-6 py-24 md:py-32">
        <SectionHeading
          eyebrow="Features"
          icon="sparkles"
          title={<>Your calendar, <em>filled by text.</em></>}
          sub="Three automations that win back missed calls, fill your calendar — and keep it full."
        />

        <div className="mx-auto mt-20 max-w-6xl space-y-24 md:space-y-32">
          {features.map((f, i) => (
            <div key={f.kicker} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div data-reveal className={i % 2 === 1 ? "reveal-right lg:order-2" : "reveal-left"}>
                <p className="label mb-4 flex items-center gap-2 text-blue">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky">
                    <Icon name={f.icon} className="h-4 w-4" />
                  </span>
                  {f.kicker}
                </p>
                <h3 className="font-display text-[2rem] leading-[1.12] md:text-[2.6rem]">{f.title}</h3>
                <p className="mt-5 text-lg leading-relaxed text-ink-soft">{f.desc}</p>
                <ul className="mt-7 space-y-3.5">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[15px] text-ink">
                      <CheckDot />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div data-reveal className={i % 2 === 1 ? "reveal-left lg:order-1" : "reveal-right"}>
                {f.visual}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EVERYTHING ELSE ──────────────────────────────────── */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h3 className="font-display text-3xl md:text-4xl">And everything around it.</h3>
            <p className="max-w-md text-ink-soft">
              The details that make customers trust the text — and you trust the system.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((e, i) => (
              <div key={e.title} data-reveal className={`card lift r-delay-${(i % 3) + 1} p-7`}>
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky text-blue">
                    <Icon name={e.icon} className="h-5 w-5" />
                  </span>
                  {e.soon && (
                    <span className="rounded-full border border-blue/15 bg-sky/60 px-2.5 py-1 text-[11px] font-semibold text-blue">
                      Coming soon
                    </span>
                  )}
                </div>
                <h4 className="mb-1.5 font-semibold text-ink">{e.title}</h4>
                <p className="text-sm leading-relaxed text-ink-soft">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI CALCULATOR ───────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-line bg-white px-6 py-24 md:py-32">
        <div className="halo pointer-events-none absolute inset-0" />
        <div className="relative">
          <SectionHeading
            eyebrow="ROI calculator"
            icon="euro"
            title={<>What are missed calls <em>costing you?</em></>}
            sub="Move the sliders to match your business. The math is simple — and it adds up fast."
          />
          <div data-reveal className="reveal-zoom mx-auto mt-14 max-w-5xl">
            <RoiCalculator />
          </div>
        </div>
      </section>

      {/* ── COMPARISON ───────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32">
        <SectionHeading
          eyebrow="Compare"
          icon="sliders"
          title={<>Voicemail loses customers. <em>RingLoop books them.</em></>}
          sub="How RingLoop stacks up against the usual ways businesses handle the calls they miss."
        />

        <div data-reveal className="relative mx-auto mt-14 max-w-4xl overflow-x-auto rounded-3xl border border-line bg-white shadow-[0_24px_60px_-40px_rgba(12,27,56,0.35)]">
          <table className="w-full table-fixed text-left">
            <colgroup>
              <col className="w-[37%] sm:w-[40%]" />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr className="border-b border-line">
                <th className="px-4 py-4 text-sm font-medium text-muted sm:px-6 sm:py-5">
                  <span className="sr-only">Feature</span>
                </th>
                <th className="bg-sky/60 px-1 py-4 text-center sm:px-6 sm:py-5">
                  <span className="inline-flex flex-col items-center gap-1 font-display text-xs text-ink sm:flex-row sm:gap-2 sm:text-[15px]">
                    <LogoMark size={20} /> RingLoop
                  </span>
                </th>
                <th className="px-1 py-4 text-center text-xs font-semibold text-ink-soft sm:px-6 sm:py-5 sm:text-sm">Voicemail</th>
                <th className="px-1 py-4 text-center text-xs font-semibold text-ink-soft sm:px-6 sm:py-5 sm:text-sm">
                  <span className="sm:hidden">Extra staff</span>
                  <span className="hidden sm:inline">Extra receptionist</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5 text-sm font-medium text-ink sm:px-6 sm:py-4 sm:text-[15px]">{row.feature}</td>
                  <td className="bg-sky/40 px-1 py-3.5 text-center sm:px-6 sm:py-4"><Cell value={row.rl} highlight /></td>
                  <td className="px-1 py-3.5 text-center sm:px-6 sm:py-4"><Cell value={row.vm} /></td>
                  <td className="px-1 py-3.5 text-center sm:px-6 sm:py-4"><Cell value={row.rec} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── TRUST ────────────────────────────────────────────── */}
      <section className="border-y border-line bg-white px-6 py-24 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div data-reveal className="reveal-left">
            <Eyebrow icon="shieldCheck">Trust &amp; privacy</Eyebrow>
            <h2 className="font-display mt-5 text-[2.4rem] leading-[1.08] md:text-5xl">
              Private by design. <em>GDPR-ready.</em>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Customer conversations are personal — whether it&apos;s a dental check-up or a Saturday
              haircut. RingLoop is built in the EU, with privacy as the starting point, not an add-on.
            </p>
            <Link href="/privacy" className="group mt-7 inline-flex items-center gap-1.5 font-semibold text-blue">
              Read our privacy policy <span className="arrow">→</span>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trust.map((t, i) => (
              <div key={t.title} data-reveal className={`rounded-2xl border border-line bg-paper/70 p-6 r-delay-${(i % 3) + 1}`}>
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue shadow-sm">
                  <Icon name={t.icon} className="h-5 w-5" />
                </span>
                <h3 className="mb-1.5 font-semibold text-ink">{t.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div data-reveal>
            <Eyebrow icon="chat">FAQ</Eyebrow>
            <h2 className="font-display mt-5 text-[2.4rem] leading-[1.08] md:text-5xl">
              Questions, <em>answered.</em>
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Can&apos;t find what you&apos;re looking for?{" "}
              <Link href="/contact" className="font-semibold text-blue underline-offset-4 hover:underline">
                Ask us directly
              </Link>{" "}
              — we usually reply within a few hours.
            </p>
          </div>
          <div data-reveal>
            <Faq items={faqs} />
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ──────────────────────────────────────── */}
      <CtaBand
        eyebrow="Your next missed call could be tonight"
        title={<>Stop sending customers <em>to voicemail.</em></>}
        sub="Book a free 20-minute demo. We'll set RingLoop up with your business name and show you a real text-back — live."
        secondary={{ href: "/demo", label: "Try the live demo" }}
        halo="celebrate"
      >
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-sky/55">
          {["Priority onboarding", "Direct line to our team", "Price locked in while you stay", "No contract"].map((p) => (
            <li key={p} className="flex items-center gap-2">
              <Icon name="check" className="h-4 w-4 text-periwinkle" strokeWidth={2.4} />
              {p}
            </li>
          ))}
        </ul>
      </CtaBand>
    </main>
  );
}

function Journey({
  items, tone,
}: {
  items: { time: string; icon: string; text: string }[];
  tone: "lost" | "won";
}) {
  return (
    <ol className="space-y-6">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        const iconClass =
          tone === "won"
            ? i === 0 ? "bg-paper text-ink-soft" : "bg-blue text-white shadow-[0_8px_20px_-8px_rgba(33,86,232,0.7)]"
            : last ? "bg-red-50 text-red-500" : "bg-paper text-muted";
        return (
          <li key={it.text} className="relative flex items-start gap-4">
            {!last && (
              <span className={`absolute left-[18px] top-11 -bottom-5 w-px ${tone === "won" ? "bg-blue/25" : "bg-line"}`} />
            )}
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
              <Icon name={it.icon} className="h-4 w-4" />
            </span>
            <div className="pt-0.5">
              <p className="text-xs font-semibold tabular-nums text-muted">{it.time}</p>
              <p className={`mt-0.5 text-[15px] font-medium ${tone === "lost" && last ? "text-red-500" : "text-ink"}`}>
                {it.text}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Cell({ value, highlight = false }: { value: string | boolean; highlight?: boolean }) {
  if (typeof value === "string") {
    return <span className={`text-xs sm:text-sm ${highlight ? "font-bold text-blue" : "font-medium text-ink-soft"}`}>{value}</span>;
  }
  return value ? (
    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${highlight ? "bg-blue text-white" : "bg-sky text-blue"}`}>
      <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
      <span className="sr-only">Yes</span>
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-paper text-muted">
      <Icon name="x" className="h-3.5 w-3.5" strokeWidth={2.6} />
      <span className="sr-only">No</span>
    </span>
  );
}
