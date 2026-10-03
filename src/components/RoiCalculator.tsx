"use client";
import { useId, useState } from "react";
import Link from "next/link";

const WEEKS_PER_MONTH = 52 / 12;

/** €1,234 — formatted by hand so server and browser always agree */
function euro(n: number) {
  return "€" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Slider({
  label, hint, value, min, max, step, onChange, format,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-3.5 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[15px] font-medium text-ink">{label}</label>
        <output htmlFor={id} className="font-display text-2xl tabular-nums text-blue">{format(value)}</output>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
      />
      {hint && <p className="mt-2.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export default function RoiCalculator() {
  const [calls, setCalls] = useState(15);
  const [value, setValue] = useState(90);
  const [rate, setRate] = useState(30);

  const booked = Math.round(calls * WEEKS_PER_MONTH * (rate / 100));
  const monthly = booked * value;

  return (
    <div className="card grid overflow-hidden lg:grid-cols-[1.15fr_1fr]">
      <div className="space-y-9 p-7 md:p-10">
        <Slider
          label="Missed calls per week"
          hint="Count evenings, weekends and the busy hours when nobody can pick up."
          value={calls} min={1} max={100} step={1}
          onChange={setCalls}
          format={(v) => String(v)}
        />
        <Slider
          label="Average booking value"
          value={value} min={20} max={500} step={5}
          onChange={setValue}
          format={euro}
        />
        <Slider
          label="Callers who book after the text"
          hint="A deliberately conservative 30% by default — adjust to taste."
          value={rate} min={10} max={60} step={5}
          onChange={setRate}
          format={(v) => `${v}%`}
        />
      </div>

      <div className="relative overflow-hidden bg-night p-7 text-white md:p-10">
        <div className="night-glow pointer-events-none absolute inset-0" />
        <div className="dot-grid-dark pointer-events-none absolute inset-0" />
        <div className="relative flex h-full flex-col">
          <p className="label text-sky/55">Revenue you could win back</p>
          <p className="font-display mt-4 text-[3.25rem] leading-none tabular-nums md:text-6xl" aria-live="polite">
            {euro(monthly)}
            <span className="ml-1.5 align-middle text-lg font-semibold text-sky/50">/ month</span>
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[var(--line-dark)] bg-white/5 p-4">
              <p className="text-xs text-sky/50">Per year</p>
              <p className="font-display mt-1 text-2xl tabular-nums">{euro(monthly * 12)}</p>
            </div>
            <div className="rounded-2xl border border-[var(--line-dark)] bg-white/5 p-4">
              <p className="text-xs text-sky/50">Extra bookings / month</p>
              <p className="font-display mt-1 text-2xl tabular-nums">{booked}</p>
            </div>
          </div>

          <div className="mt-auto pt-9">
            <Link href="/contact" className="btn-primary group w-full py-3.5">
              Win these customers back <span className="arrow">→</span>
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-sky/45">
              {calls} missed calls × 4.3 weeks × {rate}% who book × {euro(value)}. Doesn&apos;t count
              repeat visits or the no-shows reminders prevent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
