import Link from "next/link";
import { Wordmark } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-safe pb-safe flex min-h-dvh flex-col">
      <header className="px-5 py-4">
        <Link href="/" aria-label="RingLoop home">
          <Wordmark />
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-5 pb-16 pt-4 sm:items-center sm:pt-0">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
