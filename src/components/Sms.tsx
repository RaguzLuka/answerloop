import Icon from "@/components/Icon";

/* Building blocks for the SMS mockups used across the site:
   a phone shell, a Messages-style header, bubbles and thread notes.
   "in" = message the phone's owner receives, "out" = one they send. */

export function PhoneShell({
  children, time = "18:41", tone = "light", className = "", screenClassName = "",
}: {
  children: React.ReactNode;
  time?: string;
  /** "dark" = white status bar text, for wallpapers and call screens */
  tone?: "light" | "dark";
  className?: string;
  screenClassName?: string;
}) {
  return (
    <div
      className={`relative rounded-[2.9rem] bg-[#0d1426] p-[9px] ring-1 ring-[#2a3552] shadow-[0_60px_110px_-40px_rgba(12,27,56,0.5),0_30px_70px_-35px_rgba(33,86,232,0.45)] ${className}`}
    >
      {/* Hardware buttons */}
      <span className="absolute -left-[3px] top-[104px] h-8 w-[3px] rounded-l-sm bg-[#1d2742]" />
      <span className="absolute -left-[3px] top-[150px] h-12 w-[3px] rounded-l-sm bg-[#1d2742]" />
      <span className="absolute -left-[3px] top-[206px] h-12 w-[3px] rounded-l-sm bg-[#1d2742]" />
      <span className="absolute -right-[3px] top-[170px] h-16 w-[3px] rounded-r-sm bg-[#1d2742]" />

      <div className={`relative flex flex-col overflow-hidden rounded-[2.35rem] ${screenClassName}`}>
        <StatusBar time={time} tone={tone} />
        {children}
        {/* Home indicator */}
        <span
          className={`pointer-events-none absolute bottom-2 left-1/2 h-[4px] w-28 -translate-x-1/2 rounded-full ${
            tone === "dark" ? "bg-white/80" : "bg-ink/85"
          }`}
        />
      </div>
    </div>
  );
}

function StatusBar({ time, tone }: { time: string; tone: "light" | "dark" }) {
  return (
    <div
      className={`relative z-10 flex h-11 shrink-0 items-center justify-between px-7 text-[12.5px] font-semibold ${
        tone === "dark" ? "text-white" : "text-ink"
      }`}
    >
      <span className="tabular-nums">{time}</span>
      {/* Dynamic island */}
      <span className="absolute left-1/2 top-[9px] h-[26px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden="true">
          <rect x="0" y="7" width="3" height="4" rx="0.8" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.8" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.8" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.8" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor" aria-hidden="true">
          <path d="M7.5 2.3c2.1 0 4 .8 5.5 2.1l1.1-1.2A9.4 9.4 0 0 0 7.5.7 9.4 9.4 0 0 0 .9 3.2L2 4.4a7.9 7.9 0 0 1 5.5-2.1Zm0 3.2c1.3 0 2.4.5 3.3 1.3l1.1-1.2a6.4 6.4 0 0 0-8.8 0l1.1 1.2c.9-.8 2-1.3 3.3-1.3Zm0 3.2c.4 0 .8.2 1.1.4L7.5 10.3 6.4 9.1c.3-.2.7-.4 1.1-.4Z" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor" aria-hidden="true">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.4" fill="none" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="16" height="8" rx="2" />
          <path d="M23 4v4c.8-.3 1.4-1.1 1.4-2S23.8 4.3 23 4Z" opacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

/** iOS-style conversation header: back chevron, avatar, contact name */
export function ChatHeader({ name = "Adria Dental", initials = "AD" }: { name?: string; initials?: string }) {
  return (
    <div className="relative flex shrink-0 flex-col items-center gap-1 border-b border-line/70 bg-white/90 pb-2.5 pt-0.5 backdrop-blur">
      <Icon name="chevronRight" className="absolute left-3 top-3.5 h-5 w-5 rotate-180 text-blue" strokeWidth={2.4} />
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#a9c1fb] to-[#5f8cf3] text-[13px] font-semibold text-white">
        {initials}
      </span>
      <span className="flex items-center gap-0.5 text-[11.5px] font-medium text-ink">
        {name}
        <Icon name="chevronRight" className="h-3 w-3 text-muted" strokeWidth={2.4} />
      </span>
    </div>
  );
}

export function Bubble({
  side, children, animate = false, className = "",
}: {
  side: "in" | "out";
  children: React.ReactNode;
  animate?: boolean;
  className?: string;
}) {
  const incoming = side === "in";
  return (
    <div className={`flex ${incoming ? "justify-start" : "justify-end"} ${className}`}>
      <p
        className={`max-w-[82%] whitespace-pre-line px-3.5 py-2 text-[13px] leading-[1.38] ${
          animate ? `bubble ${incoming ? "bubble-in" : "bubble-out"}` : ""
        } ${
          incoming
            ? "rounded-[18px] rounded-bl-md bg-[var(--bubble-in)] text-ink"
            : "rounded-[18px] rounded-br-md bg-blue text-white"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex justify-start">
      <span
        role="status"
        aria-label="Typing"
        className="bubble bubble-in flex items-center gap-1 rounded-[18px] rounded-bl-md bg-[var(--bubble-in)] px-3.5 py-3"
      >
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-soft" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-soft" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-soft" />
      </span>
    </div>
  );
}

/** Centered note inside a thread — timestamps, missed calls, system events */
export function ThreadNote({
  children, tone = "neutral", animate = false,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "missed";
  animate?: boolean;
}) {
  return (
    <div className={`flex justify-center py-1 ${animate ? "bubble" : ""}`}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-medium ${
          tone === "missed" ? "bg-red-50 text-red-500" : "text-muted"
        }`}
      >
        {tone === "missed" && <Icon name="phoneMissed" className="h-3 w-3" strokeWidth={2.2} />}
        {children}
      </span>
    </div>
  );
}

/** A compact chat window (where a full phone would be too much) */
export function ChatWindow({
  name, initials, label = "Text message", children, className = "",
}: {
  name: string;
  initials: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-line bg-white shadow-[0_30px_60px_-30px_rgba(12,27,56,0.3)] ${className}`}>
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#a9c1fb] to-[#5f8cf3] text-[11px] font-semibold text-white">
          {initials}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[13px] font-semibold text-ink">{name}</span>
          <span className="block text-[11px] text-muted">{label}</span>
        </span>
      </div>
      <div className="space-y-1.5 p-4">{children}</div>
    </div>
  );
}

/** Non-interactive compose bar for illustrations */
export function FakeInput({ text = "Text Message" }: { text?: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2 px-3 pb-6 pt-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bubble-in)] text-muted">
        <Icon name="plus" className="h-3.5 w-3.5" strokeWidth={2.4} />
      </span>
      <span className="flex-1 rounded-full border border-line px-3.5 py-[7px] text-[12px] text-muted">{text}</span>
    </div>
  );
}
