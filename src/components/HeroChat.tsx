"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { PhoneShell, ChatHeader, Bubble, TypingBubble, ThreadNote, FakeInput } from "@/components/Sms";
import useReducedMotion from "@/components/useReducedMotion";
import Halo from "@/components/Halo";

/* The hero story, played on a loop and rotating through industries:
   a missed call, the instant text-back, and a booking made by SMS. */

type Step =
  | { kind: "note"; text: string; wait: number }
  | { kind: "typing"; wait: number }
  | { kind: "in" | "out"; text: string; wait: number };

type Story = {
  id: string;
  label: string;
  icon: string;
  business: string;
  initials: string;
  time: string;
  bookedKicker: string;
  bookedTitle: string;
  steps: Step[];
};

/** note → text-back → reply → offer → choice → confirmation, with typing pauses */
function script(time: string, [opening, ask, offer, pick, confirm]: [string, string, string, string, string]): Step[] {
  return [
    { kind: "note", text: `Missed call · ${time}`, wait: 700 },
    { kind: "typing", wait: 900 },
    { kind: "in", text: opening, wait: 1500 },
    { kind: "out", text: ask, wait: 2300 },
    { kind: "typing", wait: 900 },
    { kind: "in", text: offer, wait: 1500 },
    { kind: "out", text: pick, wait: 2100 },
    { kind: "typing", wait: 900 },
    { kind: "in", text: confirm, wait: 1500 },
  ];
}

const STORIES: Story[] = [
  {
    id: "salon", label: "Salon", icon: "scissors",
    business: "Studio Mila", initials: "SM", time: "14:12",
    bookedKicker: "Booked · reminder set", bookedTitle: "Fri 16:30 · Cut & blow-dry",
    steps: script("14:12", [
      "Hi, it's Studio Mila ✂️ Sorry we missed your call! Want to book an appointment? Just reply here.",
      "Yes please! Cut & blow-dry this week?",
      "Of course! Thursday 10:00 with Mila or Friday 16:30 with Petra?",
      "Friday with Petra 🙌",
      "You're booked ✅ Fri 16:30 · Cut & blow-dry with Petra. We'll text you a reminder the day before.",
    ]),
  },
  {
    id: "barber", label: "Barber", icon: "barberPole",
    business: "Corner Cut Barbers", initials: "CC", time: "12:15",
    bookedKicker: "Booked · reminder set", bookedTitle: "Sat 10:30 · Skin fade",
    steps: script("12:15", [
      "Hey, it's Corner Cut Barbers 💈 Sorry we missed you! Want to book a cut? Just reply to this text.",
      "Yeah — skin fade on Saturday?",
      "Sure! Saturday 10:30 or 13:00 with Marko — which works?",
      "10:30 👌",
      "You're in ✅ Sat 10:30 · Skin fade with Marko. We'll send you a reminder on Friday.",
    ]),
  },
  {
    id: "nails", label: "Nails", icon: "nailPolish",
    business: "Luna Nail Studio", initials: "LN", time: "15:07",
    bookedKicker: "Booked · reminder set", bookedTitle: "Thu 17:00 · Gel manicure",
    steps: script("15:07", [
      "Hi, it's Luna Nail Studio 💅 Sorry we missed your call! Want to book? Just reply here.",
      "Gel manicure this week?",
      "Of course! Thursday 17:00 or Friday 10:30 — which suits you?",
      "Thursday please",
      "Booked ✅ Thu 17:00 · Gel manicure with Ana. We'll remind you the day before. See you!",
    ]),
  },
  {
    id: "restaurant", label: "Restaurant", icon: "utensils",
    business: "Bistro Lanterna", initials: "BL", time: "17:52",
    bookedKicker: "Reserved · team notified", bookedTitle: "Tonight 20:30 · Table for 4",
    steps: script("17:52", [
      "Hi from Bistro Lanterna 🍝 Sorry we missed your call — the kitchen is busy! Want a table? Just reply.",
      "Table for 4 tonight around 8?",
      "We have 19:45 or 20:30 for four — which works best?",
      "20:30 please",
      "Reserved ✅ Tonight 20:30 · Table for 4. Can't wait to see you — reply here if plans change!",
    ]),
  },
  {
    id: "clinic", label: "Clinic", icon: "stethoscope",
    business: "Adria Dental", initials: "AD", time: "18:41",
    bookedKicker: "Booked · reminder set", bookedTitle: "Fri 14:30 · Cleaning",
    steps: script("18:41", [
      "Hi, it's Adria Dental 👋 Sorry we missed your call! Want to book an appointment? Just reply here.",
      "Yes please! I need a cleaning — anything this week?",
      "Of course! Thursday 10:00 or Friday 14:30 — which suits you?",
      "Friday works 🙌",
      "You're booked ✅ Fri 14:30 · Cleaning with Dr. Kovač. We'll text you a reminder the day before.",
    ]),
  },
];

const HOLD_MS = 4800; // linger on the finished conversation before moving on
const FADE_MS = 600;

export default function HeroChat() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(0);
  const [fading, setFading] = useState(false);
  const story = STORIES[index];

  // Advance the script one step at a time, then hold and fade
  useEffect(() => {
    if (reduced) return;
    const id =
      shown < story.steps.length
        ? setTimeout(() => setShown((s) => s + 1), story.steps[shown].wait)
        : setTimeout(() => setFading(true), HOLD_MS);
    return () => clearTimeout(id);
  }, [shown, reduced, story]);

  // After the fade, move on to the next industry
  useEffect(() => {
    if (!fading) return;
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % STORIES.length);
      setShown(0);
      setFading(false);
    }, FADE_MS);
    return () => clearTimeout(id);
  }, [fading]);

  function pick(i: number) {
    setIndex(i);
    setShown(0);
    setFading(false);
  }

  const visible = reduced ? story.steps.length : shown;
  const textedBack = visible >= 3;
  const booked = visible >= story.steps.length;

  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      {/* Industry switcher — rotates on its own, or jump straight to yours */}
      <div className="relative z-10 mb-6 flex flex-wrap justify-center gap-1.5" role="group" aria-label="Example business type">
        {STORIES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pick(i)}
            aria-pressed={i === index}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
              i === index
                ? "border-blue/25 bg-white text-blue shadow-sm"
                : "border-transparent text-ink-soft hover:bg-white/70 hover:text-ink"
            }`}
          >
            <Icon name={s.icon} className="h-3.5 w-3.5" />
            {s.label}
          </button>
        ))}
      </div>

      <div
        role="img"
        aria-label={`Example: ${story.business} misses a call, texts the caller back within seconds, and they book just by replying.`}
        className="relative"
      >
        {/* Glow behind the phone */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/25 blur-[100px]" />

        <PhoneShell time={story.time} className="relative mx-auto w-[292px]" screenClassName="h-[600px] bg-white">
          <ChatHeader name={story.business} initials={story.initials} />
          <div
            className={`flex flex-1 flex-col justify-end gap-1.5 overflow-hidden px-3 pb-1 transition-opacity duration-500 ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          >
            {story.steps.slice(0, visible).map((step, i) => {
              const key = `${story.id}-${i}`;
              if (step.kind === "note") return <ThreadNote key={key} tone="missed" animate>{step.text}</ThreadNote>;
              if (step.kind === "typing") return i === visible - 1 ? <TypingBubble key={key} /> : null;
              return <Bubble key={key} side={step.kind} animate>{step.text}</Bubble>;
            })}
          </div>
          <FakeInput />
        </PhoneShell>

        {/* Halo peeks in beside the phone — same breakpoints as the chips */}
        <div aria-hidden="true" className="absolute left-[calc(50%_+_136px)] top-[64px] hidden sm:block lg:hidden xl:block">
          <div className="animate-float relative">
            <Halo pose="wave" size={120} priority decorative className="h-[120px] w-[120px] drop-shadow-[0_24px_30px_rgba(33,86,232,0.3)]" />
            <span className="absolute -top-7 left-[70px] whitespace-nowrap rounded-2xl rounded-bl-md border border-line bg-white px-3 py-1.5 text-[13px] font-semibold text-ink shadow-[0_14px_30px_-16px_rgba(12,27,56,0.4)]">
              Halo? 👋
            </span>
          </div>
        </div>

        {/* Floating outcome chips — anchored to the phone's edges so they only
            ever cover empty space beside the bubbles, never the messages */}
        <Chip
          show={textedBack && !fading}
          className="right-[calc(50%_+_82px)] top-[118px]"
          icon="zap"
          iconClass="bg-emerald-50 text-emerald-600"
          kicker="Missed call recovered"
          title="Texted back in 4 sec"
        />
        <Chip
          show={booked && !fading}
          className="left-[calc(50%_+_82px)] top-[484px]"
          icon="calendarCheck"
          iconClass="bg-sky text-blue"
          kicker={story.bookedKicker}
          title={story.bookedTitle}
        />
      </div>
    </div>
  );
}

function Chip({
  show, className, icon, iconClass, kicker, title,
}: {
  show: boolean;
  className: string;
  icon: string;
  iconClass: string;
  kicker: string;
  title: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute hidden items-center gap-2.5 whitespace-nowrap rounded-2xl border border-line/80 bg-white/95 py-2.5 pl-2.5 pr-4 shadow-[0_22px_44px_-20px_rgba(12,27,56,0.35)] backdrop-blur transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] sm:flex lg:hidden xl:flex ${
        show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      } ${className}`}
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}>
        <Icon name={icon} className="h-4.5 w-4.5" />
      </span>
      <span>
        <span className="block text-[11px] font-medium text-muted">{kicker}</span>
        <span className="block text-[13.5px] font-semibold text-ink">{title}</span>
      </span>
    </div>
  );
}
