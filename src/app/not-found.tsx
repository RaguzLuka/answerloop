import Link from "next/link";
import { Bubble, ThreadNote } from "@/components/Sms";
import Halo from "@/components/Halo";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-paper px-6 pb-20 pt-36 text-center text-ink">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="halo pointer-events-none absolute inset-0" />

      <div className="relative w-full max-w-md">
        <Halo pose="listen" size={140} priority decorative className="animate-float mx-auto -mb-6 h-32 w-32 md:h-36 md:w-36" />
        <div className="card relative mx-auto mb-12 max-w-[320px] space-y-1.5 p-4 text-left">
          <ThreadNote tone="missed">Missed page · 404</ThreadNote>
          <Bubble side="in">Halo? 👂 Hmm, nobody&apos;s on this page. Want to head back home?</Bubble>
          <Bubble side="out">Yes please</Bubble>
        </div>

        <h1 className="font-display text-4xl md:text-5xl">
          This page went <em>unanswered.</em>
        </h1>
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-ink-soft">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Halo catches every missed
          call — but this one even Halo can&apos;t text back.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Link href="/" className="btn-primary px-8 py-3.5">
            ← Back to home
          </Link>
          <Link href="/demo" className="btn-secondary px-8 py-3.5">
            Try the live demo
          </Link>
        </div>
      </div>
    </main>
  );
}
