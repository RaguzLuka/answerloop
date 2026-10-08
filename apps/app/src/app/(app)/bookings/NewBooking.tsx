"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createManualBooking } from "@/lib/actions/bookings";
import { initialState } from "@/lib/form";
import type { Service } from "@/lib/db/schema";
import { Field, FormMessage, SubmitButton, TextField } from "@/components/form";
import Icon from "@/components/Icon";

export default function NewBooking({
  services, defaultOpen, today, words, confirmations,
}: {
  services: Service[];
  defaultOpen: boolean;
  today: string;
  words: { booking: string; customer: string; service: string };
  confirmations: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [state, action] = useActionState(createManualBooking, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  if (!open) {
    return (
      <div className="space-y-3">
        {state.ok && <FormMessage state={state} />}
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          <Icon name="plus" className="h-4 w-4" /> New {words.booking}
        </button>
      </div>
    );
  }

  const v = state.ok ? {} : (state.values ?? {});

  return (
    <form ref={formRef} action={action} className="card space-y-5 p-5" noValidate>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl capitalize">New {words.booking}</h2>
        <button type="button" className="rounded-full p-2 text-muted hover:bg-sky" aria-label="Close" onClick={() => setOpen(false)}>
          <Icon name="x" className="h-5 w-5" />
        </button>
      </div>
      <FormMessage state={state} />
      <Field label={`Which ${words.service}?`} name="serviceId" error={state.errors?.serviceId}>
        <select id="serviceId" name="serviceId" className="input" defaultValue={v.serviceId ?? services[0]?.id}>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · {s.durationMin} min
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <TextField state={state} name="date" label="Date" type="date" defaultValue={v.date ?? today} min={today} />
        <TextField state={state} name="time" label="Time" type="time" defaultValue={v.time ?? "10:00"} step={300} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField state={state} name="customerName" label={`${words.customer[0].toUpperCase()}${words.customer.slice(1)} name`} autoComplete="off" />
        <TextField state={state} name="customerPhone" label="Mobile number" type="tel" placeholder="091 234 5678" autoComplete="off" />
      </div>
      <TextField state={state} name="notes" label="Note (optional)" placeholder="e.g. prefers Ana, allergic to…" />
      {confirmations && (
        <label className="flex items-center gap-3 text-sm text-ink-soft">
          <input type="checkbox" name="textCustomer" defaultChecked className="h-5 w-5 accent-blue" />
          Text the {words.customer} a confirmation
        </label>
      )}
      <SubmitButton pendingText="Booking…">
        <Icon name="calendarCheck" className="h-4 w-4" /> Save {words.booking}
      </SubmitButton>
    </form>
  );
}
