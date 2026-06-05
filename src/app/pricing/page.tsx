import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Pricing — Ringloop",
  description: "Simple, transparent pricing. €200/month per clinic location. Everything included.",
};

export default function Pricing() {
  return (
    <>
      <Nav />
      <main className="pt-16">

        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-24 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,_#dbeafe,_transparent)]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Pricing</p>
            <h1 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl">Simple, transparent pricing.</h1>
            <p className="text-lg text-gray-500">One plan. Everything included. No surprises.</p>
          </div>
        </section>

        {/* Pricing card */}
        <section className="mx-auto max-w-xl px-6 pb-20">
          <div className="relative overflow-hidden rounded-2xl bg-[#060e1f] p-10 text-white shadow-2xl">
            <div className="dot-grid absolute inset-0 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,_rgba(37,99,235,0.25),_transparent)] pointer-events-none" />

            <div className="relative">
              <p className="mb-1.5 text-center text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Ringloop</p>
              <p className="text-center text-8xl font-bold tracking-tight">€200</p>
              <p className="mt-1 text-center text-gray-400">/month per clinic location</p>
              <p className="mt-2 mb-10 text-center text-sm text-gray-600">No setup fee · No contract · Cancel anytime</p>

              <div className="mb-10 grid gap-3 sm:grid-cols-2">
                {[
                  "Dedicated WhatsApp number",
                  "Unlimited AI conversations",
                  "WhatsApp & SMS follow-ups",
                  "Automatic appointment booking",
                  "Collects name, treatment & doctor",
                  "Patient lead summary per booking",
                  "Multi-language AI support",
                  "Custom AI persona for your clinic",
                  "Missed call trigger (24/7)",
                  "Google Calendar integration",
                  "Priority email & WhatsApp support",
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
                className="group block w-full rounded-full bg-blue-600 py-4 text-center font-semibold text-white shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-all duration-200"
              >
                Book a free demo
                <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ROI */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">ROI Calculator</p>
          <h2 className="mb-4 text-center text-4xl font-bold tracking-tight">Ringloop pays for itself fast.</h2>
          <p className="mb-14 text-center text-gray-500">Here&apos;s what a typical clinic earns back with Ringloop.</p>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { type: "Small clinic",  missed: "10 calls/month", recovered: "6 patients",  value: "€600",   cost: "€200", profit: "€400",   roi: "200%",    hi: false },
              { type: "Medium clinic", missed: "20 calls/month", recovered: "12 patients", value: "€1,800", cost: "€200", profit: "€1,600", roi: "800%",    hi: true  },
              { type: "Busy clinic",   missed: "40 calls/month", recovered: "25 patients", value: "€3,750", cost: "€200", profit: "€3,550", roi: "1,775%",  hi: false },
            ].map((row) => (
              <div
                key={row.type}
                className={`rounded-2xl p-8 border transition-all duration-200 hover:-translate-y-0.5 ${
                  row.hi
                    ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200"
                    : "bg-white border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                <p className={`mb-6 text-xs font-semibold uppercase tracking-[0.12em] ${row.hi ? "text-blue-200" : "text-gray-400"}`}>{row.type}</p>
                <div className="space-y-3">
                  {[
                    { label: "Missed calls/month", value: row.missed },
                    { label: "Patients recovered", value: row.recovered },
                    { label: "Revenue recovered",  value: row.value },
                    { label: "Ringloop cost",       value: row.cost },
                    { label: "Net profit",          value: row.profit },
                    { label: "ROI",                 value: row.roi },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className={row.hi ? "text-blue-200" : "text-gray-500"}>{item.label}</span>
                      <span className={`font-semibold ${row.hi ? "text-white" : "text-gray-900"}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
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
                { q: "Is there a setup fee?",                     a: "No. Setup and onboarding is completely free. You only pay the €200/month subscription." },
                { q: "Is there a contract or minimum commitment?", a: "No contract. You can cancel anytime with no penalty. We're confident you'll stay because it works." },
                { q: "What happens when I cancel?",               a: "Your WhatsApp number and AI stop working at the end of the billing month. No questions asked." },
                { q: "Do I pay per message or per call?",         a: "No. €200/month covers unlimited conversations — no per-message or per-call fees." },
                { q: "How much for multiple clinic locations?",   a: "Each location is €200/month. Each gets its own dedicated WhatsApp number and AI persona." },
                { q: "Can I try it before paying?",              a: "Yes — book a free demo and we'll show you a live test with your clinic's details before you commit." },
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
            <h2 className="mb-5 text-4xl font-bold tracking-tight">Start recovering missed patients today.</h2>
            <p className="mb-8 text-gray-400">Book a free demo — no payment required.</p>
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
