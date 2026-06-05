import Link from "next/link";

export const metadata = {
  title: "Page not found — RingLoop",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,_#dbeafe,_transparent)]" />

      <div className="relative">
        <p className="mb-4 text-8xl font-bold tracking-tight text-blue-100 select-none">404</p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">Page not found</h1>
        <p className="mb-10 max-w-sm text-slate-500 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full bg-blue-600 px-7 py-3 font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-500 hover:-translate-y-px transition-all duration-300"
          >
            ← Back to home
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-slate-200 px-7 py-3 font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
