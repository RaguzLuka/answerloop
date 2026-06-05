import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "How It Works — RingLoop",
  description: "Learn exactly how RingLoop follows up missed calls and books appointments automatically.",
};

export default function HowItWorks() {
  return (
    <>
      <Nav />
      <main className="pt-16">

        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-24 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,_#dbeafe,_transparent)]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">How it works</p>
            <h1 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl">Simple setup.<br />Powerful results.</h1>
            <p className="text-lg text-gray-500 leading-relaxed">From missed call to booked appointment — here&apos;s exactly what happens.</p>
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
                  <p className="text-red-500 font-medium">✕ No answer — forwarded to RingLoop</p>
                </div>
              ),
            },
            {
              step: "02",
              title: "RingLoop detects the missed call",
              desc: "The moment the call comes in, RingLoop identifies the patient's phone number and which clinic the call was for.",
              detail: "Each clinic has a dedicated RingLoop number. The system knows which clinic to represent and uses that clinic's name, treatments, and AI persona in all communications.",
              preview: (
                <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 text-sm space-y-1.5">
                  <p className="text-gray-500">Caller: <span className="font-semibold text-gray-900">+385 99 436 3110</span></p>
                  <p className="text-gray-500">Clinic: <span className="font-semibold text-gray-900">Zagreb Dental Clinic</span></p>
                  <p className="text-green-600 font-medium mt-2">✓ Identified — sending follow-up</p>
                </div>
              ),
            },
            {
              step: "03",
              title: "AI sends a WhatsApp message in 30 seconds",
              desc: "The patient receives a friendly WhatsApp message from your clinic's AI within 30 seconds of the missed call.",
              detail: "The message is sent from a dedicated WhatsApp Business number registered under your clinic's name. The patient sees your clinic name — not RingLoop.",
              preview: (
                <div className="space-y-2">
                  <div className="rounded-2xl bg-white p-4 text-sm shadow-sm border border-gray-100 text-gray-800 max-w-[85%]">
                    Hi! Sorry we missed your call. This is Zagreb Dental — how can we help? 😊
                  </div>
                  <p className="text-xs text-gray-400 pl-1">Sent in 28 seconds ✓</p>
                </div>
              ),
            },
            {
              step: "04",
              title: "AI has a full booking conversation",
              desc: "The AI asks what treatment the patient needs, collects their name, asks about doctor preference, and finds a suitable time.",
              detail: "The AI is powered by Claude — one of the most advanced AI models available. It understands natural language, handles follow-up questions, and responds in whatever language the patient writes in.",
              preview: (
                <div className="space-y-2">
                  {[
                    { from: "ai",     text: "What treatment are you looking for?" },
                    { from: "client", text: "Dental checkup" },
                    { from: "ai",     text: "Your name?" },
                    { from: "client", text: "Marko Horvat" },
                    { from: "ai",     text: "Preferred doctor?" },
                    { from: "client", text: "Any is fine" },
                  ].map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === "client" ? "justify-end" : ""}`}>
                      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${msg.from === "ai" ? "bg-white shadow-sm border border-gray-100 text-gray-800" : "bg-[#DCF8C6] text-gray-800"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              step: "05",
              title: "Appointment confirmed & calendar updated",
              desc: "Once a time is agreed, the AI confirms the booking and your calendar is updated automatically.",
              detail: "Bookings appear in your Google Calendar. Your team also receives a clear summary: patient name, treatment requested, doctor preference, and confirmed time.",
              preview: (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-[#DCF8C6] p-3.5 text-sm text-gray-800 max-w-[90%] ml-auto">
                    ✅ Booked! Dental checkup tomorrow at 10:00. See you then, Marko!
                  </div>
                  <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-xs">
                    <p className="font-semibold text-green-700 mb-1.5">📅 Calendar updated</p>
                    <p className="text-green-600">Marko Horvat — Dental checkup</p>
                    <p className="text-green-600">Tomorrow 10:00–10:30</p>
                  </div>
                </div>
              ),
            },
          ].map((s, i) => (
            <div key={s.step} className={`grid items-center gap-12 md:grid-cols-2 ${i % 2 === 1 ? "" : ""}`}>
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
                { step: "1", title: "Sign up",           desc: "Book a demo and we set up your account." },
                { step: "2", title: "We configure AI",   desc: "We set up your clinic name, treatments, and AI persona." },
                { step: "3", title: "You forward calls", desc: "Set up call forwarding on your phone. Takes 2 minutes." },
                { step: "4", title: "You're live",       desc: "RingLoop starts catching missed calls immediately." },
              ].map((s) => (
                <div key={s.step} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
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
            <h2 className="mb-5 text-4xl font-bold tracking-tight">Ready to see it in action?</h2>
            <p className="mb-8 text-gray-400">Book a free demo and we&apos;ll show you RingLoop working for your clinic.</p>
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
      <Footer />
    </>
  );
}
