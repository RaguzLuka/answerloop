import Link from "next/link";
import Halo, { type HaloPose } from "@/components/Halo";

type LinkSpec = { href: string; label: string };

/** Closing navy call-to-action used at the bottom of every page */
export default function CtaBand({
  eyebrow,
  title,
  sub,
  primary = { href: "/contact", label: "Book a free demo" },
  secondary,
  halo = "wave",
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  primary?: LinkSpec;
  secondary?: LinkSpec;
  /** Halo pose above the heading; null hides it */
  halo?: HaloPose | null;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-night px-6 py-28 text-center text-white md:py-36">
      <div className="grid-bg-dark pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_115%,rgba(64,116,245,0.35),transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-periwinkle/50 to-transparent" />

      <div data-reveal className="relative mx-auto max-w-3xl">
        {halo && (
          <Halo
            pose={halo}
            size={112}
            decorative
            className="animate-float mx-auto mb-6 h-24 w-24 drop-shadow-[0_20px_40px_rgba(64,116,245,0.45)] md:h-28 md:w-28"
          />
        )}
        {eyebrow && <p className="label mb-5 text-sky/55">{eyebrow}</p>}
        <h2 className="font-display text-[2.5rem] leading-[1.06] md:text-6xl">{title}</h2>
        {sub && <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-sky/65">{sub}</p>}
        <div className="mt-11 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Link href={primary.href} className="btn-primary group w-full px-8 py-4 sm:w-auto">
            {primary.label} <span className="arrow">→</span>
          </Link>
          {secondary && (
            <Link href={secondary.href} className="btn-ghost w-full px-8 py-4 sm:w-auto">
              {secondary.label}
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
