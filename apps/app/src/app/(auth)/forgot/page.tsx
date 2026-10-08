"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestReset } from "@/lib/actions/auth";
import { initialState } from "@/lib/form";
import { FormMessage, SubmitButton, TextField } from "@/components/form";

export default function ForgotPage() {
  const [state, action] = useActionState(requestReset, initialState);
  return (
    <div className="space-y-6">
      <form action={action} className="card space-y-5 p-6" noValidate>
        <div>
          <h1 className="font-display text-2xl">Reset your password</h1>
          <p className="mt-1 text-sm text-ink-soft">We&apos;ll email you a link to choose a new one.</p>
        </div>
        <FormMessage state={state} />
        {!state.ok && (
          <>
            <TextField state={state} name="email" label="Email" type="email" autoComplete="email" inputMode="email" required />
            <SubmitButton className="btn btn-primary w-full" pendingText="Sending…">Send reset link</SubmitButton>
          </>
        )}
      </form>
      <p className="text-center text-sm">
        <Link href="/login" className="font-semibold text-blue">Back to sign in</Link>
      </p>
    </div>
  );
}
