"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/",            label: "Home" },
  { href: "/how-it-works",label: "How it works" },
  { href: "/pricing",     label: "Pricing" },
  { href: "/contact",     label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-2xl border-b border-gray-100/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo — always takes you home */}
        <Link
          href="/"
          className="text-[1.2rem] font-bold tracking-tight select-none transition-opacity duration-200 hover:opacity-75"
        >
          Ring<span className="text-blue-600">Loop</span>
        </Link>

        {/* Links */}
        <div className="hidden gap-8 text-sm font-medium text-gray-400 sm:flex">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative py-1 transition-all duration-200 hover:text-gray-900 ${
                  active ? "text-gray-900" : ""
                }`}
              >
                {label}
                {active && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          href="/contact"
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-all duration-300 shadow-md shadow-blue-100 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-px"
        >
          Book a demo
        </Link>
      </div>
    </nav>
  );
}
