"use client";

import Link from "next/link";
import { use, useActionState } from "react";
import { resetPassword } from "@/lib/actions/auth";
import { initialState } from "@/lib/form";
import { FormMessage, SubmitButton, TextField } from "@/components/form";

export default function ResetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [state, action] = useActionState(resetPassword, initialState);
  return (
    <div className="space-y-6">
      <form action={action} className="card space-y-5 p-6" noValidate>
        <h1 className="font-display text-2xl">Choose a new password</h1>
        <FormMessage state={state} />
        <input type="hidden" name="token" value={token} />
        <TextField
          state={state}
          name="password"
          label="New password"
          type="password"
          autoComplete="new-password"
          hint="At least 10 characters"
          required
        />
        <SubmitButton className="btn btn-primary w-full" pendingText="Saving…">Save and sign in</SubmitButton>
      </form>
      <p className="text-center text-sm">
        <Link href="/forgot" className="font-semibold text-blue">Need a new link?</Link>
      </p>
    </div>
  );
}
