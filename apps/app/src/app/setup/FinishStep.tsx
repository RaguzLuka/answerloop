"use client";

import { useState } from "react";
import { finishSetup } from "@/lib/actions/business";
import { SubmitButton } from "@/components/form";
import { CopyButton } from "@/components/CopyButton";
import VisitRequestForm from "@/components/VisitRequestForm";
import Icon from "@/components/Icon";

export default function FinishStep({
  bookingLink, visitDefaults, forwarding,
}: {
  bookingLink: string;
  visitDefaults: { contactName: string; contactPhone: string; address: string };
  forwarding: React.ReactNode;
}) {
  const [choice, setChoice] = useState<"self" | "visit">("self");

  return (
    <div className="space-y-8">
      <section className="card p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ok-soft text-ok">
            <Icon name="check" className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold">Your booking link works already</h2>
            <p className="mt-1 text-sm text-ink-soft">
              It goes in every text-back. You can also put it in your Instagram bio or Google profile right away.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <code className="max-w-full truncate rounded-lg bg-sky px-2.5 py-1.5 text-sm text-blue-deep">{bookingLink}</code>
              <CopyButton text={bookingLink} />
              <a href={bookingLink} target="_blank" rel="noreferrer" className="btn btn-quiet btn-sm">
                <Icon name="external" className="h-4 w-4" /> Open
              </a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display mb-1 text-xl">Send missed calls to RingLoop</h2>
        <p className="mb-4 text-ink-soft">Customers keep calling your usual number. Calls you miss go on to RingLoop, which texts them back.</p>

        <div className="mb-5 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="How do you want to do this?">
          {(
            [
              ["self", "phoneForwarded", "I'll do it myself", "Dial one code on your phone. Takes a minute."],
              ["visit", "van", "Come over and do it with me", "We'll visit, set it up and show your team."],
            ] as const
          ).map(([id, icon, title, sub]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={choice === id}
              onClick={() => setChoice(id)}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                choice === id ? "border-blue bg-sky" : "border-line bg-white hover:border-blue/40"
              }`}
            >
              <Icon name={icon} className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
              <span>
                <span className="block font-semibold">{title}</span>
                <span className="text-sm text-ink-soft">{sub}</span>
              </span>
            </button>
          ))}
        </div>

        <div id="visit">
          {choice === "self" ? (
            forwarding
          ) : (
            <div className="card p-5">
              <VisitRequestForm defaults={visitDefaults} />
            </div>
          )}
        </div>
      </section>

      <form action={finishSetup} className="border-t border-line pt-6">
        <SubmitButton className="btn btn-primary w-full sm:w-auto" pendingText="Finishing…">
          Finish setup <Icon name="arrowRight" className="h-4 w-4" />
        </SubmitButton>
        <p className="mt-2 text-sm text-muted">You can change everything later in Settings.</p>
      </form>
    </div>
  );
}
