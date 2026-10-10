import Link from "next/link";
import type { Usage } from "@/lib/usage";
import { EXTRA_CALL_CENTS, euros } from "@/lib/plans";

/** This month's missed calls used vs the plan's allowance. `link` = on Home (links to the Plan page). */
export default function UsageMeter({ usage, allowExtra, link = true }: { usage: Usage; allowExtra: boolean; link?: boolean }) {
  const share = Math.min(1, usage.used / Math.max(1, usage.limit));
  const tone = usage.stopped ? "bg-danger" : share >= 0.8 ? "bg-warn" : "bg-blue";
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-semibold">Missed calls used this month</span>
        <span className="tabular-nums text-ink-soft">
          {Math.min(usage.used, usage.limit)} / {usage.limit}
          {usage.extra > 0 && <span className="text-warn"> + {usage.extra} extra ({euros(usage.extraCents)})</span>}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={usage.limit} aria-valuenow={usage.used}>
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${share * 100}%` }} />
      </div>
      {usage.stopped ? (
        <p className="text-sm text-danger">
          {`All ${usage.limit} used. Missed callers won't get a message until the 1st; you still see them under Missed calls. `}
          {link && <Link href="/settings?s=plan" className="font-semibold underline underline-offset-2">Keep going</Link>}
        </p>
      ) : (
        // On the Plan page (link off) the same explanation is right above the meter
        link && <p className="text-xs text-muted">
          Each missed call counts once. The chat, the booking and the reminder are included.
          {allowExtra ? ` Over ${usage.limit}: ${euros(EXTRA_CALL_CENTS)} each.` : ""}
        </p>
      )}
    </div>
  );
}
