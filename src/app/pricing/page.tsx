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
        <section className="bg-gradient-to-b from-blue-50 to-white px-6 py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">Pricing</p>
            <h1 className="mb-5 text-5xl font-bold">Simple, transparent pricing.</h1>
            <p className="text-lg text-gray-500">One plan. Everything included. No surprises.</p>
          </div>
        </section>

        {/* Pricing card */}
        <section className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-3xl bg-gray-950 p-10 text-white text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Ringloop</p>
            <p className="mb-1 text-7xl font-bold">€200</p>
            <p className="mb-2 text-gray-400">/month per clinic location</p>
            <p className="mb-10 text-sm text-gray-500">No setup fee · No contract · Cancel anytime</p>

            <div className="mb-10 grid gap-3 text-left sm:grid-cols-2">
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
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs text-white">✓</span>
                  {f}
                </div>
              ))}
            </div>

            <Link href="/contact" className="block rounded-full bg-blue-600 py-4 text-center font-medium text-white hover:bg-blue-700 transition-colors">
              Book a free demo →
            </Link>
          </div>
        </section>

        {/* ROI section */}
        <section className="mx-auto max-w-4xl px-6 py-16">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">ROI Calculator</p>
          <h2 className="mb-4 text-center text-4xl font-bold">Ringloop pays for itself fast.</h2>
          <p className="mb-14 text-center text-gray-500">Here's what a typical clinic earns back with Ringloop.</p>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                type: "Small clinic",
                missed: "10 calls/month",
                recovered: "6 patients",
                value: "€600",
                cost: "€200",
                profit: "€400",
                roi: "200%",
              },
              {
                type: "Medium clinic",
                missed: "20 calls/month",
                recovered: "12 patients",
                value: "€1,800",
                cost: "€200",
                profit: "€1,600",
                roi: "800%",
                highlight: true,
              },
              {
                type: "Busy clinic",
                missed: "40 calls/month",
                recovered: "25 patients",
                value: "€3,750",
                cost: "€200",
                profit: "€3,550",
                roi: "1,775%",
              },
            ].map((row) => (
              <div key={row.type} className={`rounded-3xl p-8 border ${row.highlight ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200"}`}>
                <p className={`mb-6 text-sm font-semibold uppercase tracking-widest ${row.highlight ? "text-blue-200" : "text-gray-400"}`}>{row.type}</p>
                <div className="space-y-3">
                  {[
                    { label: "Missed calls/month", value: row.missed },
                    { label: "Patients recovered", value: row.recovered },
                    { label: "Revenue recovered", value: row.value },
                    { label: "Ringloop cost", value: row.cost },
                    { label: "Net profit", value: row.profit },
                    { label: "ROI", value: row.roi },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className={row.highlight ? "text-blue-200" : "text-gray-500"}>{item.label}</span>
                      <span className={`font-semibold ${row.highlight ? "text-white" : "text-gray-900"}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-gray-400">Calculations based on 62% recovery rate and €150 average treatment value.</p>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 py-24">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-14 text-center text-4xl font-bold">Pricing FAQ</h2>
            <div className="space-y-6">
              {[
                { q: "Is there a setup fee?", a: "No. Setup and onboarding is completely free. You only pay the €200/month subscription." },
                { q: "Is there a contract or minimum commitment?", a: "No contract. You can cancel anytime with no penalty. We're confident you'll stay because it works." },
                { q: "What happens when I cancel?", a: "Your WhatsApp number and AI stop working at the end of the billing month. No questions asked." },
                { q: "Do I pay per message or per call?", a: "No. €200/month covers unlimited conversations — no per-message or per-call fees." },
                { q: "How much for multiple clinic locations?", a: "Each location is €200/month. Each gets its own dedicated WhatsApp number and AI persona." },
                { q: "Can I try it before paying?", a: "Yes — book a free demo and we'll show you a live test with your clinic's details before you commit." },
              ].map((item) => (
                <div key={item.q} className="border-b border-gray-200 pb-6">
                  <h3 className="mb-2 font-bold">{item.q}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-600 py-24 text-white text-center">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="mb-5 text-4xl font-bold">Start recovering missed patients today.</h2>
            <p className="mb-8 text-blue-100">Book a free demo — no payment required.</p>
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
