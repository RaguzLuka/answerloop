import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ringloop.net"),
  title: {
    default: "RingLoop — AI missed call recovery for medical clinics",
    template: "%s — RingLoop",
  },
  description:
    "RingLoop follows up every missed call with an AI that chats on WhatsApp, qualifies the patient, and books the appointment automatically. €200/month, no contract.",
  keywords: ["missed call recovery", "AI receptionist", "medical clinic", "WhatsApp booking", "appointment booking", "dental clinic AI"],
  openGraph: {
    title: "RingLoop — AI missed call recovery for medical clinics",
    description: "Your clinic misses calls. RingLoop books them. An AI receptionist that follows up every missed call via WhatsApp, 24/7.",
    url: "https://ringloop.net",
    siteName: "RingLoop",
    type: "website",
    locale: "en_EU",
  },
  twitter: {
    card: "summary_large_image",
    title: "RingLoop — AI missed call recovery for medical clinics",
    description: "Your clinic misses calls. RingLoop books them. An AI receptionist that follows up every missed call via WhatsApp, 24/7.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: "6Crkty_au9n6QFAPhxX4IkcGfAZriGCksXweub5AkGQ",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* Nav lives here — outside template.tsx so fixed positioning never breaks */}
        <Nav />
        {children}
        <Footer />
        <WhatsAppButton />
        <BackToTop />
        <CookieBanner />
      </body>
    </html>
  );
}
