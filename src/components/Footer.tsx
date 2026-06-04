import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="mb-3 text-xl font-bold">Ring<span className="text-blue-600">loop</span></p>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI-powered missed call recovery for medical institutes and appointment-based businesses.
            </p>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Product</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/how-it-works" className="hover:text-black transition-colors">How it works</Link></li>
              <li><Link href="/#features" className="hover:text-black transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Industries</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Dental Clinics</li>
              <li>Aesthetic Clinics</li>
              <li>General Practices</li>
              <li>Physiotherapy</li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Contact</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="mailto:hello@ringloop.net" className="hover:text-black transition-colors">hello@ringloop.net</a></li>
              <li><a href="https://wa.me/14788003855" className="hover:text-black transition-colors">WhatsApp us</a></li>
              <li><Link href="/contact" className="hover:text-black transition-colors">Book a demo</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-100 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Ringloop. All rights reserved.</p>
          <div className="flex items-center gap-5 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <span>·</span>
            <p>Built for medical institutes across Europe 🇪🇺</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
