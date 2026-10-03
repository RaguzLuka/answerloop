/**
 * RingLoop logo mark — "message loop": the open ring (the missed call)
 * wrapped around a typing indicator (the text that loops back).
 * Sapphire tile, white mark.
 */
export default function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lm-tile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a6cf2" />
          <stop offset="1" stopColor="#1741c9" />
        </linearGradient>
      </defs>

      <rect width="1024" height="1024" rx="232" fill="url(#lm-tile)" />

      <path
        d="M447.7 688.7 A188 188 0 1 1 576.3 688.7"
        fill="none"
        stroke="#ffffff"
        strokeWidth="56"
        strokeLinecap="round"
      />

      <g fill="#ffffff">
        <circle cx="432" cy="512" r="36" />
        <circle cx="512" cy="512" r="36" />
        <circle cx="592" cy="512" r="36" />
      </g>
    </svg>
  );
}
