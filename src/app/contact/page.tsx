import Link from "next/link";
import Icon from "@/components/Icon";
import LeadForm from "@/components/LeadForm";
import { Eyebrow, CheckDot } from "@/components/Section";

export const metadata = {
  title: "Book a demo",
  description:
    "Book a free 20-minute demo: see RingLoop text back a missed call and book the customer in by SMS — set up with your business name.",
};

const benefits = [
  "A live text-back set up with your business name",
  "A walkthrough of booking, confirmations and reminders",
  "Your exact monthly price — the same day",
  "Honest answers, zero pressure",
];

const next = [
  { title: "We reply within a few hours", desc: "To pick a time that suits you." },
  { title: "20-minute demo",              desc: "Tailored to your business and how you take bookings." },
  { title: "Live within 24 hours",        desc: "If you like it — no contract, cancel anytime." },
];

const channels = [
  { icon: "mail",        label: "Email us",  value: "hello@ringloop.net",  href: "mailto:hello@ringloop.net" },
  { icon: "instagram",   label: "Instagram", value: "@ringloop.io",        href: "https://instagram.com/ringloop.io" },
  { icon: "messageText", label: "Live demo", value: "Text the AI now",     href: "/demo" },
];

export default function Contact() {
  return (
    <main className="overflow-x-clip bg-paper text-ink">
      <section className="relative px-6 pb-24 pt-32 md:pt-40">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="halo pointer-events-none absolute inset-0" />

        {/* Phones: pitch → form → details. Desktop: pitch + details left, sticky form right. */}
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-x-16 lg:gap-y-0">
          <div className="lg:col-start-1 lg:row-start-1">
            <div className="animate-fade-up">
              <Eyebrow icon="calendarCheck">Book a demo</Eyebrow>
            </div>
            <h1 className="font-display animate-fade-up anim-d1 mt-6 text-[2.75rem] leading-[1.04] md:text-[3.6rem]">
              See RingLoop <em>book your customers.</em>
            </h1>
            <p className="animate-fade-up anim-d2 mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
              A 20-minute call. We&apos;ll set RingLoop up with your business name and show you a real
              missed-call text-back — live.
            </p>
          </div>

          <div className="animate-fade-up anim-d2 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            <LeadForm />
          </div>

          <div className="lg:col-start-1 lg:row-start-2 lg:mt-10">
            <ul className="animate-fade-up anim-d3 space-y-3.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px] text-ink">
                  <CheckDot />
                  {b}
                </li>
              ))}
            </ul>

            <div className="animate-fade-up anim-d4 mt-12">
              <p className="label mb-5 text-muted">What happens next</p>
              <ol className="space-y-5">
                {next.map((n, i) => (
                  <li key={n.title} className="relative flex gap-4">
                    {i < next.length - 1 && <span className="absolute left-4 top-10 -bottom-3 w-px bg-line" />}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue text-sm font-bold text-white shadow-md shadow-blue/20">
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <p className="font-semibold text-ink">{n.title}</p>
                      <p className="text-sm text-ink-soft">{n.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="animate-fade-up anim-d5 mt-12 grid gap-3 sm:grid-cols-3">
              {channels.map((c) => {
                const className = "lift group flex flex-col gap-2 rounded-2xl border border-line bg-white p-4 text-sm";
                const inner = (
                  <>
                    <Icon name={c.icon} className="h-4.5 w-4.5 text-blue" />
                    <span className="text-xs text-muted">{c.label}</span>
                    <span className="font-semibold text-ink group-hover:text-blue">{c.value}</span>
                  </>
                );
                if (c.href.startsWith("/")) {
                  return <Link key={c.label} href={c.href} className={className}>{inner}</Link>;
                }
                const external = c.href.startsWith("http");
                return (
                  <a
                    key={c.label}
                    href={c.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className={className}
                  >
                    {inner}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
