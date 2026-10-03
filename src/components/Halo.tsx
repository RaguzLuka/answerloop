import Image from "next/image";

/** Halo — RingLoop's mascot: the sapphire ring that answers for you.
 *  Poses are 512px transparent renders in /public/halo. */
export type HaloPose =
  | "wave" | "booking" | "celebrate" | "happy" | "listen" | "night" | "avatar" | "talk";

const ALT: Record<HaloPose, string> = {
  wave:      "Halo, RingLoop's AI receptionist, waving hello",
  booking:   "Halo holding up a calendar date",
  celebrate: "Halo smiling with the loop closed — booking done",
  happy:     "Halo smiling",
  listen:    "Halo listening with an earpiece",
  night:     "Halo, awake at night",
  avatar:    "Halo",
  talk:      "Halo talking",
};

export default function Halo({
  pose = "wave",
  size = 160,
  className = "",
  priority = false,
  decorative = false,
}: {
  pose?: HaloPose;
  size?: number;
  className?: string;
  priority?: boolean;
  /** true when nearby text already names Halo */
  decorative?: boolean;
}) {
  return (
    <Image
      src={`/halo/${pose}.png`}
      alt={decorative ? "" : ALT[pose]}
      width={size}
      height={size}
      priority={priority}
      className={`select-none ${className}`}
      draggable={false}
    />
  );
}
