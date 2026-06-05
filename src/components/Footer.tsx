import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#060e1f] text-gray-400">
      {/* Top gradient rule */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-800/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-black">R</span>
              <p className="text-lg font-bold text-white">Ring<span className="text-blue-400">loop</span></p>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              AI-powered missed call recovery for medical institutes and appointment-based businesses.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Product</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="/#features"    className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing"      className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Industries</p>
            <ul className="space-y-2.5 text-sm">
              {["Dental Clinics","Aesthetic Clinics","General Practices","Physiotherapy"].map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">Contact</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="mailto:hello@ringloop.net" className="hover:text-white transition-colors">hello@ringloop.net</a></li>
              <li><a href="https://wa.me/14788003855"  className="hover:text-white transition-colors">WhatsApp us</a></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Book a demo</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-white/5 pt-7 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} Ringloop. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <span>Built for medical institutes across Europe 🇪🇺</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
