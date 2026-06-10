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
    <main className="pt-16">

      {/* Hero + the demo itself — no scrolling needed to start */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,_#dbeafe,_transparent)]" />
        <div className="animate-aurora pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] rounded-full bg-blue-300/25 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-blue-200/70 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-blue-600" />
            </span>
            Live interactive demo — free, no sign-up
          </div>

          <h1 className="mb-5 text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl">
            Don&apos;t take our word for it.<br />
            <span className="text-blue-600">Talk to her.</span>
          </h1>
          <p className="mx-auto mb-12 max-w-lg text-lg text-slate-500 leading-relaxed">
            This is the exact AI receptionist your patients would hear. Book a fictional appointment at our demo clinic — right here in your browser.
          </p>

          <LiveDemo />

          <p className="mt-8 text-sm text-slate-400">
            Prefer a real phone call? Dial{" "}
            <a href="tel:+14788003855" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">+1 478 800 3855</a>
            {" "}— she answers there too.
          </p>
        </div>
      </section>

      {/* What to try — turns curiosity into a guided test drive */}
      <section className="border-y border-slate-100 bg-[#f8faff] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div data-reveal>
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Put her to the test</p>
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">Three things to try.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: "globe",   title: "Switch languages", desc: "Start in Croatian, switch to English or German mid-call. She follows you without missing a beat." },
              { icon: "message", title: "Interrupt her",    desc: "Talk over her like a real caller in a hurry would. She stops, listens, and adapts." },
              { icon: "calendarCheck", title: "Book messy", desc: "Give her everything at once — \"I'm Marko, whitening, Friday at 3\" — and watch her sort it out." },
            ].map((t, i) => (
              <div key={t.title} data-reveal className={`r-delay-${i + 1} rounded-2xl border border-slate-100 bg-white p-7 shadow-sm`}>
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon name={t.icon} className="h-5.5 w-5.5" />
                </span>
                <h3 className="mb-2 font-semibold text-slate-900">{t.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The bridge from demo to deal */}
      <section className="relative overflow-hidden bg-[#050c1e] py-24 text-white text-center">
        <div className="dot-grid absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,_rgba(37,99,235,0.3),_transparent)] pointer-events-none" />
        <div data-reveal className="relative mx-auto max-w-2xl px-6">
          <h2 className="mb-5 text-4xl font-bold tracking-tight">Liked what you heard?</h2>
          <p className="mb-9 text-lg text-slate-400 leading-relaxed">
            In 24 hours, she can be answering <em>your</em> clinic&apos;s missed calls — with your name, your treatments, your doctors.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="group rounded-full bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-all duration-300">
              Set it up for my clinic
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/pricing" className="rounded-full border border-white/20 px-8 py-4 font-semibold text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300">
              €200/month — see what&apos;s included
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
