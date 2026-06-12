import Link from "next/link";

export const metadata = {
  title: "Pricing — RingLoop",
  description: "Pricing tailored to your clinic — call volume, locations, integrations. No setup fee, no contract, cancel anytime.",
};

export default function Pricing() {
  return (
      <main className="pt-16">

        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-24 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,_#dbeafe,_transparent)]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Pricing</p>
            <h1 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl">Pricing that fits your clinic.</h1>
            <p className="text-lg text-gray-500">Every clinic is different — call volume, locations, integrations. We shape the plan around yours.</p>
          </div>
        </section>

        {/* Pricing card */}
        <section className="mx-auto max-w-xl px-6 pb-20">
          <div className="relative overflow-hidden rounded-2xl bg-[#060e1f] p-10 text-white shadow-2xl">
            <div className="dot-grid absolute inset-0 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,_rgba(37,99,235,0.25),_transparent)] pointer-events-none" />

            <div className="relative">
              <p className="mb-1.5 text-center text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">RingLoop</p>
              <p className="text-center text-6xl font-bold tracking-tight md:text-7xl">Your plan,<br />your price</p>
              <p className="mt-3 text-center text-gray-400">One flat monthly price per clinic — agreed upfront, shaped around your call volume</p>
              <p className="mt-2 mb-10 text-center text-sm text-gray-600">No setup fee · No contract · Cancel anytime</p>

              <div className="mb-10 grid gap-3 sm:grid-cols-2">
                {[
                  "AI voice receptionist (24/7)",
                  "Answers every forwarded call",
                  "Books appointments by voice",
                  "SMS confirmation to every patient",
                  "Booking alerts to your team",
                  "Google Calendar integration",
                  "Collects name, treatment & therapist",
                  "Custom AI persona for your clinic",
                  "Multi-language AI support",
                  "Knows your team, hours & services",
                  "Priority support",
                  "Full setup & onboarding included",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">✓</span>
                    {f}
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className="btn-shine group block w-full rounded-full bg-blue-600 py-4 text-center font-semibold text-white shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-all duration-200"
              >
                Get your price — book a free demo
                <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
              <p className="mt-4 text-center text-xs text-gray-500">A 20-minute call — you&apos;ll have your exact price the same day.</p>
            </div>
          </div>
        </section>

        {/* ROI */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">What missed calls cost you</p>
          <h2 className="mb-4 text-center text-4xl font-bold tracking-tight">RingLoop pays for itself fast.</h2>
          <p className="mb-14 text-center text-gray-500">Here&apos;s the revenue a typical clinic leaves on the table every month.</p>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { type: "Small clinic",  missed: "10 calls/month", recovered: "6 patients",  value: "€600",   hi: false },
              { type: "Medium clinic", missed: "20 calls/month", recovered: "12 patients", value: "€1,800", hi: true  },
              { type: "Busy clinic",   missed: "40 calls/month", recovered: "25 patients", value: "€3,750", hi: false },
            ].map((row, i) => (
              <div
                key={row.type}
                data-reveal
                className={`r-delay-${(i % 3) + 1} rounded-2xl p-8 border transition-all duration-200 hover:-translate-y-0.5 ${
                  row.hi
                    ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200"
                    : "bg-white border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                <p className={`mb-6 text-xs font-semibold uppercase tracking-[0.12em] ${row.hi ? "text-blue-200" : "text-gray-400"}`}>{row.type}</p>
                <div className="space-y-3">
                  {[
                    { label: "Missed calls/month",  value: row.missed },
                    { label: "Patients recovered",  value: row.recovered },
                    { label: "Revenue recovered",   value: row.value },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className={row.hi ? "text-blue-200" : "text-gray-500"}>{item.label}</span>
                      <span className={`font-semibold ${row.hi ? "text-white" : "text-gray-900"}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <p className={`mt-6 text-xs ${row.hi ? "text-blue-200" : "text-gray-400"}`}>
                  Recovered revenue, every month — typically a multiple of what RingLoop costs.
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-gray-400">Calculations based on 62% recovery rate and €150 average treatment value.</p>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50/80 border-y border-gray-100 py-24">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-14 text-center text-4xl font-bold tracking-tight">Pricing FAQ</h2>
            <div className="divide-y divide-gray-100">
              {[
                { q: "How is the price determined?",               a: "By what your clinic actually needs: expected call volume, number of locations, and integrations like Google Calendar. You get one flat monthly price, agreed upfront — no surprises after." },
                { q: "Is there a setup fee?",                      a: "No. Setup and onboarding are completely free — we configure the AI, your services, your team, and your working hours." },
                { q: "Is there a contract or minimum commitment?", a: "No contract. You can cancel anytime with no penalty. We're confident you'll stay because it works." },
                { q: "Do I pay per call or per message?",          a: "No. Your monthly price covers unlimited calls and SMS confirmations — no usage fees, ever." },
                { q: "How does it work for multiple locations?",   a: "Each location gets its own number and AI persona, and we price them together — multi-location clinics get a combined quote." },
                { q: "Can I try it before paying?",                a: "Yes — talk to the AI right now on our live demo page, then book a free call and we'll set up a test with your clinic's details before you commit." },
              ].map((item) => (
                <div key={item.q} className="py-6">
                  <h3 className="mb-2 font-semibold text-gray-900">{item.q}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
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
            <h2 className="mb-5 text-4xl font-bold tracking-tight">Get your price in one short call.</h2>
            <p className="mb-8 text-gray-400">Free demo, exact quote the same day — no payment, no commitment.</p>
            <Link
              href="/contact"
              className="btn-shine group inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all duration-200"
            >
              Book a free demo
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </section>

      </main>
  );
}
