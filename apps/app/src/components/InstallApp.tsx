"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";

type Platform = "ios" | "android" | "desktop";
type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

// The browser fires this once, possibly before React mounts — catch it early.
let deferred: BeforeInstallPromptEvent | null = null;
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
  });
}

function detect(): { platform: Platform; standalone: boolean } {
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && navigator.maxTouchPoints > 1);
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return { platform: ios ? "ios" : /Android/i.test(ua) ? "android" : "desktop", standalone };
}

/** "Get the app" — one-tap install where the browser allows it, clear steps elsewhere. */
export default function InstallApp({ variant = "card" }: { variant?: "card" | "banner" }) {
  const [env, setEnv] = useState<{ platform: Platform; standalone: boolean } | null>(null);
  const [canPrompt, setCanPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Runs once on mount: browser-only facts aren't known during server render
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnv(detect());
    setCanPrompt(!!deferred);
    try {
      setDismissed(localStorage.getItem("rl-install-dismissed") === "1");
    } catch {}
    const onPrompt = () => setTimeout(() => setCanPrompt(!!deferred), 0);
    const onInstalled = () => setEnv((e) => (e ? { ...e, standalone: true } : e));
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!env) return null;

  if (env.standalone) {
    return variant === "card" ? (
      <div className="flex items-center gap-2 text-sm font-medium text-ok">
        <Icon name="checkCircle" className="h-5 w-5" /> You&apos;re using the installed app.
      </div>
    ) : null;
  }
  if (variant === "banner" && dismissed) return null;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    setCanPrompt(false);
  }

  const steps =
    env.platform === "ios" ? (
      <ol className="space-y-1.5 text-sm text-ink-soft">
        <li>1. Open this page in <strong>Safari</strong>.</li>
        <li className="flex flex-wrap items-center gap-1">
          2. Tap <Icon name="share" className="inline h-4 w-4 text-blue" /> <strong>Share</strong> at the bottom of the screen.
        </li>
        <li>3. Choose <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</li>
      </ol>
    ) : env.platform === "android" ? (
      <ol className="space-y-1.5 text-sm text-ink-soft">
        <li>1. Open this page in <strong>Chrome</strong>.</li>
        <li>2. Tap the <strong>⋮</strong> menu, then <strong>Install app</strong> (or Add to Home screen).</li>
      </ol>
    ) : (
      <p className="text-sm text-ink-soft">
        In <strong>Chrome</strong> or <strong>Edge</strong>, click the install icon at the right of the address bar. On a Mac
        with Safari: <strong>File → Add to Dock</strong>. Easiest of all: open this page on your phone.
      </p>
    );

  if (variant === "banner") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
        <Icon name="download" className="h-5 w-5 shrink-0 text-blue" />
        <p className="flex-1 text-sm text-ink-soft">
          <strong className="text-ink">Get the RingLoop app</strong> — bookings on your home screen.
        </p>
        {canPrompt ? (
          <button className="btn btn-primary btn-sm" onClick={install}>Install</button>
        ) : (
          <a href="/install" className="btn btn-secondary btn-sm">How</a>
        )}
        <button
          aria-label="Dismiss"
          className="rounded-full p-1.5 text-muted hover:bg-sky"
          onClick={() => {
            setDismissed(true);
            try {
              localStorage.setItem("rl-install-dismissed", "1");
            } catch {}
          }}
        >
          <Icon name="x" className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {canPrompt && (
        <button className="btn btn-primary w-full sm:w-auto" onClick={install}>
          <Icon name="download" className="h-5 w-5" /> Install RingLoop
        </button>
      )}
      <div>
        <p className="label mb-2">
          {env.platform === "ios" ? "On iPhone / iPad" : env.platform === "android" ? "On Android" : "On a computer"}
        </p>
        {steps}
      </div>
    </div>
  );
}
