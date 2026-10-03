"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Halo from "@/components/Halo";

/** Floating CTA: take any visitor straight to the live SMS demo. */
export default function FloatingDemoButton() {
  const pathname = usePathname();
  if (pathname === "/demo") return null; // already there

  return (
    <Link
      href="/demo"
      aria-label="Text Halo — try the live SMS demo"
      className="btn-primary fixed bottom-5 right-5 z-40 py-2.5 pl-2.5 pr-4.5 text-sm md:bottom-6 md:right-6"
    >
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white">
        <Halo pose="avatar" size={28} decorative className="h-7 w-7" />
        <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
          <span className="ring-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-300" />
          <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
        </span>
      </span>
      Text Halo
    </Link>
  );
}
