import type { Business } from "@/lib/db";
import type { Usage } from "@/lib/usage";
import { EXTRA_MESSAGE_CENTS, PLANS, euros } from "@/lib/plans";
import { trialDaysLeft } from "@/lib/queries";
import UsageMeter from "@/components/UsageMeter";
import ExtraChoice from "./ExtraChoice";

export default function PlanSection({ business, usage }: { business: Business; usage: Usage }) {
  const plan = PLANS[business.plan];
  const trial = business.trialEndsAt ? trialDaysLeft(business.trialEndsAt) : 0;
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl">
          {plan.name} · {euros(plan.priceEur * 100)}/month
        </h2>
        <p className="text-ink-soft">{plan.blurb}</p>
        <p className="mt-1 text-sm text-muted">
          {usage.limit} messages included each month{trial > 0 ? ` · free trial, ${trial} days left` : ""}. To change your plan,
          write to hello@ringloop.net.
        </p>
      </div>

      <UsageMeter usage={usage} allowExtra={business.allowExtraMessages} link={false} />

      <div>
        <h3 className="mb-2 font-semibold">When this month&apos;s messages run out</h3>
        <ExtraChoice allow={business.allowExtraMessages} price={euros(EXTRA_MESSAGE_CENTS)} />
      </div>
    </div>
  );
}
