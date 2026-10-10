import type { Business } from "@/lib/db";
import type { Usage } from "@/lib/usage";
import { EXTRA_CALL_CENTS, PLAN, euros } from "@/lib/plans";
import { trialDaysLeft } from "@/lib/queries";
import UsageMeter from "@/components/UsageMeter";
import ExtraChoice from "./ExtraChoice";

export default function PlanSection({ business, usage }: { business: Business; usage: Usage }) {
  const trial = business.trialEndsAt ? trialDaysLeft(business.trialEndsAt) : 0;
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl">
          {PLAN.name} · {euros(PLAN.priceEur * 100)} a month
        </h2>
        {trial > 0 && <p className="text-sm font-semibold text-ok">Free trial: {trial} {trial === 1 ? "day" : "days"} left</p>}
        <p className="mt-2 text-ink-soft">
          Every missed call gets a message from your number. Halo chats with the caller, books the appointment and
          sends a reminder the day before.
        </p>
        <p className="mt-2 text-ink-soft">
          Includes <strong>{usage.limit} missed calls a month</strong>. Each one counts once: the chat, the booking and
          the reminder are included.
        </p>
      </div>

      <UsageMeter usage={usage} allowExtra={business.allowExtraCalls} link={false} />

      <div>
        <h3 className="mb-2 font-semibold">If you reach {usage.limit} missed calls in a month</h3>
        <ExtraChoice allow={business.allowExtraCalls} limit={usage.limit} price={euros(EXTRA_CALL_CENTS)} />
      </div>

      <p className="text-sm text-muted">Questions about your plan? Write to hello@ringloop.net.</p>
    </div>
  );
}
