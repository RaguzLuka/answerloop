"use client";

import { useActionState, useState } from "react";
import { saveHours } from "@/lib/actions/business";
import { initialState } from "@/lib/form";
import { businessType, WEEKDAYS } from "@/lib/business-types";
import type { Business, WeekHours } from "@/lib/db/schema";
import { ActionForm, FormMessage, SubmitButton } from "@/components/form";
import Icon from "@/components/Icon";

const PRESETS: { label: string; hours: WeekHours }[] = [
  {
    label: "Mon–Fri 9–17",
    hours: Array.from({ length: 7 }, (_, i) => ({ open: i < 5, from: "09:00", to: "17:00" })),
  },
  {
    label: "Mon–Sat 8–20",
    hours: Array.from({ length: 7 }, (_, i) => ({ open: i < 6, from: "08:00", to: "20:00" })),
  },
  {
    label: "Every day 12–23",
    hours: Array.from({ length: 7 }, () => ({ open: true, from: "12:00", to: "23:00" })),
  },
];

export default function HoursForm({ business, mode }: { business: Business; mode: "setup" | "settings" }) {
  const [state, action, pending] = useActionState(saveHours, initialState);
  const [hours, setHours] = useState<WeekHours>(business.hours);
  const words = businessType(business.type).words;

  const set = (i: number, patch: Partial<WeekHours[number]>) =>
    setHours((h) => h.map((d, j) => (j === i ? { ...d, ...patch } : d)));

  return (
    <ActionForm action={action} pending={pending} className="space-y-6" noValidate>
      {mode === "setup" && <input type="hidden" name="_setup" value="1" />}
      <FormMessage state={state} />

      <div className="flex flex-wrap gap-2">
        <span className="self-center text-sm text-muted">Quick fill:</span>
        {PRESETS.map((p) => (
          <button key={p.label} type="button" className="btn btn-secondary btn-sm" onClick={() => setHours(p.hours)}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="divide-y divide-line rounded-2xl border border-line bg-white">
        {hours.map((d, i) => (
          <div key={WEEKDAYS[i]} className="px-4 py-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <label className="flex w-36 items-center gap-3">
                <input
                  type="checkbox"
                  role="switch"
                  name={`open_${i}`}
                  className="switch"
                  checked={d.open}
                  onChange={(e) => set(i, { open: e.target.checked })}
                />
                <span className="font-medium">{WEEKDAYS[i]}</span>
              </label>
              {d.open ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    name={`from_${i}`}
                    value={d.from}
                    onChange={(e) => set(i, { from: e.target.value })}
                    className="input w-[7.5rem] !min-h-10 !py-1.5"
                    aria-label={`${WEEKDAYS[i]} opens`}
                    step={900}
                  />
                  <span className="text-muted">–</span>
                  <input
                    type="time"
                    name={`to_${i}`}
                    value={d.to}
                    onChange={(e) => set(i, { to: e.target.value })}
                    className="input w-[7.5rem] !min-h-10 !py-1.5"
                    aria-label={`${WEEKDAYS[i]} closes`}
                    step={900}
                  />
                </div>
              ) : (
                <>
                  <span className="text-sm text-muted">Closed</span>
                  <input type="hidden" name={`from_${i}`} value={d.from} />
                  <input type="hidden" name={`to_${i}`} value={d.to} />
                </>
              )}
            </div>
            {state.errors?.[`day_${i}`] && <p className="mt-2 text-sm text-danger">{state.errors[`day_${i}`]}</p>}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-white p-4">
        <label htmlFor="capacity" className="flex flex-wrap items-center justify-between gap-3">
          <span>
            <span className="block font-semibold">How many customers can you take at once?</span>
            <span className="text-sm text-muted">Number of {words.capacity}.</span>
          </span>
          <input
            id="capacity"
            name="capacity"
            type="number"
            inputMode="numeric"
            min={1}
            max={50}
            defaultValue={state.values?.capacity ?? business.capacity}
            className="input w-24 text-center"
          />
        </label>
        {state.errors?.capacity && <p className="mt-2 text-sm text-danger">{state.errors.capacity}</p>}
      </div>

      <SubmitButton>
        {mode === "setup" ? (
          <>
            Continue <Icon name="arrowRight" className="h-4 w-4" />
          </>
        ) : (
          "Save hours"
        )}
      </SubmitButton>
    </ActionForm>
  );
}
