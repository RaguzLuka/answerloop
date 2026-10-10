import type { Metadata } from "next";
import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { db, bookings, businesses, memberships, phoneNumbers, users, visitRequests } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";
import { businessType } from "@/lib/business-types";
import { formatDateTime } from "@/lib/time";
import { formatPhone } from "@/lib/phone";
import { Wordmark } from "@/components/Logo";
import { twilioConfigured } from "@/lib/twilio";
import { missedCallFunnel } from "@/lib/stats";
import { messagesThisMonth, usageThisMonth } from "@/lib/usage";
import { euros } from "@/lib/plans";
import { trialDaysLeft } from "@/lib/queries";
import FunnelCard from "@/components/FunnelCard";
import { aiEnabled } from "@/lib/ai";
import { whatsappReady } from "@/lib/whatsapp";
import { AddNumbersForm, AssignNumberForm, LimitInput, RemoveNumberButton, StatusSelect, VisitForm, WhatsAppConnectForm } from "./forms";

export const metadata: Metadata = { title: "Admin" };

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  setup: { label: "In setup", cls: "bg-paper text-muted" },
  number_pending: { label: "Needs number", cls: "bg-warn-soft text-warn" },
  forwarding: { label: "Forwarding", cls: "bg-sky text-blue-deep" },
  live: { label: "Live", cls: "bg-ok-soft text-ok" },
  paused: { label: "Paused", cls: "bg-danger-soft text-danger" },
};

export default async function AdminPage() {
  await requireAdmin();

  const [bizRows, visits, bookingCounts, pool] = await Promise.all([
    db
      .select({ biz: businesses, ownerName: users.name, ownerEmail: users.email })
      .from(businesses)
      .leftJoin(memberships, eq(memberships.businessId, businesses.id))
      .leftJoin(users, eq(users.id, memberships.userId))
      .orderBy(desc(businesses.createdAt)),
    db
      .select({ v: visitRequests, bizName: businesses.name, ownerEmail: users.email })
      .from(visitRequests)
      .innerJoin(businesses, eq(businesses.id, visitRequests.businessId))
      .leftJoin(users, eq(users.id, visitRequests.requestedBy))
      .orderBy(desc(visitRequests.createdAt))
      .limit(100),
    db.select({ businessId: bookings.businessId, n: count() }).from(bookings).groupBy(bookings.businessId),
    db
      .select({ number: phoneNumbers.number, bizName: businesses.name })
      .from(phoneNumbers)
      .leftJoin(businesses, eq(businesses.id, phoneNumbers.businessId))
      .orderBy(phoneNumbers.createdAt),
  ]);
  const freeNumbers = pool.filter((p) => !p.bizName).length;
  const funnels = new Map(await Promise.all(bizRows.map(async (r) => [r.biz.id, await missedCallFunnel(r.biz.id)] as const)));
  const usages = new Map(await Promise.all(bizRows.map(async (r) => [r.biz.id, await usageThisMonth(r.biz)] as const)));
  const sent = new Map(await Promise.all(bizRows.map(async (r) => [r.biz.id, await messagesThisMonth(r.biz)] as const)));
  const nBookings = new Map(bookingCounts.map((r) => [r.businessId, r.n]));
  const tz = "Europe/Zagreb";
  const when = (ms: number) => formatDateTime(ms, tz, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const openVisits = visits.filter((r) => r.v.status === "requested" || r.v.status === "scheduled");
  const needNumber = bizRows.filter((r) => r.biz.status === "number_pending");

  return (
    <div className="mx-auto max-w-6xl px-5 py-6">
      <header className="flex items-center justify-between">
        <Wordmark />
        <Link href="/dashboard" className="btn btn-quiet btn-sm">Back to app</Link>
      </header>
      <h1 className="font-display mt-8 text-3xl">Admin</h1>
      <p className="text-ink-soft">
        {bizRows.length} businesses · {needNumber.length} waiting for a number · {openVisits.length} open visit requests ·{" "}
        {freeNumbers} free number{freeNumbers === 1 ? "" : "s"} in the pool
      </p>
      {!aiEnabled() && (
        <p className="mt-3 rounded-xl bg-sky px-4 py-3 text-sm text-blue-deep">
          AI is off on this server (<code>AI_ENABLED</code> isn&apos;t &quot;true&quot; or there&apos;s no <code>OPENAI_API_KEY</code>), so
          callers get the booking page instead of the chat with Halo.
        </p>
      )}
      {!whatsappReady() && (
        <p className="mt-3 rounded-xl bg-sky px-4 py-3 text-sm text-blue-deep">
          WhatsApp isn&apos;t set up on this server (<code>WHATSAPP_APP_SECRET</code>, <code>WHATSAPP_VERIFY_TOKEN</code>), so
          shops reach callers by SMS with a chat link.
        </p>
      )}
      {!twilioConfigured() && (
        <p className="mt-3 rounded-xl bg-warn-soft px-4 py-3 text-sm text-warn">
          Twilio keys aren&apos;t set on this server: texts are printed to the server log instead of sent, and numbers
          aren&apos;t routed automatically.
        </p>
      )}

      <section className="mt-8">
        <h2 className="font-display mb-1 text-xl">Number pool</h2>
        <p className="mb-3 text-sm text-ink-soft">
          Buy voice-capable numbers in Twilio and paste them here. Each business that finishes setup gets the next free
          one automatically, and its calls are routed to this app.
        </p>
        <div className="card grid gap-6 p-5 lg:grid-cols-[1fr_1.2fr]">
          <AddNumbersForm />
          {pool.length === 0 ? (
            <p className="text-sm text-muted">The pool is empty, so new businesses wait for you to assign a number.</p>
          ) : (
            <ul className="divide-y divide-line text-sm">
              {pool.map((p) => (
                <li key={p.number} className="flex items-center justify-between gap-3 py-2">
                  <span className="font-medium tabular-nums">{formatPhone(p.number)}</span>
                  {p.bizName ? (
                    <span className="text-muted">{p.bizName}</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="chip bg-ok-soft text-ok">Free</span>
                      <RemoveNumberButton number={p.number} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display mb-1 text-xl">WhatsApp numbers</h2>
        <p className="mb-3 text-sm text-ink-soft">
          Each shop sends from its own WhatsApp number, so customers see the shop&apos;s name. Connect it during the
          setup visit (README → WhatsApp setup), then submit the message templates.
        </p>
        <ul className="card divide-y divide-line">
          {bizRows.length === 0 && <li className="p-4 text-sm text-muted">No shops yet.</li>}
          {bizRows.map(({ biz }) => (
            <li key={biz.id} className="grid gap-3 p-4 lg:grid-cols-[220px_1fr]">
              <div className="text-sm">
                <p className="font-semibold">{biz.name}</p>
                <p className={biz.waPhoneNumberId ? "text-ok" : "text-muted"}>
                  {biz.waPhoneNumberId ? `Connected${biz.waDisplayPhone ? ` · ${formatPhone(biz.waDisplayPhone)}` : ""}` : "Not connected"}
                </p>
                {biz.waTemplatesAt && <p className="text-xs text-muted">Templates submitted {when(biz.waTemplatesAt)}</p>}
              </div>
              <WhatsAppConnectForm
                id={biz.id}
                phoneNumberId={biz.waPhoneNumberId ?? ""}
                wabaId={biz.waBusinessAccountId ?? ""}
                displayPhone={biz.waDisplayPhone ?? ""}
                ownApp={biz.waOwnApp}
                hasToken={!!biz.waTokenEnc}
                templatesAt={biz.waTemplatesAt}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display mb-3 text-xl">Visit requests</h2>
        {visits.length === 0 ? (
          <p className="card p-5 text-sm text-muted">No visit requests yet.</p>
        ) : (
          <ul className="card divide-y divide-line">
            {visits.map(({ v, bizName, ownerEmail }) => (
              <li key={v.id} className="grid gap-3 px-4 py-4 lg:grid-cols-[1fr_auto]">
                <div className="min-w-0 text-sm">
                  <p className="text-base font-semibold">{bizName}</p>
                  <p>
                    {v.contactName} · <a className="text-blue" href={`tel:${v.contactPhone}`}>{formatPhone(v.contactPhone)}</a>
                    {ownerEmail && <> · <a className="text-blue" href={`mailto:${ownerEmail}`}>{ownerEmail}</a></>}
                  </p>
                  <p className="text-ink-soft">{v.address}</p>
                  <p className="text-ink-soft">Prefers: {v.preferredTimes}</p>
                  <p className="text-ink-soft">Help with: {v.help.join(", ")}{v.notes ? ` · “${v.notes}”` : ""}</p>
                  <p className="text-xs text-muted">Requested {when(v.createdAt)}</p>
                </div>
                <VisitForm id={v.id} status={v.status} scheduledFor={v.scheduledFor ?? ""} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display mb-3 text-xl">Businesses</h2>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[1150px] text-left text-sm">
            <thead className="border-b border-line bg-paper/60 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Business</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Trial</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">RingLoop number</th>
                <th className="px-4 py-3 font-semibold">Bookings</th>
                <th className="px-4 py-3 font-semibold">Missed calls used this month</th>
                <th className="px-4 py-3 font-semibold" title="Missed calls → texted → opened → booked, last 30 days">Missed → texted → opened → booked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {bizRows.map(({ biz, ownerName, ownerEmail }) => {
                const st = STATUS_LABEL[biz.status];
                return (
                  <tr key={biz.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{biz.name}</p>
                      <p className="text-muted">
                        {businessType(biz.type).label}{biz.city ? ` · ${biz.city}` : ""}
                      </p>
                      <p className="text-muted">{biz.phone ? formatPhone(biz.phone) : "—"} · joined {when(biz.createdAt)}</p>
                      <a href={`/b/${biz.slug}`} target="_blank" rel="noreferrer" className="text-blue">/b/{biz.slug}</a>
                    </td>
                    <td className="px-4 py-3">
                      <p>{ownerName ?? "—"}</p>
                      {ownerEmail && <a href={`mailto:${ownerEmail}`} className="text-blue">{ownerEmail}</a>}
                    </td>
                    <td className="px-4 py-3">
                      {biz.trialEndsAt ? `${trialDaysLeft(biz.trialEndsAt) > 0 ? "Until" : "Ended"} ${when(biz.trialEndsAt)}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`chip ${st.cls}`}>{st.label}</span>
                      <div className="mt-2">
                        <StatusSelect id={biz.id} status={biz.status} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <AssignNumberForm id={biz.id} number={biz.ringloopNumber ?? ""} />
                    </td>
                    <td className="px-4 py-3 tabular-nums">{nBookings.get(biz.id) ?? 0}</td>
                    <td className="px-4 py-3">
                      {(() => {
                        const u = usages.get(biz.id)!;
                        const m = sent.get(biz.id)!;
                        return (
                          <div className="space-y-1">
                            <p className={`tabular-nums ${u.stopped ? "text-danger" : ""}`}>
                              {u.used} / {u.limit}
                              {u.extra > 0 && <span className="text-warn"> · +{u.extra} = {euros(u.extraCents)}</span>}
                            </p>
                            <p className="text-xs text-muted">{biz.allowExtraCalls ? "keeps going" : "pauses at the limit"}</p>
                            <p className="text-xs text-muted" title="What you paid to send, not billed to the shop">
                              Sent: {m.whatsapp} WhatsApp · {m.sms} SMS
                            </p>
                            <LimitInput id={biz.id} value={biz.callLimit} />
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3">{funnels.get(biz.id) && <FunnelCard funnel={funnels.get(biz.id)!} compact />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
