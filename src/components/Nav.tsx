"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import LogoMark from "@/components/LogoMark";

const links = [
  { href: "/#features",    label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing",      label: "Pricing" },
  { href: "/demo",         label: "Live demo", live: true },
  { href: "/about",        label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // phone menu
  const [scrolled, setScrolled] = useState(false);

  // Prevent body scroll while the phone menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Frosted glass appears once you scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;
  const close = () => setOpen(false);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-line bg-white/80 shadow-[0_1px_12px_rgba(12,27,56,0.04)] backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-6">
        <Link href="/" onClick={close} className="flex select-none items-center gap-2.5 transition-opacity duration-300 hover:opacity-80">
          <LogoMark size={30} />
          <span className="font-display text-[1.25rem] tracking-tight text-ink">
            Ring<em>Loop</em>
          </span>
        </Link>

        <div className="hidden items-center gap-1 text-sm font-medium md:flex">
          {links.map(({ href, label, live }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-2.5 py-2 transition-colors duration-200 lg:px-3.5 ${
                  active ? "bg-sky/80 text-blue" : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink"
                }`}
              >
                {live && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="ring-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                )}
                {label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/contact"
            className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink lg:block"
          >
            Contact
          </Link>
          <Link href="/contact" className="btn-primary group px-4 py-2.5 text-sm lg:px-5">
            Book a demo <span className="arrow hidden lg:inline-block">→</span>
          </Link>
        </div>

        {/* Phone menu button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink-soft transition-colors duration-200 hover:text-ink md:hidden"
        >
          {open ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Slide-down phone menu */}
      <div
        className={`overflow-hidden border-t border-line bg-white/95 backdrop-blur-2xl transition-all duration-300 ease-out md:hidden ${
          open ? "max-h-[36rem] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-6 py-5">
          {[...links, { href: "/contact", label: "Contact", live: false }].map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={`rounded-xl px-4 py-3 text-[15px] font-medium transition-colors duration-200 ${
                  active ? "bg-sky text-blue" : "text-ink-soft hover:bg-paper hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link href="/contact" onClick={close} className="btn-primary mt-3 py-3.5 text-[15px]">
            Book a free demo →
          </Link>
        </div>
      </div>
    </nav>
  );
}
