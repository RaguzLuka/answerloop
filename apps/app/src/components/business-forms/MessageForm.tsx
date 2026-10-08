"use client";

import { useActionState, useRef, useState } from "react";
import { saveMessage } from "@/lib/actions/business";
import { initialState } from "@/lib/form";
import { defaultTextback, fillTemplate, smsSegments, type MessageLang } from "@/lib/business-types";
import type { Business } from "@/lib/db/schema";
import { ActionForm, Field, FormMessage, SubmitButton } from "@/components/form";
import Icon from "@/components/Icon";
import SmsPreview from "@/components/SmsPreview";

export default function MessageForm({
  business, bookingLink, mode,
}: { business: Business; bookingLink: string; mode: "setup" | "settings" }) {
  const [state, action, pending] = useActionState(saveMessage, initialState);
  const [sender, setSender] = useState(state.values?.senderName ?? business.senderName);
  const [message, setMessage] = useState(state.values?.textbackMessage ?? business.textbackMessage);
  const textarea = useRef<HTMLTextAreaElement>(null);

  const filled = fillTemplate(message, business.name, bookingLink);
  const sms = smsSegments(filled);

  function insert(token: string) {
    const el = textarea.current;
    if (!el) return setMessage((m) => m + token);
    const { selectionStart: a, selectionEnd: b } = el;
    setMessage((m) => m.slice(0, a) + token + m.slice(b));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a + token.length, a + token.length);
    });
  }

  const applyTemplate = (lang: MessageLang) => setMessage(defaultTextback(lang, business.type));

  return (
    <ActionForm action={action} pending={pending} className="grid gap-8 lg:grid-cols-[1fr_300px]" noValidate>
      <div className="space-y-6">
        {mode === "setup" && <input type="hidden" name="_setup" value="1" />}
        <FormMessage state={state} />

        <Field
          label="Sender name"
          name="senderName"
          error={state.errors?.senderName}
          hint="What callers see instead of a number. Up to 11 letters or digits, without č, ć, š, ž or đ."
        >
          <input
            id="senderName"
            name="senderName"
            className="input"
            value={sender}
            maxLength={11}
            onChange={(e) => setSender(e.target.value)}
            aria-invalid={state.errors?.senderName ? true : undefined}
          />
        </Field>

        <Field label="The text your callers get" name="textbackMessage" error={state.errors?.textbackMessage}>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Start from:</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => applyTemplate("hr")}>Hrvatski</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => applyTemplate("en")}>English</button>
          </div>
          <textarea
            ref={textarea}
            id="textbackMessage"
            name="textbackMessage"
            className="input !min-h-36"
            value={message}
            maxLength={480}
            onChange={(e) => setMessage(e.target.value)}
            aria-invalid={state.errors?.textbackMessage ? true : undefined}
          />
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">Insert:</span>
            <button type="button" className="chip bg-sky text-blue-deep hover:bg-[#dbe6fb]" onClick={() => insert("{business}")}>
              + business name
            </button>
            <button type="button" className="chip bg-sky text-blue-deep hover:bg-[#dbe6fb]" onClick={() => insert("{link}")}>
              + booking link
            </button>
          </div>
        </Field>

        <div className="rounded-2xl border border-line bg-white p-4 text-sm">
          <p className="flex items-center justify-between gap-3">
            <span className="font-semibold">
              {sms.segments === 1 ? "Fits in 1 SMS" : `Sent as ${sms.segments} SMS`}
            </span>
            <span className="tabular-nums text-muted">
              {sms.length} / {sms.segments === 1 ? sms.perSegment : sms.perSegment * sms.segments} characters
            </span>
          </p>
          {sms.unicode && (
            <p className="mt-2 text-ink-soft">
              Letters like <strong>{sms.offending.slice(0, 5).join(" ")}</strong>{" "}make each SMS hold 70 characters instead of
              160. That&apos;s fine. Removing them just makes each text cheaper.
            </p>
          )}
          {!message.includes("{link}") && (
            <p className="mt-2 flex items-start gap-2 text-warn">
              <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
              Without the booking link, callers can only wait for you to call back.
            </p>
          )}
        </div>

        <SubmitButton>
          {mode === "setup" ? (
            <>
              Continue <Icon name="arrowRight" className="h-4 w-4" />
            </>
          ) : (
            "Save message"
          )}
        </SubmitButton>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="label mb-3">Preview</p>
        <SmsPreview sender={sender || "RingLoop"} text={filled} />
      </div>
    </ActionForm>
  );
}
