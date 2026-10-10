"use client";

import { useEffect } from "react";

/** Records the tap, then sends the visitor on to the booking page. */
export default function Forward({ token, target }: { token: string; target: string }) {
  useEffect(() => {
    try {
      navigator.sendBeacon(`/api/opened/${token}`);
    } catch {}
    window.location.replace(target);
  }, [token, target]);
  return (
    <main className="flex min-h-dvh items-center justify-center px-5 text-center">
      <p className="text-ink-soft">
        <a href={target} className="font-semibold text-blue underline underline-offset-2">Otvori / Open</a>
      </p>
    </main>
  );
}
