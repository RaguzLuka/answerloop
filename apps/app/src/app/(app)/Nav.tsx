"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";

const LINKS = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/bookings", label: "Bookings", icon: "calendar" },
  { href: "/help", label: "Help", icon: "help" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

export function SideNav({ admin }: { admin: boolean }) {
  const path = usePathname();
  const links = admin ? [...LINKS, { href: "/admin", label: "Admin", icon: "shield" }] : LINKS;
  return (
    <nav className="mt-6 flex flex-col gap-1" aria-label="Main">
      {links.map((l) => {
        const active = isActive(path, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] font-medium transition ${
              active ? "bg-white text-blue shadow-[0_1px_2px_rgba(12,27,56,0.06)] ring-1 ring-line" : "text-ink-soft hover:bg-white hover:text-ink"
            }`}
          >
            <Icon name={l.icon} className="h-5 w-5" />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomTabs() {
  const path = usePathname();
  return (
    <nav
      aria-label="Main"
      className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur md:hidden"
    >
      <div className="grid grid-cols-4">
        {LINKS.map((l) => {
          const active = isActive(path, l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 pb-2 pt-2.5 text-[11px] font-semibold ${active ? "text-blue" : "text-muted"}`}
            >
              <Icon name={l.icon} className="h-[22px] w-[22px]" strokeWidth={active ? 2.2 : 1.8} />
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
