import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import Icon from "@/components/Icon";
import CookieSettingsButton from "@/components/CookieSettingsButton";

const INSTAGRAM_URL = "https://instagram.com/ringloop.io";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/#features",    label: "Features" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/demo",         label: "Live demo" },
      { href: "/pricing",      label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about",   label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-night text-sky/60">
      <div className="rule-blue" />

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pb-10">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="mb-4 flex items-center gap-2.5">
              <LogoMark size={30} />
              <p className="font-display text-[1.3rem] tracking-tight text-white">
                Ring<em>Loop</em>
              </p>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-sky/50">
              SMS automation for small businesses. RingLoop texts back every missed call, books the
              customer in by text, and sends the reminders that keep your calendar full.
            </p>
            <Link href="/contact" className="btn-primary group mt-7 px-5 py-2.5 text-sm">
              Book a free demo <span className="arrow">→</span>
            </Link>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="label mb-5 text-sky/35">{col.title}</p>
                <ul className="space-y-3 text-sm">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="label mb-5 text-sky/35">Get in touch</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="mailto:hello@ringloop.net" className="inline-flex items-center gap-2 transition-colors hover:text-white">
                    <Icon name="mail" className="h-4 w-4" />
                    hello@ringloop.net
                  </a>
                </li>
                <li>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-white"
                  >
                    <Icon name="instagram" className="h-4 w-4" />
                    @ringloop.io
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--line-dark)] pt-7 text-xs text-sky/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RingLoop · SMS automation for small businesses</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <CookieSettingsButton className="transition-colors hover:text-white" />
            <span>Made in Croatia for businesses across Europe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
