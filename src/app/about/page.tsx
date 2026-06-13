import Link from "next/link";
import Icon from "@/components/Icon";

export const metadata = {
  title: "About — RingLoop",
  description:
    "Why we built RingLoop: an AI voice receptionist that makes sure no patient call ever goes unanswered. Built in Croatia for medical institutes across Europe.",
};

export default function About() {
  return (
    <main className="bg-paper pt-16 text-ink">

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div className="halo pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-3xl">
          <p className="label mb-4 text-blue">About RingLoop</p>
          <h1 className="font-display mb-6 text-5xl leading-[1.05] md:text-6xl">
            No patient call should <em className="text-blue">go unanswered.</em>
          </h1>
          <p className="text-lg leading-relaxed text-ink-soft">
            That one sentence is the whole company. Here&apos;s why we built RingLoop —
            and what we believe a clinic&apos;s phone line should be.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div data-reveal className="card space-y-6 p-10 leading-relaxed text-ink-soft">
          <p>
            Every clinic knows the moment: the waiting room is full, the team is with
            patients, and the phone rings. And rings. Eventually it stops — and somewhere,
            a patient just booked with the clinic next door.
          </p>
          <p>
            Missed calls aren&apos;t a staffing problem. Even the best front desk can&apos;t
            be on the phone at 9 PM, on Sunday, or while helping the patient standing in
            front of them. Hiring more people for the phone is expensive; voicemail is
            where bookings go to die.
          </p>
          <p>
            So we built RingLoop: an AI receptionist that answers the calls your team
            can&apos;t, speaks naturally in your patient&apos;s language, books the
            appointment on the spot, and confirms it by SMS. It introduces itself as
            <em> your</em> clinic, knows your doctors and your hours, and never takes a
            day off.
          </p>
          <p className="font-medium text-ink">
            Your team focuses on the patients in the room. RingLoop takes care of the
            ones on the line.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div data-reveal className="mb-14 text-center">
          <p className="label mb-4 text-muted">What we believe</p>
          <h2 className="font-display text-4xl md:text-5xl">Three principles we <em className="text-blue">won&apos;t bend.</em></h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: "phone",
              title: "The patient comes first",
              desc: "A call is a person who needs help. The AI is warm, patient, and clear — and if someone just needs to reach a human, it never stands in the way.",
            },
            {
              icon: "clinic",
              title: "Your clinic, your name",
              desc: "RingLoop is invisible to your patients. The AI answers as your clinic, the SMS arrives under your name, and the relationship stays yours.",
            },
            {
              icon: "clipboard",
              title: "Privacy is non-negotiable",
              desc: "We serve medical institutes in the EU. GDPR compliance, data minimisation, and transparent processing aren't features — they're the baseline.",
            },
          ].map((v, i) => (
            <div key={v.title} data-reveal className={`card r-delay-${i + 1} p-8 transition-all duration-300 hover:-translate-y-1`}>
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-sky text-blue">
                <Icon name={v.icon} className="h-5 w-5" />
              </span>
              <h3 className="mb-2 font-semibold">{v.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Facts strip */}
      <section className="border-y border-[var(--line)] bg-white py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-10 px-6 md:grid-cols-4">
          {[
            { number: "🇭🇷",   label: "Built in Croatia, for Europe" },
            { number: "24/7", label: "your line, always answered" },
            { number: "24h",  label: "from sign-up to live" },
            { number: "GDPR", label: "compliant by design" },
          ].map((stat, i) => (
            <div key={stat.label} data-reveal className={`reveal-pop r-delay-${(i % 3) + 1} text-center`}>
              <p className="font-display mb-2 text-[2.4rem] leading-none text-blue">{stat.number}</p>
              <p className="mx-auto max-w-[180px] text-sm leading-snug text-ink-soft">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-night py-28 text-center text-white">
        <div className="dot-grid-dark pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_110%,_rgba(64,116,245,0.3),_transparent)]" />
        <div data-reveal className="relative mx-auto max-w-2xl px-6">
          <h2 className="font-display mb-6 text-4xl md:text-5xl">Hear what your patients <em className="text-[#7fa6f8]">would hear.</em></h2>
          <p className="mb-10 text-sky/60">Talk to the AI right now in your browser, or book a free demo with our team.</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/demo" className="btn-primary group px-9 py-4">
              Try the live demo
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/contact" className="rounded-full border border-sky/25 px-9 py-4 font-semibold text-white transition-all duration-300 hover:border-[#7fa6f8]/60 hover:bg-white/5">
              Book a free demo
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
