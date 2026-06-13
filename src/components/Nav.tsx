"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

/* All pages live flat in the top bar (Privacy stays in the footer) */
const links = [
  { href: "/",             label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/demo",         label: "Live demo" },
  { href: "/pricing",      label: "Pricing" },
  { href: "/about",        label: "About" },
  { href: "/contact",      label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // narrow-screen panel
  const [scrolled, setScrolled] = useState(false);

  // Close the menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // Prevent body scroll when the mobile panel is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Frosted glass appears once you scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      solid
        ? "bg-white/80 backdrop-blur-2xl border-b border-[var(--line)] shadow-[0_1px_12px_rgba(12,27,56,0.04)]"
        : "bg-transparent border-b border-transparent"
    }`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Wordmark */}
        <Link href="/" className="font-display text-[1.3rem] tracking-tight text-ink select-none transition-opacity duration-300 hover:opacity-80">
          Ring<em>Loop</em>
        </Link>

        {/* All links inline in the top bar — collapses to a menu only on phones */}
        <div className="hidden items-center gap-5 text-sm font-medium md:flex lg:gap-7">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative py-1 transition-colors duration-200 ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {label}
                {active && <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-blue" />}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <Link href="/contact" className="btn-primary hidden px-4 py-2 text-sm md:block lg:px-5">
          Book a demo
        </Link>

        {/* Narrow screens (phones AND cropped windows): menu button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)] bg-white text-ink-soft transition-colors duration-200 hover:text-ink"
        >
          {open ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Slide-down menu panel — phones only */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out border-t border-[var(--line)] bg-white/95 backdrop-blur-2xl ${open ? "max-h-[34rem] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 py-5 flex flex-col gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  active ? "bg-sky text-blue" : "text-ink-soft hover:bg-paper hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link href="/contact" className="btn-primary mt-3 py-3 text-center text-sm">
            Book a free demo →
          </Link>
        </div>
      </div>
    </nav>
  );
}
