import Link from "next/link";

export const metadata = {
  title: "Page not found — RingLoop",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink">
      <div className="halo pointer-events-none absolute inset-0" />

      <div className="relative">
        <p className="font-display mb-4 select-none text-8xl text-blue/15">404</p>
        <h1 className="font-display mb-3 text-4xl">Page not found</h1>
        <p className="mb-12 max-w-sm leading-relaxed text-ink-soft">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/" className="btn-primary px-8 py-3.5">
            ← Back to home
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-[var(--line)] bg-white px-8 py-3.5 font-semibold text-ink-soft transition-all duration-300 hover:border-blue/30 hover:text-blue"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
