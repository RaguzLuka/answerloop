"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function LeadForm() {
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    name: "",
    clinic: "",
    email: "",
    phone: "",
    message: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-3xl border border-blue/20 bg-sky/60 p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue text-2xl text-white">✓</div>
        <h3 className="font-display mb-2 text-2xl">Message received!</h3>
        <p className="text-sm text-ink-soft">We&apos;ll be in touch within a few hours. Check your inbox.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-8">
      <h3 className="font-display text-2xl">Send us a message</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name *" id="name" name="name" placeholder="Ana Horvat" value={form.name} onChange={handleChange} required />
        <Field label="Clinic name *" id="clinic" name="clinic" placeholder="Zagreb Dental" value={form.clinic} onChange={handleChange} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email *" id="email" name="email" type="email" placeholder="ana@clinic.hr" value={form.email} onChange={handleChange} required />
        <Field label="Phone" id="phone" name="phone" type="tel" placeholder="+385 91 234 5678" value={form.phone} onChange={handleChange} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-soft">Message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us about your clinic and what you need..."
          value={form.message}
          onChange={handleChange}
          className="w-full resize-none rounded-2xl border border-[var(--line)] bg-paper px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-blue/50 focus:ring-2 focus:ring-blue/10"
        />
      </div>

      {state === "error" && (
        <p className="text-sm text-red-600">Something went wrong. Please email us directly at hello@ringloop.net.</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="btn-primary w-full py-3.5 disabled:opacity-60"
      >
        {state === "submitting" ? "Sending…" : "Send message →"}
      </button>

      <p className="text-center text-xs text-muted">
        By submitting you agree to our{" "}
        <a href="/privacy" className="text-blue hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
}

function Field({
  label, id, name, type = "text", placeholder, value, onChange, required,
}: {
  label: string; id: string; name: string; type?: string;
  placeholder: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl border border-[var(--line)] bg-paper px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-blue/50 focus:ring-2 focus:ring-blue/10"
      />
    </div>
  );
}
