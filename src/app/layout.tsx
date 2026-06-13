import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import Reveal from "@/components/Reveal";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ringloop.net"),
  title: {
    default: "RingLoop — AI voice receptionist for medical clinics",
    template: "%s — RingLoop",
  },
  description:
    "RingLoop answers your clinic's missed calls with a natural AI voice, books the appointment on the spot, and confirms it to the patient by SMS. Pricing tailored to your clinic, no contract.",
  keywords: ["AI receptionist", "AI voice agent", "medical clinic", "missed call recovery", "appointment booking", "dental clinic AI", "clinic phone answering"],
  openGraph: {
    title: "RingLoop — AI voice receptionist for medical clinics",
    description: "Your clinic misses calls. RingLoop answers them. An AI receptionist that picks up every forwarded call, books appointments by voice, and reminds patients on WhatsApp — 24/7.",
    url: "https://www.ringloop.net",
    siteName: "RingLoop",
    type: "website",
    locale: "en_EU",
  },
  twitter: {
    card: "summary_large_image",
    title: "RingLoop — AI voice receptionist for medical clinics",
    description: "Your clinic misses calls. RingLoop answers them. An AI receptionist that books appointments by voice, 24/7.",
  },
  alternates: { canonical: "./" },
  robots: { index: true, follow: true },
  verification: {
    google: "6Crkty_au9n6QFAPhxX4IkcGfAZriGCksXweub5AkGQ",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.ringloop.net/#organization",
      name: "RingLoop",
      url: "https://www.ringloop.net",
      email: "hello@ringloop.net",
      description: "AI voice receptionist for medical clinics. Answers missed calls, books appointments by voice, and sends WhatsApp reminders.",
      areaServed: "Europe",
    },
    {
      "@type": "Service",
      name: "RingLoop AI Voice Receptionist",
      provider: { "@id": "https://www.ringloop.net/#organization" },
      serviceType: "AI phone answering and appointment booking for medical clinics",
      areaServed: "Europe",
      offers: {
        "@type": "Offer",
        description: "Pricing tailored to each clinic — on request. No setup fee, no contract.",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Nav lives here — outside template.tsx so fixed positioning never breaks */}
        <Nav />
        <Reveal />
        {children}
        <Footer />
        <WhatsAppButton />
        <BackToTop />
        <CookieBanner />
      </body>
    </html>
  );
}
