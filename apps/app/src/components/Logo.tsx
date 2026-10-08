/** RingLoop mark — the open ring around a typing indicator (same as ringloop.net).
 *  The tile gradient is CSS rather than an SVG <linearGradient>: SVG gradient ids
 *  clash when the mark appears twice and one copy sits in a hidden sidebar. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.2266,
        background: "linear-gradient(180deg, #3a6cf2, #1741c9)",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
        <path d="M447.7 688.7 A188 188 0 1 1 576.3 688.7" stroke="#fff" strokeWidth="56" strokeLinecap="round" />
        <g fill="#fff">
          <circle cx="432" cy="512" r="36" />
          <circle cx="512" cy="512" r="36" />
          <circle cx="592" cy="512" r="36" />
        </g>
      </svg>
    </span>
  );
}

export function Wordmark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      <span className="font-display text-[1.05rem] text-ink">RingLoop</span>
    </span>
  );
}
