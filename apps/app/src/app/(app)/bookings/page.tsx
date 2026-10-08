import type { Metadata } from "next";
import Link from "next/link";
import { getServices, requireBusiness } from "@/lib/dal";
import { businessType } from "@/lib/business-types";
import { cancelledUpcoming, pastBookings, today, upcomingBookings } from "@/lib/queries";
import { addDays, formatDateLabel, zonedParts } from "@/lib/time";
import type { Booking } from "@/lib/db/schema";
import BookingCard from "@/components/BookingCard";
import Icon from "@/components/Icon";
import Halo from "@/components/Halo";
import NewBooking from "./NewBooking";

export const metadata: Metadata = { title: "Bookings" };

function groupByDay(list: Booking[], tz: string) {
  const groups = new Map<string, Booking[]>();
  for (const b of list) {
    const d = zonedParts(b.startsAt, tz).date;
    groups.set(d, [...(groups.get(d) ?? []), b]);
  }
  return [...groups.entries()];
}

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ view?: string; new?: string }> }) {
  const { business } = await requireBusiness();
  const { view, new: openNew } = await searchParams;
  const words = businessType(business.type).words;
  const services = await getServices(business.id);
  const t = today(business);

  const past = view === "past";
  const list = past
    ? await pastBookings(business)
    : [...(await upcomingBookings(business)), ...(await cancelledUpcoming(business))].sort((a, b) => a.startsAt - b.startsAt);
  const groups = groupByDay(list, business.timezone);

  const dayLabel = (d: string) => (d === t ? "Today" : d === addDays(t, 1) ? "Tomorrow" : formatDateLabel(d));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl capitalize">{words.bookings}</h1>
          <p className="text-ink-soft">Everything booked through your link, by text or by you.</p>
        </div>
      </div>

      <NewBooking
        services={services}
        defaultOpen={openNew === "1"}
        today={t}
        words={words}
        confirmations={business.confirmationsEnabled}
      />

      <div className="inline-flex rounded-full border border-line bg-white p-1 text-sm font-semibold" role="tablist">
        <Link href="/bookings" role="tab" aria-selected={!past} className={`rounded-full px-4 py-1.5 ${!past ? "bg-sky text-blue-deep" : "text-muted"}`}>
          Upcoming
        </Link>
        <Link href="/bookings?view=past" role="tab" aria-selected={past} className={`rounded-full px-4 py-1.5 ${past ? "bg-sky text-blue-deep" : "text-muted"}`}>
          Past
        </Link>
      </div>

      {groups.length ? (
        groups.map(([day, items]) => (
          <section key={day} className="card overflow-hidden">
            <h2 className="flex items-center justify-between border-b border-line bg-paper/60 px-4 py-2.5 text-sm font-semibold">
              {dayLabel(day)}
              <span className="font-normal text-muted">
                {items.filter((b) => b.status === "confirmed").length} booked
              </span>
            </h2>
            <ul className="divide-y divide-line">
              {items.map((b) => (
                <BookingCard key={b.id} booking={b} tz={business.timezone} />
              ))}
            </ul>
          </section>
        ))
      ) : (
        <div className="card flex flex-col items-center px-6 py-10 text-center">
          <Halo pose={past ? "night" : "booking"} size={120} />
          <p className="mt-2 font-semibold">{past ? `No past ${words.bookings} yet` : `No upcoming ${words.bookings}`}</p>
          <p className="mt-1 max-w-sm text-sm text-ink-soft">
            {past
              ? "Once days go by, finished bookings show up here."
              : "Share your booking link, or add one yourself when someone calls."}
          </p>
          {!past && (
            <Link href="/dashboard" className="btn btn-secondary btn-sm mt-4">
              <Icon name="link" className="h-4 w-4" /> Get your booking link
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
