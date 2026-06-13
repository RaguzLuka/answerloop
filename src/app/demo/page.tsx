import Link from "next/link";
import Icon from "@/components/Icon";
import LiveDemo from "@/components/LiveDemo";

export const metadata = {
  title: "Live demo — talk to the AI receptionist right now",
  description:
    "No forms, no waiting. Click once and have a real voice conversation with RingLoop, the AI receptionist for medical clinics. Book a fictional appointment and hear exactly what your patients would hear.",
};

export default function DemoPage() {
  return (
    <main className="bg-paper pt-16 text-ink">

      {/* Hero + the demo itself — no scrolling needed to start */}
      <section className="relative overflow-hidden px-6 pt-24 pb-28">
        <div className="halo pointer-events-none absolute inset-0" />
        <div className="halo-drift pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] rounded-full bg-blue/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-blue/15 bg-white/70 px-4 py-1.5 text-xs font-semibold text-blue shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="ring-pulse absolute inline-flex h-full w-full rounded-full bg-blue" />
              <span className="relative h-2 w-2 rounded-full bg-blue" />
            </span>
            Live interactive demo — free, no sign-up
          </p>

          <h1 className="font-display mb-6 text-5xl leading-[1.05] md:text-6xl">
            Don&apos;t take our word for it.<br />
            <em className="text-blue">Talk to her.</em>
          </h1>
          <p className="mx-auto mb-14 max-w-lg text-lg leading-relaxed text-ink-soft">
            This is the exact AI receptionist your patients would hear. Book a fictional
            appointment at our demo clinic — right here in your browser.
          </p>

          <LiveDemo />

          <p className="mt-10 text-sm text-muted">
            Works in any modern browser — just allow the microphone when asked.
          </p>
        </div>
      </section>

      {/* What to try — turns curiosity into a guided test drive */}
      <section className="border-y border-[var(--line)] bg-white py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div data-reveal className="mb-14 text-center">
            <p className="label mb-4 text-muted">Put her to the test</p>
            <h2 className="font-display text-3xl md:text-4xl">Three things to try.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: "globe",         title: "Switch languages", desc: "Start in Croatian, switch to English or German mid-call. She follows you without missing a beat." },
              { icon: "message",       title: "Interrupt her",    desc: "Talk over her like a real caller in a hurry would. She stops, listens, and adapts." },
              { icon: "calendarCheck", title: "Book messy",       desc: "Give her everything at once — \"I'm Marko, whitening, Friday at 3\" — and watch her sort it out." },
            ].map((t, i) => (
              <div key={t.title} data-reveal className={`card r-delay-${i + 1} p-7 transition-all duration-300 hover:-translate-y-1`}>
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-sky text-blue">
                  <Icon name={t.icon} className="h-5 w-5" />
                </span>
                <h3 className="mb-2 font-semibold">{t.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The bridge from demo to deal */}
      <section className="relative overflow-hidden bg-night py-28 text-center text-white">
        <div className="dot-grid-dark pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_110%,_rgba(64,116,245,0.3),_transparent)]" />
        <div data-reveal className="relative mx-auto max-w-2xl px-6">
          <h2 className="font-display mb-6 text-4xl md:text-5xl">Liked what <em className="text-[#7fa6f8]">you heard?</em></h2>
          <p className="mb-10 text-lg leading-relaxed text-sky/60">
            In 24 hours, she can be answering <em>your</em> clinic&apos;s missed calls —
            with your name, your treatments, your doctors.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="btn-primary group px-9 py-4">
              Set it up for my clinic
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/pricing" className="rounded-full border border-sky/25 px-9 py-4 font-semibold text-white transition-all duration-300 hover:border-[#7fa6f8]/60 hover:bg-white/5">
              See what&apos;s included
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
