import Link from "next/link";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import RoiCalculator from "@/components/RoiCalculator";
import CtaBand from "@/components/CtaBand";
import PricingPlans from "@/components/PricingPlans";
import Faq, { faqJsonLd, type FaqItem } from "@/components/Faq";
import { Eyebrow, SectionHeading } from "@/components/Section";

export const metadata = {
  title: "Pricing",
  description:
    "Three simple plans: Start from €59/month, Pro €149/month with voice, and Business for multiple locations. 14-day free trial, no contract, cancel anytime.",
};

const always = [
  { icon: "sparkles",    text: "14-day free trial" },
  { icon: "check",       text: "No setup fee on Start & Pro" },
  { icon: "x",           text: "No contract — cancel anytime" },
  { icon: "lock",        text: "Partner price locked in while you stay" },
];

const faqs: FaqItem[] = [
  {
    q: "Which plan is right for me?",
    a: "If you work alone or with one calendar, Start covers everything you need. If you have a team, a busy phone, or want Halo to also answer calls by voice, go with Pro. Several locations or a booking system to connect? Business is built for that — we'll quote it with you.",
  },
  {
    q: "How does the free trial work?",
    a: "We set Halo up with your business name, services and hours, and you use it for 14 days. If it's not for you, you simply don't continue — no charge.",
  },
  {
    q: "What happens if I go over my SMS or voice minutes?",
    a: "Nothing stops working. Extra texts are €0.08 each and extra voice minutes €0.25, billed with your next invoice. If you keep going over, we'll suggest the plan that saves you money.",
  },
  {
    q: "Is there a setup fee?",
    a: "Not on Start or Pro — we configure Halo, your message templates and your calendar for free. Business setups with several locations or custom integrations get a one-off onboarding quote.",
  },
  {
    q: "How does yearly billing work?",
    a: "Pay for the year upfront and get two months free — Start works out at €49/month and Pro at €124/month. Prices exclude VAT.",
  },
  {
    q: "Can I switch plans or cancel?",
    a: "Yes. Upgrade or downgrade anytime, and there's no contract or minimum term on monthly plans. Cancel before your next billing date and you won't be charged again.",
  },
];

export default function Pricing() {
  return (
    <main className="overflow-x-clip bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />

      <PageHero
        eyebrow="Pricing"
        icon="euro"
        title={<>Simple plans. <em>Built to pay for itself.</em></>}
        sub="Pick the plan that fits your business. Every plan starts with a 14-day free trial — no setup fee, no contract, cancel anytime."
      />

      {/* Plans */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <PricingPlans />

          <ul data-reveal className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[15px] font-medium text-ink">
            {always.map((a) => (
              <li key={a.text} className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky text-blue">
                  <Icon name={a.icon} className="h-3.5 w-3.5" strokeWidth={2.6} />
                </span>
                {a.text}
              </li>
            ))}
          </ul>
          <p data-reveal className="mt-5 text-center text-sm text-muted">
            Prices exclude VAT. Extra SMS €0.08 · extra voice minutes €0.25.
          </p>
        </div>
      </section>

      {/* ROI */}
      <section className="relative overflow-hidden border-y border-line bg-white px-6 py-24 md:py-28">
        <div className="halo pointer-events-none absolute inset-0" />
        <div className="relative">
          <SectionHeading
            eyebrow="Return on investment"
            icon="trendingUp"
            title={<>Do the math on <em>your missed calls.</em></>}
            sub="One extra booking a week usually covers the Start plan. See where you land."
          />
          <div data-reveal className="reveal-zoom mx-auto mt-14 max-w-5xl">
            <RoiCalculator />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div data-reveal>
            <Eyebrow icon="chat">Pricing FAQ</Eyebrow>
            <h2 className="font-display mt-5 text-[2.4rem] leading-[1.08] md:text-5xl">
              No fine print. <em>Promise.</em>
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Still unsure?{" "}
              <Link href="/contact" className="font-semibold text-blue underline-offset-4 hover:underline">
                Ask us anything
              </Link>{" "}
              — you&apos;ll get a straight answer.
            </p>
          </div>
          <div data-reveal>
            <Faq items={faqs} />
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="14 days free, no commitment"
        title={<>Let Halo answer <em>your missed calls.</em></>}
        sub="We set everything up with your business name — you're live within 24 hours."
        primary={{ href: "/contact?plan=pro", label: "Start my free trial" }}
        secondary={{ href: "/demo", label: "Try the live demo first" }}
        halo="celebrate"
      />
    </main>
  );
}
