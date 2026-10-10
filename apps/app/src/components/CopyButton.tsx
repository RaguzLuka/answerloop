"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

export function CopyButton({ text, label = "Copy", className = "btn btn-secondary btn-sm" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {}
      }}
    >
      <Icon name={done ? "check" : "copy"} className="h-4 w-4" />
      {done ? "Copied" : label}
    </button>
  );
}

export function ShareButton({ url, title, className = "btn btn-secondary btn-sm" }: { url: string; title: string; className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        if (navigator.share) {
          try {
            await navigator.share({ title, url });
          } catch {}
        } else {
          window.open(url, "_blank", "noopener");
        }
      }}
    >
      <Icon name="share" className="h-4 w-4" /> Share
    </button>
  );
}
