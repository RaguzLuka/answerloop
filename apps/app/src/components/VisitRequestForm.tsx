"use client";

import { useActionState } from "react";
import { requestVisit } from "@/lib/actions/business";
import { initialState } from "@/lib/form";
import { Field, FormMessage, SubmitButton, TextField } from "@/components/form";
import Icon from "@/components/Icon";

const HELP = ["Call forwarding", "Services & hours", "Booking link", "Training my team", "Everything"];

export default function VisitRequestForm({
  defaults, onDone,
}: {
  defaults: { contactName: string; contactPhone: string; address: string };
  onDone?: React.ReactNode;
}) {
  const [state, action] = useActionState(requestVisit, initialState);

  if (state.ok) {
    return (
      <div className="space-y-4">
        <div role="status" className="flex items-start gap-3 rounded-2xl bg-ok-soft p-4 text-ok">
          <Icon name="checkCircle" className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="font-medium">{state.message}</p>
        </div>
        {onDone}
      </div>
    );
  }

  const checked = new Set((state.values?.help ?? "").split(","));

  return (
    <form action={action} className="space-y-5" noValidate>
      <FormMessage state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField state={state} name="contactName" label="Who should we ask for?" defaultValue={defaults.contactName} autoComplete="name" />
        <TextField
          state={state}
          name="contactPhone"
          label="Phone to confirm the visit"
          defaultValue={defaults.contactPhone}
          type="tel"
          autoComplete="tel"
          placeholder="091 234 5678"
        />
      </div>
      <TextField state={state} name="address" label="Address" defaultValue={defaults.address} autoComplete="street-address" placeholder="Ilica 12, Zagreb" />
      <Field
        label="When suits you?"
        name="preferredTimes"
        error={state.errors?.preferredTimes}
        hint="A few days or times. We'll call to confirm one. A visit takes about 45 minutes."
      >
        <textarea
          id="preferredTimes"
          name="preferredTimes"
          className="input !min-h-20"
          placeholder="e.g. Tuesday or Wednesday morning, or Friday after 14:00"
          defaultValue={state.values?.preferredTimes}
          aria-invalid={state.errors?.preferredTimes ? true : undefined}
        />
      </Field>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">What would you like help with?</legend>
        <div className="flex flex-wrap gap-2">
          {HELP.map((h) => (
            <label
              key={h}
              className="cursor-pointer rounded-full border border-line bg-white px-3.5 py-2 text-sm font-medium transition has-[:checked]:border-blue has-[:checked]:bg-sky has-[:checked]:text-blue-deep"
            >
              <input type="checkbox" name="help" value={h} className="sr-only" defaultChecked={checked.has(h)} />
              {h}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Anything else? (optional)" name="notes">
        <textarea id="notes" name="notes" className="input !min-h-20" defaultValue={state.values?.notes} placeholder="Parking, best entrance, languages…" />
      </Field>
      <SubmitButton pendingText="Sending…">
        <Icon name="van" className="h-5 w-5" /> Request a visit
      </SubmitButton>
    </form>
  );
}
