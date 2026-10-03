"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "ringloop_cookie_consent";

/** Fired by the footer's "Cookie settings" button to reopen the banner */
export const COOKIE_SETTINGS_EVENT = "ringloop:cookie-settings";

function readConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveConsent(value: "accepted" | "declined") {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage blocked (private mode) — the choice just won't persist
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Let the page settle before asking
    const id = setTimeout(() => {
      if (!readConsent()) setVisible(true);
    }, 1200);
    const reopen = () => setVisible(true);
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
    return () => {
      clearTimeout(id);
      window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
    };
  }, []);

  function choose(value: "accepted" | "declined") {
    saveConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div role="dialog" aria-label="Cookie preferences" className="animate-fade-up fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:left-5 sm:max-w-sm">
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white/95 p-5 shadow-2xl shadow-[rgba(12,27,56,0.14)] backdrop-blur-xl">
        <p className="text-sm leading-relaxed text-ink-soft">
          We use essential cookies to run this site, and optional ones only with your consent.{" "}
          <Link href="/privacy#cookies" className="font-medium text-blue hover:underline">
            Learn more
          </Link>
        </p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="flex-1 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-blue/30 hover:text-ink"
          >
            Decline
          </button>
          <button type="button" onClick={() => choose("accepted")} className="btn-primary flex-1 px-4 py-2 text-sm">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
