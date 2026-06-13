import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Contact — RingLoop",
  description: "Book a free demo or get in touch with the RingLoop team.",
};

export default function Contact() {
  return (
    <main className="bg-paper pt-16 text-ink">

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div className="halo pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-3xl">
          <p className="label mb-4 text-blue">Contact</p>
          <h1 className="font-display mb-6 text-5xl leading-[1.05] md:text-6xl">
            Let&apos;s <em className="text-blue">talk.</em>
          </h1>
          <p className="text-lg leading-relaxed text-ink-soft">
            Book a free demo or reach out with any questions. We typically respond within a few hours.
          </p>
        </div>
      </section>

      {/* Lead form */}
      <section className="mx-auto max-w-2xl px-6 pb-8">
        <LeadForm />
      </section>

      {/* Contact options */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">

          {/* Book a demo */}
          <div className="relative overflow-hidden rounded-3xl bg-night p-10 text-white shadow-xl shadow-blue/10">
            <div className="night-glow pointer-events-none absolute inset-0" />
            <div className="relative">
              <p className="font-display mb-3 text-3xl">Book a <em className="text-[#7fa6f8]">free demo</em></p>
              <p className="mb-8 text-sm leading-relaxed text-sky/60">
                See RingLoop working live with your clinic&apos;s details. 20 minutes, no commitment required.
              </p>
              <div className="space-y-3">
                {[
                  { label: "Email us",  value: "hello@ringloop.net",       href: "mailto:hello@ringloop.net" },
                  { label: "Live demo", value: "Talk to the AI right now", href: "/demo" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 rounded-2xl bg-white/5 border border-[var(--line-dark)] p-4 transition-colors hover:bg-white/10"
                  >
                    <div>
                      <p className="text-xs text-sky/45">{item.label}</p>
                      <p className="font-semibold">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Info panels */}
          <div className="space-y-5">
            <div className="card p-7">
              <h3 className="font-display mb-4 text-xl">What happens in a demo?</h3>
              <ul className="space-y-3.5">
                {[
                  "We show you RingLoop working live",
                  "We configure it with your clinic's name",
                  "You hear a real booking conversation",
                  "We answer all your questions",
                  "You decide if it's right for you — no pressure",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-soft">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky text-[10px] font-bold text-blue">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-7">
              <h3 className="font-display mb-4 text-xl">Response time</h3>
              <div className="space-y-3">
                {[
                  { channel: "Email",     time: "Usually within a few hours" },
                  { channel: "Demo form", time: "Same day" },
                ].map((item) => (
                  <div key={item.channel} className="flex justify-between text-sm">
                    <span className="text-ink-soft">{item.channel}</span>
                    <span className="font-medium text-blue">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-white/60 p-7">
              <h3 className="mb-1.5 font-display text-xl">Based in Croatia 🇭🇷</h3>
              <p className="text-sm leading-relaxed text-ink-soft">
                We serve medical institutes across Croatia and Europe. Available in Croatian, English, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
