"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Ring<span className="text-blue-600">loop</span>
        </Link>
        <div className="hidden gap-8 text-sm font-medium text-gray-500 sm:flex">
          <Link href="/how-it-works" className={`hover:text-black transition-colors ${pathname === "/how-it-works" ? "text-black" : ""}`}>How it works</Link>
          <Link href="/#features" className="hover:text-black transition-colors">Features</Link>
          <Link href="/#industries" className="hover:text-black transition-colors">Industries</Link>
          <Link href="/pricing" className={`hover:text-black transition-colors ${pathname === "/pricing" ? "text-black" : ""}`}>Pricing</Link>
          <Link href="/contact" className={`hover:text-black transition-colors ${pathname === "/contact" ? "text-black" : ""}`}>Contact</Link>
        </div>
        <Link href="/contact" className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          Book a demo
        </Link>
      </div>
    </nav>
  );
}
