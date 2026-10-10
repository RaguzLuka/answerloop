"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { setBookingStatus } from "@/lib/actions/bookings";
import type { BookingStatus } from "@/lib/db/schema";
import Icon from "@/components/Icon";

export default function BookingActions({ id, status }: { id: string; status: BookingStatus }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const run = (s: BookingStatus, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setOpen(false);
    start(() => setBookingStatus(id, s));
  };

  const items: { s: BookingStatus; label: string; icon: string; confirm?: string; danger?: boolean }[] =
    status === "confirmed"
      ? [
          { s: "completed", label: "Mark as done", icon: "check" },
          { s: "no_show", label: "Didn't show up", icon: "alert" },
          { s: "cancelled", label: "Cancel booking", icon: "x", confirm: "Cancel this booking? The time becomes free again.", danger: true },
        ]
      : [{ s: "confirmed", label: "Restore booking", icon: "calendarCheck" }];

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-label="Booking options"
        aria-expanded={open}
        disabled={pending}
        onClick={() => setOpen((o) => !o)}
        className="rounded-full p-2 text-muted hover:bg-sky hover:text-blue disabled:opacity-50"
      >
        {pending ? (
          <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
            <circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" />
          </svg>
        )}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-10 z-20 w-52 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-[0_16px_40px_-16px_rgba(12,27,56,0.3)]">
          {items.map((it) => (
            <button
              key={it.s}
              role="menuitem"
              type="button"
              onClick={() => run(it.s, it.confirm)}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium hover:bg-paper ${it.danger ? "text-danger" : "text-ink"}`}
            >
              <Icon name={it.icon} className="h-4 w-4" /> {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
