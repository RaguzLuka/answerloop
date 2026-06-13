/**
 * RingLoop logo mark — "voice loop": an open ring (the call) wrapping a
 * voice equalizer (the AI speaking). Sapphire tile, white mark.
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
        <rect x="409" y="452" width="38" height="120" rx="19" />
        <rect x="465" y="407" width="38" height="210" rx="19" />
        <rect x="521" y="432" width="38" height="160" rx="19" />
        <rect x="577" y="464" width="38" height="96" rx="19" />
      </g>
    </svg>
  );
}
