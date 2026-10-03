"use client";
import { COOKIE_SETTINGS_EVENT } from "@/components/CookieBanner";

export default function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}
      className={className}
    >
      Cookie settings
    </button>
  );
}
