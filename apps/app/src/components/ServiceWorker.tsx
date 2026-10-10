"use client";

import { useEffect } from "react";

/** Registers /sw.js (offline fallback page). Skipped in development so it
 *  never interferes with hot reloading. */
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
  }, []);
  return null;
}
