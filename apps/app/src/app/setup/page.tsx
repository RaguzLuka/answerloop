import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getBusinessFor, getServices, isAdmin, requireUser } from "@/lib/dal";
import { appUrl } from "@/lib/email";
import { logout } from "@/lib/actions/auth";
import { Wordmark } from "@/components/Logo";
import { HaloSays, type HaloPose } from "@/components/Halo";
import Icon from "@/components/Icon";
import BasicsForm from "@/components/business-forms/BasicsForm";
import HoursForm from "@/components/business-forms/HoursForm";
import ServicesForm from "@/components/business-forms/ServicesForm";
import MessageForm from "@/components/business-forms/MessageForm";
import ForwardingGuide from "@/components/ForwardingGuide";
import VisitRequestForm from "@/components/VisitRequestForm";
import FinishStep from "./FinishStep";
import ConnectionsPanel from "@/components/ConnectionsPanel";
import { continueFromConnect } from "@/lib/actions/connections";
import { SubmitButton } from "@/components/form";

export const metadata: Metadata = { title: "Set up RingLoop" };

const STEPS: { title: string; halo: HaloPose; say: React.ReactNode }[] = [
  { title: "Your business", halo: "wave", say: <>Let&apos;s start with the basics. What&apos;s your business called?</> },
  { title: "Opening hours", halo: "talk", say: <>When are you open? I&apos;ll only offer times inside these hours.</> },
  { title: "Services", halo: "booking", say: <>What can customers book? I&apos;ve filled in a few to start, so change anything you like.</> },
  { title: "Your text-back", halo: "listen", say: <>This is the text I send when you miss a call. Make it sound like you.</> },
  { title: "Connect", halo: "talk", say: <>Connect your WhatsApp and calendar, or skip this and do it later.</> },
  { title: "Go live", halo: "happy", say: <>Almost done! Here&apos;s how your missed calls will reach me.</> },
];

export default async function SetupPage({ searchParams }: { searchParams: Promise<{ step?: string; visit?: string; google?: string }> }) {
  const user = await requireUser();
  const row = await getBusinessFor(user.id);
  const business = row?.business ?? null;
  if (business && business.status !== "setup") redirect("/dashboard");

  const maxStep = business ? business.setupStep : 1;
  const query = await searchParams;
  const asked = Number(query.step) || maxStep;
  const visit = query.visit === "1" && !!business;
  const step = Math.min(Math.max(1, asked), maxStep);
  const meta = STEPS[step - 1];
  const bookingLink = business ? `${appUrl()}/b/${business.slug}` : "";
  const services = business ? await getServices(business.id) : [];

  return (
    <div className="pt-safe pb-safe min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Wordmark />
          <div className="flex items-center gap-1">
            {isAdmin(user.email) && (
              <Link href="/admin" className="btn btn-quiet btn-sm">Admin</Link>
            )}
            <form action={logout}>
              <button className="btn btn-quiet btn-sm">Sign out</button>
            </form>
          </div>
        </div>
        <nav aria-label="Setup progress" className="mx-auto max-w-3xl px-5 pb-3">
          <ol className="flex gap-1.5">
            {STEPS.map((s, i) => {
              const n = i + 1;
              const reachable = n <= maxStep;
              const bar = (
                <span
                  className={`block h-1.5 rounded-full ${n < step || (n <= maxStep && n !== step) ? "bg-blue" : n === step ? "bg-blue/60" : "bg-line"}`}
                />
              );
              return (
                <li key={s.title} className="flex-1">
                  {reachable ? (
                    <Link href={`/setup?step=${n}`} aria-label={`Step ${n}: ${s.title}`} aria-current={n === step ? "step" : undefined}>
                      {bar}
                    </Link>
                  ) : (
                    bar
                  )}
                </li>
              );
            })}
          </ol>
          <p className="mt-2 text-xs font-medium text-muted">
            Step {step} of {STEPS.length} · {meta.title}
          </p>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-6">
        {visit && business ? (
          <>
            <div className="mb-6">
              <HaloSays pose="happy">
                No problem! Tell us when suits you and someone from RingLoop will come over and set everything up with you.
              </HaloSays>
            </div>
            <h1 className="font-display mb-6 text-3xl">We&apos;ll come over</h1>
            <VisitRequestForm
              defaults={{
                contactName: user.name,
                contactPhone: business.phone,
                address: [business.address, business.city].filter(Boolean).join(", "),
              }}
              onDone={
                <Link href={`/setup?step=${maxStep}`} className="btn btn-primary">
                  Back to setup <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              }
            />
            <div className="mt-8 border-t border-line pt-5">
              <Link href={`/setup?step=${maxStep}`} className="btn btn-quiet btn-sm">
                <Icon name="arrowLeft" className="h-4 w-4" /> Back to setup
              </Link>
            </div>
          </>
        ) : (
          <>
        <div className="mb-6">
          <HaloSays pose={meta.halo}>{meta.say}</HaloSays>
        </div>

        <h1 className="font-display mb-6 text-3xl">{meta.title}</h1>

        {step === 1 && <BasicsForm business={business} mode="setup" />}
        {step === 2 && business && <HoursForm business={business} mode="setup" />}
        {step === 3 && business && <ServicesForm business={business} services={services} mode="setup" />}
        {step === 4 && business && <MessageForm business={business} bookingLink={bookingLink} mode="setup" />}
        {step === 5 && business && (
          <div className="space-y-6">
            <ConnectionsPanel business={business} back="/setup?step=5" notice={query.google} />
            <form action={continueFromConnect} className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
              <SubmitButton pendingText="…">
                Continue <Icon name="arrowRight" className="h-4 w-4" />
              </SubmitButton>
              <span className="text-sm text-muted">You can connect these later in Settings.</span>
            </form>
          </div>
        )}
        {step === 6 && business && (
          <FinishStep
            bookingLink={bookingLink}
            visitDefaults={{
              contactName: user.name,
              contactPhone: business.phone,
              address: [business.address, business.city].filter(Boolean).join(", "),
            }}
            forwarding={<ForwardingGuide number={business.ringloopNumber} />}
          />
        )}

        {step > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <Link href={`/setup?step=${step - 1}`} className="btn btn-quiet btn-sm">
              <Icon name="arrowLeft" className="h-4 w-4" /> Back
            </Link>
            {step < 6 && (
              <Link href="/setup?visit=1" className="text-sm font-medium text-blue">
                Rather have us come over and do it?
              </Link>
            )}
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
}
