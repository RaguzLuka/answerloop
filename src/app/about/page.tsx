import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import { SectionHeading } from "@/components/Section";

export const metadata = {
  title: "About",
  description:
    "Why we built RingLoop: SMS automation that makes sure no customer goes unanswered. Built in Croatia for small businesses across Europe.",
};

const whySms = [
  { icon: "smartphone", title: "Every phone has it", desc: "No app to download, no account to create. If someone can call you, they can text you." },
  { icon: "clock",      title: "On their own time", desc: "They reply between meetings, on the tram, or from the sofa — no hold music, no phone tag." },
  { icon: "bell",       title: "It actually gets read", desc: "Texts get opened within minutes. Voicemails wait for days — if they're ever played at all." },
];

const principles = [
  {
    icon: "userCheck",
    title: "Customers first",
    desc: "Every text is short, clear and kind. The assistant is honest about what it is, and if someone needs a person, they get one.",
  },
  {
    icon: "store",
    title: "Your business, your name",
    desc: "Texts arrive under your business name and sound like you. The relationship stays yours — RingLoop stays invisible.",
  },
  {
    icon: "shieldCheck",
    title: "Privacy is the baseline",
    desc: "We serve businesses across the EU — medical practices included. GDPR, data minimisation and transparency aren't features — they're the floor.",
  },
];

const facts = [
  { number: "24/7",  label: "every missed call answered" },
  { number: "< 5s",  label: "from missed call to text" },
  { number: "24h",   label: "from sign-up to live" },
  { number: "GDPR",  label: "compliant by design" },
];

export default function About() {
  return (
    <main className="overflow-x-clip bg-paper text-ink">
      <PageHero
        eyebrow="About RingLoop"
        icon="sparkles"
        title={<>No customer should <em>go unanswered.</em></>}
        sub="That one sentence is the whole company. Here's why we built RingLoop — and why we built it around the humble text message."
      />

      {/* Story */}
      <section className="px-6 pb-20">
        <div data-reveal className="card mx-auto max-w-3xl space-y-6 p-8 text-[17px] leading-relaxed text-ink-soft md:p-12">
          <p>
            Every busy business knows the moment: the chair is full, the kitchen is slammed, the team
            is with customers — and the phone rings. And rings. Eventually it stops, and somewhere,
            that caller just booked with someone else.
          </p>
          <p>
            Missed calls aren&apos;t a staffing problem. Nobody can be on the phone at 9 PM, on a
            Sunday, or while helping the customer standing right in front of them. And voicemail is
            where bookings go to die.
          </p>
          <p>
            Meanwhile, people have moved on from phone calls. Most would rather send a quick text
            than wait on hold. So we built RingLoop around the channel everyone already uses: a simple
            SMS. It replies the moment a call is missed, books the appointment or table in a friendly
            conversation, and keeps the customer reminded until they walk through your door.
          </p>
          <p className="font-display text-2xl leading-snug text-ink">
            You focus on the people in front of you. <em>RingLoop takes care of everyone else.</em>
          </p>
        </div>
      </section>

      {/* Why SMS */}
      <section className="border-y border-line bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Why SMS"
            icon="messageText"
            title={<>The simplest channel <em>wins.</em></>}
          />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {whySms.map((w, i) => (
              <div key={w.title} data-reveal className={`card lift r-delay-${i + 1} p-8`}>
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-sky text-blue">
                  <Icon name={w.icon} className="h-5 w-5" />
                </span>
                <h3 className="mb-2 font-semibold">{w.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="What we believe"
            icon="star"
            title={<>Three principles we <em>won&apos;t bend.</em></>}
          />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {principles.map((v, i) => (
              <div key={v.title} data-reveal className={`card lift r-delay-${i + 1} p-8`}>
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-sky text-blue">
                  <Icon name={v.icon} className="h-5 w-5" />
                </span>
                <h3 className="mb-2 font-semibold">{v.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facts strip */}
      <section className="border-y border-line bg-white py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-10 px-6 md:grid-cols-4">
          {facts.map((stat, i) => (
            <div key={stat.label} data-reveal className={`reveal-pop r-delay-${(i % 3) + 1} text-center`}>
              <p className="font-display mb-2 text-[2.6rem] leading-none text-blue">{stat.number}</p>
              <p className="mx-auto max-w-[180px] text-sm leading-snug text-ink-soft">{stat.label}</p>
            </div>
          ))}
        </div>
        <p data-reveal className="mt-12 text-center text-sm text-muted">
          Built in Croatia — for businesses across Europe.
        </p>
      </section>

      <CtaBand
        title={<>See what your customers <em>would see.</em></>}
        sub="Text one of our demo businesses right now in your browser, or book a free demo with our team."
        primary={{ href: "/demo", label: "Try the live demo" }}
        secondary={{ href: "/contact", label: "Book a free demo" }}
      />
    </main>
  );
}
