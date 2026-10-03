"use client";
import { useEffect, useRef, useState } from "react";
import useReducedMotion from "@/components/useReducedMotion";

/**
 * Animates a number from 0 to `end` the first time it scrolls into view.
 * Shows the final value immediately for reduced-motion visitors.
 */
export default function CountUp({
  end, prefix = "", suffix = "", duration = 1400,
}: {
  end: number; prefix?: string; suffix?: string; duration?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / duration, 1);
          setValue(Math.round((1 - Math.pow(1 - p, 3)) * end)); // ease-out cubic
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration, reduced]);

  return <span ref={ref}>{prefix}{reduced ? end : value}{suffix}</span>;
}
