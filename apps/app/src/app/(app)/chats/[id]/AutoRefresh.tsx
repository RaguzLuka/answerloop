"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Re-fetches the page every few seconds while it's visible, so new messages appear. */
export default function AutoRefresh({ seconds }: { seconds: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, seconds * 1000);
    return () => clearInterval(t);
  }, [router, seconds]);
  return null;
}
