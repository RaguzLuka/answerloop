"use client";

import { useActionState, useState } from "react";
import { saveServices } from "@/lib/actions/business";
import { initialState } from "@/lib/form";
import { businessType } from "@/lib/business-types";
import type { Business, Service } from "@/lib/db/schema";
import { ActionForm, FormMessage, SubmitButton } from "@/components/form";
import Icon from "@/components/Icon";

type Row = { key: string; id?: string; name: string; durationMin: string; price: string };

const DURATIONS = [10, 15, 20, 30, 45, 60, 75, 90, 105, 120, 150, 180, 240];

export default function ServicesForm({
  business, services, mode,
}: { business: Business; services: Service[]; mode: "setup" | "settings" }) {
  const [state, action, pending] = useActionState(saveServices, initialState);
  const words = businessType(business.type).words;
  const showPrice = business.type !== "restaurant";
  const [rows, setRows] = useState<Row[]>(() =>
    services.map((s) => ({
      key: s.id,
      id: s.id,
      name: s.name,
      durationMin: String(s.durationMin),
      price: s.priceCents != null ? String(s.priceCents / 100) : "",
    })),
  );

  const update = (key: string, patch: Partial<Row>) => setRows((r) => r.map((x) => (x.key === key ? { ...x, ...patch } : x)));
  const remove = (key: string) => setRows((r) => r.filter((x) => x.key !== key));
  const move = (i: number, dir: -1 | 1) =>
    setRows((r) => {
      const j = i + dir;
      if (j < 0 || j >= r.length) return r;
      const copy = [...r];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  const add = () =>
    setRows((r) => [...r, { key: crypto.randomUUID(), name: "", durationMin: "30", price: "" }]);

  const payload = JSON.stringify(
    rows.map((r) => ({ id: r.id, name: r.name, durationMin: r.durationMin, price: r.price.replace(",", ".") })),
  );

  return (
    <ActionForm action={action} pending={pending} className="space-y-5" noValidate>
      {mode === "setup" && <input type="hidden" name="_setup" value="1" />}
      <input type="hidden" name="services" value={payload} />
      <FormMessage state={state} />

      <ul className="space-y-3">
        {rows.map((r, i) => (
          <li key={r.key} className="rounded-2xl border border-line bg-white p-4">
            <div className="flex items-start gap-2">
              <div className="flex flex-col pt-1">
                <button type="button" aria-label="Move up" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-0.5 text-muted hover:text-blue disabled:opacity-30">
                  <Icon name="chevronDown" className="h-4 w-4 rotate-180" />
                </button>
                <button type="button" aria-label="Move down" onClick={() => move(i, 1)} disabled={i === rows.length - 1} className="rounded p-0.5 text-muted hover:text-blue disabled:opacity-30">
                  <Icon name="chevronDown" className="h-4 w-4" />
                </button>
              </div>
              <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_9rem_7rem]">
                <input
                  className="input"
                  value={r.name}
                  onChange={(e) => update(r.key, { name: e.target.value })}
                  placeholder={`Name of the ${words.service}`}
                  aria-label="Name"
                  maxLength={60}
                />
                <select
                  className="input"
                  value={r.durationMin}
                  onChange={(e) => update(r.key, { durationMin: e.target.value })}
                  aria-label="Duration"
                >
                  {[...new Set([...DURATIONS, Number(r.durationMin)])]
                    .sort((a, b) => a - b)
                    .map((m) => (
                      <option key={m} value={m}>
                        {m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}`}
                      </option>
                    ))}
                </select>
                {showPrice && (
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">€</span>
                    <input
                      className="input pl-8"
                      value={r.price}
                      onChange={(e) => update(r.key, { price: e.target.value })}
                      placeholder="Price"
                      inputMode="decimal"
                      aria-label="Price in euros"
                    />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(r.key)}
                aria-label={`Remove ${r.name || "service"}`}
                className="rounded-full p-2 text-muted hover:bg-danger-soft hover:text-danger"
              >
                <Icon name="trash" className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button type="button" onClick={add} className="btn btn-secondary w-full border-dashed">
        <Icon name="plus" className="h-4 w-4" /> Add a {words.service}
      </button>

      <p className="text-sm text-muted">
        {showPrice ? "Prices are optional — they're shown on your booking page. " : ""}
        The length decides which times customers can pick.
      </p>

      <SubmitButton disabled={rows.length === 0}>
        {mode === "setup" ? (
          <>
            Continue <Icon name="arrowRight" className="h-4 w-4" />
          </>
        ) : (
          `Save ${words.services}`
        )}
      </SubmitButton>
    </ActionForm>
  );
}
