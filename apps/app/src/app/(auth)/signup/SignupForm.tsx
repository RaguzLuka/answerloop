"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/lib/actions/auth";
import { initialState } from "@/lib/form";
import { FormMessage, SubmitButton, TextField, Field } from "@/components/form";
import { HaloSays } from "@/components/Halo";

export default function SignupForm() {
  const [state, action] = useActionState(signup, initialState);
  return (
    <div className="space-y-6">
      <HaloSays pose="wave">
        Hi, I&apos;m <strong>Halo</strong>! Create your account and I&apos;ll help you set up RingLoop. It takes about 5 minutes.
      </HaloSays>

      <form action={action} className="card space-y-5 p-6" noValidate>
        <h1 className="font-display text-2xl">Create your account</h1>
        <FormMessage state={state} />
        <TextField state={state} name="name" label="Your name" autoComplete="name" placeholder="Mila Horvat" required />
        <TextField state={state} name="email" label="Email" type="email" autoComplete="email" inputMode="email" placeholder="you@yourbusiness.hr" required />
        <TextField
          state={state}
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 10 characters"
          minLength={10}
          required
        />
        <Field label="" name="terms" error={state.errors?.terms}>
          <label className="flex items-start gap-3 text-sm text-ink-soft">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              className="mt-0.5 h-5 w-5 shrink-0 accent-blue"
              defaultChecked={state.values?.terms === "on"}
            />
            <span>
              I agree to RingLoop&apos;s terms and{" "}
              <a href="https://www.ringloop.net/privacy" target="_blank" rel="noreferrer" className="font-medium text-blue underline-offset-2 hover:underline">
                privacy policy
              </a>
              .
            </span>
          </label>
        </Field>
        <SubmitButton className="btn btn-primary w-full" pendingText="Creating your account…">
          Create account
        </SubmitButton>
      </form>

      <p className="text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-blue">Sign in</Link>
      </p>
    </div>
  );
}
