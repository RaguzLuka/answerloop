"use client";

import { useActionState } from "react";
import { saveBasics } from "@/lib/actions/business";
import { initialState } from "@/lib/form";
import { BUSINESS_TYPES } from "@/lib/business-types";
import type { Business } from "@/lib/db/schema";
import { Field, FormMessage, SubmitButton, TextField } from "@/components/form";
import Icon from "@/components/Icon";

export default function BasicsForm({ business, mode }: { business: Business | null; mode: "setup" | "settings" }) {
  const [state, action] = useActionState(saveBasics, initialState);
  const type = state.values?.type ?? business?.type ?? "";

  return (
    <form action={action} className="space-y-6" noValidate>
      {mode === "setup" && <input type="hidden" name="_setup" value="1" />}
      <FormMessage state={state} />

      <TextField
        state={state}
        name="name"
        label="Business name"
        defaultValue={business?.name}
        placeholder="Studio Mila"
        autoComplete="organization"
        required
      />

      <Field label="What kind of business is it?" name="type" error={state.errors?.type}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup">
          {BUSINESS_TYPES.map((t) => (
            <label
              key={t.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-3 text-sm font-medium transition has-[:checked]:border-blue has-[:checked]:bg-sky has-[:checked]:text-blue-deep hover:border-blue/40"
            >
              <input type="radio" name="type" value={t.id} defaultChecked={type === t.id} className="sr-only" />
              <Icon name={t.icon} className="h-5 w-5 shrink-0 text-blue" />
              {t.label}
            </label>
          ))}
        </div>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField state={state} name="city" label="Town or city" defaultValue={business?.city} placeholder="Zagreb" autoComplete="address-level2" />
        <TextField
          state={state}
          name="phone"
          label="Phone customers call you on"
          defaultValue={business?.phone}
          placeholder="091 234 5678"
          type="tel"
          autoComplete="tel"
          hint="Your usual business number — it stays the same."
        />
      </div>
      {mode === "settings" && (
        <TextField state={state} name="address" label="Address" defaultValue={business?.address} placeholder="Ilica 12" autoComplete="street-address" hint="Shown on your booking page." />
      )}

      <SubmitButton>
        {mode === "setup" ? (
          <>
            Continue <Icon name="arrowRight" className="h-4 w-4" />
          </>
        ) : (
          "Save"
        )}
      </SubmitButton>
    </form>
  );
}
