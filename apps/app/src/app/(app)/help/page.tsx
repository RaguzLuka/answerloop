import type { Metadata } from "next";
import { requireBusiness } from "@/lib/dal";
import { visitsFor } from "@/lib/queries";
import { cancelVisit } from "@/lib/actions/business";
import { formatDateTime } from "@/lib/time";
import type { VisitRequest } from "@/lib/db/schema";
import VisitRequestForm from "@/components/VisitRequestForm";
import { HaloSays } from "@/components/Halo";
import Icon from "@/components/Icon";
import { SubmitButton } from "@/components/form";

export const metadata: Metadata = { title: "Help" };

const VISIT_STATUS: Record<VisitRequest["status"], { label: string; cls: string }> = {
  requested: { label: "We'll call you", cls: "bg-warn-soft text-warn" },
  scheduled: { label: "Booked", cls: "bg-sky text-blue-deep" },
  done: { label: "Done", cls: "bg-ok-soft text-ok" },
  cancelled: { label: "Cancelled", cls: "bg-paper text-muted" },
};

const FAQ = [
  {
    q: "Do my customers need to call a new number?",
    a: "No. They keep calling your usual number. Only calls you don't pick up are forwarded to RingLoop, which texts the caller your booking link.",
  },
  {
    q: "What does the caller receive?",
    a: "One SMS from your sender name, with your message and booking link. You can change the wording any time under Settings → Text-back.",
  },
  {
    q: "How do I stop it for a day?",
    a: "Tap Pause on the Home screen. Or dial ##004# on your phone to switch call forwarding off completely.",
  },
  {
    q: "Can my staff use the app?",
    a: "Yes. Install it on the phones at the counter and sign in with your account. Separate staff logins aren't available yet.",
  },
];

export default async function HelpPage() {
  const { user, business } = await requireBusiness();
  const visits = await visitsFor(business.id);
  const open = visits.filter((v) => v.status === "requested" || v.status === "scheduled");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Help</h1>
        <p className="text-ink-soft">Set it up yourself, or ask us to come over.</p>
      </div>

      {visits.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold">Your visit requests</h2>
          <ul className="card divide-y divide-line">
            {visits.map((v) => {
              const st = VISIT_STATUS[v.status];
              return (
                <li key={v.id} className="flex flex-wrap items-start gap-3 px-4 py-3.5">
                  <Icon name="van" className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{v.address}</p>
                      <span className={`chip ${st.cls}`}>{st.label}</span>
                    </div>
                    <p className="text-sm text-ink-soft">
                      {v.status === "scheduled" && v.scheduledFor ? `Visit: ${v.scheduledFor}` : `You suggested: ${v.preferredTimes}`}
                    </p>
                    <p className="text-xs text-muted">
                      Sent {formatDateTime(v.createdAt, business.timezone, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      {" · "}
                      {v.help.join(", ")}
                    </p>
                  </div>
                  {(v.status === "requested" || v.status === "scheduled") && (
                    <form action={cancelVisit.bind(null, v.id)}>
                      <SubmitButton className="btn btn-danger btn-sm" pendingText="…">Cancel</SubmitButton>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="card space-y-5 p-5 sm:p-6">
        <HaloSays pose="wave" size={64}>
          {open.length
            ? "Need something else as well? Send another request."
            : "Rather not do it alone? Someone from RingLoop can come to your place, set everything up and show your team. Usually within a few days."}
        </HaloSays>
        <h2 className="font-display text-xl">Request a visit</h2>
        <VisitRequestForm
          defaults={{
            contactName: user.name,
            contactPhone: business.phone,
            address: [business.address, business.city].filter(Boolean).join(", "),
          }}
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Common questions</h2>
        <div className="card divide-y divide-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-4 py-3.5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium">
                {f.q}
                <Icon name="chevronDown" className="h-4 w-4 shrink-0 text-muted transition group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="card flex flex-wrap items-center gap-4 p-5">
        <Icon name="mail" className="h-6 w-6 text-blue" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Talk to a person</p>
          <p className="text-sm text-ink-soft">We answer within one business day.</p>
        </div>
        <a href="mailto:hello@ringloop.net" className="btn btn-secondary btn-sm">hello@ringloop.net</a>
      </section>
    </div>
  );
}
