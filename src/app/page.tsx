import Link from "next/link";
import Icon from "@/components/Icon";

const faqs = [
  {
    q: "Do I need a new phone number?",
    a: "No. You keep your existing clinic number and set up call forwarding — takes about 2 minutes. When a call goes unanswered after a few rings, it forwards to RingLoop's AI. Your patients dial the same number as always.",
  },
  {
    q: "How long does setup take?",
    a: "Most clinics are live within 24 hours. We handle the AI configuration, voice persona setup, and WhatsApp number. You just flip the call forwarding switch.",
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

export default function Home() {
  return (
      <main className="overflow-x-hidden bg-white text-slate-900 pt-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative min-h-[94vh] flex items-center justify-center overflow-hidden px-6 py-32 text-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_50%_-15%,_#dbeafe_0%,_transparent_72%)]" />
            <div className="animate-aurora absolute -top-48 left-1/2 h-[480px] w-[820px] rounded-full bg-blue-300/25 blur-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-blue-300/60 to-transparent" />
          </div>

          <div className="relative mx-auto max-w-4xl">
            <div className="animate-fade-up mb-9 inline-flex items-center gap-2.5 rounded-full border border-blue-200/70 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm shadow-blue-100/50 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-blue-600" />
              </span>
              Now live for medical institutes across Europe
            </div>

            <h1 className="animate-fade-up delay-100 mb-7 text-5xl font-bold leading-[1.07] tracking-tight md:text-[4.25rem] lg:text-[5rem]">
              Your clinic misses calls.<br />
              <span className="text-blue-600">RingLoop answers them.</span>
            </h1>

            <p className="animate-fade-up delay-200 mx-auto mb-10 max-w-lg text-lg text-slate-500 leading-relaxed md:text-xl">
              An AI receptionist that picks up every forwarded call, books the appointment by voice, and sends patients a WhatsApp reminder 24 hours before — automatically, 24/7.
            </p>

            <div className="animate-fade-up delay-300 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/contact" className="group rounded-full bg-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-200/80 hover:-translate-y-px transition-all duration-300">
                Book a free demo
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/how-it-works" className="rounded-full border border-slate-200 bg-white px-8 py-3.5 font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-all duration-300">
                See how it works
              </Link>
            </div>

            <p className="animate-fade-up delay-400 mt-5 text-sm text-slate-400">
              No contract &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; Setup in 24h &nbsp;·&nbsp; €200/month
            </p>

            <Link
              href="/demo"
              className="animate-fade-up delay-400 mt-7 inline-flex items-center gap-2.5 rounded-full border border-blue-100 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm hover:border-blue-300 hover:text-blue-700 transition-all duration-300"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                <Icon name="phone" className="h-3 w-3" />
              </span>
              Talk to her right now — live demo in your browser
            </Link>

            {/* Phone call mockup */}
            <div className="animate-fade-up delay-500 animate-float mx-auto mt-16 w-full max-w-[330px] overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-2xl shadow-blue-100/40 text-left">
              <div className="flex items-center gap-3 bg-[#1a1a2e] px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white"><Icon name="phone" className="h-4 w-4" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">Zagreb Dental Clinic</p>
                  <p className="text-xs text-blue-400">AI receptionist · live call</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-4 items-center gap-[3px]">
                    {[10, 16, 7, 13, 9].map((h, i) => (
                      <span
                        key={i}
                        className="wave-bar w-[3px] rounded-full bg-blue-400"
                        style={{ height: `${h}px`, animationDelay: `${i * 0.13}s` }}
                      />
                    ))}
                  </div>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                    <span className="relative h-2 w-2 rounded-full bg-green-400" />
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-4 space-y-3">
                {[
                  { from: "ai",     text: "Hello! Thank you for calling Zagreb Dental. What treatment are you looking for?" },
                  { from: "client", text: "Hi, I need a dental checkup." },
                  { from: "ai",     text: "Of course! May I have your full name?" },
                  { from: "client", text: "Marko Horvat." },
                  { from: "ai",     text: "Thanks Marko! What date and time works for you?" },
                  { from: "client", text: "Tomorrow at 10am." },
                  { from: "ai",     text: "✅ Booked! Dental checkup tomorrow at 10:00. You'll get a WhatsApp reminder. See you then!" },
                ].map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "client" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-[12px] leading-relaxed shadow-sm ${
                      msg.from === "ai"
                        ? "rounded-tl-sm bg-white text-slate-800 border border-slate-100"
                        : "rounded-tr-sm bg-blue-600 text-white"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────── */}
        <section className="border-y border-slate-100 bg-[#f8faff] py-14">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-8 px-6 md:grid-cols-4">
            {[
              { number: "62%",   label: "of missed calls never call back" },
              { number: "< 5s",  label: "AI picks up the call" },
              { number: "24/7",  label: "always available" },
              { number: "3×",    label: "more bookings per month" },
            ].map((stat, i) => (
              <div key={stat.label} data-reveal className={`r-delay-${i % 4 === 0 ? 1 : i % 4} text-center`}>
                <p className="mb-1.5 text-[2.4rem] font-bold tracking-tight text-blue-600 leading-none">{stat.number}</p>
                <p className="text-sm text-slate-500 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROBLEM ──────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-32">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div data-reveal>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-red-500">The problem</p>
              <h2 className="mb-5 text-4xl font-bold leading-[1.15] tracking-tight">Your clinic is losing patients every single day.</h2>
              <p className="mb-8 text-slate-500 leading-relaxed text-[1.05rem]">
                When a patient calls and nobody answers, they don&apos;t wait. They call the next clinic on Google. That&apos;s a lost patient — and lost revenue — every single time.
              </p>
              <ul className="space-y-4">
                {[
                  "62% of missed calls never call back",
                  "The average clinic misses 15–30 calls per month",
                  "Each missed call = €50–500 in lost treatment",
                  "Voicemail has less than 20% callback rate",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-500">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal className="r-delay-1 rounded-2xl border border-red-100/80 bg-red-50/50 p-8">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-red-500">Monthly loss calculator</p>
              <p className="mb-6 text-sm text-slate-500">For a clinic missing 20 calls/month</p>
              <div className="space-y-2">
                {[
                  { label: "Missed calls/month",            value: "20 calls", hi: false },
                  { label: "Average treatment value",       value: "€150",     hi: false },
                  { label: "Patients who don't call back",  value: "62% = 12", hi: false },
                  { label: "Monthly revenue lost",          value: "€1,800",   hi: true  },
                  { label: "Annual revenue lost",           value: "€21,600",  hi: true  },
                ].map((row) => (
                  <div key={row.label} className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${row.hi ? "bg-red-100/70 font-semibold" : "bg-white/70"}`}>
                    <span className="text-slate-600">{row.label}</span>
                    <span className={row.hi ? "text-red-600" : "font-medium text-slate-900"}>{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-slate-400">RingLoop pays for itself in the first recovered booking.</p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="divide-light-to-dark" />

        {/* ── SOLUTION ─────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#050c1e] py-32 text-white">
          <div className="dot-grid absolute inset-0 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,_rgba(37,99,235,0.22),_transparent)] pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-6">
            <div className="grid items-center gap-16 md:grid-cols-2">
              <div data-reveal>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-blue-400">The solution</p>
                <h2 className="mb-5 text-4xl font-bold leading-[1.15] tracking-tight">RingLoop answers every call. Even when you can&apos;t.</h2>
                <p className="mb-8 text-slate-400 leading-relaxed text-[1.05rem]">
                  Clinic forwards calls to RingLoop. Our AI picks up, has a natural voice conversation, and books the appointment. The patient gets a WhatsApp reminder 24 hours before they arrive.
                </p>
                <Link href="/how-it-works" className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300">
                  See exactly how it works
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { icon: "phone",         title: "Patient calls, no answer",       desc: "Call forwards to RingLoop in seconds" },
                  { icon: "bot",           title: "AI picks up and talks",          desc: "Natural voice conversation — sounds like a real receptionist" },
                  { icon: "calendarCheck", title: "Appointment booked by voice",    desc: "Collects name, treatment, doctor, and time" },
                  { icon: "message",       title: "WhatsApp reminder sent 24h before", desc: "Patient gets a reminder and can reply if they need to reschedule" },
                ].map((step, i) => (
                  <div key={step.title} data-reveal className={`r-delay-${(i % 3) + 1} flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300`}>
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                      <Icon name={step.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{step.title}</p>
                      <p className="text-sm text-slate-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="divide-dark-to-light" />

        {/* ── COMPARISON ───────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 pt-20 pb-32">
          <div data-reveal>
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Comparison</p>
            <h2 className="mb-5 text-center text-4xl font-bold tracking-tight">Why RingLoop?</h2>
            <p className="mb-16 text-center text-slate-500 text-[1.05rem]">See how RingLoop compares to traditional solutions.</p>
          </div>
          <div data-reveal className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm shadow-slate-100">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-6 py-5 text-left text-sm font-semibold text-slate-400">Feature</th>
                  <th className="px-6 py-5 text-center text-sm font-bold text-blue-600 bg-blue-50/60">RingLoop</th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-slate-400">Receptionist</th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-slate-400">Voicemail</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Available 24/7",                    rl: true,   rec: false, vm: true  },
                  { feature: "Answers calls instantly",           rl: true,   rec: false, vm: true  },
                  { feature: "Books appointments automatically",  rl: true,   rec: true,  vm: false },
                  { feature: "Sends 24h appointment reminders",   rl: true,   rec: false, vm: false },
                  { feature: "Multi-language support",            rl: true,   rec: false, vm: false },
                  { feature: "No salary or sick days",            rl: true,   rec: false, vm: true  },
                  { feature: "Monthly cost",                      rl: "€200", rec: "€1,500+", vm: "€0" },
                ].map((row, i) => (
                  <tr key={row.feature} className={`transition-colors duration-200 hover:bg-blue-50/20 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                    <td className="px-6 py-5 text-sm font-medium text-slate-700">{row.feature}</td>
                    <td className="px-6 py-5 text-center bg-blue-50/30">
                      {typeof row.rl === "boolean" ? <Check ok={row.rl} /> : <span className="font-bold text-blue-600 text-sm">{row.rl}</span>}
                    </td>
                    <td className="px-6 py-5 text-center">
                      {typeof row.rec === "boolean" ? <Check ok={row.rec} /> : <span className="text-sm text-slate-500">{row.rec}</span>}
                    </td>
                    <td className="px-6 py-5 text-center">
                      {typeof row.vm === "boolean" ? <Check ok={row.vm} /> : <span className="text-sm text-slate-500">{row.vm}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Divider */}
        <div className="divide-light-to-dark" />

        {/* ── FEATURES ─────────────────────────────────────── */}
        <section id="features" className="relative overflow-hidden bg-[#050c1e] py-32 text-white">
          <div className="dot-grid absolute inset-0 pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-6">
            <div data-reveal>
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Features</p>
              <h2 className="mb-4 text-center text-4xl font-bold tracking-tight">Everything your clinic needs.</h2>
              <p className="mb-14 text-center text-slate-400 text-[1.05rem]">Built specifically for medical institutes.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {[
                { icon: "phone",         title: "AI voice receptionist",  desc: "Answers every forwarded call and has a natural booking conversation." },
                { icon: "sparkles",      title: "Advanced AI",            desc: "Understands any language, any phrasing, any medical request." },
                { icon: "calendarCheck", title: "Auto booking",           desc: "Collects all booking details and confirms the appointment by voice." },
                { icon: "message",       title: "WhatsApp reminders",     desc: "Sends patients a reminder 24 hours before their appointment." },
                { icon: "clinic",        title: "Custom AI persona",      desc: "The AI introduces itself as your clinic — not as RingLoop." },
                { icon: "globe",         title: "Multi-language",         desc: "Croatian, English, German — whatever the patient speaks." },
                { icon: "user",          title: "Doctor preference",      desc: "Asks if the patient has a preferred doctor before booking." },
                { icon: "clipboard",     title: "Patient summaries",      desc: "After every booking, your team gets a full patient summary." },
                { icon: "sync",          title: "Calendar sync",          desc: "Bookings can be pushed to Google Calendar automatically." },
              ].map((f, i) => (
                <div key={f.title} data-reveal className={`r-delay-${(i % 3) + 1} rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-blue-500/25 hover:bg-white/8 transition-all duration-300`}>
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                    <Icon name={f.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mb-1.5 font-semibold text-white">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="divide-dark-to-light" />

        {/* ── INDUSTRIES ───────────────────────────────────── */}
        <section id="industries" className="mx-auto max-w-5xl px-6 pt-20 pb-32">
          <div data-reveal>
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Industries</p>
            <h2 className="mb-4 text-center text-4xl font-bold tracking-tight">Built for every medical institute.</h2>
            <p className="mb-14 text-center text-slate-500">If your clinic takes appointments, RingLoop works for you.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: "tooth",       name: "Dental Clinics",        desc: "Cleanings, checkups, whitening, implants" },
              { icon: "syringe",     name: "Aesthetic Clinics",     desc: "Botox, fillers, skin treatments, laser" },
              { icon: "stethoscope", name: "General Practices",     desc: "GP visits, specialist referrals, checkups" },
              { icon: "eye",         name: "Ophthalmology",         desc: "Eye exams, vision correction, surgery" },
              { icon: "bone",        name: "Physiotherapy",         desc: "Rehab, injury treatment, sports medicine" },
              { icon: "smile",       name: "Psychiatry & Therapy",  desc: "Mental health, counseling, psychotherapy" },
              { icon: "heartPulse",  name: "Cardiology",            desc: "Heart checkups, ECG, consultations" },
              { icon: "droplet",     name: "Dermatology",           desc: "Skin conditions, mole checks, cosmetic" },
              { icon: "baby",        name: "Pediatrics",            desc: "Child health, vaccinations, development" },
            ].map((ind, i) => (
              <div key={ind.name} data-reveal className={`r-delay-${(i % 3) + 1} rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:bg-blue-50/40 hover:-translate-y-0.5 transition-all duration-300`}>
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon name={ind.icon} className="h-5.5 w-5.5" />
                </span>
                <h3 className="mb-1 font-semibold text-slate-900">{ind.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-slate-400">
            Not in the list?{" "}
            <Link href="/contact" className="text-blue-600 underline underline-offset-2 hover:text-blue-700 transition-colors">Contact us</Link>
            {" "}— RingLoop works for any appointment-based business.
          </p>
        </section>

        {/* ── WHAT CLINICS CAN EXPECT ──────────────────────── */}
        <section className="bg-[#f8faff] border-y border-slate-100/80 py-32">
          <div className="mx-auto max-w-5xl px-6">
            <div data-reveal>
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">What to expect</p>
              <h2 className="mb-4 text-center text-4xl font-bold tracking-tight">What clinics can expect.</h2>
              <p className="mb-14 text-center text-slate-500 text-[1.05rem]">From the very first forwarded call.</p>
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
                  metric: "Fewer",
                  metricLabel: "no-shows",
                  desc: "Patients receive an automatic WhatsApp reminder 24 hours before their visit — and can reply if they need to reschedule.",
                },
              ].map((c, i) => (
                <div
                  key={c.metric + c.metricLabel}
                  data-reveal
                  className={`r-delay-${i + 1} flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon name={c.icon} className="h-5.5 w-5.5" />
                  </span>
                  <p className="text-2xl font-bold tracking-tight leading-tight">
                    <span className="text-blue-600">{c.metric}</span> {c.metricLabel}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
            <p data-reveal className="mt-10 text-center text-sm text-slate-400">
              Want to hear it for yourself?{" "}
              <Link href="/contact" className="text-blue-600 underline underline-offset-2 hover:text-blue-700 transition-colors">Book a free demo</Link>
              {" "}and we&apos;ll call you live.
            </p>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-3xl px-6 py-32">
          <div data-reveal>
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">FAQ</p>
            <h2 className="mb-14 text-center text-4xl font-bold tracking-tight">Common questions</h2>
          </div>
          <div data-reveal className="divide-y divide-slate-100">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group py-6 cursor-pointer">
                <summary className="flex items-center justify-between gap-4 text-base font-semibold text-slate-900 list-none [&::-webkit-details-marker]:hidden select-none">
                  {q}
                  <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-300 group-open:rotate-45">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed pr-8">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="divide-light-to-dark" />

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#050c1e] py-32 text-white text-center">
          <div className="dot-grid absolute inset-0 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_110%,_rgba(37,99,235,0.28),_transparent)] pointer-events-none" />
          <div className="animate-aurora pointer-events-none absolute -bottom-48 left-1/2 h-[420px] w-[760px] rounded-full bg-blue-500/15 blur-3xl" />
          <div data-reveal className="relative mx-auto max-w-2xl px-6">
            <h2 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">Ready to stop losing patients?</h2>
            <p className="mb-10 text-lg text-slate-400 leading-relaxed">Book a free 20-minute demo and hear your AI receptionist answer a live call.</p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/contact" className="group rounded-full bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-900/50 hover:bg-blue-500 hover:shadow-xl hover:-translate-y-px transition-all duration-300">
                Book a free demo
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/pricing" className="rounded-full border border-white/20 px-8 py-4 font-semibold text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300">
                See pricing
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-500">No contract &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; Setup in 24h</p>
            <p className="mt-3 text-sm text-slate-500">
              Or{" "}
              <Link href="/demo" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">talk to her right now</Link>
              {" "}— live in your browser.
            </p>
          </div>
        </section>

      </main>
  );
}

function Check({ ok }: { ok: boolean }) {
  return ok
    ? <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600">✓</span>
    : <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-500">✕</span>;
}
