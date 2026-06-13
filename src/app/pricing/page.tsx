import Link from "next/link";

export const metadata = {
  title: "Pricing — RingLoop",
  description: "Pricing tailored to your clinic — call volume, locations, integrations. No setup fee, no contract, cancel anytime.",
};

export default function Pricing() {
  return (
    <main className="bg-paper pt-16 text-ink">

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div className="halo pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-3xl">
          <p className="label mb-4 text-blue">Pricing</p>
          <h1 className="font-display mb-6 text-5xl leading-[1.05] md:text-6xl">
            Pricing that fits <em className="text-blue">your clinic.</em>
          </h1>
          <p className="text-lg text-ink-soft">
            Every clinic is different — call volume, locations, integrations. We shape the plan around yours.
          </p>
        </div>
      </section>

      {/* Pricing card */}
      <section className="mx-auto max-w-xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-night p-10 text-white shadow-2xl shadow-blue/10">
          <div className="dot-grid-dark pointer-events-none absolute inset-0" />
          <div className="night-glow pointer-events-none absolute inset-0" />

          <div className="relative">
            <p className="label mb-2 text-center text-sky/40">RingLoop · One plan, all features</p>
            <p className="font-display text-center text-5xl leading-[1.05] md:text-6xl">
              Your plan,<br /><em className="text-[#7fa6f8]">your price.</em>
            </p>
            <p className="mt-4 text-center text-sky/60">
              One flat monthly price per clinic — agreed upfront, shaped around your call volume.
            </p>
            <p className="mt-2 mb-10 text-center text-sm text-sky/40">
              No setup fee · No contract · Cancel anytime
            </p>

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
                <div key={f} className="flex items-center gap-3 text-sm text-sky/75">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue text-[10px] font-bold text-white">✓</span>
                  {f}
                </div>
              ))}
            </div>

            <Link href="/contact" className="btn-primary group block w-full py-4 text-center">
              Get your price — book a free demo
              <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <p className="mt-4 text-center text-xs text-sky/40">
              A 20-minute call — you&apos;ll have your exact price the same day.
            </p>
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="mx-auto max-w-5xl px-6 pb-28">
        <p className="label mb-4 text-center text-muted">What missed calls cost you</p>
        <h2 className="font-display mb-5 text-center text-4xl md:text-5xl">RingLoop pays for itself <em className="text-blue">fast.</em></h2>
        <p className="mb-16 text-center text-ink-soft">Here&apos;s the revenue a typical clinic leaves on the table every month.</p>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            { type: "Small clinic",  missed: "10 calls/month", recovered: "6 patients",  value: "€600",   hi: false },
            { type: "Medium clinic", missed: "20 calls/month", recovered: "12 patients", value: "€1,800", hi: true  },
            { type: "Busy clinic",   missed: "40 calls/month", recovered: "25 patients", value: "€3,750", hi: false },
          ].map((row, i) => (
            <div
              key={row.type}
              data-reveal
              className={`r-delay-${(i % 3) + 1} rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                row.hi
                  ? "bg-blue text-white shadow-xl shadow-blue/25"
                  : "card"
              }`}
            >
              <p className={`label mb-7 ${row.hi ? "text-white/70" : "text-muted"}`}>{row.type}</p>
              <div className="space-y-4">
                {[
                  { label: "Missed calls/month", value: row.missed },
                  { label: "Patients recovered", value: row.recovered },
                  { label: "Revenue recovered",  value: row.value },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className={row.hi ? "text-white/70" : "text-ink-soft"}>{item.label}</span>
                    <span className={`font-semibold ${row.hi ? "text-white" : "text-ink"}`}>{item.value}</span>
                  </div>
                ))}
              </div>
              <p className={`mt-7 text-xs leading-relaxed ${row.hi ? "text-white/60" : "text-muted"}`}>
                Recovered revenue, every month — typically a multiple of what RingLoop costs.
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-muted">
          Calculations based on 62% recovery rate and €150 average treatment value.
        </p>
      </section>

      {/* FAQ */}
      <section className="border-y border-[var(--line)] bg-white py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display mb-14 text-center text-4xl md:text-5xl">Pricing FAQ</h2>
          <div className="divide-y divide-[var(--line)]">
            {[
              { q: "How is the price determined?",               a: "By what your clinic actually needs: expected call volume, number of locations, and integrations like Google Calendar. You get one flat monthly price, agreed upfront — no surprises after." },
              { q: "Is there a setup fee?",                      a: "No. Setup and onboarding are completely free — we configure the AI, your services, your team, and your working hours." },
              { q: "Is there a contract or minimum commitment?", a: "No contract. You can cancel anytime with no penalty. We're confident you'll stay because it works." },
              { q: "Do I pay per call or per message?",          a: "No. Your monthly price covers unlimited calls and SMS confirmations — no usage fees, ever." },
              { q: "How does it work for multiple locations?",   a: "Each location gets its own number and AI persona, and we price them together — multi-location clinics get a combined quote." },
              { q: "Can I try it before paying?",                a: "Yes — talk to the AI right now on our live demo page, then book a free call and we'll set up a test with your clinic's details before you commit." },
            ].map((item) => (
              <div key={item.q} className="py-6">
                <h3 className="mb-2 font-semibold">{item.q}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{item.a}</p>
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
          <h2 className="font-display mb-6 text-4xl md:text-5xl">Get your price in <em className="text-[#7fa6f8]">one short call.</em></h2>
          <p className="mb-10 text-sky/60">Free demo, exact quote the same day — no payment, no commitment.</p>
          <Link href="/contact" className="btn-primary group inline-flex items-center gap-2 px-9 py-4">
            Book a free demo
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

    </main>
  );
}
