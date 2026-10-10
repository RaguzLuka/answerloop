import type { z } from "zod";

/** What every form Server Action returns to `useActionState`. */
export type FormState = {
  error?: string;
  /** Per-field messages, keyed by input name */
  errors?: Record<string, string>;
  /** Submitted values, so the form can refill after an error (React resets it) */
  values?: Record<string, string>;
  ok?: boolean;
  message?: string;
};

export const initialState: FormState = {};

export function formValues(fd: FormData) {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v === "string" && !/password/i.test(k)) out[k] = k in out ? `${out[k]},${v}` : v;
  }
  return out;
}

export function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_");
    errors[key] ??= issue.message;
  }
  return errors;
}
