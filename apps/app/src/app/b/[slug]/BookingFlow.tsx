"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPublicBooking, type PublicBookingResult } from "@/lib/actions/bookings";
import Icon from "@/components/Icon";
import Halo from "@/components/Halo";
import { bookingCopy, type Lang } from "@/lib/booking-i18n";

type Svc = { id: string; name: string; durationMin: number; priceCents: number | null };
type Slot = { time: string; startsAt: number };

const dayFmtIn = (locale: string) => (date: string, opts: Intl.DateTimeFormatOptions) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...opts }).format(new Date(Date.UTC(y, m - 1, d)));
};
const duration = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}`);
const price = (c: number | null) => (c == null ? null : `€${(c / 100).toFixed(c % 100 ? 2 : 0)}`);

export default function BookingFlow({
  slug, businessName, services, dates, lang, typeId, refToken,
}: {
  slug: string;
  businessName: string;
  services: Svc[];
  dates: { date: string; open: boolean }[];
  lang: Lang;
  typeId: string;
  refToken?: string;
}) {
  const t = bookingCopy(lang, typeId, businessName);
  const dayFmt = dayFmtIn(t.locale);
  const [service, setService] = useState<Svc | null>(services.length === 1 ? services[0] : null);
  const [date, setDate] = useState<string>(() => dates.find((d) => d.open)?.date ?? dates[0]?.date);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [result, setResult] = useState<PublicBookingResult | null>(null);
  // React resets the form after each submit; refill it if the booking fails
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();
  const details = useRef<HTMLElement>(null);

  // Bring the details form into view once a time is picked
  useEffect(() => {
    if (slot) details.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [slot]);

  useEffect(() => {
    if (!service || !date) return;
    let cancelled = false;
    // Clear stale times while the new day loads
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlots(null);
    setSlot(null);
    fetch(`/api/b/${encodeURIComponent(slug)}/slots?service=${service.id}&date=${date}`)
      .then((r) => (r.ok ? r.json() : { slots: [] }))
      .then((j) => !cancelled && setSlots(j.slots ?? []))
      .catch(() => !cancelled && setSlots([]));
    return () => {
      cancelled = true;
    };
  }, [slug, service, date, refresh]);

  // Morning / afternoon / evening rows of free times
  const groups: Slot[][] = [[], [], []];
  for (const s of slots ?? []) {
    const h = Number(s.time.slice(0, 2));
    groups[h < 12 ? 0 : h < 17 ? 1 : 2].push(s);
  }
  const grouped = groups.map((list, i) => [t.parts[i], list] as const).filter(([, list]) => list.length);

  if (result?.ok) {
    const s = result.summary;
    return (
      <div className="card flex flex-col items-center p-8 text-center">
        <Halo pose="celebrate" size={140} priority />
        <h2 className="font-display mt-2 text-2xl">{t.done}</h2>
        <p className="mt-2 text-ink-soft">
          <strong className="text-ink">{t.doneAt(s.service)}</strong>
          <br />
          {s.day} {t.at} <strong className="text-ink">{s.time}</strong>
        </p>
        <p className="mt-4 text-sm text-muted">{t.change}</p>
      </div>
    );
  }

  function submit(fd: FormData) {
    if (!service || !slot) return;
    const input = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]));
    setDraft(input);
    start(async () => {
      const r = await createPublicBooking({
        ...input, slug, serviceId: service.id, startsAt: String(slot.startsAt), ref: refToken ?? "",
      });
      setResult(r);
      if (!r.ok && r.slotGone) {
        setSlot(null);
        setRefresh((n) => n + 1);
      }
    });
  }

  const errors = result && !result.ok ? result.errors ?? {} : {};

  return (
    <div className="space-y-8">
      {/* 1 — service */}
      <section>
        <h2 className="mb-3 font-semibold">{t.step1}</h2>
        <div className="space-y-2">
          {services.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setService(s)}
              aria-pressed={service?.id === s.id}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                service?.id === s.id ? "border-blue bg-sky" : "border-line bg-white hover:border-blue/40"
              }`}
            >
              <span>
                <span className="block font-semibold">{s.name}</span>
                <span className="text-sm text-muted">{duration(s.durationMin)}</span>
              </span>
              <span className="flex items-center gap-3">
                {price(s.priceCents) && <span className="font-semibold tabular-nums">{price(s.priceCents)}</span>}
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    service?.id === s.id ? "border-blue bg-blue text-white" : "border-line"
                  }`}
                >
                  {service?.id === s.id && <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 2 — day & time */}
      {service && (
        <section>
          <h2 className="mb-3 font-semibold">{t.step2}</h2>
          <div className="-mx-5 overflow-x-auto px-5 pb-2">
            <div className="flex w-max gap-2">
              {dates.map((d) => (
                <button
                  key={d.date}
                  type="button"
                  disabled={!d.open}
                  onClick={() => setDate(d.date)}
                  aria-pressed={date === d.date}
                  className={`flex w-16 flex-col items-center rounded-2xl border py-2.5 transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    date === d.date ? "border-blue bg-blue text-white" : "border-line bg-white hover:border-blue/40"
                  }`}
                >
                  <span className={`text-xs font-semibold uppercase ${date === d.date ? "text-white/80" : "text-muted"}`}>
                    {dayFmt(d.date, { weekday: "short" })}
                  </span>
                  <span className="font-display text-xl">{dayFmt(d.date, { day: "numeric" })}</span>
                  <span className={`text-[11px] ${date === d.date ? "text-white/80" : "text-muted"}`}>
                    {d.open ? dayFmt(d.date, { month: "short" }) : t.closed}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 min-h-24">
            {slots === null ? (
              <div className="grid grid-cols-4 gap-2" aria-busy="true" aria-label={t.loading}>
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className="h-11 animate-pulse rounded-xl bg-line/70" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <p className="rounded-2xl bg-white px-4 py-5 text-center text-sm text-ink-soft ring-1 ring-line">
                {t.noTimes(dayFmt(date, { weekday: "long", day: "numeric", month: "long" }))}
              </p>
            ) : (
              <div className="space-y-4">
                {grouped.map(([label, list]) => (
                  <div key={label}>
                    <p className="label mb-2">{label}</p>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                      {list.map((s) => (
                        <button
                          key={s.startsAt}
                          type="button"
                          onClick={() => setSlot(s)}
                          aria-pressed={slot?.startsAt === s.startsAt}
                          className={`h-11 rounded-xl border text-[0.9375rem] font-semibold tabular-nums transition ${
                            slot?.startsAt === s.startsAt ? "border-blue bg-blue text-white" : "border-line bg-white hover:border-blue/50"
                          }`}
                        >
                          {s.time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3 — details */}
      {service && slot && (
        <section ref={details} className="scroll-mt-4">
          <h2 className="mb-3 font-semibold">{t.step3}</h2>
          <form action={submit} className="card space-y-4 p-5" noValidate>
            <div className="rounded-xl bg-sky px-4 py-3 text-sm text-blue-deep">
              <strong>{service.name}</strong> · {dayFmt(date, { weekday: "long", day: "numeric", month: "long" })} {t.at}{" "}
              <strong>{slot.time}</strong>
            </div>
            {result && !result.ok && result.error && (
              <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">{result.error}</p>
            )}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="customerName" className="text-sm font-semibold">{t.name}</label>
              <input id="customerName" name="customerName" className="input" autoComplete="name" defaultValue={draft.customerName} aria-invalid={errors.customerName ? true : undefined} />
              {errors.customerName && <p className="text-sm text-danger">{errors.customerName}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="customerPhone" className="text-sm font-semibold">{t.phone}</label>
              <input id="customerPhone" name="customerPhone" type="tel" className="input" autoComplete="tel" placeholder="091 234 5678" defaultValue={draft.customerPhone} aria-invalid={errors.customerPhone ? true : undefined} />
              {errors.customerPhone ? (
                <p className="text-sm text-danger">{errors.customerPhone}</p>
              ) : (
                <p className="text-sm text-muted">{t.phoneHint}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="notes" className="text-sm font-semibold">{t.notes} <span className="font-normal text-muted">{t.optional}</span></label>
              <input id="notes" name="notes" className="input" maxLength={300} defaultValue={draft.notes} />
            </div>
            <label className="flex items-start gap-3 text-sm text-ink-soft">
              <input type="checkbox" name="consent" className="mt-0.5 h-5 w-5 shrink-0 accent-blue" defaultChecked={draft.consent === "on"} />
              <span>
                {t.consent} (
                <a href="https://www.ringloop.net/privacy" target="_blank" rel="noreferrer" className="text-blue underline-offset-2 hover:underline">
                  {t.privacy}
                </a>
                ).
              </span>
            </label>
            {errors.consent && <p className="text-sm text-danger">{errors.consent}</p>}
            <button type="submit" className="btn btn-primary w-full" disabled={pending}>
              {pending ? t.booking : t.confirm}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
