import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import ServiceWorker from "@/components/ServiceWorker";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-display", subsets: ["latin", "latin-ext"], weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: "RingLoop for business", template: "%s · RingLoop" },
  description: "Turn missed calls into bookings — set up RingLoop yourself in minutes, or we'll come over and do it with you.",
  applicationName: "RingLoop",
  appleWebApp: { capable: true, title: "RingLoop", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f9fc",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper text-ink">
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
