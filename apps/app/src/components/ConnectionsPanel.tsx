import Link from "next/link";
import type { Business } from "@/lib/db";
import { appUrl } from "@/lib/email";
import { formatPhone } from "@/lib/phone";
import { googleConfigured, googleLinked } from "@/lib/google-calendar";
import { disconnectGoogle, renewCalendarLink } from "@/lib/actions/connections";
import ConnectWhatsApp from "@/components/ConnectWhatsApp";
import { CopyButton } from "@/components/CopyButton";
import { SubmitButton } from "@/components/form";
import Icon from "@/components/Icon";

/* WhatsApp + calendar, connected by the owner — used in the setup wizard and Settings. */
export default function ConnectionsPanel({ business, back, notice }: { business: Business; back: string; notice?: string }) {
  const feed = business.calendarToken ? `${appUrl()}/api/cal/${business.calendarToken}.ics` : null;
  const webcal = feed?.replace(/^https?:/, "webcal:");
  const google = googleLinked(business);

  return (
    <div className="space-y-5">
      {notice === "connected" && (
        <p className="rounded-xl bg-ok-soft px-4 py-3 text-sm text-ok">Google Calendar is connected.</p>
      )}
      {notice === "failed" && (
        <p className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">Google Calendar wasn&apos;t connected. Please try again.</p>
      )}

      <section className="rounded-2xl border border-line bg-white p-5">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f8ee] text-[#128c4a]">
            <Icon name="message" className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-semibold">WhatsApp</h3>
            <p className="text-sm text-muted">Missed callers get a WhatsApp from you, and Halo books them in the chat.</p>
          </div>
        </div>
        <ConnectWhatsApp
          appId={process.env.NEXT_PUBLIC_META_APP_ID ?? null}
          configId={process.env.NEXT_PUBLIC_META_CONFIG_ID ?? null}
          simulate={process.env.WHATSAPP_DRY_RUN === "true" && process.env.NODE_ENV !== "production"}
          connected={!!business.waPhoneNumberId}
          displayPhone={business.waDisplayPhone ? formatPhone(business.waDisplayPhone) : null}
          ownApp={business.waOwnApp}
        />
      </section>

      <section className="rounded-2xl border border-line bg-white p-5">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky text-blue">
            <Icon name="calendar" className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-semibold">Your calendar</h3>
            <p className="text-sm text-muted">See bookings in the calendar you already use.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-1 text-sm font-semibold">Google Calendar: both ways</p>
            {google ? (
              <div className="flex flex-wrap items-center gap-3">
                <p className="flex items-center gap-2 text-sm text-ok">
                  <Icon name="checkCircle" className="h-4 w-4" /> Connected{business.googleCalEmail ? `: ${business.googleCalEmail}` : ""}
                </p>
                <form action={disconnectGoogle}>
                  <SubmitButton className="btn btn-quiet btn-sm text-danger" pendingText="…">Disconnect</SubmitButton>
                </form>
              </div>
            ) : googleConfigured() ? (
              <a href={`/api/google/connect?back=${encodeURIComponent(back)}`} className="btn btn-secondary btn-sm">
                <Icon name="link" className="h-4 w-4" /> Connect Google Calendar
              </a>
            ) : (
              <p className="text-sm text-ink-soft">Coming soon. Until then, use the subscription link below.</p>
            )}
            <p className="mt-1 text-sm text-muted">
              New bookings appear in your calendar. Anything you put in your calendar yourself (a dentist, a day off)
              blocks that time for customers.
            </p>
          </div>

          <div className="border-t border-line pt-4">
            <p className="mb-1 text-sm font-semibold">Any calendar app: see bookings</p>
            {feed && webcal ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <a href={webcal} className="btn btn-secondary btn-sm">
                    <Icon name="smartphone" className="h-4 w-4" /> Add to iPhone / Mac
                  </a>
                  <a
                    href={`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    Add to Google Calendar
                  </a>
                  <CopyButton text={feed} label="Copy link (Outlook, others)" />
                </div>
                <p className="text-sm text-muted">Updates every 15–60 minutes, depending on the calendar app. Keep this link private.</p>
                <form action={renewCalendarLink}>
                  <SubmitButton className="btn btn-quiet btn-sm" pendingText="…">Make a new link (the old one stops working)</SubmitButton>
                </form>
              </div>
            ) : (
              <form action={renewCalendarLink}>
                <SubmitButton className="btn btn-secondary btn-sm" pendingText="…">Create my calendar link</SubmitButton>
              </form>
            )}
          </div>
        </div>
      </section>

      <p className="text-sm text-ink-soft">
        Rather not do this yourself?{" "}
        <Link href={back.startsWith("/setup") ? "/setup?visit=1" : "/help"} className="font-semibold text-blue">
          We&apos;ll come over and connect everything with you.
        </Link>
      </p>
    </div>
  );
}
