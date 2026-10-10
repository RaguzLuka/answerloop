"use client";

import { createContext, startTransition, useContext } from "react";
import { useFormStatus } from "react-dom";
import Icon from "@/components/Icon";
import type { FormState } from "@/lib/form";

const Pending = createContext<boolean | null>(null);

/** A form for an action from useActionState that does NOT get reset after
 *  submitting. React resets <form action> forms, which silently reverts
 *  controlled checkboxes, radios and selects to their first-render state. */
export function ActionForm({
  action, pending, children, ...props
}: {
  action: (fd: FormData) => void;
  pending: boolean;
  children: React.ReactNode;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, "action" | "onSubmit">) {
  return (
    <Pending.Provider value={pending}>
      <form
        {...props}
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(() => action(fd));
        }}
      >
        {children}
      </form>
    </Pending.Provider>
  );
}

export function SubmitButton({
  children, pendingText, className = "btn btn-primary", disabled,
}: { children: React.ReactNode; pendingText?: string; className?: string; disabled?: boolean }) {
  const fromForm = useFormStatus().pending;
  const fromContext = useContext(Pending);
  const pending = fromContext ?? fromForm;
  return (
    <button type="submit" className={className} disabled={pending || disabled} aria-busy={pending}>
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden />
          {pendingText ?? "Saving…"}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function Field({
  label, name, hint, error, children, className = "",
}: {
  label: string;
  name: string;
  hint?: React.ReactNode;
  error?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${name}-error`} className="flex items-center gap-1.5 text-sm text-danger">
          <Icon name="alert" className="h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

/** Text input wired to a FormState: refills after errors, shows the field's error. */
export function TextField({
  state, name, label, hint, defaultValue = "", ...props
}: {
  state: FormState;
  name: string;
  label: string;
  hint?: React.ReactNode;
  defaultValue?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "defaultValue">) {
  const error = state.errors?.[name];
  return (
    <Field label={label} name={name} hint={hint} error={error}>
      <input
        id={name}
        name={name}
        className="input"
        defaultValue={state.values?.[name] ?? defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
    </Field>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (state.error) {
    return (
      <div role="alert" className="flex items-start gap-2 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
        <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
        {state.error}
      </div>
    );
  }
  if (state.ok && state.message) {
    return (
      <div role="status" className="flex items-start gap-2 rounded-xl bg-ok-soft px-4 py-3 text-sm text-ok">
        <Icon name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0" />
        {state.message}
      </div>
    );
  }
  return null;
}
