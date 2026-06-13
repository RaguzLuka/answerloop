import Link from "next/link";
import Timeline from "@/components/Timeline";

export const metadata = {
  title: "How It Works — RingLoop",
  description: "Learn exactly how RingLoop answers calls by voice, books appointments, and confirms them to patients by SMS.",
};

export default function HowItWorks() {
  return (
    <main className="bg-paper pt-16 text-ink">

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div className="halo pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-3xl">
          <p className="label mb-4 text-blue">How it works</p>
          <h1 className="font-display mb-6 text-5xl leading-[1.05] md:text-6xl">
            Simple setup.<br /><em className="text-blue">Powerful results.</em>
          </h1>
          <p className="text-lg leading-relaxed text-ink-soft">
            From forwarded call to confirmed appointment — here&apos;s exactly what happens, step by step.
          </p>
        </div>
      </section>

      {/* Steps — a spine of light fills in as you scroll */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Timeline>
        <div className="space-y-28 py-4">
        {[
          {
            step: "01",
            title: "Patient calls your clinic",
            desc: "A patient calls your clinic's existing phone number. Your staff is busy or unavailable — nobody picks up. Without RingLoop, this patient would hang up and call a competitor.",
            detail: "RingLoop works with your existing number. You set up call forwarding in your phone settings — when a call goes unanswered after a few rings, it forwards to RingLoop. No number change. No technical work.",
            preview: (
              <div className="card space-y-2 p-5 text-sm">
                <p className="text-ink-soft">📞 Incoming call to <strong className="text-ink">Zagreb Dental Clinic</strong></p>
                <p className="font-medium text-blue">→ No answer — forwarding to RingLoop AI</p>
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
                <div className="max-w-[90%] rounded-2xl rounded-tl-md bg-night px-4 py-3 text-sm text-white">
                  <p className="label mb-1.5 text-[#7fa6f8] normal-case tracking-[0.06em]">RingLoop · AI receptionist</p>
                  &ldquo;Hello! Thank you for calling Zagreb Dental. I&apos;m here to help you book an appointment. What treatment are you looking for?&rdquo;
                </div>
                <p className="pl-1 text-xs text-muted">Answered in 4 seconds ✓</p>
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
                    <div className={`max-w-[80%] px-3.5 py-2 text-xs ${
                      msg.from === "ai"
                        ? "rounded-2xl rounded-tl-md border border-[var(--line)] bg-white text-ink-soft shadow-sm"
                        : "rounded-2xl rounded-tr-md bg-blue text-white"
                    }`}>
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
            desc: "Once all details are collected, the AI confirms the booking clearly, tells the patient what to expect, and lets them know they can call back anytime if they need anything.",
            detail: "Your team receives a full patient summary instantly — name, treatment, doctor preference, and confirmed time. With Google Calendar integration, bookings land straight in your clinic's calendar.",
            preview: (
              <div className="space-y-3">
                <div className="max-w-[95%] rounded-2xl rounded-tl-md bg-night px-4 py-3 text-sm text-white">
                  <p className="label mb-1.5 text-[#7fa6f8] normal-case tracking-[0.06em]">RingLoop · AI receptionist</p>
                  &ldquo;Booked! Dental checkup tomorrow at 10:00. You&apos;ll receive an SMS confirmation right away. If you need anything, just call us back. See you then, Marko!&rdquo;
                </div>
                <div className="rounded-2xl border border-blue/15 bg-sky/60 p-4 text-xs">
                  <p className="label mb-2 text-blue normal-case tracking-[0.06em]">📅 Booking logged</p>
                  <p className="text-ink-soft">Marko Horvat — Dental checkup</p>
                  <p className="text-ink-soft">Tomorrow 10:00 · Any doctor</p>
                </div>
              </div>
            ),
          },
          {
            step: "05",
            title: "SMS confirmation sent instantly",
            desc: "The moment the call ends, the patient receives an SMS with all the appointment details, and your team gets the full booking summary at the same time.",
            detail: "The SMS arrives under your clinic's name — patients see your clinic, not RingLoop. With Google Calendar integration, the booking also lands straight in your calendar.",
            preview: (
              <div className="space-y-2">
                <div className="card max-w-[90%] p-4 text-sm text-ink-soft">
                  <p className="mb-2 text-xs text-muted">Zagreb Dental · SMS</p>
                  Dear Marko, your appointment at Zagreb Dental is confirmed:<br /><br />
                  📋 Dental checkup<br />
                  🕐 Tomorrow, 10:00<br /><br />
                  See you then!
                </div>
                <p className="pl-1 text-xs text-muted">Sent seconds after the call ✓</p>
              </div>
            ),
          },
        ].map((s, i) => (
          <div key={s.step} className="relative grid items-center gap-12 pl-12 md:grid-cols-2 md:gap-20 md:pl-0">
            {/* Step marker on the spine */}
            <div className="absolute left-4 top-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue/30 bg-white text-xs font-bold text-blue shadow-md shadow-blue/10 md:left-1/2">
              {i + 1}
            </div>

            <div data-reveal className={`${i % 2 === 1 ? "md:order-2 reveal-right" : "reveal-left"}`}>
              <p className="font-display mb-2 text-7xl leading-none text-blue/15">{s.step}</p>
              <h2 className="font-display mb-5 text-3xl">{s.title}</h2>
              <p className="mb-5 leading-relaxed text-ink-soft">{s.desc}</p>
              <p className="border-l-2 border-blue/25 pl-5 text-sm leading-relaxed text-muted">{s.detail}</p>
            </div>
            <div data-reveal className={`rounded-2xl border border-[var(--line)] bg-white/60 p-7 ${i % 2 === 1 ? "md:order-1 reveal-left" : "reveal-right"}`}>
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue text-xs font-bold text-white">{s.step}</div>
                <p className="text-sm font-semibold text-blue">{s.title}</p>
              </div>
              {s.preview}
            </div>
          </div>
        ))}
        </div>
        </Timeline>
      </section>

      {/* Setup steps */}
      <section className="border-y border-[var(--line)] bg-white py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="label mb-4 text-muted">Setup process</p>
          <h2 className="font-display mb-5 text-4xl md:text-5xl">You&apos;re live in <em className="text-blue">24 hours.</em></h2>
          <p className="mb-16 text-ink-soft">We handle everything. You just need to forward your calls.</p>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              { step: "1", title: "Sign up",           desc: "Book a demo and we set up your account." },
              { step: "2", title: "We configure AI",   desc: "We set up your clinic name, treatments, and AI voice persona." },
              { step: "3", title: "You forward calls", desc: "Set up call forwarding on your phone. Takes 2 minutes." },
              { step: "4", title: "You're live",       desc: "RingLoop starts answering missed calls immediately." },
            ].map((s, i) => (
              <div key={s.step} data-reveal className={`card r-delay-${(i % 3) + 1} p-7 text-center transition-all duration-300 hover:-translate-y-1`}>
                <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-blue font-bold text-white shadow-md shadow-blue/20">{s.step}</div>
                <h3 className="mb-2 font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-night py-28 text-center text-white">
        <div className="dot-grid-dark pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_110%,_rgba(64,116,245,0.3),_transparent)]" />
        <div className="relative mx-auto max-w-2xl px-6">
          <h2 className="font-display mb-6 text-4xl md:text-5xl">Hear it answer <em className="text-[#7fa6f8]">a live call.</em></h2>
          <p className="mb-10 text-sky/60">Book a free demo and we&apos;ll call your number so you can hear RingLoop in action.</p>
          <Link href="/contact" className="btn-primary group inline-flex items-center gap-2 px-9 py-4">
            Book a free demo
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

    </main>
  );
}
