import { CopyButton } from "@/components/CopyButton";
import Icon from "@/components/Icon";
import { formatPhone } from "@/lib/phone";

/* Conditional call forwarding uses standard GSM codes, which work the same on
   HT, A1 and Telemach mobile lines: dial the code in the Phone app, press call. */

function Code({ code, label, sub, disabled }: { code: string; label: string; sub: string; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-muted">{sub}</p>
      </div>
      <div className="flex items-center gap-2">
        <code className="rounded-lg bg-sky px-2.5 py-1.5 font-mono text-[0.9375rem] font-semibold tracking-wide text-blue-deep">
          {code}
        </code>
        {!disabled && <CopyButton text={code} label="Copy" />}
      </div>
    </div>
  );
}

export default function ForwardingGuide({ number }: { number: string | null }) {
  const target = number ?? "[RingLoop number]";
  return (
    <div className="space-y-4">
      {!number && (
        <div className="flex items-start gap-3 rounded-xl bg-warn-soft px-4 py-3 text-sm text-warn">
          <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            We&apos;re setting up your RingLoop number. We&apos;ll email you when it&apos;s ready (usually within 1 business
            day). The codes below will then show your real number.
          </span>
        </div>
      )}
      {number && (
        <p className="text-ink-soft">
          Your RingLoop number is <strong className="text-ink">{formatPhone(number)}</strong>. On the phone your customers
          call, open the <strong>Phone</strong> app, dial this code and press call:
        </p>
      )}
      <Code
        code={`**004*${target}#`}
        label="Recommended: forward calls you miss"
        sub="When you don't answer, you're on another call, or your phone is off."
        disabled={!number}
      />
      <details className="group rounded-xl border border-line bg-white px-4 py-3">
        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
          Other options
          <Icon name="chevronDown" className="h-4 w-4 text-muted transition group-open:rotate-180" />
        </summary>
        <div className="mt-3 space-y-2">
          <Code code={`**61*${target}#`} label="Only when you don't answer" sub="After about 20 seconds of ringing." disabled={!number} />
          <Code code={`**67*${target}#`} label="Only when you're busy" sub="You're already on a call." disabled={!number} />
          <Code code="##004#" label="Turn forwarding off" sub="Calls ring only on your phone again." />
          <Code code="*#61#" label="Check if it's on" sub="Shows where unanswered calls go." />
        </div>
      </details>
      <p className="text-sm text-muted">
        Landline, switchboard or a dual-SIM phone? Forwarding works differently there. Ask us to come over, or ask your
        provider for <em>preusmjeravanje poziva kad se ne javljam</em> to your RingLoop number. Your provider may charge
        forwarded calls like a normal call.
      </p>
    </div>
  );
}
