/**
 * RingLoop logo mark — loop arrow icon.
 * Blue rounded-square background with a white 270° circular arrow.
 * Represents "looping back" on a missed call.
 */
export default function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Background */}
      <rect width="30" height="30" rx="7" fill="#2563EB" />

      {/* 270° clockwise arc — from top (15,5.5) sweeping to left (5.5,15) */}
      <path
        d="M15 5.5A9.5 9.5 0 1 1 5.5 15"
        stroke="white"
        strokeWidth="2.3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Arrowhead at (5.5, 15) pointing upward (direction of the arc) */}
      <path
        d="M2.5 17.5L5.5 15L8.5 17.5"
        stroke="white"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
