import PageHero from "@/components/PageHero";


export const metadata = {
  title: "Privacy Policy",
  description: "How RingLoop collects, uses, and protects your personal data.",
};

export default function Privacy() {
  return (
      <main className="overflow-x-clip bg-paper text-ink">
        <PageHero eyebrow="Legal" icon="shieldCheck" title="Privacy Policy" sub="Last updated: 1 October 2026" />

        <section className="mx-auto max-w-3xl px-6 pb-24">
          <div className="card max-w-none space-y-10 p-8 md:p-12">

            <Block title="1. Who we are">
              <p>RingLoop (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a software service that provides SMS automation — texting back missed calls, booking appointments by text, and sending appointment confirmations and reminders — for appointment-based businesses such as salons, barbershops, restaurants and medical practices. Our website is <a href="https://ringloop.net" className="text-blue hover:underline">ringloop.net</a>.</p>
              <p>For questions about this policy, contact us at <a href="mailto:hello@ringloop.net" className="text-blue hover:underline">hello@ringloop.net</a>.</p>
            </Block>

            <Block title="2. What data we collect">
              <p>We collect personal data in two contexts:</p>
              <ul className="list-disc pl-6 space-y-2 text-ink-soft">
                <li><strong>Website visitors:</strong> When you fill in the contact or demo request form we collect your name, business name and type, email address, and phone number (if provided).</li>
                <li><strong>Customers of our business clients:</strong> When someone&rsquo;s call to a business that uses RingLoop goes unanswered, or when they text that business, our system may process their phone number and the content of their SMS conversation (name, booking request, preferred times). This data is processed on behalf of the business, which is the data controller for its customers.</li>
                <li><strong>Website demo:</strong> Messages you type into the live demo on our website are sent to our AI provider to generate replies. Please don&rsquo;t enter real personal data — the demo uses fictional businesses. We don&rsquo;t store demo conversations.</li>
                <li><strong>Analytics:</strong> We collect standard server logs and, where you consent, anonymised usage analytics via cookies.</li>
              </ul>
            </Block>

            <Block title="3. Legal basis for processing (GDPR)">
              <ul className="list-disc pl-6 space-y-2 text-ink-soft">
                <li><strong>Contract performance (Art. 6(1)(b)):</strong> Processing necessary to provide the RingLoop service to business clients.</li>
                <li><strong>Legitimate interests (Art. 6(1)(f)):</strong> Processing enquiry data to respond to demo requests.</li>
                <li><strong>Consent (Art. 6(1)(a)):</strong> Non-essential cookies and analytics, collected only when you accept via the cookie banner.</li>
              </ul>
            </Block>

            <Block title="4. How we use your data">
              <ul className="list-disc pl-6 space-y-2 text-ink-soft">
                <li>To respond to demo requests and sales enquiries.</li>
                <li>To operate the missed-call text-back and SMS booking service for business clients.</li>
                <li>To send booking confirmations and reminders by SMS on behalf of business clients.</li>
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
                      ["Twilio Inc.", "SMS messaging & call forwarding", "USA (SCCs)"],
                      ["OpenAI, L.L.C.", "AI conversation processing", "USA (SCCs)"],
                      ["Vercel Inc.", "Website & API hosting", "USA (SCCs)"],
                      ["Resend, Inc.", "Email delivery for enquiries", "USA (SCCs)"],
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
                <li><strong>SMS conversation data:</strong> Retained for the duration of the business client&rsquo;s subscription plus 30 days, then deleted.</li>
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

            <Block title="8. Cookies" id="cookies">
              <p>We use the following types of cookies:</p>
              <ul className="list-disc pl-6 space-y-2 text-ink-soft">
                <li><strong>Essential cookies:</strong> Required for the website to function. No consent needed.</li>
                <li><strong>Analytics cookies:</strong> Anonymised data to understand how visitors use the site. Only set with your consent.</li>
              </ul>
              <p>You can update your cookie preferences at any time by clicking &ldquo;Cookie settings&rdquo; in the footer.</p>
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

function Block({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="font-display mb-4 text-2xl text-ink">{title}</h2>
      <div className="space-y-3 text-ink-soft leading-relaxed">{children}</div>
    </div>
  );
}
