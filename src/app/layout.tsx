import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import FloatingDemoButton from "@/components/FloatingDemoButton";
import BackToTop from "@/components/BackToTop";
import Reveal from "@/components/Reveal";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const TITLE = "RingLoop — Missed-call text-back & SMS booking for small businesses";
const DESCRIPTION =
  "RingLoop texts back every missed call within seconds, books the customer in a two-way AI text conversation, and sends reminders that cut no-shows. For salons, barbershops, nail studios, restaurants, clinics and more — keep your number, no contract.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ringloop.net"),
  title: {
    default: TITLE,
    template: "%s — RingLoop",
  },
  description: DESCRIPTION,
  keywords: [
    "missed call text back",
    "SMS automation for small business",
    "AI SMS booking",
    "salon booking by text",
    "barbershop booking SMS",
    "nail salon appointments",
    "restaurant reservations by text",
    "appointment reminders SMS",
    "reduce no-shows",
    "clinic SMS reminders",
  ],
  openGraph: {
    title: TITLE,
    description:
      "Your business misses calls. RingLoop texts them back in seconds and books them in by SMS — 24/7, under your business name.",
    url: "https://www.ringloop.net",
    siteName: "RingLoop",
    type: "website",
    locale: "en_EU",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "Missed call? RingLoop texts the caller back in seconds and books them in by SMS — 24/7.",
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
      description:
        "SMS automation for small businesses: missed-call text-back, AI booking by text, confirmations and reminders.",
      areaServed: "Europe",
    },
    {
      "@type": "Service",
      name: "RingLoop SMS automation",
      provider: { "@id": "https://www.ringloop.net/#organization" },
      serviceType: "Missed-call text-back and SMS booking for salons, restaurants, clinics and other appointment-based businesses",
      areaServed: "Europe",
      offers: [
        { "@type": "Offer", name: "Start", price: "59", priceCurrency: "EUR", url: "https://www.ringloop.net/pricing" },
        { "@type": "Offer", name: "Pro", price: "149", priceCurrency: "EUR", url: "https://www.ringloop.net/pricing" },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        {/* Without JavaScript, scroll-reveal content must still be visible */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Nav lives here — outside template.tsx so fixed positioning never breaks */}
        <Nav />
        <Reveal />
        {children}
        <Footer />
        <FloatingDemoButton />
        <BackToTop />
        <CookieBanner />
      </body>
    </html>
  );
}
