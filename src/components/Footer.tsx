import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import Icon from "@/components/Icon";

const INSTAGRAM_URL = "https://instagram.com/ringloop.io";

export default function Footer() {
  return (
    <footer className="relative bg-night text-sky/55">
      <div className="rule-blue" />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">

          {/* Brand */}
          <div className="col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <LogoMark size={30} />
              <p className="font-display text-[1.35rem] tracking-tight text-white">
                Ring<em className="text-[#7fa6f8]">Loop</em>
              </p>
            </div>
            <p className="text-sm leading-relaxed text-sky/45">
              The AI voice receptionist for medical clinics. Answers every missed call, books the appointment, and confirms it by SMS — 24/7.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="label mb-5 text-sky/35">Product</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="/demo"         className="hover:text-white transition-colors">Live demo</Link></li>
              <li><Link href="/#features"    className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing"      className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="label mb-5 text-sky/35">Company</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about"   className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="label mb-5 text-sky/35">Get in touch</p>
            <ul className="space-y-3 text-sm">
              <li><a href="mailto:hello@ringloop.net" className="hover:text-white transition-colors">hello@ringloop.net</a></li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <Icon name="instagram" className="h-4 w-4" />
                  @ringloop.io
                </a>
              </li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Book a demo</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-[var(--line-dark)] pt-7 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-sky/35">© {new Date().getFullYear()} RingLoop. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RingLoop on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-dark)] text-sky/55 transition-colors hover:border-[#7fa6f8]/50 hover:text-white"
            >
              <Icon name="instagram" className="h-4.5 w-4.5" />
            </a>
            <p className="text-xs text-sky/35">Built for medical institutes across Europe &amp; the US</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
