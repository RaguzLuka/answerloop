"use client";
import { useEffect, useState } from "react";

/**
 * template.tsx re-mounts on EVERY route change (unlike layout.tsx which
 * persists). This gives every page the same smooth fade-up reveal.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Tiny delay so the browser paints before we start the animation
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0px)" : "translateY(18px)",
        transition: "opacity 0.55s cubic-bezier(.16,1,.3,1), transform 0.55s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {children}
    </div>
  );
}
