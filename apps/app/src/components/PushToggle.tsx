"use client";

import { useEffect, useState } from "react";
import { removePushSubscription, savePushSubscription } from "@/lib/actions/push";
import Icon from "@/components/Icon";

/* Turns phone notifications on or off for this device. On iPhone this only
   works inside the installed app (Add to Home Screen), iOS 16.4 or newer. */

type State = "loading" | "unsupported" | "needs-install" | "blocked" | "off" | "on" | "busy";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function registration() {
  return (await navigator.serviceWorker.getRegistration("/")) ?? navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

export default function PushToggle({ publicKey, variant = "row" }: { publicKey: string | null; variant?: "row" | "card" }) {
  const [state, setState] = useState<State>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const standalone = window.matchMedia("(display-mode: standalone)").matches;
      if (!publicKey || !("serviceWorker" in navigator)) return setState("unsupported");
      if (!("PushManager" in window)) return setState(ios && !standalone ? "needs-install" : "unsupported");
      if (Notification.permission === "denied") return setState("blocked");
      const reg = await navigator.serviceWorker.getRegistration("/");
      const sub = await reg?.pushManager.getSubscription();
      setState(sub ? "on" : "off");
    })().catch(() => setState("unsupported"));
  }, [publicKey]);

  async function enable() {
    setError(null);
    setState("busy");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return setState(permission === "denied" ? "blocked" : "off");
      const reg = await registration();
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey!),
      });
      const res = await savePushSubscription(JSON.parse(JSON.stringify(sub)));
      setState(res.ok ? "on" : "off");
      if (!res.ok) setError("Couldn't save this device. Try again.");
    } catch {
      setError("Notifications couldn't be turned on in this browser.");
      setState("off");
    }
  }

  async function disable() {
    setState("busy");
    const reg = await navigator.serviceWorker.getRegistration("/");
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      await removePushSubscription(sub.endpoint);
      await sub.unsubscribe();
    }
    setState("off");
  }

  if (state === "loading") return null;
  if (variant === "card" && state !== "off") return null; // the Home-screen prompt only asks once it can

  const hint =
    state === "needs-install"
      ? "On iPhone, add RingLoop to your Home Screen first, then turn this on from the app."
      : state === "blocked"
        ? "Notifications are blocked for RingLoop. Allow them in your phone's or browser's settings."
        : state === "unsupported"
          ? publicKey
            ? "This browser can't show notifications. Try the installed app or Chrome."
            : "Phone notifications aren't set up on this server yet."
          : "Get a ping for every new booking and missed call, even when the app is closed.";

  if (variant === "card") {
    return (
      <div className="card flex flex-wrap items-center gap-4 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky text-blue">
          <Icon name="bell" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Turn on notifications</p>
          <p className="text-sm text-ink-soft">{hint}</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={enable}>Turn on</button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4">
        <span>
          <span className="block font-semibold">Notifications on this device</span>
          <span className="text-sm text-muted">{hint}</span>
        </span>
        <input
          type="checkbox"
          role="switch"
          aria-label="Notifications on this device"
          className="switch"
          checked={state === "on"}
          disabled={state === "busy" || state === "unsupported" || state === "blocked" || state === "needs-install"}
          onChange={(e) => (e.target.checked ? enable() : disable())}
        />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
