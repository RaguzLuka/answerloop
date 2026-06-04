import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-white text-black pt-16">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white px-6 py-28 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-white pointer-events-none" />
          <div className="relative mx-auto max-w-5xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Now live for medical institutes across Europe
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Your clinic misses calls.<br />
              <span className="text-blue-600">Ringloop books them.</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-500 md:text-xl">
              An AI receptionist that instantly follows up every missed call, qualifies the patient,
              and books the appointment — automatically, 24/7, in any language.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/contact" className="rounded-full bg-blue-600 px-8 py-4 font-medium text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                Book a free demo →
              </Link>
              <Link href="/how-it-works" className="rounded-full border border-gray-200 px-8 py-4 font-medium text-gray-700 hover:border-gray-400 transition-colors">
                See how it works
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-400">No contract · Cancel anytime · Setup in 24h · €200/month</p>

            {/* Chat mockup */}
            <div className="mx-auto mt-16 max-w-sm rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl text-left">
              <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">ZD</div>
                <div>
                  <p className="text-sm font-semibold">Zagreb Dental Clinic</p>
                  <p className="text-xs text-green-500">● Online</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { from: "ai", text: "Hi! Sorry we missed your call. This is Zagreb Dental — how can we help? 😊" },
                  { from: "client", text: "I need a dental checkup." },
                  { from: "ai", text: "Of course! May I have your name?" },
                  { from: "client", text: "Marko Horvat" },
                  { from: "ai", text: "Thanks Marko! Any preferred doctor?" },
                  { from: "client", text: "No preference." },
                  { from: "ai", text: "When works for you?" },
                  { from: "client", text: "Tomorrow at 10am." },
                  { from: "ai", text: "✅ Booked! Tomorrow at 10:00. See you then!" },
                ].map((msg, i) => (
                  <div key={i} className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${msg.from === "ai" ? "bg-gray-100 text-gray-800" : "ml-auto bg-blue-600 text-white"}`}>
                    {msg.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-gray-100 py-14">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
            {[
              { number: "62%", label: "of missed calls never call back" },
              { number: "< 30s", label: "AI response time" },
              { number: "24/7", label: "always available" },
              { number: "3×", label: "more bookings" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="mb-1 text-4xl font-bold text-blue-600">{stat.number}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Problem section */}
        <section className="mx-auto max-w-5xl px-6 py-24">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-red-500">The problem</p>
              <h2 className="mb-5 text-4xl font-bold leading-tight">Your clinic is losing patients every single day.</h2>
              <p className="mb-6 text-gray-500 leading-relaxed">
                When a patient calls and nobody answers, they don't wait. They call the next clinic on Google. That's a lost patient — and lost revenue — every single time.
              </p>
              <ul className="space-y-3">
                {[
                  "62% of missed calls never call back",
                  "The average clinic misses 15-30 calls per month",
                  "Each missed call = €50-500 in lost treatment",
                  "Voicemail has less than 20% callback rate",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs text-red-500">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-red-50 p-8 border border-red-100">
              <p className="mb-2 text-sm font-semibold text-red-500 uppercase tracking-widest">Monthly loss calculator</p>
              <p className="mb-6 text-gray-600 text-sm">For a clinic missing 20 calls/month:</p>
              <div className="space-y-4">
                {[
                  { label: "Missed calls/month", value: "20 calls" },
                  { label: "Average treatment value", value: "€150" },
                  { label: "Patients who don't call back", value: "62% = 12 patients" },
                  { label: "Monthly revenue lost", value: "€1,800", highlight: true },
                  { label: "Annual revenue lost", value: "€21,600", highlight: true },
                ].map((row) => (
                  <div key={row.label} className={`flex items-center justify-between rounded-xl p-3 ${row.highlight ? "bg-red-100 font-bold" : "bg-white"}`}>
                    <span className="text-sm text-gray-600">{row.label}</span>
                    <span className={`text-sm font-semibold ${row.highlight ? "text-red-600" : "text-gray-900"}`}>{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-400">Ringloop pays for itself in the first booking.</p>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="bg-blue-600 py-24 text-white">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid items-center gap-16 md:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-200">The solution</p>
                <h2 className="mb-5 text-4xl font-bold leading-tight">Ringloop answers every call. Even when you can't.</h2>
                <p className="mb-8 text-blue-100 leading-relaxed">
                  When a patient calls and nobody answers, Ringloop automatically sends them a WhatsApp message within 30 seconds. The AI has a full conversation, collects all booking details, and confirms the appointment.
                </p>
                <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                  See exactly how it works →
                </Link>
              </div>
              <div className="space-y-4">
                {[
                  { icon: "📞", title: "Patient calls, no answer", desc: "Call forwarding triggers Ringloop instantly" },
                  { icon: "💬", title: "AI sends WhatsApp in 30s", desc: "Patient receives a message from your clinic" },
                  { icon: "🤖", title: "AI handles conversation", desc: "Collects name, treatment, doctor preference, time" },
                  { icon: "✅", title: "Appointment confirmed", desc: "Booking appears in your calendar automatically" },
                ].map((step) => (
                  <div key={step.title} className="flex items-start gap-4 rounded-2xl bg-white/10 p-5">
                    <span className="text-2xl">{step.icon}</span>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-blue-200">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="mx-auto max-w-5xl px-6 py-24">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">Comparison</p>
          <h2 className="mb-4 text-center text-4xl font-bold">Why Ringloop?</h2>
          <p className="mb-14 text-center text-gray-500">See how Ringloop compares to traditional solutions.</p>

          <div className="overflow-x-auto rounded-3xl border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-5 text-left text-sm font-semibold text-gray-500">Feature</th>
                  <th className="p-5 text-center text-sm font-bold text-blue-600 bg-blue-50">Ringloop</th>
                  <th className="p-5 text-center text-sm font-semibold text-gray-500">Receptionist</th>
                  <th className="p-5 text-center text-sm font-semibold text-gray-500">Voicemail</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Available 24/7", ringloop: true, receptionist: false, voicemail: true },
                  { feature: "Responds in 30 seconds", ringloop: true, receptionist: false, voicemail: false },
                  { feature: "Books appointments automatically", ringloop: true, receptionist: true, voicemail: false },
                  { feature: "Multi-language support", ringloop: true, receptionist: false, voicemail: false },
                  { feature: "Never misses a call", ringloop: true, receptionist: false, voicemail: true },
                  { feature: "No salary or sick days", ringloop: true, receptionist: false, voicemail: true },
                  { feature: "Monthly cost", ringloop: "€200", receptionist: "€1,500+", voicemail: "€0" },
                ].map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-5 text-sm font-medium">{row.feature}</td>
                    <td className="p-5 text-center bg-blue-50">
                      {typeof row.ringloop === "boolean"
                        ? <span className={`text-lg ${row.ringloop ? "text-green-500" : "text-red-400"}`}>{row.ringloop ? "✓" : "✕"}</span>
                        : <span className="font-bold text-blue-600 text-sm">{row.ringloop}</span>
                      }
                    </td>
                    <td className="p-5 text-center">
                      {typeof row.receptionist === "boolean"
                        ? <span className={`text-lg ${row.receptionist ? "text-green-500" : "text-red-400"}`}>{row.receptionist ? "✓" : "✕"}</span>
                        : <span className="text-sm text-gray-600">{row.receptionist}</span>
                      }
                    </td>
                    <td className="p-5 text-center">
                      {typeof row.voicemail === "boolean"
                        ? <span className={`text-lg ${row.voicemail ? "text-green-500" : "text-red-400"}`}>{row.voicemail ? "✓" : "✕"}</span>
                        : <span className="text-sm text-gray-600">{row.voicemail}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-gray-950 py-24 text-white">
          <div className="mx-auto max-w-5xl px-6">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gray-500">Features</p>
            <h2 className="mb-4 text-center text-4xl font-bold">Everything your clinic needs.</h2>
            <p className="mb-14 text-center text-gray-400">Built specifically for medical institutes.</p>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                { icon: "💬", title: "WhatsApp & SMS", desc: "Follows up on the channel your patients already use daily." },
                { icon: "🤖", title: "AI conversation", desc: "Understands any language, any phrasing, any medical request." },
                { icon: "📅", title: "Auto booking", desc: "Collects all booking details and confirms the appointment." },
                { icon: "🏥", title: "Custom AI persona", desc: "The AI introduces itself as your clinic — not as Ringloop." },
                { icon: "🌍", title: "Multi-language", desc: "Croatian, English, German — whatever the patient writes." },
                { icon: "👨‍⚕️", title: "Doctor preference", desc: "Asks if the patient has a preferred doctor before booking." },
                { icon: "🔔", title: "Missed call trigger", desc: "Every missed call gets a follow-up. No patient left behind." },
                { icon: "📋", title: "Patient summaries", desc: "After every booking, your team gets a clear patient summary." },
                { icon: "📆", title: "Calendar integration", desc: "Bookings appear in Google Calendar automatically." },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
                  <p className="mb-3 text-2xl">{f.icon}</p>
                  <h3 className="mb-2 font-bold">{f.title}</h3>
                  <p className="text-sm text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section id="industries" className="mx-auto max-w-5xl px-6 py-24">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">Industries</p>
          <h2 className="mb-4 text-center text-4xl font-bold">Built for every medical institute.</h2>
          <p className="mb-14 text-center text-gray-500">If your clinic takes appointments, Ringloop works for you.</p>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: "🦷", name: "Dental Clinics", desc: "Cleanings, checkups, whitening, implants" },
              { icon: "💉", name: "Aesthetic Clinics", desc: "Botox, fillers, skin treatments, laser" },
              { icon: "🏥", name: "General Practices", desc: "GP visits, specialist referrals, checkups" },
              { icon: "👁️", name: "Ophthalmology", desc: "Eye exams, vision correction, surgery" },
              { icon: "🦴", name: "Physiotherapy", desc: "Rehab, injury treatment, sports medicine" },
              { icon: "🧠", name: "Psychiatry & Therapy", desc: "Mental health, counseling, psychotherapy" },
              { icon: "❤️", name: "Cardiology", desc: "Heart checkups, ECG, consultations" },
              { icon: "🧴", name: "Dermatology", desc: "Skin conditions, mole checks, cosmetic" },
              { icon: "👶", name: "Pediatrics", desc: "Child health, vaccinations, development" },
            ].map((industry) => (
              <div key={industry.name} className="rounded-2xl border border-gray-100 p-6 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                <span className="mb-3 block text-3xl">{industry.icon}</span>
                <h3 className="mb-1 font-bold">{industry.name}</h3>
                <p className="text-sm text-gray-500">{industry.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-gray-400">
            Not in the list? <Link href="/contact" className="text-blue-600 underline hover:text-blue-700">Contact us</Link> — Ringloop works for any appointment-based business.
          </p>
        </section>

        {/* Testimonials placeholder */}
        <section className="bg-gray-50 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">Testimonials</p>
            <h2 className="mb-14 text-center text-4xl font-bold">Clinics love Ringloop.</h2>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                { quote: "We were missing 20+ calls a month. Ringloop turned most of them into booked appointments. It paid for itself in the first week.", name: "Dr. Ana K.", role: "Dental Clinic, Zagreb" },
                { quote: "Our patients love how fast they get a response. The AI is professional, polite, and books correctly every time.", name: "Dr. Marko P.", role: "Aesthetic Clinic, Split" },
                { quote: "Setup took less than a day. We didn't have to change our number or anything. Just works perfectly in the background.", name: "Dr. Ivan R.", role: "General Practice, Rijeka" },
              ].map((t) => (
                <div key={t.name} className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="mb-6 text-gray-600 text-sm leading-relaxed italic">"{t.quote}"</p>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-gray-400">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-600 py-24 text-white text-center">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-5 text-4xl font-bold">Ready to stop losing patients?</h2>
            <p className="mb-10 text-lg text-blue-100">Book a free 20-minute demo and see exactly how Ringloop works for your clinic.</p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/contact" className="rounded-full bg-white px-8 py-4 font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                Book a free demo →
              </Link>
              <Link href="/pricing" className="rounded-full border border-white/30 px-8 py-4 font-medium text-white hover:border-white transition-colors">
                See pricing
              </Link>
            </div>
            <p className="mt-6 text-sm text-blue-200">No contract · Cancel anytime · Setup in 24h</p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
