import Image from "next/image";

/** Halo — RingLoop's mascot, the sapphire ring that answers for you.
 *  Always the 3D renders in /public/halo (512px, transparent). */
export type HaloPose = "wave" | "booking" | "celebrate" | "happy" | "listen" | "night" | "avatar" | "talk";

export default function Halo({
  pose = "wave", size = 120, className = "", priority = false,
}: { pose?: HaloPose; size?: number; className?: string; priority?: boolean }) {
  return (
    <Image
      src={`/halo/${pose}.png`}
      alt=""
      width={size}
      height={size}
      priority={priority}
      className={`pointer-events-none select-none ${className}`}
      draggable={false}
    />
  );
}

/** Halo with a speech bubble — the guide voice of the app. */
export function HaloSays({
  pose = "talk", children, size = 72,
}: { pose?: HaloPose; children: React.ReactNode; size?: number }) {
  return (
    <div className="flex items-end gap-3">
      <Halo pose={pose} size={size} className="shrink-0" />
      <div className="relative mb-2 rounded-2xl rounded-bl-md bg-sky px-4 py-3 text-[0.9375rem] leading-relaxed text-ink">
        {children}
      </div>
    </div>
  );
}
