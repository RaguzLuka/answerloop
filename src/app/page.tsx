import Link from "next/link";

export default function Home() {
  return (
      <main className="overflow-x-hidden bg-white text-slate-900 pt-16">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative min-h-[94vh] flex items-center justify-center overflow-hidden px-6 py-32 text-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_50%_-15%,_#dbeafe_0%,_transparent_72%)]" />
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
              <span className="text-blue-600">RingLoop books them.</span>
            </h1>

            <p className="animate-fade-up delay-200 mx-auto mb-10 max-w-lg text-lg text-slate-500 leading-relaxed md:text-xl">
              An AI receptionist that follows up every missed call on WhatsApp, qualifies the patient, and books the appointment — automatically, 24/7.
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

            {/* WhatsApp chat mockup */}
            <div className="animate-fade-up delay-500 animate-float mx-auto mt-16 w-full max-w-[330px] overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-2xl shadow-blue-100/40 text-left">
              <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white text-xs font-bold">ZD</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">Zagreb Dental Clinic</p>
                  <p className="text-xs text-emerald-300">online</p>
                </div>
              </div>
              <div className="bg-[#ECE5DD] px-4 py-4 space-y-2">
                {[
                  { from: "ai",     text: "Hi! Sorry we missed your call. This is Zagreb Dental — how can we help? 😊" },
                  { from: "client", text: "I need a dental checkup." },
                  { from: "ai",     text: "Of course! May I have your name?" },
                  { from: "client", text: "Marko Horvat" },
                  { from: "ai",     text: "Thanks Marko! Any preferred doctor?" },
                  { from: "client", text: "No preference." },
                  { from: "ai",     text: "When works for you?" },
                  { from: "client", text: "Tomorrow at 10am." },
                  { from: "ai",     text: "✅ Booked! Tomorrow at 10:00. See you then, Marko!" },
                ].map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "client" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-[12.5px] leading-relaxed shadow-sm ${
                      msg.from === "ai" ? "rounded-tl-sm bg-white text-slate-800" : "rounded-tr-sm bg-[#DCF8C6] text-slate-800"
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
              { number: "< 30s", label: "AI response time" },
              { number: "24/7",  label: "always available" },
              { number: "3×",    label: "more bookings per month" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="mb-1.5 text-[2.4rem] font-bold tracking-tight text-blue-600 leading-none">{stat.number}</p>
                <p className="text-sm text-slate-500 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROBLEM ──────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-32">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
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
            <div className="rounded-2xl border border-red-100/80 bg-red-50/50 p-8">
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
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-blue-400">The solution</p>
                <h2 className="mb-5 text-4xl font-bold leading-[1.15] tracking-tight">RingLoop answers every call. Even when you can&apos;t.</h2>
                <p className="mb-8 text-slate-400 leading-relaxed text-[1.05rem]">
                  When a patient calls and nobody answers, RingLoop automatically sends them a WhatsApp message within 30 seconds. The AI has a natural conversation, collects all booking details, and confirms the appointment.
                </p>
                <Link href="/how-it-works" className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300">
                  See exactly how it works
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { icon: "📞", title: "Patient calls, no answer",    desc: "Call forwarding triggers RingLoop instantly" },
                  { icon: "💬", title: "AI sends WhatsApp in 30s",    desc: "Patient receives a message from your clinic" },
                  { icon: "🤖", title: "AI handles the conversation", desc: "Collects name, treatment, doctor, time" },
                  { icon: "✅", title: "Appointment confirmed",       desc: "Booking appears in your calendar automatically" },
                ].map((step) => (
                  <div key={step.title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                    <span className="text-xl leading-none mt-0.5">{step.icon}</span>
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
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Comparison</p>
          <h2 className="mb-5 text-center text-4xl font-bold tracking-tight">Why RingLoop?</h2>
          <p className="mb-16 text-center text-slate-500 text-[1.05rem]">See how RingLoop compares to traditional solutions.</p>
          <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm shadow-slate-100">
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
                  { feature: "Available 24/7",                   rl: true,   rec: false, vm: true  },
                  { feature: "Responds in 30 seconds",           rl: true,   rec: false, vm: false },
                  { feature: "Books appointments automatically", rl: true,   rec: true,  vm: false },
                  { feature: "Multi-language support",           rl: true,   rec: false, vm: false },
                  { feature: "Never misses a call",              rl: true,   rec: false, vm: true  },
                  { feature: "No salary or sick days",           rl: true,   rec: false, vm: true  },
                  { feature: "Monthly cost",                     rl: "€200", rec: "€1,500+", vm: "€0" },
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
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Features</p>
            <h2 className="mb-4 text-center text-4xl font-bold tracking-tight">Everything your clinic needs.</h2>
            <p className="mb-14 text-center text-slate-400 text-[1.05rem]">Built specifically for medical institutes.</p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {[
                { icon: "💬", title: "WhatsApp & SMS",      desc: "Follows up on the channel your patients already use daily." },
                { icon: "🤖", title: "AI conversation",     desc: "Understands any language, any phrasing, any medical request." },
                { icon: "📅", title: "Auto booking",        desc: "Collects all booking details and confirms the appointment." },
                { icon: "🏥", title: "Custom AI persona",   desc: "The AI introduces itself as your clinic — not as RingLoop." },
                { icon: "🌍", title: "Multi-language",      desc: "Croatian, English, German — whatever the patient writes." },
                { icon: "👨‍⚕️", title: "Doctor preference", desc: "Asks if the patient has a preferred doctor before booking." },
                { icon: "🔔", title: "Missed call trigger", desc: "Every missed call gets a follow-up. No patient left behind." },
                { icon: "📋", title: "Patient summaries",   desc: "After every booking, your team gets a clear patient summary." },
                { icon: "📆", title: "Calendar sync",       desc: "Bookings appear in Google Calendar automatically." },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-blue-500/25 hover:bg-white/8 transition-all duration-300">
                  <p className="mb-3 text-2xl">{f.icon}</p>
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
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Industries</p>
          <h2 className="mb-4 text-center text-4xl font-bold tracking-tight">Built for every medical institute.</h2>
          <p className="mb-14 text-center text-slate-500">If your clinic takes appointments, RingLoop works for you.</p>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: "🦷", name: "Dental Clinics",        desc: "Cleanings, checkups, whitening, implants" },
              { icon: "💉", name: "Aesthetic Clinics",     desc: "Botox, fillers, skin treatments, laser" },
              { icon: "🏥", name: "General Practices",     desc: "GP visits, specialist referrals, checkups" },
              { icon: "👁️", name: "Ophthalmology",        desc: "Eye exams, vision correction, surgery" },
              { icon: "🦴", name: "Physiotherapy",         desc: "Rehab, injury treatment, sports medicine" },
              { icon: "🧠", name: "Psychiatry & Therapy",  desc: "Mental health, counseling, psychotherapy" },
              { icon: "❤️", name: "Cardiology",            desc: "Heart checkups, ECG, consultations" },
              { icon: "🧴", name: "Dermatology",           desc: "Skin conditions, mole checks, cosmetic" },
              { icon: "👶", name: "Pediatrics",            desc: "Child health, vaccinations, development" },
            ].map((ind) => (
              <div key={ind.name} className="rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:bg-blue-50/40 hover:-translate-y-0.5 transition-all duration-300">
                <span className="mb-2.5 block text-3xl">{ind.icon}</span>
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

        {/* ── TESTIMONIALS ─────────────────────────────────── */}
        <section className="bg-[#f8faff] border-y border-slate-100/80 py-32">
          <div className="mx-auto max-w-5xl px-6">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Testimonials</p>
            <h2 className="mb-14 text-center text-4xl font-bold tracking-tight">Clinics love RingLoop.</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { quote: "We were missing 20+ calls a month. RingLoop turned most of them into booked appointments. It paid for itself in the first week.", name: "Dr. Ana K.", role: "Dental Clinic, Zagreb", initials: "AK" },
                { quote: "Our patients love how fast they get a response. The AI is professional, polite, and books correctly every time.", name: "Dr. Marko P.", role: "Aesthetic Clinic, Split", initials: "MP" },
                { quote: "Setup took less than a day. We didn't have to change our number or anything. Just works perfectly in the background.", name: "Dr. Ivan R.", role: "General Practice, Rijeka", initials: "IR" },
              ].map((t) => (
                <div key={t.name} className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-[15px]">★</span>)}</div>
                  <p className="flex-1 text-sm text-slate-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{t.initials}</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-3xl px-6 py-32">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">FAQ</p>
          <h2 className="mb-14 text-center text-4xl font-bold tracking-tight">Common questions</h2>
          <div className="divide-y divide-slate-100">
            {[
              {
                q: "Do I need a new phone number?",
                a: "No. You keep your existing clinic number and set up call forwarding — takes about 2 minutes. RingLoop works silently in the background whenever a call goes unanswered.",
              },
              {
                q: "How long does setup take?",
                a: "Most clinics are live within 24 hours. We handle the AI configuration, WhatsApp number setup, and onboarding. You just flip the call forwarding switch.",
              },
              {
                q: "What if the patient doesn't have WhatsApp?",
                a: "WhatsApp has over 2 billion users and is the primary messaging app in Croatia and across Europe. In the rare case a patient doesn't have it, they simply won't receive the follow-up — your clinic is no worse off than before.",
              },
              {
                q: "Is it GDPR compliant?",
                a: "Yes. RingLoop processes data under legitimate interest and contract performance (Art. 6 GDPR). All third-party processors — Twilio, Anthropic, Vercel — operate under Standard Contractual Clauses. See our Privacy Policy for full details.",
              },
              {
                q: "What languages does the AI speak?",
                a: "Any language your patients write in. Croatian, English, German, Italian, Slovenian — the AI responds in whatever language the patient uses, automatically.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. No contract, no minimum term. Cancel before the next billing date and you won't be charged. We're confident you'll stay because the results speak for themselves.",
              },
            ].map(({ q, a }) => (
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
          <div className="relative mx-auto max-w-2xl px-6">
            <h2 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">Ready to stop losing patients?</h2>
            <p className="mb-10 text-lg text-slate-400 leading-relaxed">Book a free 20-minute demo and see exactly how RingLoop works for your clinic.</p>
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
