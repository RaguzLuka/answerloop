"use client";

import { useState, useTransition } from "react";
import { setAllowExtra } from "@/lib/actions/business";

export default function ExtraChoice({ allow, limit, price }: { allow: boolean; limit: number; price: string }) {
  const [value, setValue] = useState(allow);
  const [pending, start] = useTransition();
  const options = [
    {
      v: false,
      title: "Pause until the 1st",
      body: "Missed callers don't get a message until next month. You still see every missed call in the app and can call back.",
    },
    {
      v: true,
      title: "Keep going",
      body: `Each missed call over ${limit} is ${price}, added to your next bill.`,
    },
  ];
  return (
    <div className="space-y-2" role="radiogroup" aria-label={`If you reach ${limit} missed calls in a month`}>
      {options.map((o) => (
        <label
          key={String(o.v)}
          className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
            value === o.v ? "border-blue bg-sky" : "border-line bg-white hover:border-blue/40"
          }`}
        >
          <input
            type="radio"
            name="allowExtra"
            className="mt-1 h-4 w-4 accent-blue"
            checked={value === o.v}
            disabled={pending}
            onChange={() => {
              setValue(o.v);
              start(() => setAllowExtra(o.v));
            }}
          />
          <span>
            <span className="block font-semibold">{o.title}</span>
            <span className="text-sm text-ink-soft">{o.body}</span>
          </span>
        </label>
      ))}
      {pending && <p className="text-sm text-muted">Saving…</p>}
    </div>
  );
}
