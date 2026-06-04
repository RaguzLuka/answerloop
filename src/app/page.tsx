export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight">Ringloop</span>
          <div className="hidden gap-8 text-sm font-medium text-gray-500 sm:flex">
            <a href="#how" className="hover:text-black transition-colors">How it works</a>
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#industries" className="hover:text-black transition-colors">Industries</a>
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
          </div>
          <a href="#contact" className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
            Book a demo
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-semibold text-gray-500">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
          Now available for businesses across Europe
        </div>

        <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          Every missed call is a
          <span className="italic"> lost client.</span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-gray-500 md:text-xl">
          Ringloop instantly follows up every missed call with an AI that qualifies the lead,
          collects their request, and books the appointment — automatically.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="#contact" className="rounded-full bg-black px-8 py-4 font-medium text-white hover:bg-gray-800 transition-colors">
            Book a free demo →
          </a>
          <a href="#how" className="rounded-full border border-gray-200 px-8 py-4 font-medium text-gray-700 hover:border-gray-400 transition-colors">
            See how it works
          </a>
        </div>

        <p className="mt-6 text-sm text-gray-400">No contract · Cancel anytime · Setup in 24h</p>

        {/* Mock phone */}
        <div className="mt-16 w-full max-w-sm rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-xl">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Live conversation</p>
          </div>
          <div className="space-y-3">
            {[
              { from: "ai", text: "Hi! Sorry we missed your call. This is Lumi Clinic — how can we help? 😊" },
              { from: "client", text: "I'd like to book a Botox consultation." },
              { from: "ai", text: "Of course! May I have your name?" },
              { from: "client", text: "Ana Kovač" },
              { from: "ai", text: "Thanks Ana! Do you have a preferred doctor, or is any doctor fine?" },
              { from: "client", text: "Any doctor is fine." },
              { from: "ai", text: "Perfect — when would you like to come in?" },
              { from: "client", text: "Tomorrow at 3pm." },
              { from: "ai", text: "✅ Booked! Botox consultation tomorrow at 15:00. See you then, Ana!" },
            ].map((msg, i) => (
              <div key={i} className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${msg.from === "ai" ? "bg-white shadow-sm text-gray-800" : "ml-auto bg-black text-white"}`}>
                {msg.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50 py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {[
            { number: "62%", label: "of missed calls never call back" },
            { number: "< 30s", label: "response time after missed call" },
            { number: "24/7", label: "always on, no days off" },
            { number: "3×", label: "more bookings from missed calls" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="mb-1 text-3xl font-bold">{stat.number}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-5xl px-6 py-24">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">How it works</p>
        <h2 className="mb-4 text-center text-4xl font-bold">Three steps. Zero effort.</h2>
        <p className="mb-14 text-center text-gray-500">Ringloop works silently in the background. Your staff doesn't need to do anything.</p>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { step: "01", title: "Missed call detected", desc: "A potential client calls your business. Nobody picks up. Ringloop detects it instantly via call forwarding." },
            { step: "02", title: "AI follows up", desc: "Within seconds, the client gets a WhatsApp message from your clinic's AI asking how it can help." },
            { step: "03", title: "Appointment booked", desc: "The AI collects their name, treatment, preferred doctor and time — then confirms the booking automatically." },
          ].map((item) => (
            <div key={item.step} className="rounded-3xl border border-gray-100 bg-gray-50 p-8">
              <p className="mb-4 text-5xl font-bold text-gray-200">{item.step}</p>
              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-black py-24 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gray-500">Features</p>
          <h2 className="mb-4 text-center text-4xl font-bold">Everything you need. Nothing you don't.</h2>
          <p className="mb-14 text-center text-gray-400">Built specifically for appointment-based businesses.</p>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: "💬", title: "WhatsApp & SMS", desc: "Follows up on the channel your clients already use." },
              { icon: "🤖", title: "AI conversation", desc: "Understands any language, any phrasing, any request." },
              { icon: "📅", title: "Auto booking", desc: "Collects all booking details and confirms the appointment." },
              { icon: "🏥", title: "Custom AI persona", desc: "The AI introduces itself as your clinic, not as Ringloop." },
              { icon: "🌍", title: "Multi-language", desc: "Responds in Croatian, English, German — whatever the client writes." },
              { icon: "📋", title: "Lead summaries", desc: "After every booking, your team gets a clear summary." },
              { icon: "🔔", title: "Missed call trigger", desc: "No missed call goes unanswered. Ever." },
              { icon: "📞", title: "Any phone number", desc: "Works with call forwarding — no number change needed." },
              { icon: "⚡", title: "Setup in 24h", desc: "We handle the entire setup. You just forward calls." },
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
        <h2 className="mb-4 text-center text-4xl font-bold">Built for any appointment-based business.</h2>
        <p className="mb-14 text-center text-gray-500">If your business takes appointments, Ringloop works for you.</p>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            { icon: "🦷", name: "Dental Clinics", desc: "Cleanings, checkups, whitening" },
            { icon: "💉", name: "Aesthetic Clinics", desc: "Botox, fillers, skin treatments" },
            { icon: "🧴", name: "Beauty Salons", desc: "Facials, skincare, laser" },
            { icon: "💇", name: "Hair Salons", desc: "Cuts, color, treatments" },
            { icon: "🏥", name: "Medical Practices", desc: "GP, specialists, physio" },
            { icon: "🧘", name: "Wellness & Therapy", desc: "Massage, yoga, counseling" },
          ].map((industry) => (
            <div key={industry.name} className="rounded-2xl border border-gray-100 p-6 hover:border-gray-300 transition-colors">
              <span className="mb-3 block text-3xl">{industry.icon}</span>
              <h3 className="mb-1 font-bold">{industry.name}</h3>
              <p className="text-sm text-gray-500">{industry.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Pricing</p>
          <h2 className="mb-4 text-4xl font-bold">One plan. Everything included.</h2>
          <p className="mb-14 text-gray-500">No hidden fees. No feature limits. Just results.</p>

          <div className="rounded-3xl bg-black p-10 text-white">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Ringloop</p>
            <p className="mb-1 text-6xl font-bold">€200<span className="text-2xl font-normal text-gray-400">/mo</span></p>
            <p className="mb-10 text-gray-400 text-sm">per business location</p>

            <div className="mb-10 grid gap-3 text-left sm:grid-cols-2">
              {[
                "Dedicated WhatsApp number",
                "Unlimited AI conversations",
                "WhatsApp & SMS follow-ups",
                "Automatic appointment booking",
                "Collects name, treatment & time",
                "Lead summary after every booking",
                "Multi-language support",
                "Custom AI persona for your brand",
                "Missed call trigger included",
                "Priority support",
                "Full setup & onboarding",
                "No contract — cancel anytime",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs">✓</span>
                  {f}
                </div>
              ))}
            </div>

            <a href="#contact" className="block rounded-full bg-white py-4 text-center font-medium text-black hover:bg-gray-100 transition-colors">
              Book a free demo
            </a>
            <p className="mt-4 text-xs text-gray-500">Setup fee: €0 · No contract · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">FAQ</p>
        <h2 className="mb-14 text-center text-4xl font-bold">Common questions.</h2>

        <div className="space-y-6">
          {[
            { q: "Do I need to change my phone number?", a: "No. You keep your existing number. You just set up call forwarding — when nobody answers, the call forwards to Ringloop. Takes 2 minutes." },
            { q: "How does the AI know my clinic's name?", a: "We set it up for you during onboarding. The AI introduces itself as your clinic and handles conversations in your name." },
            { q: "What languages does it support?", a: "The AI responds in whatever language the client writes — Croatian, English, German, Italian, and more." },
            { q: "Does it work with my existing calendar?", a: "Google Calendar integration is included. Bookings appear automatically in your calendar." },
            { q: "What if the client wants something the AI can't handle?", a: "If no time agreement is reached, the AI says a team member will contact them shortly and logs the lead for your staff." },
            { q: "How long does setup take?", a: "We handle everything. Most clinics are live within 24 hours." },
          ].map((item) => (
            <div key={item.q} className="border-b border-gray-100 pb-6">
              <h3 className="mb-2 font-bold">{item.q}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-black py-24 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Get started</p>
          <h2 className="mb-5 text-4xl font-bold">Ready to never lose a client again?</h2>
          <p className="mb-10 text-lg text-gray-400">Book a free 20-minute demo and we'll show you exactly how Ringloop works for your business.</p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="mailto:hello@ringloop.net" className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-medium text-white hover:border-white transition-colors">
              ✉ hello@ringloop.net
            </a>
            <a href="https://wa.me/14788003855" className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black hover:bg-gray-100 transition-colors">
              💬 WhatsApp us
            </a>
          </div>

          <p className="mt-8 text-sm text-gray-600">We typically respond within a few hours.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <span className="font-bold">Ringloop</span>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Ringloop. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="mailto:hello@ringloop.net" className="hover:text-black transition-colors">hello@ringloop.net</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
