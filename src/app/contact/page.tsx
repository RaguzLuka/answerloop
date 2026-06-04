import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Contact — Ringloop",
  description: "Book a free demo or get in touch with the Ringloop team.",
};

export default function Contact() {
  return (
    <>
      <Nav />
      <main className="pt-16">

        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white px-6 py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-500">Contact</p>
            <h1 className="mb-5 text-5xl font-bold">Let's talk.</h1>
            <p className="text-lg text-gray-500">Book a free demo or reach out with any questions. We typically respond within a few hours.</p>
          </div>
        </section>

        {/* Lead form */}
        <section className="mx-auto max-w-2xl px-6 pb-4">
          <LeadForm />
        </section>

        {/* Contact options */}
        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-2">

            {/* Book a demo */}
            <div className="rounded-3xl bg-blue-600 p-10 text-white">
              <p className="mb-2 text-2xl font-bold">Book a free demo</p>
              <p className="mb-8 text-blue-100 text-sm leading-relaxed">
                See Ringloop working live with your clinic's details. 20 minutes, no commitment required.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "✉", label: "Email us", value: "hello@ringloop.net", href: "mailto:hello@ringloop.net" },
                  { icon: "💬", label: "WhatsApp us", value: "Message us directly", href: "https://wa.me/14788003855" },
                ].map((item) => (
                  <a key={item.label} href={item.href} className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 hover:bg-white/20 transition-colors">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-sm text-blue-200">{item.label}</p>
                      <p className="font-semibold">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-gray-200 p-8">
                <h3 className="mb-4 text-xl font-bold">What happens in a demo?</h3>
                <ul className="space-y-3">
                  {[
                    "We show you Ringloop working live",
                    "We configure it with your clinic's name",
                    "You see a real WhatsApp conversation",
                    "We answer all your questions",
                    "You decide if it's right for you — no pressure",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-gray-200 p-8">
                <h3 className="mb-4 text-xl font-bold">Response time</h3>
                <div className="space-y-3">
                  {[
                    { channel: "WhatsApp", time: "Usually within 1 hour" },
                    { channel: "Email", time: "Usually within a few hours" },
                  ].map((item) => (
                    <div key={item.channel} className="flex justify-between text-sm">
                      <span className="text-gray-500">{item.channel}</span>
                      <span className="font-medium text-green-600">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-gray-50 border border-gray-200 p-8">
                <h3 className="mb-2 font-bold">Based in Croatia 🇭🇷</h3>
                <p className="text-sm text-gray-500">We serve medical institutes across Croatia and Europe. Available in Croatian, English, and more.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
