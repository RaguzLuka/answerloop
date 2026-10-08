"use client";

import { useActionState, useState } from "react";
import { saveBookingSettings, sendTestSms } from "@/lib/actions/business";
import { changePassword, updateProfile } from "@/lib/actions/auth";
import { initialState } from "@/lib/form";
import type { Business } from "@/lib/db/schema";
import { ActionForm, Field, FormMessage, SubmitButton, TextField } from "@/components/form";
import { CopyButton } from "@/components/CopyButton";
import Icon from "@/components/Icon";

const LEAD = [
  [0, "Any time (no notice)"], [30, "30 minutes ahead"], [60, "1 hour ahead"], [120, "2 hours ahead"],
  [240, "4 hours ahead"], [1440, "1 day ahead"], [2880, "2 days ahead"],
] as const;

export function BookingSettingsForm({
  business, bookingLink, aiOn,
}: { business: Business; bookingLink: string; aiOn: boolean }) {
  const [state, action, pending] = useActionState(saveBookingSettings, initialState);
  const [enabled, setEnabled] = useState(business.bookingEnabled);
  const v = state.values ?? {};
  const pro = business.plan === "pro";
  const [mode, setMode] = useState<string>(
    v.linkMode ?? (pro && business.chatEnabled ? "chat" : business.customBookingUrl ? "custom" : "page"),
  );
  const modes = [
    {
      id: "chat",
      title: "Chat with Halo",
      body: pro
        ? aiOn
          ? "Halo, your AI assistant, chats with the caller and books them in."
          : "Halo will chat and book as soon as AI is switched on for your account. Until then, callers get your booking page."
        : "Halo chats with callers and books them in. Included in the Pro plan.",
      disabled: !pro,
    },
    { id: "page", title: "Your RingLoop booking page", body: bookingLink, disabled: false },
    { id: "custom", title: "Your own booking page", body: "For example your Buker profile or website.", disabled: false },
  ];

  return (
    <ActionForm action={action} pending={pending} className="space-y-6" noValidate>
      <FormMessage state={state} />
      <label className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4">
        <span>
          <span className="block font-semibold">Online booking</span>
          <span className="text-sm text-muted">Customers can pick a time themselves through your link.</span>
        </span>
        <input
          type="checkbox"
          role="switch"
          name="bookingEnabled"
          className="switch"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <code className="max-w-full truncate rounded-lg bg-sky px-2.5 py-1.5 text-sm text-blue-deep">{bookingLink}</code>
        <CopyButton text={bookingLink} />
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-2 font-semibold">When callers tap the link in your text</legend>
        {modes.map((m) => (
          <label
            key={m.id}
            className={`flex items-start gap-3 rounded-2xl border p-4 transition ${
              m.disabled ? "cursor-not-allowed border-line bg-paper opacity-70" : "cursor-pointer border-line bg-white has-[:checked]:border-blue has-[:checked]:bg-sky"
            }`}
          >
            <input
              type="radio"
              name="linkMode"
              value={m.id}
              checked={mode === m.id}
              disabled={m.disabled}
              onChange={() => setMode(m.id)}
              className="mt-1 h-4 w-4 accent-blue"
            />
            <span className="min-w-0">
              <span className="flex items-center gap-2 font-semibold">
                {m.title}
                {m.id === "chat" && <span className="chip bg-blue text-white">Pro</span>}
              </span>
              <span className="block break-words text-sm text-muted">{m.body}</span>
            </span>
          </label>
        ))}
        {mode === "custom" && (
          <TextField
            state={state}
            name="customBookingUrl"
            label="Link to your booking page"
            type="url"
            placeholder="https://buker.hr/…"
            defaultValue={business.customBookingUrl ?? ""}
          />
        )}
      </fieldset>

      <div className="divide-y divide-line rounded-2xl border border-line bg-white">
        <label className="flex items-center justify-between gap-4 p-4">
          <span>
            <span className="block font-semibold">Confirmation text</span>
            <span className="text-sm text-muted">Sent right after someone books.</span>
          </span>
          <input type="checkbox" role="switch" name="confirmationsEnabled" className="switch" defaultChecked={business.confirmationsEnabled} />
        </label>
        <label className="flex items-center justify-between gap-4 p-4">
          <span>
            <span className="block font-semibold">Reminder the day before</span>
            <span className="text-sm text-muted">Sent in the afternoon to everyone booked for tomorrow.</span>
          </span>
          <input type="checkbox" role="switch" name="remindersEnabled" className="switch" defaultChecked={business.remindersEnabled} />
        </label>
        <label className="flex items-center justify-between gap-4 p-4">
          <span className="font-semibold">Language of these texts</span>
          <select name="smsLanguage" className="input w-40" defaultValue={v.smsLanguage ?? business.smsLanguage}>
            <option value="hr">Hrvatski</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Minimum notice" name="leadTimeMin">
          <select id="leadTimeMin" name="leadTimeMin" className="input" defaultValue={v.leadTimeMin ?? business.leadTimeMin}>
            {LEAD.map(([m, label]) => (
              <option key={m} value={m}>{label}</option>
            ))}
          </select>
        </Field>
        <Field label="Book up to" name="horizonDays">
          <select id="horizonDays" name="horizonDays" className="input" defaultValue={v.horizonDays ?? business.horizonDays}>
            {[7, 14, 21, 30, 45, 60].map((d) => (
              <option key={d} value={d}>{d} days ahead</option>
            ))}
          </select>
        </Field>
        <Field label="Start times every" name="slotIntervalMin">
          <select id="slotIntervalMin" name="slotIntervalMin" className="input" defaultValue={v.slotIntervalMin ?? business.slotIntervalMin}>
            {[5, 10, 15, 20, 30, 60].map((m) => (
              <option key={m} value={m}>{m} minutes</option>
            ))}
          </select>
        </Field>
      </div>
      <SubmitButton>Save</SubmitButton>
    </ActionForm>
  );
}

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, action] = useActionState(updateProfile, initialState);
  return (
    <form action={action} className="space-y-5" noValidate>
      <h2 className="font-display text-xl">Your details</h2>
      <FormMessage state={state} />
      <TextField state={state} name="name" label="Your name" defaultValue={name} autoComplete="name" />
      <Field label="Email" name="email" hint="To change your sign-in email, write to hello@ringloop.net.">
        <input id="email" className="input bg-paper text-muted" value={email} readOnly />
      </Field>
      <SubmitButton>Save</SubmitButton>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState(changePassword, initialState);
  return (
    <form action={action} className="space-y-5 border-t border-line pt-8" noValidate>
      <h2 className="font-display text-xl">Change password</h2>
      <FormMessage state={state} />
      <TextField state={state} name="current" label="Current password" type="password" autoComplete="current-password" />
      <TextField state={state} name="password" label="New password" type="password" autoComplete="new-password" hint="At least 10 characters" />
      <SubmitButton pendingText="Changing…">Change password</SubmitButton>
    </form>
  );
}

export function TestSmsForm({ defaultTo }: { defaultTo: string }) {
  const [state, action] = useActionState(sendTestSms, initialState);
  return (
    <form action={action} className="space-y-4 border-t border-line pt-6" noValidate>
      <div>
        <h2 className="font-display text-xl">Send yourself a test</h2>
        <p className="text-sm text-ink-soft">Get the text exactly as your callers will, on your own phone.</p>
      </div>
      <FormMessage state={state} />
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-56 flex-1">
          <TextField state={state} name="to" label="Your mobile" type="tel" defaultValue={defaultTo} placeholder="091 234 5678" />
        </div>
        <div className="sm:pt-7">
          <SubmitButton className="btn btn-secondary" pendingText="Sending…">
            <Icon name="test" className="h-4 w-4" /> Send test text
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
