import type { Booking } from "@/lib/db/schema";
import { formatTime } from "@/lib/time";
import { formatPhone } from "@/lib/phone";
import Icon from "@/components/Icon";
import BookingActions from "@/components/BookingActions";

const SOURCE: Record<Booking["source"], string> = { link: "Booking link", manual: "Added by you", sms: "By text", chat: "Chat with Halo" };
const STATUS: Record<Booking["status"], { label: string; cls: string } | null> = {
  confirmed: null,
  cancelled: { label: "Cancelled", cls: "bg-danger-soft text-danger" },
  completed: { label: "Done", cls: "bg-ok-soft text-ok" },
  no_show: { label: "No-show", cls: "bg-warn-soft text-warn" },
};

export default function BookingCard({ booking: b, tz, actions = true }: { booking: Booking; tz: string; actions?: boolean }) {
  const status = STATUS[b.status];
  const mins = Math.round((b.endsAt - b.startsAt) / 60_000);
  return (
    <li className={`flex gap-4 px-4 py-3.5 ${b.status === "cancelled" ? "opacity-60" : ""}`}>
      <div className="w-14 shrink-0 pt-0.5 text-right">
        <p className="font-display text-[1.05rem] tabular-nums">{formatTime(b.startsAt, tz)}</p>
        <p className="text-xs text-muted">{mins} min</p>
      </div>
      <div className="min-w-0 flex-1 border-l-2 border-blue/30 pl-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">{b.customerName}</p>
          {status && <span className={`chip ${status.cls}`}>{status.label}</span>}
        </div>
        <p className="text-sm text-ink-soft">{b.serviceName}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <a href={`tel:${b.customerPhone}`} className="inline-flex items-center gap-1 font-medium text-blue">
            <Icon name="phone" className="h-3.5 w-3.5" /> {formatPhone(b.customerPhone)}
          </a>
          <span className="text-xs text-muted">{SOURCE[b.source]}</span>
        </div>
        {b.notes && <p className="mt-1.5 rounded-lg bg-paper px-2.5 py-1.5 text-sm text-ink-soft">“{b.notes}”</p>}
      </div>
      {actions && <BookingActions id={b.id} status={b.status} />}
    </li>
  );
}
