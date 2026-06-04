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
      <div className="rounded-3xl border border-green-200 bg-green-50 p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
        <h3 className="mb-2 text-xl font-bold text-green-800">Message received!</h3>
        <p className="text-sm text-green-700">We&apos;ll be in touch within a few hours. Check your inbox or WhatsApp.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 p-8 space-y-5">
      <h3 className="text-xl font-bold">Send us a message</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name *" id="name" name="name" placeholder="Ana Horvat" value={form.name} onChange={handleChange} required />
        <Field label="Clinic name *" id="clinic" name="clinic" placeholder="Zagreb Dental" value={form.clinic} onChange={handleChange} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email *" id="email" name="email" type="email" placeholder="ana@clinic.hr" value={form.email} onChange={handleChange} required />
        <Field label="Phone / WhatsApp" id="phone" name="phone" type="tel" placeholder="+385 91 234 5678" value={form.phone} onChange={handleChange} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us about your clinic and what you need..."
          value={form.message}
          onChange={handleChange}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
        />
      </div>

      {state === "error" && (
        <p className="text-sm text-red-600">Something went wrong. Please email us directly at hello@ringloop.net.</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full rounded-full bg-blue-600 py-3.5 font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
      >
        {state === "submitting" ? "Sending…" : "Send message →"}
      </button>

      <p className="text-center text-xs text-gray-400">
        By submitting you agree to our{" "}
        <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>.
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
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}
