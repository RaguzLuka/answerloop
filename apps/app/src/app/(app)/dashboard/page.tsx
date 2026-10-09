import type { Metadata } from "next";
import Link from "next/link";
import { requireBusiness } from "@/lib/dal";
import { appUrl } from "@/lib/email";
import { businessType } from "@/lib/business-types";
import { localNow, today, trialDaysLeft, upcomingBookings, visitsFor } from "@/lib/queries";
import { recentCalls } from "@/lib/sms";
import type { Call } from "@/lib/db/schema";
import PushToggle from "@/components/PushToggle";
import FunnelCard from "@/components/FunnelCard";
import { missedCallFunnel } from "@/lib/stats";
import { formatDateLabel, formatDateTime, zonedParts } from "@/lib/time";
import { confirmForwarding, setPaused } from "@/lib/actions/business";
import Halo, { HaloSays } from "@/components/Halo";
import Icon from "@/components/Icon";
import BookingCard from "@/components/BookingCard";
import ForwardingGuide from "@/components/ForwardingGuide";
import InstallApp from "@/components/InstallApp";
import { CopyButton, ShareButton } from "@/components/CopyButton";
import { SubmitButton } from "@/components/form";
import { formatPhone } from "@/lib/phone";

export const metadata: Metadata = { title: "Home" };

function greeting(hour: number) {
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const { user, business } = await requireBusiness();
  const { welcome } = await searchParams;
  const words = businessType(business.type).words;
  const link = `${appUrl()}/b/${business.slug}`;
  const now = localNow(business);
  const todayDate = today(business);

  const [upcoming, funnel, visits, missed] = await Promise.all([
    upcomingBookings(business),
    missedCallFunnel(business.id),
    visitsFor(business.id),
    recentCalls(business.id, 6),
  ]);
  const todays = upcoming.filter((b) => zonedParts(b.startsAt, business.timezone).date === todayDate);
  const later = upcoming.filter((b) => zonedParts(b.startsAt, business.timezone).date !== todayDate);
  const openVisit = visits.find((v) => v.status === "requested" || v.status === "scheduled");

  return (
    <div className="space-y-6">
      {welcome ? (
        <div className="card flex items-center gap-4 overflow-hidden bg-gradient-to-r from-sky to-white p-5">
          <Halo pose="celebrate" size={96} priority className="-my-2 shrink-0" />
          <div>
            <h1 className="font-display text-2xl">You&apos;re all set up!</h1>
            <p className="mt-1 text-ink-soft">
              Your booking link is live.{" "}
              {business.status === "number_pending"
                ? "We'll email you when your RingLoop number is ready for the last step."
                : "One last step below: forward your missed calls."}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted">{greeting(now.h)}, {user.name.split(" ")[0]}</p>
          <h1 className="font-display text-3xl">{business.name}</h1>
        </div>
      )}

      <InstallApp variant="banner" />
      {business.trialEndsAt && <TrialBanner endsAt={business.trialEndsAt} />}
      <PushToggle variant="card" publicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null} />

      <StatusCard business={business} />

      {openVisit && (
        <Link href="/help" className="card flex items-center gap-4 p-4 transition hover:border-blue/30">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky text-blue">
            <Icon name="van" className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{openVisit.status === "scheduled" ? "Visit booked" : "Visit requested"}</p>
            <p className="truncate text-sm text-ink-soft">
              {openVisit.status === "scheduled" && openVisit.scheduledFor
                ? `We're coming ${openVisit.scheduledFor}`
                : "We'll call you to agree a time."}
            </p>
          </div>
          <Icon name="chevronRight" className="h-5 w-5 text-muted" />
        </Link>
      )}

      <FunnelCard funnel={funnel} />

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="font-semibold">Today · {formatDateLabel(todayDate)}</h2>
          <Link href="/bookings?new=1" className="btn btn-secondary btn-sm">
            <Icon name="plus" className="h-4 w-4" /> Add
          </Link>
        </div>
        {todays.length ? (
          <ul className="divide-y divide-line">
            {todays.map((b) => (
              <BookingCard key={b.id} booking={b} tz={business.timezone} />
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-4 px-4 py-6">
            <Halo pose="avatar" size={56} className="shrink-0 opacity-90" />
            <p className="text-sm text-ink-soft">
              Nothing booked for today yet.{" "}
              {later.length ? (
                <>
                  Next up: <strong>{later[0].customerName}</strong> on {formatDateLabel(zonedParts(later[0].startsAt, business.timezone).date)}.
                </>
              ) : (
                <>New {words.bookings} will show up here.</>
              )}
            </p>
          </div>
        )}
        {later.length > 0 && (
          <Link href="/bookings" className="flex items-center justify-between border-t border-line px-4 py-3 text-sm font-semibold text-blue hover:bg-paper">
            See all {upcoming.length} upcoming <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        )}
      </section>

      {missed.length > 0 && (
        <section className="card overflow-hidden">
          <h2 className="border-b border-line px-4 py-3 font-semibold">Missed calls</h2>
          <ul className="divide-y divide-line">
            {missed.map((row) => (
              <MissedCall key={row.call.id} row={row} tz={business.timezone} />
            ))}
          </ul>
        </section>
      )}

      <section className="card p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky text-blue">
            <Icon name="link" className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold">Your booking link</h2>
            <p className="mt-0.5 text-sm text-ink-soft">
              {business.bookingEnabled
                ? "In every text-back. Add it to your Instagram bio, Google profile and website too."
                : "Online booking is switched off. Turn it on in Settings."}
            </p>
            <p className="mt-3 truncate rounded-lg bg-paper px-3 py-2 font-mono text-sm text-blue-deep">{link}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton text={link} />
              <ShareButton url={link} title={`Book at ${business.name}`} />
              <a href={link} target="_blank" rel="noreferrer" className="btn btn-quiet btn-sm">
                <Icon name="external" className="h-4 w-4" /> Open
              </a>
            </div>
          </div>
        </div>
      </section>

      <Link href="/help" className="card flex items-center gap-4 p-4 transition hover:border-blue/30">
        <Halo pose="wave" size={56} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Want a hand?</p>
          <p className="text-sm text-ink-soft">We can come over and set everything up with you and your team.</p>
        </div>
        <Icon name="chevronRight" className="h-5 w-5 text-muted" />
      </Link>
    </div>
  );
}

function StatusCard({ business }: { business: Awaited<ReturnType<typeof requireBusiness>>["business"] }) {
  if (business.status === "number_pending") {
    return (
      <section className="card p-5">
        <HaloSays pose="listen" size={64}>
          <strong>We&apos;re getting your RingLoop number ready.</strong>{" "}You&apos;ll get an email, usually within 1 business
          day, with one last step: forwarding your missed calls. Your booking link already works.
        </HaloSays>
      </section>
    );
  }
  if (business.status === "forwarding" && business.ringloopNumber) {
    return (
      <section className="card space-y-4 border-blue/30 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue text-white">
            <Icon name="phoneForwarded" className="h-5 w-5" />
          </span>
          <div>
            <p className="label text-blue">Last step</p>
            <h2 className="font-display text-xl">Forward your missed calls</h2>
          </div>
        </div>
        <ForwardingGuide number={business.ringloopNumber} />
        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <form action={confirmForwarding}>
            <SubmitButton pendingText="Saving…">
              <Icon name="check" className="h-4 w-4" /> I&apos;ve dialled the code
            </SubmitButton>
          </form>
          <Link href="/help" className="btn btn-quiet btn-sm">Rather we do it? Request a visit</Link>
        </div>
        <p className="text-sm text-muted">
          Test it: call your business number from another phone and don&apos;t answer. Within a few seconds that phone gets
          your text-back.
        </p>
      </section>
    );
  }
  if (business.status === "paused") {
    return (
      <section className="card flex flex-wrap items-center gap-4 border-warn/30 p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warn-soft text-warn">
          <Icon name="pause" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">RingLoop is paused</h2>
          <p className="text-sm text-ink-soft">Missed calls aren&apos;t texted back and the booking link is closed.</p>
        </div>
        <form action={setPaused.bind(null, false)}>
          <SubmitButton pendingText="Resuming…">
            <Icon name="play" className="h-4 w-4" /> Resume
          </SubmitButton>
        </form>
      </section>
    );
  }
  // live
  return (
    <section className="card flex flex-wrap items-center gap-4 p-5">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ok-soft text-ok">
        <Icon name="checkCircle" className="h-5 w-5" />
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-ok" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold">RingLoop is live</h2>
        <p className="text-sm text-ink-soft">
          Missed calls to your number are forwarded to {business.ringloopNumber ? formatPhone(business.ringloopNumber) : "RingLoop"} and
          texted back.
        </p>
      </div>
      <form action={setPaused.bind(null, true)}>
        <SubmitButton className="btn btn-secondary btn-sm" pendingText="Pausing…">
          <Icon name="pause" className="h-4 w-4" /> Pause
        </SubmitButton>
      </form>
    </section>
  );
}

const OUTCOME: Record<Call["outcome"], { label: string; cls: string; callBack?: boolean }> = {
  texted: { label: "Texted your link", cls: "bg-ok-soft text-ok" },
  repeat: { label: "Already had your link", cls: "bg-sky text-blue-deep" },
  landline: { label: "Landline, call back", cls: "bg-warn-soft text-warn", callBack: true },
  no_caller_id: { label: "Hidden number", cls: "bg-paper text-muted" },
  paused: { label: "While paused", cls: "bg-paper text-muted", callBack: true },
  limit: { label: "Daily text limit, call back", cls: "bg-warn-soft text-warn", callBack: true },
  failed: { label: "Text failed, call back", cls: "bg-danger-soft text-danger", callBack: true },
};

type MissedRow = Awaited<ReturnType<typeof recentCalls>>[number];

function MissedCall({ row, tz }: { row: MissedRow; tz: string }) {
  const { call } = row;
  const o =
    row.chatStatus === "booked"
      ? { label: "Booked by chat", cls: "bg-ok-soft text-ok", callBack: false }
      : row.chatId && row.chatUserMessages
        ? { label: call.channel === "whatsapp" ? "Chatting on WhatsApp" : "Chatting with Halo", cls: "bg-sky text-blue-deep", callBack: false }
        : call.channel === "whatsapp" && call.outcome === "texted"
          ? { label: "Messaged on WhatsApp", cls: "bg-ok-soft text-ok", callBack: false }
          : OUTCOME[call.outcome];
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <Icon name="phoneMissed" className="h-5 w-5 shrink-0 text-muted" />
      <div className="min-w-0 flex-1">
        <p className="font-medium tabular-nums">{call.callerPhone ? formatPhone(call.callerPhone) : "Hidden number"}</p>
        <p className="text-xs text-muted">
          {formatDateTime(call.createdAt, tz, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })}
        </p>
      </div>
      {row.chatId && row.chatUserMessages ? (
        <Link href={`/chats/${row.chatId}`} className={`chip ${o.cls} hover:underline`}>
          {o.label} <Icon name="chevronRight" className="h-3 w-3" />
        </Link>
      ) : (
        <span className={`chip ${o.cls}`}>{o.label}</span>
      )}
      {o.callBack && call.callerPhone && (
        <a href={`tel:${call.callerPhone}`} className="btn btn-secondary btn-sm" aria-label="Call back">
          <Icon name="phone" className="h-4 w-4" />
        </a>
      )}
    </li>
  );
}

function TrialBanner({ endsAt }: { endsAt: number }) {
  const days = trialDaysLeft(endsAt);
  return (
    <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${days > 0 ? "bg-sky text-blue-deep" : "bg-warn-soft text-warn"}`}>
      <Icon name="sparkle" className="h-4 w-4 shrink-0" />
      <p className="flex-1">
        {days > 0
          ? `Free trial: ${days} ${days === 1 ? "day" : "days"} left of everything, including Halo's WhatsApp chat.`
          : "Your free trial has ended. We'll be in touch about your plan."}
      </p>
      <Link href="/help" className="font-semibold underline-offset-2 hover:underline">Questions?</Link>
    </div>
  );
}
