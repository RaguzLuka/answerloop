import Link from "next/link";

export const metadata = {
  title: "How It Works — RingLoop",
  description: "Learn exactly how RingLoop answers calls by voice, books appointments, and sends WhatsApp reminders.",
};

export default function HowItWorks() {
  return (
      <main className="pt-16">

        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-24 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,_#dbeafe,_transparent)]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">How it works</p>
            <h1 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl">Simple setup.<br />Powerful results.</h1>
            <p className="text-lg text-gray-500 leading-relaxed">From forwarded call to confirmed appointment — here&apos;s exactly what happens.</p>
          </div>
        </section>

        {/* Steps */}
        <section className="mx-auto max-w-4xl px-6 py-16 space-y-24">
          {[
            {
              step: "01",
              title: "Patient calls your clinic",
              desc: "A patient calls your clinic's existing phone number. Your staff is busy or unavailable — nobody picks up. Without RingLoop, this patient would hang up and call a competitor.",
              detail: "RingLoop works with your existing number. You set up call forwarding in your phone settings — when a call goes unanswered after a few rings, it forwards to RingLoop. No number change. No technical work.",
              preview: (
                <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 text-sm space-y-2">
                  <p className="text-gray-700">📞 Incoming call to <strong>Zagreb Dental Clinic</strong></p>
                  <p className="text-red-500 font-medium">✕ No answer — forwarding to RingLoop AI</p>
                </div>
              ),
            },
            {
              step: "02",
              title: "AI picks up the call within seconds",
              desc: "RingLoop answers immediately — no hold music, no voicemail. The AI greets the patient using your clinic's name and begins the booking conversation naturally.",
              detail: "The AI voice is warm and professional. It introduces itself as your clinic's receptionist — patients interact with it like they would a real person. The conversation is powered by advanced AI that understands natural speech in any language.",
              preview: (
                <div className="space-y-2">
                  <div className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-white max-w-[90%]">
                    <p className="text-xs text-slate-400 mb-1">🤖 AI Receptionist</p>
                    &ldquo;Hello! Thank you for calling Zagreb Dental. I&apos;m here to help you book an appointment. What treatment are you looking for?&rdquo;
                  </div>
                  <p className="text-xs text-gray-400 pl-1">Answered in 4 seconds ✓</p>
                </div>
              ),
            },
            {
              step: "03",
              title: "AI has a full booking conversation",
              desc: "The AI collects everything needed to book the appointment: what treatment, the patient's name, their preferred date and time, and whether they have a preferred doctor.",
              detail: "The conversation is completely natural — the AI handles follow-up questions, understands different phrasings, and responds in the same language the patient speaks (Croatian, English, German, and more).",
              preview: (
                <div className="space-y-2">
                  {[
                    { from: "ai",     text: "What treatment are you looking for?" },
                    { from: "client", text: "Dental checkup please." },
                    { from: "ai",     text: "Of course! May I have your full name?" },
                    { from: "client", text: "Marko Horvat." },
                    { from: "ai",     text: "What date and time works for you?" },
                    { from: "client", text: "Tomorrow at 10am." },
                    { from: "ai",     text: "Any preferred doctor, or is any doctor fine?" },
                    { from: "client", text: "Any is fine." },
                  ].map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === "client" ? "justify-end" : ""}`}>
                      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${msg.from === "ai" ? "bg-white shadow-sm border border-gray-100 text-gray-800" : "bg-blue-600 text-white"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              step: "04",
              title: "Appointment confirmed by voice",
              desc: "Once all details are collected, the AI confirms the booking clearly, tells the patient what to expect, and lets them know they can call back or WhatsApp if they need anything.",
              detail: "Your team receives a full patient summary instantly — name, treatment, doctor preference, and confirmed time. Bookings can also be pushed to Google Calendar automatically.",
              preview: (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-white max-w-[95%]">
                    <p className="text-xs text-slate-400 mb-1">🤖 AI Receptionist</p>
                    &ldquo;✅ Booked! Dental checkup tomorrow at 10:00. You&apos;ll get a WhatsApp reminder. If you need anything, call us back or message on WhatsApp. See you then, Marko!&rdquo;
                  </div>
                  <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-xs">
                    <p className="font-semibold text-green-700 mb-1.5">📅 Booking logged</p>
                    <p className="text-green-600">Marko Horvat — Dental checkup</p>
                    <p className="text-green-600">Tomorrow 10:00 · Any doctor</p>
                  </div>
                </div>
              ),
            },
            {
              step: "05",
              title: "WhatsApp reminder sent 24 hours before",
              desc: "The patient automatically receives a WhatsApp message 24 hours before their appointment with all the details. They can reply to reschedule or ask questions.",
              detail: "The reminder is sent from a WhatsApp Business number registered under your clinic's name. Patients see your clinic — not RingLoop. It's a professional, automatic touchpoint that reduces no-shows.",
              preview: (
                <div className="space-y-2">
                  <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 text-sm text-gray-800 max-w-[90%]">
                    <p className="text-xs text-gray-400 mb-2">Zagreb Dental Clinic · WhatsApp</p>
                    Hi Marko! 👋 Reminder from Zagreb Dental.<br /><br />
                    Your appointment is tomorrow:<br />
                    📋 Dental checkup<br />
                    🕐 10:00<br /><br />
                    Need to reschedule? Just reply here. See you tomorrow!
                  </div>
                  <p className="text-xs text-gray-400 pl-1">Sent automatically 24h before ✓</p>
                </div>
              ),
            },
          ].map((s, i) => (
            <div key={s.step} data-reveal className="grid items-center gap-12 md:grid-cols-2">
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <p className="mb-2 text-7xl font-bold text-blue-100 leading-none">{s.step}</p>
                <h2 className="mb-4 text-2xl font-bold tracking-tight">{s.title}</h2>
                <p className="mb-4 text-gray-600 leading-relaxed">{s.desc}</p>
                <p className="border-l-2 border-blue-200 pl-4 text-sm text-gray-400 leading-relaxed">{s.detail}</p>
              </div>
              <div className={`rounded-2xl border border-gray-100 bg-gray-50/80 p-7 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">{s.step}</div>
                  <p className="text-sm font-semibold text-blue-600">{s.title}</p>
                </div>
                {s.preview}
              </div>
            </div>
          ))}
        </section>

        {/* Setup steps */}
        <section className="bg-gray-50/80 border-y border-gray-100 py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Setup process</p>
            <h2 className="mb-4 text-4xl font-bold tracking-tight">You&apos;re live in 24 hours.</h2>
            <p className="mb-14 text-gray-500">We handle everything. You just need to forward your calls.</p>

            <div className="grid gap-4 md:grid-cols-4">
              {[
                { step: "1", title: "Sign up",              desc: "Book a demo and we set up your account." },
                { step: "2", title: "We configure AI",      desc: "We set up your clinic name, treatments, and AI voice persona." },
                { step: "3", title: "You forward calls",    desc: "Set up call forwarding on your phone. Takes 2 minutes." },
                { step: "4", title: "You're live",          desc: "RingLoop starts answering missed calls immediately." },
              ].map((s, i) => (
                <div key={s.step} data-reveal className={`r-delay-${(i % 3) + 1} rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-sm shadow-blue-200">{s.step}</div>
                  <h3 className="mb-2 font-semibold">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[#060e1f] py-24 text-white text-center">
          <div className="dot-grid absolute inset-0 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,_rgba(37,99,235,0.3),_transparent)] pointer-events-none" />
          <div className="relative mx-auto max-w-2xl px-6">
            <h2 className="mb-5 text-4xl font-bold tracking-tight">Hear it answer a live call.</h2>
            <p className="mb-8 text-gray-400">Book a free demo and we&apos;ll call your number so you can hear RingLoop in action.</p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all duration-200"
            >
              Book a free demo
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </section>

      </main>
  );
}
