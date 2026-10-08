import Link from "next/link";
import { isAdmin, requireBusiness } from "@/lib/dal";
import { logout } from "@/lib/actions/auth";
import { businessType } from "@/lib/business-types";
import { Wordmark } from "@/components/Logo";
import Icon from "@/components/Icon";
import { BottomTabs, SideNav } from "./Nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, business } = await requireBusiness();
  const admin = isAdmin(user.email);

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[248px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-white/60 px-4 py-5 md:flex">
        <Link href="/dashboard" className="px-2">
          <Wordmark />
        </Link>
        <div className="mt-6 rounded-xl bg-sky/70 px-3 py-2.5">
          <p className="truncate text-sm font-semibold">{business.name}</p>
          <p className="truncate text-xs text-muted">{businessType(business.type).label}{business.city ? ` · ${business.city}` : ""}</p>
        </div>
        <SideNav admin={admin} />
        <div className="mt-auto border-t border-line pt-4">
          <p className="truncate px-2 text-sm font-medium">{user.name}</p>
          <p className="truncate px-2 text-xs text-muted">{user.email}</p>
          <form action={logout} className="mt-2">
            <button className="btn btn-quiet btn-sm w-full justify-start">
              <Icon name="logout" className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Phone header */}
      <header className="pt-safe sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Wordmark size={26} />
          <span className="max-w-[45%] truncate text-sm font-medium text-ink-soft">{business.name}</span>
        </div>
      </header>

      <main className="min-w-0 px-4 pb-28 pt-5 sm:px-6 md:px-10 md:pb-16 md:pt-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>

      <BottomTabs />
    </div>
  );
}
