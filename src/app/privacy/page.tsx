
export const metadata = {
  title: "Privacy Policy — RingLoop",
  description: "How RingLoop collects, uses, and protects your personal data.",
};

export default function Privacy() {
  return (
      <main className="bg-paper pt-16 text-ink">
        <section className="relative overflow-hidden px-6 py-24 text-center">
          <div className="halo pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-3xl">
            <p className="label mb-4 text-blue">Legal</p>
            <h1 className="font-display mb-5 text-5xl md:text-6xl">Privacy Policy</h1>
            <p className="text-ink-soft">Last updated: 4 June 2025</p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="max-w-none space-y-10">

            <Block title="1. Who we are">
              <p>RingLoop (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a software service that provides an AI voice receptionist — answering forwarded calls, booking appointments, and sending appointment reminders — for medical institutes and appointment-based businesses. Our website is <a href="https://ringloop.net" className="text-blue hover:underline">ringloop.net</a>.</p>
              <p>For questions about this policy, contact us at <a href="mailto:hello@ringloop.net" className="text-blue hover:underline">hello@ringloop.net</a>.</p>
            </Block>

            <Block title="2. What data we collect">
              <p>We collect personal data in two contexts:</p>
              <ul className="list-disc pl-6 space-y-2 text-ink-soft">
                <li><strong>Website visitors:</strong> When you fill in the contact or demo request form we collect your name, clinic name, email address, and phone number (if provided).</li>
                <li><strong>End-patients of our clinic clients:</strong> When a patient calls a clinic that uses RingLoop, our system may process their phone number and the content of their WhatsApp conversation (name, appointment request, preferred times). This data is processed on behalf of the clinic operator, who is the data controller for their patients.</li>
                <li><strong>Analytics:</strong> We collect standard server logs and, where you consent, anonymised usage analytics via cookies.</li>
              </ul>
            </Block>

            <Block title="3. Legal basis for processing (GDPR)">
              <ul className="list-disc pl-6 space-y-2 text-ink-soft">
                <li><strong>Contract performance (Art. 6(1)(b)):</strong> Processing necessary to provide the RingLoop service to clinic clients.</li>
                <li><strong>Legitimate interests (Art. 6(1)(f)):</strong> Processing enquiry data to respond to demo requests.</li>
                <li><strong>Consent (Art. 6(1)(a)):</strong> Non-essential cookies and analytics, collected only when you accept via the cookie banner.</li>
              </ul>
            </Block>

            <Block title="4. How we use your data">
              <ul className="list-disc pl-6 space-y-2 text-ink-soft">
                <li>To respond to demo requests and sales enquiries.</li>
                <li>To operate the AI missed-call recovery service for clinic clients.</li>
                <li>To send appointment confirmation messages via WhatsApp on behalf of clinic clients.</li>
                <li>To improve our product using aggregated, anonymised analytics.</li>
              </ul>
              <p>We do not sell your data to any third party.</p>
            </Block>

            <Block title="5. Third-party processors">
              <p>To deliver the service we share data with the following processors, each bound by a Data Processing Agreement:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-ink-soft border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--line)]">
                      <th className="text-left py-2 pr-4 font-semibold text-ink">Processor</th>
                      <th className="text-left py-2 pr-4 font-semibold text-ink">Purpose</th>
                      <th className="text-left py-2 font-semibold text-ink">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {[
                      ["Twilio Inc.", "SMS & WhatsApp messaging", "USA (SCCs)"],
                      ["Anthropic PBC", "AI conversation processing", "USA (SCCs)"],
                      ["Vercel Inc.", "Website & API hosting", "USA (SCCs)"],
                    ].map(([name, purpose, location]) => (
                      <tr key={name}>
                        <td className="py-2 pr-4 font-medium">{name}</td>
                        <td className="py-2 pr-4">{purpose}</td>
                        <td className="py-2">{location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted mt-3">SCCs = EU Standard Contractual Clauses ensure GDPR-compliant transfers outside the EEA.</p>
            </Block>

            <Block title="6. Data retention">
              <ul className="list-disc pl-6 space-y-2 text-ink-soft">
                <li><strong>Lead/enquiry data:</strong> Retained for 12 months after last contact, then deleted.</li>
                <li><strong>WhatsApp conversation data:</strong> Retained for the duration of the clinic's subscription plus 30 days, then deleted.</li>
                <li><strong>Server logs:</strong> Retained for 90 days.</li>
              </ul>
            </Block>

            <Block title="7. Your rights under GDPR">
              <p>If you are in the EEA or UK you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-ink-soft">
                <li>Access the personal data we hold about you.</li>
                <li>Rectify inaccurate personal data.</li>
                <li>Request erasure (&ldquo;right to be forgotten&rdquo;).</li>
                <li>Restrict or object to processing.</li>
                <li>Data portability.</li>
                <li>Withdraw consent at any time (without affecting prior processing).</li>
                <li>Lodge a complaint with your local supervisory authority (in Croatia: <a href="https://azop.hr" className="text-blue hover:underline" target="_blank" rel="noopener noreferrer">AZOP</a>).</li>
              </ul>
              <p>To exercise any of these rights, email <a href="mailto:hello@ringloop.net" className="text-blue hover:underline">hello@ringloop.net</a> with the subject &ldquo;Data Rights Request&rdquo;. We will respond within 30 days.</p>
            </Block>

            <Block title="8. Cookies">
              <p>We use the following types of cookies:</p>
              <ul className="list-disc pl-6 space-y-2 text-ink-soft">
                <li><strong>Essential cookies:</strong> Required for the website to function. No consent needed.</li>
                <li><strong>Analytics cookies:</strong> Anonymised data to understand how visitors use the site. Only set with your consent.</li>
              </ul>
              <p>You can update your cookie preferences at any time by clearing your browser&rsquo;s cookies or clicking &ldquo;Cookie Settings&rdquo; in the footer.</p>
            </Block>

            <Block title="9. Security">
              <p>All data is transmitted over TLS (HTTPS). We apply access controls, keep dependencies up to date, and follow industry-standard security practices. Despite this, no system is completely secure; if you discover a vulnerability, please report it to <a href="mailto:hello@ringloop.net" className="text-blue hover:underline">hello@ringloop.net</a>.</p>
            </Block>

            <Block title="10. Changes to this policy">
              <p>We may update this policy from time to time. Material changes will be notified via the website. The &ldquo;Last updated&rdquo; date at the top of this page always reflects the most recent version.</p>
            </Block>

          </div>
        </section>
      </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display mb-4 text-2xl text-ink">{title}</h2>
      <div className="space-y-3 text-ink-soft leading-relaxed">{children}</div>
    </div>
  );
}
