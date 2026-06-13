"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "ringloop_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl">
      <div className="rounded-2xl border border-[var(--line)] bg-white/95 backdrop-blur-xl shadow-2xl shadow-[rgba(12,27,56,0.12)] px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft leading-relaxed">
          We use cookies to understand how visitors use our site. Essential cookies are always active.{" "}
          <Link href="/privacy#cookies" className="text-blue hover:underline">
            Learn more
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={decline}
            className="rounded-full border border-[var(--line)] px-5 py-2 text-sm font-medium text-ink-soft hover:border-blue/30 hover:text-ink transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="btn-primary px-5 py-2 text-sm"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
