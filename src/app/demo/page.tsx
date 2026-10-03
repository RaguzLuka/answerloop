import Icon from "@/components/Icon";
import SmsDemo from "@/components/SmsDemo";
import CtaBand from "@/components/CtaBand";
import { Eyebrow } from "@/components/Section";
import Halo from "@/components/Halo";

export const metadata = {
  title: "Live SMS demo",
  description:
    "No forms, no waiting. Pick a business — salon, barbershop, nail studio, restaurant or clinic — call it, get the missed-call text-back, and book by SMS with RingLoop's AI, right in your browser.",
};

const tips = [
  {
    icon: "languages",
    title: "Switch languages",
    desc: "Start in Croatian, then switch to English or German mid-chat. It follows you without missing a beat.",
  },
  {
    icon: "messages",
    title: "Text like a real customer",
    desc: "Send it all at once — \"I'm Ana, cut & colour, Friday after 3\" — typos included, and watch it sort things out.",
  },
  {
    icon: "rotate",
    title: "Change your mind",
    desc: "Once you're booked, ask to move it to another day. Rescheduling is just another text.",
  },
];

export default function DemoPage() {
  return (
    <main className="overflow-x-clip bg-paper text-ink">
      {/* Hero + the demo itself — no scrolling needed to start */}
      <section className="relative px-6 pb-24 pt-32 md:pt-40">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="halo pointer-events-none absolute inset-0" />
        <div className="halo-drift pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] rounded-full bg-blue/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Halo pose="talk" size={96} priority decorative className="animate-float mx-auto mb-4 h-20 w-20 md:h-24 md:w-24" />
            <div className="animate-fade-up mb-6">
              <Eyebrow icon="messageText">Live demo · text Halo · no sign-up</Eyebrow>
            </div>
            <h1 className="font-display animate-fade-up anim-d1 text-[2.75rem] leading-[1.04] md:text-6xl">
              Be the customer. <em>Watch it book.</em>
            </h1>
            <p className="animate-fade-up anim-d2 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Pick a business, call it, get the text-back, and book by SMS with Halo — exactly what your
              customers would experience. Right here in your browser.
            </p>
          </div>

          <div className="animate-fade-up anim-d3">
            <SmsDemo
              aside={
                <div className="mt-8">
                  <p className="label mb-3 text-muted">Put it to the test</p>
                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                    {tips.map((t) => (
                      <div key={t.title} className="rounded-2xl border border-line bg-white/70 p-5">
                        <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-sky text-blue">
                          <Icon name={t.icon} className="h-4.5 w-4.5" />
                        </span>
                        <h2 className="text-sm font-semibold text-ink">{t.title}</h2>
                        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Liked what you saw?"
        title={<>This could be texting <em>your customers tomorrow.</em></>}
        sub="Your business name, your services, your team — live within 24 hours."
        primary={{ href: "/contact", label: "Set it up for my business" }}
        secondary={{ href: "/pricing", label: "See pricing" }}
      />
    </main>
  );
}
