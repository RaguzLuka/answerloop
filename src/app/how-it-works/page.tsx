import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "How It Works — Ringloop",
  description: "Learn exactly how Ringloop follows up missed calls and books appointments automatically.",
};

export default function HowItWorks() {
  return (
    <>
      <Nav />
      <main className="pt-16">

        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white px-6 py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">How it works</p>
            <h1 className="mb-5 text-5xl font-bold leading-tight">Simple setup. Powerful results.</h1>
            <p className="text-lg text-gray-500">From missed call to booked appointment — here's exactly what happens.</p>
          </div>
        </section>

        {/* Step by step */}
        <section className="mx-auto max-w-4xl px-6 py-24">
          <div className="space-y-24">
            {[
              {
                step: "01",
                title: "Patient calls your clinic",
                desc: "A patient calls your clinic's existing phone number. Your staff is busy or unavailable — nobody picks up. Without Ringloop, this patient would hang up and call a competitor.",
                detail: "Ringloop works with your existing number. You set up call forwarding in your phone settings — when a call goes unanswered after a few rings, it forwards to Ringloop. No number change. No technical work.",
                color: "blue",
              },
              {
                step: "02",
                title: "Ringloop detects the missed call",
                desc: "The moment the call comes in, Ringloop identifies the patient's phone number and which clinic the call was for.",
                detail: "Each clinic has a dedicated Ringloop number. The system knows which clinic to represent and uses that clinic's name, treatments, and AI persona in all communications.",
                color: "blue",
              },
              {
                step: "03",
                title: "AI sends a WhatsApp message in 30 seconds",
                desc: "The patient receives a friendly WhatsApp message from your clinic's AI within 30 seconds of the missed call.",
                detail: "The message is sent from a dedicated WhatsApp Business number registered under your clinic's name. The patient sees your clinic name — not Ringloop.",
                color: "blue",
              },
              {
                step: "04",
                title: "AI has a full booking conversation",
                desc: "The AI asks what treatment the patient needs, collects their name, asks about doctor preference, and finds a suitable time.",
                detail: "The AI is powered by Claude — one of the most advanced AI models available. It understands natural language, handles follow-up questions, and responds in whatever language the patient writes in.",
                color: "blue",
              },
              {
                step: "05",
                title: "Appointment confirmed & calendar updated",
                desc: "Once a time is agreed, the AI confirms the booking and your calendar is updated automatically.",
                detail: "Bookings appear in your Google Calendar. Your team also receives a clear summary: patient name, treatment requested, doctor preference, and confirmed time.",
                color: "blue",
              },
            ].map((step, i) => (
              <div key={step.step} className={`grid items-center gap-12 md:grid-cols-2 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <p className="mb-3 text-6xl font-bold text-blue-100">{step.step}</p>
                  <h2 className="mb-4 text-2xl font-bold">{step.title}</h2>
                  <p className="mb-4 text-gray-600 leading-relaxed">{step.desc}</p>
                  <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-blue-200 pl-4">{step.detail}</p>
                </div>
                <div className={`rounded-3xl bg-blue-50 p-8 border border-blue-100 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{step.step}</div>
                    <p className="font-semibold text-blue-600">{step.title}</p>
                  </div>
                  <div className="space-y-2">
                    {step.step === "01" && (
                      <div className="rounded-2xl bg-white p-4 text-sm text-gray-600 shadow-sm">
                        📞 Incoming call to Zagreb Dental Clinic<br/>
                        <span className="text-red-500">✕ No answer — forwarded to Ringloop</span>
                      </div>
                    )}
                    {step.step === "02" && (
                      <div className="rounded-2xl bg-white p-4 text-sm shadow-sm">
                        <p className="text-gray-500 mb-1">Caller: <span className="text-black font-medium">+385 99 436 3110</span></p>
                        <p className="text-gray-500">Clinic: <span className="text-black font-medium">Zagreb Dental Clinic</span></p>
                        <p className="text-green-500 mt-2">✓ Identified — sending follow-up</p>
                      </div>
                    )}
                    {step.step === "03" && (
                      <div className="space-y-2">
                        <div className="rounded-2xl bg-white p-3 text-sm shadow-sm text-gray-800">
                          Hi! Sorry we missed your call. This is Zagreb Dental — how can we help? 😊
                        </div>
                        <p className="text-xs text-gray-400 pl-2">Sent in 28 seconds ✓</p>
                      </div>
                    )}
                    {step.step === "04" && (
                      <div className="space-y-2">
                        {[
                          { from: "ai", text: "What treatment are you looking for?" },
                          { from: "client", text: "Dental checkup" },
                          { from: "ai", text: "Your name?" },
                          { from: "client", text: "Marko Horvat" },
                          { from: "ai", text: "Preferred doctor?" },
                          { from: "client", text: "Any is fine" },
                        ].map((msg, i) => (
                          <div key={i} className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${msg.from === "ai" ? "bg-white shadow-sm text-gray-800" : "ml-auto bg-blue-600 text-white"}`}>
                            {msg.text}
                          </div>
                        ))}
                      </div>
                    )}
                    {step.step === "05" && (
                      <div className="space-y-3">
                        <div className="rounded-2xl bg-white p-3 text-xs shadow-sm text-gray-800">
                          ✅ Booked! Dental checkup tomorrow at 10:00. See you then, Marko!
                        </div>
                        <div className="rounded-2xl bg-green-50 border border-green-200 p-3 text-xs">
                          <p className="font-semibold text-green-700 mb-1">📅 Calendar updated</p>
                          <p className="text-green-600">Marko Horvat — Dental checkup</p>
                          <p className="text-green-600">Tomorrow 10:00–10:30</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Setup section */}
        <section className="bg-gray-50 py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Setup process</p>
            <h2 className="mb-4 text-4xl font-bold">You're live in 24 hours.</h2>
            <p className="mb-14 text-gray-500">We handle everything. You just need to forward your calls.</p>

            <div className="grid gap-6 md:grid-cols-4">
              {[
                { step: "1", title: "Sign up", desc: "Book a demo and we set up your account." },
                { step: "2", title: "We configure AI", desc: "We set up your clinic name, treatments, and AI persona." },
                { step: "3", title: "You forward calls", desc: "Set up call forwarding on your phone. Takes 2 minutes." },
                { step: "4", title: "You're live", desc: "Ringloop starts catching missed calls immediately." },
              ].map((s) => (
                <div key={s.step} className="rounded-2xl bg-white border border-gray-200 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">{s.step}</div>
                  <h3 className="mb-2 font-bold">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-600 py-24 text-white text-center">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="mb-5 text-4xl font-bold">Ready to see it in action?</h2>
            <p className="mb-8 text-blue-100">Book a free demo and we'll show you Ringloop working for your clinic.</p>
            <Link href="/contact" className="inline-block rounded-full bg-white px-8 py-4 font-medium text-blue-600 hover:bg-blue-50 transition-colors">
              Book a free demo →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
