"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/",             label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/demo",         label: "Live demo" },
  { href: "/pricing",      label: "Pricing" },
  { href: "/contact",      label: "Contact" },
];

export default function Nav() {
  const pathname   = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);
  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  // Track scroll for the homepage dark→light nav transition
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Over the homepage's dark cinematic hero the nav is dark glass;
  // everywhere else (and once scrolled) it's the usual white glass.
  const dark = pathname === "/" && !scrolled && !open;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
      dark
        ? "bg-[#050c1e]/60 backdrop-blur-2xl border-b border-white/5"
        : "bg-white/80 backdrop-blur-2xl border-b border-slate-100/70"
    }`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className={`text-[1.2rem] font-bold tracking-tight select-none transition-colors duration-300 hover:opacity-80 ${dark ? "text-white" : "text-slate-900"}`}>
          Ring<span className={dark ? "text-blue-400" : "text-blue-600"}>Loop</span>
        </Link>

        {/* Desktop links */}
        <div className={`hidden gap-8 text-sm font-medium sm:flex transition-colors duration-300 ${dark ? "text-slate-400" : "text-slate-400"}`}>
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative py-1 transition-all duration-200 ${
                  dark
                    ? `hover:text-white ${active ? "text-white" : ""}`
                    : `hover:text-slate-900 ${active ? "text-slate-900" : ""}`
                }`}
              >
                {label}
                {active && <span className={`absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full ${dark ? "bg-blue-400" : "bg-blue-600"}`} />}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <Link href="/contact" className={`hidden sm:block rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-all duration-300 hover:-translate-y-px ${
          dark ? "shadow-md shadow-blue-950/50" : "shadow-md shadow-blue-100 hover:shadow-lg hover:shadow-blue-200"
        }`}>
          Book a demo
        </Link>

        {/* Mobile: hamburger */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className={`flex sm:hidden h-9 w-9 items-center justify-center rounded-xl border transition-colors duration-200 ${
            dark ? "border-white/15 text-white hover:bg-white/10" : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {open ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-out border-t border-slate-100/70 bg-white/95 backdrop-blur-2xl ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 py-5 flex flex-col gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                {label}
              </Link>
            );
          })}
          <Link href="/contact" className="mt-3 rounded-full bg-blue-600 py-3 text-center text-sm font-semibold text-white hover:bg-blue-500 transition-colors duration-200">
            Book a free demo →
          </Link>
        </div>
      </div>
    </nav>
  );
}
