export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">

      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-xl font-bold tracking-tight">Answerloop</span>
        <div className="hidden gap-8 text-sm font-medium text-gray-600 sm:flex">
          <a href="#how" className="hover:text-black">How it works</a>
          <a href="#industries" className="hover:text-black">Industries</a>
          <a href="#pricing" className="hover:text-black">Pricing</a>
          <a href="#contact" className="hover:text-black">Contact</a>
        </div>
        <a
          href="#contact"
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white"
        >
          Get started
        </a>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex min-h-[90vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-5 inline-block rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500">
          AI-powered call recovery
        </span>

        <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          Never lose a client to a missed call again.
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-gray-500 md:text-xl">
          Answerloop automatically follows up every missed call with an AI that qualifies the lead,
          collects their request, and books the appointment — all without any staff involvement.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="#contact" className="rounded-full bg-black px-7 py-3.5 font-medium text-white">
            Book a demo
          </a>
          <a href="#how" className="rounded-full border border-gray-200 px-7 py-3.5 font-medium text-gray-700">
            See how it works
          </a>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          Works with any business that takes appointments — no technical setup required.
        </p>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50 py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {[
            { number: "62%", label: "of missed calls never call back" },
            { number: "< 60s", label: "response time after missed call" },
            { number: "24/7", label: "always available, no days off" },
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
        <p className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-gray-400">
          How it works
        </p>
        <h2 className="mb-14 text-center text-4xl font-bold">
          Three steps. Zero effort.
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Missed call detected",
              desc: "A potential client calls your business. Nobody picks up. Answerloop detects it instantly.",
            },
            {
              step: "02",
              title: "AI follows up",
              desc: "Within seconds, your client receives a WhatsApp or SMS message from the AI asking how it can help.",
            },
            {
              step: "03",
              title: "Appointment booked",
              desc: "The AI collects their request, finds a time, books the appointment, and notifies your team.",
            },
          ].map((item) => (
            <div key={item.step} className="rounded-3xl border border-gray-100 bg-gray-50 p-8">
              <p className="mb-4 text-4xl font-bold text-gray-200">{item.step}</p>
              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
              <p className="text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo conversation */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-400">
                Live example
              </p>
              <h2 className="mb-5 text-4xl font-bold">
                Your AI receptionist in action.
              </h2>
              <p className="mb-8 text-lg text-gray-500">
                The AI introduces itself, understands what the client needs,
                checks availability, and confirms the booking — all over WhatsApp.
              </p>
              <ul className="space-y-3">
                {[
                  "Understands any service or treatment",
                  "Speaks the client's language",
                  "Books directly into your calendar",
                  "Sends your team a lead summary",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
                WhatsApp conversation
              </p>
              <div className="space-y-4">
                {[
                  { from: "ai", text: "Hi! Sorry we missed your call. This is Lumi Clinic — how can we help you today?" },
                  { from: "client", text: "Hi, I'd like to book a Botox consultation." },
                  { from: "ai", text: "Of course! When would you prefer to come in?" },
                  { from: "client", text: "Tomorrow at 3pm if possible." },
                  { from: "ai", text: "Perfect — tomorrow at 15:00 is available. Your Botox consultation is confirmed. See you then!" },
                ].map((msg, i) => (
                  <div
                    key={i}
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.from === "ai"
                        ? "bg-gray-100 text-gray-800"
                        : "ml-auto bg-black text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-gray-50 p-4 text-sm">
                <p className="mb-1 font-semibold text-gray-500">Calendar updated</p>
                <p className="font-medium">Botox consultation — Tomorrow 15:00–15:30</p>
                <p className="text-gray-400">New client · Source: missed call recovery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="mx-auto max-w-5xl px-6 py-24">
        <p className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-gray-400">
          Industries
        </p>
        <h2 className="mb-14 text-center text-4xl font-bold">
          Built for any appointment-based business.
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            { icon: "🦷", name: "Dental Clinics" },
            { icon: "💉", name: "Aesthetic Clinics" },
            { icon: "🧴", name: "Skin & Beauty Salons" },
            { icon: "💇", name: "Hair Salons" },
            { icon: "🏥", name: "Medical Practices" },
            { icon: "🧘", name: "Wellness & Therapy" },
          ].map((industry) => (
            <div
              key={industry.name}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 px-6 py-5 font-medium"
            >
              <span className="text-2xl">{industry.icon}</span>
              {industry.name}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-gray-400">
            Pricing
          </p>
          <h2 className="mb-14 text-center text-4xl font-bold">
            Simple, transparent pricing.
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "€49",
                desc: "Perfect for small businesses just getting started.",
                features: ["1 phone number", "Up to 100 conversations/mo", "WhatsApp & SMS", "Email lead summaries"],
                highlight: false,
              },
              {
                name: "Growth",
                price: "€99",
                desc: "For growing businesses that can't miss a single lead.",
                features: ["1 phone number", "Unlimited conversations", "WhatsApp & SMS", "Calendar integration", "Priority support"],
                highlight: true,
              },
              {
                name: "Pro",
                price: "€199",
                desc: "For multi-location businesses and agencies.",
                features: ["Up to 5 phone numbers", "Unlimited conversations", "WhatsApp & SMS", "Calendar integration", "Dedicated onboarding"],
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl p-8 ${
                  plan.highlight
                    ? "bg-black text-white"
                    : "border border-gray-200 bg-white"
                }`}
              >
                <p className="mb-1 text-sm font-semibold uppercase tracking-widest opacity-60">
                  {plan.name}
                </p>
                <p className="mb-2 text-4xl font-bold">{plan.price}<span className="text-lg font-normal opacity-50">/mo</span></p>
                <p className={`mb-6 text-sm ${plan.highlight ? "text-gray-400" : "text-gray-500"}`}>
                  {plan.desc}
                </p>
                <ul className="mb-8 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? "text-gray-300" : "text-gray-600"}`}>
                      <span>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`block rounded-full py-3 text-center text-sm font-medium ${
                    plan.highlight
                      ? "bg-white text-black"
                      : "bg-black text-white"
                  }`}
                >
                  Get started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-400">
          Contact
        </p>
        <h2 className="mb-5 text-4xl font-bold">
          Ready to stop losing clients?
        </h2>
        <p className="mb-10 text-lg text-gray-500">
          Book a free 20-minute demo and we'll show you how Answerloop works for your business.
        </p>

        <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="mailto:hello@answerloop.io"
            className="flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 font-medium text-gray-700 hover:border-black"
          >
            ✉ hello@answerloop.io
          </a>
          <a
            href="https://wa.me/14788003855"
            className="flex items-center gap-2 rounded-full bg-black px-6 py-3 font-medium text-white"
          >
            💬 WhatsApp us
          </a>
        </div>

        <p className="text-sm text-gray-400">
          We typically respond within a few hours.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Answerloop. All rights reserved.
      </footer>

    </main>
  );
}
