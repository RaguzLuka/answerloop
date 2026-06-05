import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────
   RingLoop — Landing page (redesigned)
───────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      <Nav />
      <main className="overflow-x-hidden bg-white text-[#09090f] pt-16">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-6 py-28 text-center">
          {/* Layered background */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_#dbeafe_0%,_transparent_70%)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
          </div>

          <div className="relative mx-auto max-w-5xl">
            {/* Badge */}
            <div className="animate-fade-up mb-8 inline-flex items-center gap-2.5 rounded-full border border-blue-200/80 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm shadow-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-blue-600" />
              </span>
              Now live for medical institutes across Europe
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up delay-100 mb-6 text-5xl font-bold leading-[1.08] tracking-tight md:text-[4.5rem] lg:text-[5.25rem]">
              Your clinic misses calls.<br />
              <span className="text-blue-600">RingLoop books them.</span>
            </h1>

            {/* Sub */}
            <p className="animate-fade-up delay-200 mx-auto mb-10 max-w-xl text-lg text-gray-500 md:text-xl leading-relaxed">
              An AI receptionist that follows up every missed call via WhatsApp, qualifies the patient, and books the appointment — automatically, 24/7.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up delay-300 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="group rounded-full bg-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-200 transition-all duration-200"
              >
                Book a free demo
                <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-full border border-gray-200 bg-white px-8 py-3.5 font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                See how it works
              </Link>
            </div>

            <p className="animate-fade-up delay-400 mt-5 text-sm text-gray-400">
              No contract &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; Setup in 24h &nbsp;·&nbsp; €200/month
            </p>

            {/* Chat UI mockup */}
            <div className="animate-fade-up delay-500 animate-float mx-auto mt-16 w-full max-w-[340px] rounded-[28px] bg-white shadow-2xl shadow-blue-100/60 overflow-hidden border border-gray-100 text-left">
              {/* WhatsApp-style header */}
              <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white text-xs font-bold shrink-0">ZD</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">Zagreb Dental Clinic</p>
                  <p className="text-xs text-green-200">online</p>
                </div>
                <svg className="h-5 w-5 text-white/70" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>

              {/* Chat background */}
              <div className="bg-[#ECE5DD] px-4 py-4 space-y-2.5 min-h-[280px]">
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
                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                        msg.from === "ai"
                          ? "rounded-tl-sm bg-white text-gray-800"
                          : "rounded-tr-sm bg-[#DCF8C6] text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────── */}
        <section className="border-y border-gray-100 bg-gray-50/60 py-12">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-8 gap-x-4 px-6 md:grid-cols-4">
            {[
              { number: "62%",  label: "of missed calls never call back" },
              { number: "< 30s", label: "AI response time after missed call" },
              { number: "24/7",  label: "always available, every day" },
              { number: "3×",    label: "more bookings per month" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="mb-1 text-4xl font-bold tracking-tight text-blue-600">{stat.number}</p>
                <p className="text-sm text-gray-500 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROBLEM ──────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-28">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-red-500">The problem</p>
              <h2 className="mb-5 text-4xl font-bold leading-[1.15] tracking-tight">
                Your clinic is losing patients every single day.
              </h2>
              <p className="mb-7 text-gray-500 leading-relaxed">
                When a patient calls and nobody answers, they don&apos;t wait. They call the next clinic on Google. That&apos;s a lost patient — and lost revenue — every single time.
              </p>
              <ul className="space-y-3.5">
                {[
                  "62% of missed calls never call back",
                  "The average clinic misses 15–30 calls per month",
                  "Each missed call = €50–500 in lost treatment",
                  "Voicemail has less than 20% callback rate",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-500">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Calculator card */}
            <div className="rounded-2xl border border-red-100 bg-red-50/60 p-8">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-red-500">Monthly loss calculator</p>
              <p className="mb-6 text-sm text-gray-500">For a clinic missing 20 calls/month</p>
              <div className="space-y-2.5">
                {[
                  { label: "Missed calls/month",        value: "20 calls",    hi: false },
                  { label: "Average treatment value",   value: "€150",        hi: false },
                  { label: "Patients who don't call back", value: "62% = 12", hi: false },
                  { label: "Monthly revenue lost",      value: "€1,800",      hi: true  },
                  { label: "Annual revenue lost",       value: "€21,600",     hi: true  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${
                      row.hi ? "bg-red-100/80 font-semibold" : "bg-white/80"
                    }`}
                  >
                    <span className="text-gray-600">{row.label}</span>
                    <span className={row.hi ? "text-red-600" : "font-medium text-gray-900"}>{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-400">RingLoop pays for itself in the first recovered booking.</p>
            </div>
          </div>
        </section>

        {/* ── SOLUTION ─────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#060e1f] py-28 text-white">
          <div className="dot-grid absolute inset-0 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,_rgba(37,99,235,0.25),_transparent)] pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-6">
            <div className="grid items-center gap-16 md:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-blue-400">The solution</p>
                <h2 className="mb-5 text-4xl font-bold leading-[1.15] tracking-tight">
                  RingLoop answers every call. Even when you can&apos;t.
                </h2>
                <p className="mb-8 text-gray-400 leading-relaxed">
                  When a patient calls and nobody answers, RingLoop automatically sends them a WhatsApp message within 30 seconds. The AI has a full conversation, collects all booking details, and confirms the appointment.
                </p>
                <Link
                  href="/how-it-works"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20 transition-all duration-200"
                >
                  See exactly how it works
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { icon: "📞", title: "Patient calls, no answer",      desc: "Call forwarding triggers RingLoop instantly" },
                  { icon: "💬", title: "AI sends WhatsApp in 30s",      desc: "Patient receives a message from your clinic" },
                  { icon: "🤖", title: "AI handles the conversation",   desc: "Collects name, treatment, doctor, time" },
                  { icon: "✅", title: "Appointment confirmed",         desc: "Booking appears in your calendar automatically" },
                ].map((step) => (
                  <div
                    key={step.title}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-all duration-200"
                  >
                    <span className="text-2xl">{step.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{step.title}</p>
                      <p className="text-sm text-gray-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── COMPARISON ───────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-28">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Comparison</p>
          <h2 className="mb-4 text-center text-4xl font-bold tracking-tight">Why RingLoop?</h2>
          <p className="mb-14 text-center text-gray-500">See how RingLoop compares to traditional solutions.</p>

          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="p-5 text-left text-sm font-semibold text-gray-400">Feature</th>
                  <th className="p-5 text-center text-sm font-bold text-blue-600 bg-blue-50">RingLoop</th>
                  <th className="p-5 text-center text-sm font-semibold text-gray-400">Receptionist</th>
                  <th className="p-5 text-center text-sm font-semibold text-gray-400">Voicemail</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Available 24/7",                   rl: true,    rec: false, vm: true  },
                  { feature: "Responds in 30 seconds",           rl: true,    rec: false, vm: false },
                  { feature: "Books appointments automatically", rl: true,    rec: true,  vm: false },
                  { feature: "Multi-language support",           rl: true,    rec: false, vm: false },
                  { feature: "Never misses a call",              rl: true,    rec: false, vm: true  },
                  { feature: "No salary or sick days",           rl: true,    rec: false, vm: true  },
                  { feature: "Monthly cost",                     rl: "€200",  rec: "€1,500+", vm: "€0" },
                ].map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="p-5 text-sm font-medium text-gray-700">{row.feature}</td>
                    <td className="p-5 text-center bg-blue-50/40">
                      {typeof row.rl === "boolean"
                        ? <Check ok={row.rl} />
                        : <span className="font-bold text-blue-600 text-sm">{row.rl}</span>}
                    </td>
                    <td className="p-5 text-center">
                      {typeof row.rec === "boolean"
                        ? <Check ok={row.rec} />
                        : <span className="text-sm text-gray-500">{row.rec}</span>}
                    </td>
                    <td className="p-5 text-center">
                      {typeof row.vm === "boolean"
                        ? <Check ok={row.vm} />
                        : <span className="text-sm text-gray-500">{row.vm}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────── */}
        <section id="features" className="relative overflow-hidden bg-[#060e1f] py-28 text-white">
          <div className="dot-grid absolute inset-0 pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-6">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Features</p>
            <h2 className="mb-4 text-center text-4xl font-bold tracking-tight">Everything your clinic needs.</h2>
            <p className="mb-14 text-center text-gray-400">Built specifically for medical institutes.</p>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                { icon: "💬", title: "WhatsApp & SMS",       desc: "Follows up on the channel your patients already use daily." },
                { icon: "🤖", title: "AI conversation",      desc: "Understands any language, any phrasing, any medical request." },
                { icon: "📅", title: "Auto booking",         desc: "Collects all booking details and confirms the appointment." },
                { icon: "🏥", title: "Custom AI persona",    desc: "The AI introduces itself as your clinic — not as RingLoop." },
                { icon: "🌍", title: "Multi-language",       desc: "Croatian, English, German — whatever the patient writes." },
                { icon: "👨‍⚕️", title: "Doctor preference",  desc: "Asks if the patient has a preferred doctor before booking." },
                { icon: "🔔", title: "Missed call trigger",  desc: "Every missed call gets a follow-up. No patient left behind." },
                { icon: "📋", title: "Patient summaries",    desc: "After every booking, your team gets a clear patient summary." },
                { icon: "📆", title: "Calendar integration", desc: "Bookings appear in Google Calendar automatically." },
              ].map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-200"
                >
                  <p className="mb-3 text-2xl">{f.icon}</p>
                  <h3 className="mb-1.5 font-semibold">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INDUSTRIES ───────────────────────────────────── */}
        <section id="industries" className="mx-auto max-w-5xl px-6 py-28">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Industries</p>
          <h2 className="mb-4 text-center text-4xl font-bold tracking-tight">Built for every medical institute.</h2>
          <p className="mb-14 text-center text-gray-500">If your clinic takes appointments, RingLoop works for you.</p>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: "🦷", name: "Dental Clinics",      desc: "Cleanings, checkups, whitening, implants" },
              { icon: "💉", name: "Aesthetic Clinics",   desc: "Botox, fillers, skin treatments, laser" },
              { icon: "🏥", name: "General Practices",   desc: "GP visits, specialist referrals, checkups" },
              { icon: "👁️", name: "Ophthalmology",      desc: "Eye exams, vision correction, surgery" },
              { icon: "🦴", name: "Physiotherapy",       desc: "Rehab, injury treatment, sports medicine" },
              { icon: "🧠", name: "Psychiatry & Therapy",desc: "Mental health, counseling, psychotherapy" },
              { icon: "❤️", name: "Cardiology",          desc: "Heart checkups, ECG, consultations" },
              { icon: "🧴", name: "Dermatology",         desc: "Skin conditions, mole checks, cosmetic" },
              { icon: "👶", name: "Pediatrics",          desc: "Child health, vaccinations, development" },
            ].map((ind) => (
              <div
                key={ind.name}
                className="group rounded-2xl border border-gray-100 p-5 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200"
              >
                <span className="mb-2 block text-3xl">{ind.icon}</span>
                <h3 className="mb-1 font-semibold">{ind.name}</h3>
                <p className="text-sm text-gray-500">{ind.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-gray-400">
            Not in the list?{" "}
            <Link href="/contact" className="text-blue-600 underline underline-offset-2 hover:text-blue-700">
              Contact us
            </Link>{" "}
            — RingLoop works for any appointment-based business.
          </p>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────── */}
        <section className="bg-gray-50/80 border-y border-gray-100 py-28">
          <div className="mx-auto max-w-5xl px-6">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Testimonials</p>
            <h2 className="mb-14 text-center text-4xl font-bold tracking-tight">Clinics love RingLoop.</h2>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  quote: "We were missing 20+ calls a month. RingLoop turned most of them into booked appointments. It paid for itself in the first week.",
                  name: "Dr. Ana K.",
                  role: "Dental Clinic, Zagreb",
                  initials: "AK",
                },
                {
                  quote: "Our patients love how fast they get a response. The AI is professional, polite, and books correctly every time.",
                  name: "Dr. Marko P.",
                  role: "Aesthetic Clinic, Split",
                  initials: "MP",
                },
                {
                  quote: "Setup took less than a day. We didn't have to change our number or anything. Just works perfectly in the background.",
                  name: "Dr. Ivan R.",
                  role: "General Practice, Rijeka",
                  initials: "IR",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-base">★</span>
                    ))}
                  </div>
                  <p className="flex-1 text-sm text-gray-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#060e1f] py-28 text-white text-center">
          <div className="dot-grid absolute inset-0 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,_rgba(37,99,235,0.3),_transparent)] pointer-events-none" />
          <div className="relative mx-auto max-w-2xl px-6">
            <h2 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">
              Ready to stop losing patients?
            </h2>
            <p className="mb-10 text-lg text-gray-400">
              Book a free 20-minute demo and see exactly how RingLoop works for your clinic.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="group rounded-full bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-900/50 transition-all duration-200"
              >
                Book a free demo
                <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-white/20 px-8 py-4 font-semibold text-white hover:border-white/40 hover:bg-white/5 transition-all duration-200"
              >
                See pricing
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">No contract &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; Setup in 24h</p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

/* ── Tiny helper ─────────────────────────────────────── */
function Check({ ok }: { ok: boolean }) {
  return ok
    ? <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-[10px] font-bold text-green-600">✓</span>
    : <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-500">✕</span>;
}
