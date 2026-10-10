import Link from "next/link";
import Halo from "@/components/Halo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <Halo pose="listen" size={160} />
      <h1 className="font-display mt-2 text-3xl">We couldn&apos;t find that page</h1>
      <p className="mt-2 max-w-sm text-ink-soft">The link may be old or mistyped.</p>
      <Link href="/" className="btn btn-primary mt-6">Go to RingLoop</Link>
    </div>
  );
}
