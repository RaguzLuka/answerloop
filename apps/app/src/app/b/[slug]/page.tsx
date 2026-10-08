import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { and, asc, eq } from "drizzle-orm";
import { db, businesses, services } from "@/lib/db";
import { businessType } from "@/lib/business-types";
import { bookableDates } from "@/lib/slots";
import { formatPhone } from "@/lib/phone";
import { LogoMark } from "@/components/Logo";
import Icon from "@/components/Icon";
import { bookingCopy } from "@/lib/booking-i18n";
import BookingFlow from "./BookingFlow";

const getBusiness = cache(async (slug: string) => {
  const [biz] = await db.select().from(businesses).where(eq(businesses.slug, slug)).limit(1);
  return biz ?? null;
});

export async function generateMetadata({ params }: PageProps<"/b/[slug]">): Promise<Metadata> {
  const biz = await getBusiness((await params).slug);
  if (!biz) return { title: "Not found" };
  return {
    title: bookingCopy(biz.smsLanguage, biz.type, biz.name).title,
    description: `Pick a time at ${biz.name}${biz.city ? `, ${biz.city}` : ""}. Booking takes 30 seconds.`,
    robots: { index: false, follow: false },
  };
}

export default async function BookingPage({ params, searchParams }: PageProps<"/b/[slug]">) {
  const biz = await getBusiness((await params).slug);
  const ref = (await searchParams).r;
  if (!biz) notFound();
  const type = businessType(biz.type);
  const t = bookingCopy(biz.smsLanguage, biz.type, biz.name);
  const open = biz.bookingEnabled && biz.status !== "setup" && biz.status !== "paused";

  const list = open
    ? await db
        .select()
        .from(services)
        .where(and(eq(services.businessId, biz.id), eq(services.active, true)))
        .orderBy(asc(services.position))
    : [];

  return (
    <div className="pt-safe pb-safe min-h-dvh">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-xl items-center gap-4 px-5 py-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky text-blue">
            <Icon name={type.icon} className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h1 className="font-display truncate text-xl">{biz.name}</h1>
            <p className="truncate text-sm text-muted">
              {[t.typeLabel, [biz.address, biz.city].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5 pb-16 pt-6">
        {open && list.length ? (
          <BookingFlow
            slug={biz.slug}
            businessName={biz.name}
            services={list.map((s) => ({ id: s.id, name: s.name, durationMin: s.durationMin, priceCents: s.priceCents }))}
            dates={bookableDates(biz)}
            lang={biz.smsLanguage}
            typeId={biz.type}
            refToken={typeof ref === "string" && /^[A-Za-z0-9_-]{6,20}$/.test(ref) ? ref : undefined}
          />
        ) : (
          <div className="card p-6 text-center">
            <p className="font-semibold">{t.unavailable}</p>
            {biz.phone && (
              <a href={`tel:${biz.phone}`} className="btn btn-primary mt-4">
                <Icon name="phone" className="h-4 w-4" /> {t.call} {formatPhone(biz.phone)}
              </a>
            )}
          </div>
        )}
      </main>

      <footer className="pb-8 text-center text-xs text-muted">
        <a href="https://www.ringloop.net" className="inline-flex items-center gap-1.5 hover:text-blue">
          <LogoMark size={14} /> {t.footer}
        </a>
      </footer>
    </div>
  );
}
