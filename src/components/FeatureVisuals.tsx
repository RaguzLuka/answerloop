import Icon from "@/components/Icon";
import { PhoneShell, Bubble, ThreadNote, ChatWindow } from "@/components/Sms";

/* Static product illustrations for the feature deep-dives —
   deliberately spread across industries. */

/** Soft sky stage that frames each illustration */
function Stage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-line bg-gradient-to-b from-sky/80 via-sky/30 to-white ${className}`}
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
      {children}
    </div>
  );
}

function FloatChip({
  icon, iconClass, kicker, title, className,
}: {
  icon: string;
  iconClass: string;
  kicker: string;
  title: string;
  className: string;
}) {
  return (
    <div
      className={`absolute z-10 flex items-center gap-2.5 rounded-2xl border border-line/80 bg-white/95 py-2.5 pl-2.5 pr-4 shadow-[0_22px_44px_-20px_rgba(12,27,56,0.35)] backdrop-blur ${className}`}
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

/* ── 1. Missed-call text-back: a customer's lock screen (barbershop) ── */

function LockNotification({
  app, appIcon, title, body, time = "now",
}: {
  app: string;
  appIcon: string;
  title: string;
  body?: string;
  time?: string;
}) {
  return (
    <div className="rounded-[1.35rem] bg-white/75 p-3 text-ink shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-b from-[#5cf07b] to-[#28c840] text-white">
          <Icon name={appIcon} className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-[12.5px] font-semibold">{title}</p>
            <p className="shrink-0 text-[10.5px] text-ink/50">{time}</p>
          </div>
          {body ? (
            <p className="mt-0.5 text-[12px] leading-snug text-ink/80">{body}</p>
          ) : (
            <p className="mt-0.5 text-[12px] text-ink/60">{app}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function TextBackVisual() {
  return (
    <Stage className="h-[500px]">
      <div className="absolute inset-x-0 top-10 flex justify-center">
        <PhoneShell
          tone="dark"
          time="12:15"
          className="w-[290px]"
          screenClassName="h-[600px] bg-[radial-gradient(120%_75%_at_25%_0%,#6f97f6_0%,#2d52cc_40%,#0e1a47_80%)]"
        >
          <div className="px-5 pt-4 text-center text-white">
            <p className="text-[15px] font-medium text-white/85">Saturday</p>
            <p className="font-display text-[4.6rem] font-semibold leading-none tracking-tight">12:15</p>
          </div>
          <div className="mt-8 space-y-2 px-3">
            <LockNotification app="Missed call" appIcon="phoneMissed" title="Corner Cut Barbers" time="1m ago" />
            <LockNotification
              app="Messages"
              appIcon="message"
              title="Corner Cut Barbers"
              body="Hey Luka! Sorry we missed your call 💈 Want to book a cut? Just reply to this text."
            />
          </div>
        </PhoneShell>
      </div>
      <FloatChip
        icon="zap"
        iconClass="bg-emerald-50 text-emerald-600"
        kicker="From missed call to text"
        title="4 seconds"
        className="bottom-8 left-4 md:left-8"
      />
    </Stage>
  );
}

/* ── 2. AI booking: the conversation + what lands on your side (restaurant) ── */

export function BookingVisual() {
  return (
    <Stage className="px-5 pb-40 pt-8 md:px-10 md:pb-28 md:pt-10">
      <ChatWindow name="Bistro Lanterna" initials="BL" className="relative max-w-[360px]">
        <Bubble side="in">We have 19:45 or 20:30 for four — which works best?</Bubble>
        <Bubble side="out">20:30 pls, terrace if possible</Bubble>
        <Bubble side="in">Terrace at 20:30 it is! What name should the table be under?</Bubble>
        <Bubble side="out">Ivana Kos</Bubble>
        <Bubble side="in">Reserved ✅ Tonight 20:30 · Terrace, 4 guests. See you then, Ivana!</Bubble>
      </ChatWindow>

      {/* What lands on your side */}
      <div className="absolute bottom-6 right-4 z-10 w-[250px] rounded-2xl border border-line bg-white p-4 shadow-[0_24px_50px_-24px_rgba(12,27,56,0.4)] md:right-8">
        <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
          <Icon name="calendar" className="h-3.5 w-3.5" /> Your bookings
        </p>
        <div className="flex gap-3 rounded-xl bg-sky/70 p-3">
          <span className="w-1 shrink-0 rounded-full bg-blue" />
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-ink">Table for 4 — Ivana Kos</p>
            <p className="mt-1 text-[12px] text-ink-soft">Tonight 20:30 · Terrace</p>
          </div>
        </div>
      </div>

      <FloatChip
        icon="bell"
        iconClass="bg-sky text-blue"
        kicker="You're notified"
        title="New booking by SMS"
        className="right-4 top-6 hidden sm:flex md:right-8"
      />
    </Stage>
  );
}

/* ── 3. Reminders: confirm by reply (nail studio) ── */

export function ReminderVisual() {
  return (
    <Stage className="px-5 pb-10 pt-8 md:px-10 md:pb-12 md:pt-10">
      <ChatWindow name="Luna Nail Studio" initials="LN" className="relative ml-auto max-w-[370px]">
        <ThreadNote>Wednesday 17:00</ThreadNote>
        <Bubble side="in">
          Hi Petra! Reminder: your gel manicure at Luna Nail Studio is tomorrow at 17:00. Reply C to confirm or R to reschedule.
        </Bubble>
        <Bubble side="out">C</Bubble>
        <Bubble side="in">Thanks, Petra — you&apos;re confirmed ✅ See you tomorrow!</Bubble>
      </ChatWindow>

      <div className="relative z-10 -mt-3 flex flex-wrap gap-3 md:-mt-10">
        <div className="flex items-center gap-2.5 rounded-2xl border border-line/80 bg-white/95 py-2.5 pl-2.5 pr-4 shadow-[0_22px_44px_-20px_rgba(12,27,56,0.35)] backdrop-blur">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Icon name="check" className="h-4.5 w-4.5" strokeWidth={2.4} />
          </span>
          <span>
            <span className="block text-[11px] font-medium text-muted">Confirmed by reply</span>
            <span className="block text-[13.5px] font-semibold text-ink">No phone call needed</span>
          </span>
        </div>
      </div>
    </Stage>
  );
}
