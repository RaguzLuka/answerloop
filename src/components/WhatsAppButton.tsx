"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Floating CTA: take any visitor straight to the live voice demo. */
export default function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname === "/demo") return null; // already there

  return (
    <Link
      href="/demo"
      aria-label="Talk to the AI receptionist now"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-blue-600 pl-4 pr-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 hover:bg-blue-500 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-white" />
      </span>
      <span>Talk to the AI</span>
    </Link>
  );
}
