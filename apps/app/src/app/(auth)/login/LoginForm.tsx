"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/lib/actions/auth";
import { initialState } from "@/lib/form";
import { FormMessage, SubmitButton, TextField } from "@/components/form";
import Halo from "@/components/Halo";

export default function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState(login, initialState);
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Halo pose="happy" size={112} priority />
      </div>
      <form action={action} className="card space-y-5 p-6" noValidate>
        <h1 className="font-display text-2xl">Welcome back</h1>
        <FormMessage state={state} />
        <input type="hidden" name="next" value={next} />
        <TextField state={state} name="email" label="Email" type="email" autoComplete="email" inputMode="email" required />
        <TextField
          state={state}
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
        />
        <div className="-mt-2 text-right">
          <Link href="/forgot" className="text-sm font-medium text-blue">Forgot password?</Link>
        </div>
        <SubmitButton className="btn btn-primary w-full" pendingText="Signing in…">Sign in</SubmitButton>
      </form>
      <p className="text-center text-sm text-ink-soft">
        New to RingLoop?{" "}
        <Link href="/signup" className="font-semibold text-blue">Create an account</Link>
      </p>
    </div>
  );
}
