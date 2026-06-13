"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Wraps the how-it-works steps with a vertical spine that lights up
 * as you scroll through them. The lit portion follows a point ~55%
 * down the viewport, so the glow always leads your reading position.
 */
export default function Timeline({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const focus = window.innerHeight * 0.55;
      setProgress(Math.max(0, Math.min(1, (focus - r.top) / r.height)));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Track */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-4 w-px bg-[var(--line)] md:left-1/2" />
      {/* Lit fill — eased height makes the glow glide rather than step */}
      <div
        className="pointer-events-none absolute top-0 left-4 w-px bg-gradient-to-b from-blue via-[#5f8cf3] to-[#7fa6f8] shadow-[0_0_14px_rgba(33,86,232,0.65)] transition-[height] duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:left-1/2"
        style={{ height: `${progress * 100}%` }}
      />
      {/* Glowing tip */}
      <div
        className="pointer-events-none absolute left-4 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue shadow-[0_0_16px_4px_rgba(33,86,232,0.45)] transition-[top,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:left-1/2"
        style={{ top: `${progress * 100}%`, opacity: progress > 0.005 && progress < 0.995 ? 1 : 0 }}
      />
      {children}
    </div>
  );
}
