"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

type FormState = "idle" | "submitting" | "success" | "error";

const VOLUMES = ["Not sure yet", "Under 10", "10–30", "30–60", "60+"];

const INDUSTRIES = [
  "Hair salon",
  "Barbershop",
  "Nail & beauty studio",
  "Restaurant or café",
  "Dental or medical practice",
  "Physio, fitness or wellness",
  "Other",
];

const PLAN_LABELS: Record<string, string> = {
  start: "Start plan (€59/month)",
  "start-yearly": "Start plan, yearly (€49/month)",
  pro: "Pro plan (€149/month)",
  "pro-yearly": "Pro plan, yearly (€124/month)",
  business: "Business plan (custom quote)",
};

const inputClass =
  "w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-blue/50 focus:bg-white focus:ring-4 focus:ring-blue/10";

export default function LeadForm() {
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    industry: "",
    volume: "",
    message: "",
  });

  // Coming from /pricing? Note the chosen plan in the message.
  useEffect(() => {
    const plan = PLAN_LABELS[new URLSearchParams(window.location.search).get("plan") ?? ""];
    if (plan) setForm((prev) => (prev.message ? prev : { ...prev, message: `Interested in the ${plan}.` }));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
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
      <div className="card p-10 text-center md:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Icon name="check" className="h-8 w-8" strokeWidth={2.6} />
        </div>
        <h2 className="font-display text-3xl">You&apos;re in!</h2>
        <p className="mx-auto mt-3 max-w-sm leading-relaxed text-ink-soft">
          We&apos;ll email you within a few hours to pick a time for your demo. Keep an eye on your inbox.
        </p>
        <Link href="/demo" className="btn-secondary mt-8 px-6 py-3 text-sm">
          <Icon name="messageText" className="h-4 w-4 text-blue" />
          Meanwhile, try the live demo
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-7 md:p-9">
      <div>
        <h2 className="font-display text-2xl">Book your free demo</h2>
        <p className="mt-1.5 text-sm text-ink-soft">Takes 30 seconds. We&apos;ll reply within a few hours.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" id="name" required>
          <input id="name" name="name" autoComplete="name" placeholder="Ana Horvat" value={form.name} onChange={handleChange} required className={inputClass} />
        </Field>
        <Field label="Business name" id="business" required>
          <input id="business" name="business" autoComplete="organization" placeholder="Your business" value={form.business} onChange={handleChange} required className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Work email" id="email" required>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@yourbusiness.com" value={form.email} onChange={handleChange} required className={inputClass} />
        </Field>
        <Field label="Phone" id="phone">
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+385 91 234 5678" value={form.phone} onChange={handleChange} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type of business" id="industry">
          <Select id="industry" value={form.industry} options={INDUSTRIES} onChange={handleChange} />
        </Field>
        <Field label="Missed calls per week" id="volume">
          <Select id="volume" value={form.volume} options={VOLUMES} onChange={handleChange} />
        </Field>
      </div>

      <Field label="Anything we should know?" id="message">
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Number of locations, booking system you use…"
          value={form.message}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
        />
      </Field>

      {state === "error" && (
        <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          Something went wrong. Please email us directly at{" "}
          <a href="mailto:hello@ringloop.net" className="font-semibold underline">hello@ringloop.net</a>.
        </p>
      )}

      <button type="submit" disabled={state === "submitting"} className="btn-primary group w-full py-4 disabled:opacity-60">
        {state === "submitting" ? "Sending…" : <>Book my free demo <span className="arrow">→</span></>}
      </button>

      <p className="text-center text-xs text-muted">
        No spam, no pressure. By submitting you agree to our{" "}
        <Link href="/privacy" className="text-blue hover:underline">Privacy Policy</Link>.
      </p>
    </form>
  );
}

function Select({
  id, value, options, onChange,
}: {
  id: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="relative">
      <select id={id} name={id} value={value} onChange={onChange} className={`${inputClass} appearance-none pr-10`}>
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <Icon
        name="chevronRight"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-muted"
        strokeWidth={2.4}
      />
    </div>
  );
}

function Field({
  label, id, required, children,
}: {
  label: string;
  id: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-blue"> *</span>}
      </label>
      {children}
    </div>
  );
}
