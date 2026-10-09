"use client";

import { useActionState, useEffect, useRef } from "react";
import { ownerReply } from "@/lib/actions/chats";
import { initialState } from "@/lib/form";
import { FormMessage, SubmitButton } from "@/components/form";
import Icon from "@/components/Icon";

export default function OwnerReply({ chatId }: { chatId: string }) {
  const [state, action] = useActionState(ownerReply.bind(null, chatId), initialState);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} className="space-y-2">
      {state.error && <FormMessage state={state} />}
      <div className="flex items-end gap-2">
        <label htmlFor="owner-text" className="sr-only">Your reply</label>
        <textarea
          id="owner-text"
          name="text"
          rows={2}
          maxLength={1000}
          placeholder="Write on WhatsApp as your business…"
          className="input !min-h-12 flex-1 resize-none"
        />
        <SubmitButton className="btn btn-primary h-12 w-12 !px-0" pendingText="">
          <Icon name="arrowRight" className="h-5 w-5 -rotate-90" strokeWidth={2.4} />
          <span className="sr-only">Send</span>
        </SubmitButton>
      </div>
    </form>
  );
}
