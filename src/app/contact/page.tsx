import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Contact — RingLoop",
  description: "Book a free demo or get in touch with the RingLoop team.",
};

export default function Contact() {
  return (
    <>
      <Nav />
      <main className="pt-16">

        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-24 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,_#dbeafe,_transparent)]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Contact</p>
            <h1 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl">Let&apos;s talk.</h1>
            <p className="text-lg text-gray-500 leading-relaxed">Book a free demo or reach out with any questions. We typically respond within a few hours.</p>
          </div>
        </section>

        {/* Lead form */}
        <section className="mx-auto max-w-2xl px-6 pb-6">
          <LeadForm />
        </section>

        {/* Contact options */}
        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-2">

            {/* Book a demo */}
            <div className="relative overflow-hidden rounded-2xl bg-blue-600 p-10 text-white shadow-xl shadow-blue-200">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,_rgba(255,255,255,0.12),_transparent)] pointer-events-none" />
              <div className="relative">
                <p className="mb-2 text-2xl font-bold tracking-tight">Book a free demo</p>
                <p className="mb-8 text-blue-100 text-sm leading-relaxed">
                  See RingLoop working live with your clinic&apos;s details. 20 minutes, no commitment required.
                </p>
                <div className="space-y-3">
                  {[
                    { icon: "✉", label: "Email us",     value: "hello@ringloop.net",    href: "mailto:hello@ringloop.net" },
                    { icon: "💬", label: "WhatsApp us",  value: "Message us directly",   href: "https://wa.me/14788003855" },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 hover:bg-white/20 transition-colors"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-xs text-blue-200">{item.label}</p>
                        <p className="font-semibold">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Info panels */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
                <h3 className="mb-4 font-bold text-lg tracking-tight">What happens in a demo?</h3>
                <ul className="space-y-3">
                  {[
                    "We show you RingLoop working live",
                    "We configure it with your clinic's name",
                    "You see a real WhatsApp conversation",
                    "We answer all your questions",
                    "You decide if it's right for you — no pressure",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
                <h3 className="mb-4 font-bold text-lg tracking-tight">Response time</h3>
                <div className="space-y-3">
                  {[
                    { channel: "WhatsApp", time: "Usually within 1 hour" },
                    { channel: "Email",    time: "Usually within a few hours" },
                  ].map((item) => (
                    <div key={item.channel} className="flex justify-between text-sm">
                      <span className="text-gray-500">{item.channel}</span>
                      <span className="font-medium text-green-600">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-7">
                <h3 className="mb-1.5 font-bold">Based in Croatia 🇭🇷</h3>
                <p className="text-sm text-gray-500 leading-relaxed">We serve medical institutes across Croatia and Europe. Available in Croatian, English, and more.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
