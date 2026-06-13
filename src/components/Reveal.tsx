"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global scroll-reveal: any element with [data-reveal] fades/slides in
 * the first time it enters the viewport. Re-scans on every route change.
 * Uses a rAF-throttled scroll check (more reliable across browsers than
 * IntersectionObserver, and cheap at this element count).
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    let pending = Array.from(document.querySelectorAll("[data-reveal]:not(.revealed)"));
    if (pending.length === 0) return;

    let ticking = false;

    const check = () => {
      ticking = false;
      const vh = window.innerHeight;
      pending = pending.filter((el) => {
        const r = el.getBoundingClientRect();
        // Reveal anything in view OR already scrolled past (anchor jumps,
        // fast scrolling) so sections are never left invisible above you.
        const inView = r.top < vh - 40;
        if (inView) el.classList.add("revealed");
        return !inView;
      });
      if (pending.length === 0) cleanup();
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    };

    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();

    return cleanup;
  }, [pathname]);

  return null;
}
