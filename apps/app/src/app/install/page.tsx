import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/Logo";
import Halo from "@/components/Halo";
import InstallApp from "@/components/InstallApp";

export const metadata: Metadata = { title: "Get the app" };

export default function InstallPage() {
  return (
    <div className="pt-safe pb-safe mx-auto max-w-xl px-5 py-6">
      <Link href="/">
        <Wordmark />
      </Link>
      <div className="mt-8 flex flex-col items-center text-center">
        <Halo pose="happy" size={140} priority />
        <h1 className="font-display mt-2 text-3xl">Get RingLoop on your phone</h1>
        <p className="mt-2 text-ink-soft">It installs from your browser in a few taps. No app store, and it updates itself.</p>
      </div>
      <div className="card mt-8 p-6">
        <InstallApp />
      </div>
      <p className="mt-6 text-center text-sm">
        <Link href="/dashboard" className="font-semibold text-blue">Back to the app</Link>
      </p>
    </div>
  );
}
