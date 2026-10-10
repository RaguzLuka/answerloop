import type { Funnel } from "@/lib/stats";
import Icon from "@/components/Icon";

/** Missed calls → texted → opened → booked, for the last 30 days. */
export default function FunnelCard({ funnel, compact = false }: { funnel: Funnel; compact?: boolean }) {
  const steps = [
    { label: "Missed calls", value: funnel.missed },
    { label: "Texted", value: funnel.texted },
    { label: "Opened", value: funnel.opened },
    { label: "Booked", value: funnel.booked },
  ];
  if (compact) {
    return (
      <span className="inline-flex flex-wrap items-center gap-1 tabular-nums">
        {steps.map((s, i) => (
          <span key={s.label} className="inline-flex items-center gap-1">
            {i > 0 && <span className="text-muted">→</span>}
            <span title={s.label}>{s.value}</span>
          </span>
        ))}
      </span>
    );
  }
  return (
    <section className="card p-4">
      <p className="label mb-3">From missed calls · last 30 days</p>
      <div className="grid grid-cols-4 gap-1">
        {steps.map((s, i) => (
          <div key={s.label} className="relative text-center">
            {i > 0 && (
              <Icon name="chevronRight" className="absolute -left-2 top-2.5 h-4 w-4 text-line" strokeWidth={2.4} />
            )}
            <p className={`font-display text-2xl tabular-nums sm:text-3xl ${i === 3 ? "text-ok" : ""}`}>{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
