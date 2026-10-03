"use client";
import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import Halo, { type HaloPose } from "@/components/Halo";

type Feature = { text: string; soon?: boolean; off?: boolean };

type Plan = {
  id: string;
  name: string;
  pose: HaloPose;
  forWho: string;
  monthly: number | null;   // null → custom quote
  yearly: number | null;    // per month, billed yearly (2 months free)
  from?: boolean;
  cta: string;
  featured?: boolean;
  features: Feature[];
};

export const PLANS: Plan[] = [
  {
    id: "start",
    name: "Start",
    pose: "happy",
    forWho: "Solo pros and small studios — barbers, nail artists, beauticians.",
    monthly: 59,
    yearly: 49,
    cta: "Start free trial",
    features: [
      { text: "Missed-call text-back, 24/7" },
      { text: "Halo books customers by text" },
      { text: "Confirmations & day-before reminders" },
      { text: "300 SMS included per month" },
      { text: "1 calendar · 1 location" },
      { text: "Google Calendar sync" },
      { text: "Email support" },
      { text: "Halo answers calls by voice", off: true },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    pose: "wave",
    forWho: "Salons with a team, restaurants, clinics and busy practices.",
    monthly: 149,
    yearly: 124,
    cta: "Start free trial",
    featured: true,
    features: [
      { text: "Everything in Start, plus:" },
      { text: "Halo answers calls by voice — 200 min/month" },
      { text: "1,000 SMS included per month" },
      { text: "Up to 5 staff calendars" },
      { text: "Win-back campaigns", soon: true },
      { text: "Google review requests", soon: true },
      { text: "Priority support" },
    ],
  },
  {
    id: "business",
    name: "Business",
    pose: "booking",
    forWho: "Multiple locations, chains and larger clinics.",
    monthly: 349,
    yearly: 349,
    from: true,
    cta: "Talk to us",
    features: [
      { text: "Everything in Pro, plus:" },
      { text: "Multiple locations, one dashboard" },
      { text: "Unlimited staff calendars" },
      { text: "Volume SMS & voice pricing" },
      { text: "Booking-system integrations" },
      { text: "Dedicated contact & SLA" },
      { text: "Custom DPA & onboarding" },
    ],
  },
];

export default function PricingPlans() {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      {/* Billing toggle */}
      <div className="mb-12 flex justify-center">
        <div role="group" aria-label="Billing period" className="inline-flex items-center gap-1 rounded-full border border-line bg-white p-1 shadow-sm">
          {[
            { v: false, label: "Monthly" },
            { v: true, label: "Yearly" },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              aria-pressed={yearly === o.v}
              onClick={() => setYearly(o.v)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                yearly === o.v ? "bg-blue text-white shadow" : "text-ink-soft hover:text-ink"
              }`}
            >
              {o.label}
              {o.v && (
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${yearly ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600"}`}>
                  2 months free
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid items-stretch gap-5 lg:grid-cols-3">
        {PLANS.map((p, i) => {
          const price = yearly ? p.yearly : p.monthly;
          const dark = p.featured;
          return (
            <div
              key={p.id}
              data-reveal
              className={`r-delay-${i + 1} relative flex flex-col overflow-hidden rounded-[2rem] p-8 md:p-9 ${
                dark
                  ? "bg-night text-white shadow-[0_40px_90px_-40px_rgba(33,86,232,0.6)] ring-1 ring-blue/40 lg:-my-4 lg:py-12"
                  : "card"
              }`}
            >
              {dark && (
                <>
                  <div className="grid-bg-dark pointer-events-none absolute inset-0" />
                  <div className="night-glow pointer-events-none absolute inset-0" />
                </>
              )}
              <div className="relative flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display text-2xl">{p.name}</h3>
                      {dark && (
                        <span className="rounded-full bg-blue px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                          Most popular
                        </span>
                      )}
                    </div>
                    <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-sky/60" : "text-ink-soft"}`}>{p.forWho}</p>
                  </div>
                  <Halo pose={p.pose} size={72} decorative className="-mr-2 -mt-2 h-[72px] w-[72px] shrink-0 drop-shadow-[0_12px_24px_rgba(33,86,232,0.35)]" />
                </div>

                <div className="mt-8 flex items-end gap-2">
                  {p.from && <span className={`mb-2 text-sm font-medium ${dark ? "text-sky/60" : "text-muted"}`}>from</span>}
                  <span className="font-display text-5xl tabular-nums leading-none">€{price}</span>
                  <span className={`mb-1 text-sm ${dark ? "text-sky/60" : "text-muted"}`}>/ month</span>
                </div>
                <p className={`mt-2 h-5 text-xs ${dark ? "text-sky/50" : "text-muted"}`}>
                  {p.from
                    ? "Custom quote for your locations"
                    : yearly
                      ? `€${(p.yearly ?? 0) * 12} billed yearly · excl. VAT`
                      : "Billed monthly · excl. VAT"}
                </p>

                <Link
                  href={`/contact?plan=${p.id}${yearly && !p.from ? "-yearly" : ""}`}
                  className={`group mt-7 w-full py-3.5 ${dark ? "btn-primary" : "btn-secondary"}`}
                >
                  {p.cta} <span className="arrow">→</span>
                </Link>

                <ul className="mt-8 space-y-3">
                  {p.features.map((f) => (
                    <li
                      key={f.text}
                      className={`flex items-start gap-3 text-[15px] ${
                        f.off ? (dark ? "text-sky/35" : "text-muted/70") : dark ? "text-sky/85" : "text-ink"
                      }`}
                    >
                      {f.text.endsWith(":") ? (
                        <span className="font-semibold">{f.text}</span>
                      ) : (
                        <>
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              f.off ? (dark ? "bg-white/5" : "bg-paper") : dark ? "bg-blue text-white" : "bg-sky text-blue"
                            }`}
                          >
                            <Icon name={f.off ? "x" : "check"} className="h-3 w-3" strokeWidth={3} />
                          </span>
                          <span>
                            {f.text}
                            {f.soon && (
                              <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${dark ? "bg-periwinkle/15 text-periwinkle" : "bg-sky text-blue"}`}>
                                Soon
                              </span>
                            )}
                          </span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
