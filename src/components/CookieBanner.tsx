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
      <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600 leading-relaxed">
          We use cookies to understand how visitors use our site. Essential cookies are always active.{" "}
          <Link href="/privacy#cookies" className="text-blue-600 hover:underline">
            Learn more
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={decline}
            className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 hover:border-gray-400 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
