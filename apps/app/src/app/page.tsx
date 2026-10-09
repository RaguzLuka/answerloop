import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser, homeFor } from "@/lib/dal";
import { Wordmark } from "@/components/Logo";
import Halo from "@/components/Halo";
import Icon from "@/components/Icon";
import InstallApp from "@/components/InstallApp";

/* Signed out: what the app is + get it. Signed in: straight into the app. */
export default async function Welcome() {
  const user = await getUser();
  if (user) redirect(await homeFor(user));

  const steps = [
    {
      icon: "smartphone",
      title: "Get the app & sign up",
      body: "Add RingLoop to your phone's home screen and create your account. No contract, no new phone number for your customers.",
    },
    {
      icon: "settings",
      title: "Set it up yourself",
      body: "Halo walks you through it: your hours, services and the text your callers get. About 5 minutes.",
    },
    {
      icon: "van",
      title: "…or we come over",
      body: "Prefer a hand? Ask for a visit and we'll set everything up with you at your place, and show your team.",
    },
  ];

  return (
    <div className="pt-safe pb-safe">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Wordmark />
        <Link href="/login" className="btn btn-quiet btn-sm">Sign in</Link>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-16">
        <section className="grid items-center gap-8 py-8 md:grid-cols-[1.2fr_1fr] md:py-14">
          <div>
            <p className="label mb-4 text-blue">RingLoop for business</p>
            <h1 className="font-display text-[2.4rem] leading-[1.05] sm:text-5xl">
              Your missed calls, <em>booked.</em>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
              When you can&apos;t pick up, RingLoop texts the caller your booking link within seconds. They pick a time and you
              see it in the app. Set it up yourself, or ask us to come over.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="btn btn-primary">
                Create your account <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <Link href="/login" className="btn btn-secondary">I already have an account</Link>
            </div>
            <p className="mt-3 text-sm text-muted">Free for 30 days, no card needed.</p>
          </div>
          <div className="relative mx-auto flex aspect-square w-full max-w-[300px] items-center justify-center">
            <div className="absolute inset-6 rounded-full bg-gradient-to-b from-sky to-white" />
            <Halo pose="wave" size={280} priority className="relative" />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="card p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky text-blue">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <span className="label">Step {i + 1}</span>
              </div>
              <h2 className="font-display text-lg">{s.title}</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
        </section>

        <section id="install" className="card mt-4 grid gap-6 p-6 md:grid-cols-[1fr_1.2fr] md:p-8">
          <div>
            <h2 className="font-display text-2xl">Put RingLoop on your phone</h2>
            <p className="mt-2 text-ink-soft">
              It installs straight from your browser, with no app store needed. It opens full-screen like any other app and
              updates itself.
            </p>
          </div>
          <InstallApp />
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 py-6 text-sm text-muted sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} RingLoop</span>
          <span className="flex gap-4">
            <a href="https://www.ringloop.net" className="hover:text-blue">ringloop.net</a>
            <a href="https://www.ringloop.net/privacy" className="hover:text-blue">Privacy</a>
            <a href="mailto:hello@ringloop.net" className="hover:text-blue">hello@ringloop.net</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
