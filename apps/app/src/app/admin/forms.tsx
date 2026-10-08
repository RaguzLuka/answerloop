"use client";

import { useActionState, useTransition } from "react";
import { addPoolNumbers, assignNumber, removePoolNumber, setPlan, setStatus, updateVisit } from "@/lib/actions/admin";
import { initialState } from "@/lib/form";
import type { BusinessStatus, VisitStatus } from "@/lib/db/schema";
import { SubmitButton } from "@/components/form";

export function AssignNumberForm({ id, number }: { id: string; number: string }) {
  const [state, action] = useActionState(assignNumber, initialState);
  return (
    <form action={action} className="flex flex-col gap-1.5">
      <input type="hidden" name="businessId" value={id} />
      <div className="flex gap-2">
        <input name="number" defaultValue={number} placeholder="+385 1 …" className="input !min-h-9 w-44 !py-1 text-sm" />
        <SubmitButton className="btn btn-secondary btn-sm" pendingText="…">Save</SubmitButton>
      </div>
      {state.error && <p className="text-xs text-danger">{state.error}</p>}
      {state.ok && <p className="max-w-56 text-xs text-ok">{state.message}</p>}
    </form>
  );
}

export function StatusSelect({ id, status }: { id: string; status: BusinessStatus }) {
  const [pending, start] = useTransition();
  return (
    <select
      aria-label="Change status"
      defaultValue={status}
      disabled={pending}
      onChange={(e) => start(() => setStatus(id, e.target.value as BusinessStatus))}
      className="input !min-h-9 w-40 !py-1 text-sm"
    >
      <option value="setup">In setup</option>
      <option value="number_pending">Needs number</option>
      <option value="forwarding">Forwarding</option>
      <option value="live">Live</option>
      <option value="paused">Paused</option>
    </select>
  );
}

export function VisitForm({ id, status, scheduledFor }: { id: string; status: VisitStatus; scheduledFor: string }) {
  const [state, action] = useActionState(updateVisit, initialState);
  return (
    <form action={action} className="flex flex-wrap items-start gap-2 lg:w-[420px] lg:justify-end">
      <input type="hidden" name="visitId" value={id} />
      <select name="status" defaultValue={status} className="input !min-h-9 w-36 !py-1 text-sm" aria-label="Visit status">
        <option value="requested">Requested</option>
        <option value="scheduled">Scheduled</option>
        <option value="done">Done</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <input
        name="scheduledFor"
        defaultValue={scheduledFor}
        placeholder="e.g. Tue 14 Oct, 10:00"
        className="input !min-h-9 w-44 !py-1 text-sm"
        aria-label="Scheduled for"
      />
      <SubmitButton className="btn btn-secondary btn-sm" pendingText="…">Save</SubmitButton>
      {state.ok && <p className="w-full text-right text-xs text-ok">Saved</p>}
    </form>
  );
}

export function AddNumbersForm() {
  const [state, action] = useActionState(addPoolNumbers, initialState);
  return (
    <form action={action} className="space-y-3">
      <label htmlFor="numbers" className="text-sm font-semibold">Add numbers (one per line)</label>
      <textarea id="numbers" name="numbers" className="input !min-h-24 font-mono text-sm" placeholder={"+385 1 555 0101\n+385 1 555 0102"} defaultValue={state.values?.numbers} />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.ok && <p className="text-sm text-ok">{state.message}</p>}
      <SubmitButton className="btn btn-secondary btn-sm" pendingText="Adding…">Add to pool</SubmitButton>
    </form>
  );
}

export function RemoveNumberButton({ number }: { number: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="btn btn-danger btn-sm"
      disabled={pending}
      onClick={() => window.confirm("Remove this number from the pool?") && start(() => removePoolNumber(number))}
    >
      Remove
    </button>
  );
}

export function PlanSelect({ id, plan }: { id: string; plan: "start" | "pro" }) {
  const [pending, start] = useTransition();
  return (
    <select
      aria-label="Plan"
      defaultValue={plan}
      disabled={pending}
      onChange={(e) => start(() => setPlan(id, e.target.value as "start" | "pro"))}
      className="input !min-h-9 w-32 !py-1 text-sm"
    >
      <option value="start">Start</option>
      <option value="pro">Pro (AI chat)</option>
    </select>
  );
}
