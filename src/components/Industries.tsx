"use client";
import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { ChatWindow, Bubble } from "@/components/Sms";
import { CheckDot } from "@/components/Section";

/* "Made for your kind of business" — one tab per industry, each with
   what RingLoop does there and an example text conversation. */

type Industry = {
  id: string;
  label: string;
  icon: string;
  title: string;
  desc: string;
  points: string[];
  business: string;
  initials: string;
  /** Demo persona to open from this tab, when there's a matching one */
  demo?: string;
  thread: { side: "in" | "out"; text: string }[];
};

const INDUSTRIES: Industry[] = [
  {
    id: "salons",
    label: "Salons & barbers",
    icon: "scissors",
    title: "Never miss a booking while you're mid-cut.",
    desc: "Your hands are busy and the phone keeps ringing. RingLoop texts every missed caller and fills your chair by text — even after closing time.",
    points: [
      "Books cuts, colours and fades with the right stylist",
      "Fills last-minute gaps when someone cancels",
      "Day-before reminders that stop no-shows",
    ],
    business: "Corner Cut Barbers",
    initials: "CC",
    demo: "barber",
    thread: [
      { side: "out", text: "Hi! Can I get a cut & beard trim tomorrow?" },
      { side: "in", text: "Sure! 11:00 with Marko or 15:30 with Ivan?" },
      { side: "out", text: "11 with Marko" },
      { side: "in", text: "Booked ✅ Tomorrow 11:00 · Cut & beard with Marko. See you then!" },
    ],
  },
  {
    id: "beauty",
    label: "Nails & beauty",
    icon: "nailPolish",
    title: "A full book, without picking up the phone.",
    desc: "Clients text when it suits them. RingLoop books manicures, lashes and treatments into the right slot — and knows how long each one takes.",
    points: [
      "Knows every service and its duration",
      "Rebooks regulars in seconds",
      "Reminders with reply-to-confirm",
    ],
    business: "Luna Nail Studio",
    initials: "LN",
    demo: "nails",
    thread: [
      { side: "out", text: "Do you have time for gel nails + a lash lift on Friday?" },
      { side: "in", text: "Yes! Friday 14:00 — about 2 hours in total. Shall I book it?" },
      { side: "out", text: "Perfect" },
      { side: "in", text: "Booked ✅ Fri 14:00 · Gel manicure + lash lift with Ana." },
    ],
  },
  {
    id: "restaurants",
    label: "Restaurants",
    icon: "utensils",
    title: "Turn missed calls into full tables.",
    desc: "When the kitchen is slammed and the phone rings out, RingLoop texts the caller and takes the reservation — party size, time, name and seating.",
    points: [
      "Table reservations by text, day and night",
      "Confirmations that cut no-shows",
      "Answers questions about hours, terrace and parking",
    ],
    business: "Bistro Lanterna",
    initials: "BL",
    demo: "restaurant",
    thread: [
      { side: "out", text: "Table for 6 on Saturday at 8?" },
      { side: "in", text: "Saturday 20:00 is free for 6 — inside or on the terrace?" },
      { side: "out", text: "Terrace!" },
      { side: "in", text: "Reserved ✅ Sat 20:00 · Terrace, 6 guests. See you then!" },
    ],
  },
  {
    id: "clinics",
    label: "Clinics & health",
    icon: "stethoscope",
    title: "Patients book by text. Your front desk breathes.",
    desc: "Dental, physio, aesthetics and medical practices: RingLoop books patients in and sends reminders — and never gives medical advice.",
    points: [
      "Books the right treatment with the right practitioner",
      "Reminders that keep the schedule full",
      "GDPR-ready, with a DPA for every practice",
    ],
    business: "Adria Dental",
    initials: "AD",
    demo: "dental",
    thread: [
      { side: "out", text: "I need a cleaning, anything this week?" },
      { side: "in", text: "Of course! Thursday 10:00 or Friday 14:30?" },
      { side: "out", text: "Friday" },
      { side: "in", text: "Booked ✅ Fri 14:30 · Cleaning with Dr. Kovač. We'll remind you Thursday." },
    ],
  },
  {
    id: "wellness",
    label: "Fitness & wellness",
    icon: "leaf",
    title: "Fill sessions, classes and treatments.",
    desc: "Personal trainers, yoga studios, massage and spa: RingLoop answers every missed call with a text and books the session.",
    points: [
      "Books 1:1 sessions and trial classes",
      "Handles rescheduling by text",
      "Reminders so nobody forgets their slot",
    ],
    business: "Flow Wellness",
    initials: "FW",
    thread: [
      { side: "out", text: "Can I book a 60-min massage this week?" },
      { side: "in", text: "Sure — Wednesday 18:00 or Thursday 9:00?" },
      { side: "out", text: "Wednesday" },
      { side: "in", text: "Booked ✅ Wed 18:00 · 60-min massage. See you then!" },
    ],
  },
  {
    id: "services",
    label: "Local services",
    icon: "wrench",
    title: "Every booking request, answered.",
    desc: "Car services, repairs, pet grooming, cleaning and more: RingLoop texts back, books the appointment and collects the details you need.",
    points: [
      "Books drop-offs, visits and appointments",
      "Collects the details you need upfront",
      "Hands tricky requests to you with full context",
    ],
    business: "Garage 12",
    initials: "G12",
    thread: [
      { side: "out", text: "My car needs a service — any slot next week?" },
      { side: "in", text: "Yes! Monday 8:00 drop-off or Tuesday 13:00 — which suits you?" },
      { side: "out", text: "Monday 8" },
      { side: "in", text: "Booked ✅ Mon 8:00 · Full service. See you then!" },
    ],
  },
];

export default function Industries() {
  const [active, setActive] = useState(0);
  const ind = INDUSTRIES[active];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Industries"
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:justify-center md:px-0"
      >
        {INDUSTRIES.map((x, i) => (
          <button
            key={x.id}
            id={`industry-tab-${x.id}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls="industry-panel"
            onClick={() => setActive(i)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
              i === active
                ? "border-blue bg-blue text-white shadow-[0_10px_24px_-12px_rgba(33,86,232,0.7)]"
                : "border-line bg-white text-ink-soft hover:border-blue/30 hover:text-ink"
            }`}
          >
            <Icon name={x.icon} className="h-4 w-4" />
            {x.label}
          </button>
        ))}
      </div>

      <div
        id="industry-panel"
        role="tabpanel"
        aria-labelledby={`industry-tab-${ind.id}`}
        className="card mt-6 grid items-center gap-10 overflow-hidden p-7 md:p-10 lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div key={`copy-${ind.id}`} className="bubble">
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky text-blue">
            <Icon name={ind.icon} className="h-6 w-6" />
          </span>
          <h3 className="font-display text-[1.9rem] leading-[1.12] md:text-4xl">{ind.title}</h3>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{ind.desc}</p>
          <ul className="mt-6 space-y-3">
            {ind.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px] text-ink">
                <CheckDot />
                {p}
              </li>
            ))}
          </ul>
          <Link href={ind.demo ? `/demo?business=${ind.demo}` : "/demo"} className="group mt-8 inline-flex items-center gap-1.5 font-semibold text-blue">
            Try the live demo <span className="arrow">→</span>
          </Link>
        </div>

        <div className="relative rounded-[1.75rem] bg-gradient-to-b from-sky/80 to-sky/20 p-5 md:p-8">
          <ChatWindow key={`chat-${ind.id}`} name={ind.business} initials={ind.initials} className="mx-auto max-w-[380px]">
            {ind.thread.map((m, i) => (
              <Bubble key={i} side={m.side} animate>
                {m.text}
              </Bubble>
            ))}
          </ChatWindow>
        </div>
      </div>
    </div>
  );
}
