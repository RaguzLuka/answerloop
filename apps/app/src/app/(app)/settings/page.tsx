import type { Metadata } from "next";
import Link from "next/link";
import { getServices, requireBusiness } from "@/lib/dal";
import { appUrl } from "@/lib/email";
import { businessType } from "@/lib/business-types";
import BasicsForm from "@/components/business-forms/BasicsForm";
import HoursForm from "@/components/business-forms/HoursForm";
import ServicesForm from "@/components/business-forms/ServicesForm";
import MessageForm from "@/components/business-forms/MessageForm";
import ForwardingGuide from "@/components/ForwardingGuide";
import InstallApp from "@/components/InstallApp";
import Icon from "@/components/Icon";
import PushToggle from "@/components/PushToggle";
import { aiEnabled } from "@/lib/ai";
import { BookingSettingsForm, ProfileForm, PasswordForm, TestSmsForm } from "./forms";

export const metadata: Metadata = { title: "Settings" };

const SECTIONS = [
  { id: "business", label: "Business", icon: "store" },
  { id: "hours", label: "Hours", icon: "clock" },
  { id: "services", label: "Services", icon: "calendar" },
  { id: "message", label: "Text-back", icon: "message" },
  { id: "booking", label: "Booking & texts", icon: "link" },
  { id: "phone", label: "Phone", icon: "phoneForwarded" },
  { id: "app", label: "App", icon: "smartphone" },
  { id: "account", label: "Account", icon: "user" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { user, business } = await requireBusiness();
  const s = (await searchParams).s;
  const section: SectionId = SECTIONS.some((x) => x.id === s) ? (s as SectionId) : "business";
  const words = businessType(business.type).words;
  const bookingLink = `${appUrl()}/b/${business.slug}`;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Settings</h1>

      <nav aria-label="Settings sections" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="flex w-max gap-1.5 sm:w-auto sm:flex-wrap">
          {SECTIONS.map((x) => (
            <li key={x.id}>
              <Link
                href={`/settings?s=${x.id}`}
                aria-current={section === x.id ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                  section === x.id ? "bg-ink text-white" : "border border-line bg-white text-ink-soft hover:text-ink"
                }`}
              >
                <Icon name={x.icon} className="h-4 w-4" />
                {x.id === "services" ? words.services[0].toUpperCase() + words.services.slice(1) : x.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="card p-5 sm:p-6">
        {section === "business" && <BasicsForm business={business} mode="settings" />}
        {section === "hours" && <HoursForm business={business} mode="settings" />}
        {section === "services" && (
          <ServicesForm business={business} services={await getServices(business.id)} mode="settings" />
        )}
        {section === "message" && (
          <div className="space-y-8">
            <MessageForm business={business} bookingLink={bookingLink} mode="settings" />
            <TestSmsForm defaultTo={business.phone.startsWith("+3859") ? business.phone : ""} />
          </div>
        )}
        {section === "booking" && <BookingSettingsForm business={business} bookingLink={bookingLink} aiOn={aiEnabled()} />}
        {section === "phone" && (
          <div className="space-y-4">
            <h2 className="font-display text-xl">Call forwarding</h2>
            <ForwardingGuide number={business.ringloopNumber} />
          </div>
        )}
        {section === "app" && (
          <div className="space-y-4">
            <h2 className="font-display text-xl">Get the app on your phone</h2>
            <p className="text-ink-soft">Install RingLoop on every phone at the counter. Each person signs in with your account.</p>
            <InstallApp />
            <PushToggle publicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null} />
          </div>
        )}
        {section === "account" && (
          <div className="space-y-10">
            <ProfileForm name={user.name} email={user.email} />
            <PasswordForm />
          </div>
        )}
      </section>
    </div>
  );
}
