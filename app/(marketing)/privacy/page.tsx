import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Rydora Mobility Limited Privacy Policy explaining how we collect, use, protect, and manage your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section
        style={{ backgroundColor: "var(--surface-base)" }}
        className="pt-40 pb-16"
        aria-label="Privacy Policy"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
            style={{
              fontFamily: "var(--font-data)",
              color: "var(--brand-primary)",
            }}
          >
            Privacy Policy
          </p>
          <h1
            className="text-5xl lg:text-[72px] font-black leading-[1.04] tracking-tight max-w-3xl mb-6"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--ink-strong)",
            }}
          >
            Your data. Your trust. Our responsibility.
          </h1>
          <p
            className="text-xl leading-relaxed max-w-3xl"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--ink-body)",
            }}
          >
            At Rydora Mobility Limited, we collect, use, protect and manage your
            information with transparency, care and purpose. This Privacy Policy
            explains how we handle your data across our website, platforms,
            applications and mobility services.
          </p>
        </div>
      </section>

      <section
        style={{ backgroundColor: "var(--surface-base)" }}
        className="pb-36"
        aria-label="Privacy policy details"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-16">
            <article className="prose prose-invert max-w-none">
              <h2>01 — Information we collect</h2>
              <p>
                Depending on how you interact with Rydora, we may collect
                information such as:
              </p>
              <h3>Personal Information</h3>
              <p>
                Name, phone number, email address, residential or business
                address, profile information, and account details.
              </p>
              <h3>Identity &amp; Verification Information</h3>
              <p>
                Government-issued identification, driver&apos;s licence, NIN,
                BVN, guarantor information, and other information required for
                verification and compliance.
              </p>
              <h3>Vehicle &amp; Fleet Information</h3>
              <p>
                Vehicle registration details, ownership documents, inspection
                records, maintenance information, vehicle assignments,
                operational data, and related records.
              </p>
              <h3>Transaction Information</h3>
              <p>
                Bank account details, payment information, transaction records,
                remittances, payouts, and related financial information.
              </p>
              <h3>Usage &amp; Location Information</h3>
              <p>
                Trip information, vehicle or device location where applicable,
                IP address, device information, browser information, cookies,
                and website or platform activity.
              </p>
            </article>

            <article className="prose prose-invert max-w-none">
              <h2>02 — How we use your information</h2>
              <p>We use information we collect to:</p>
              <ul>
                <li>Provide and manage Rydora&apos;s mobility and fleet-management services;</li>
                <li>Create and maintain user accounts;</li>
                <li>Verify drivers, vehicle owners, riders, and other users;</li>
                <li>Manage vehicles, trips, assignments, and fleet operations;</li>
                <li>Process payments, remittances, and payouts;</li>
                <li>Improve safety, security, and service performance;</li>
                <li>Prevent fraud, misuse, and unauthorized activity;</li>
                <li>Provide customer support and service communications;</li>
                <li>Improve our technology, products, and user experience; and</li>
                <li>Meet applicable legal and regulatory requirements.</li>
              </ul>
            </article>

            <article className="prose prose-invert max-w-none">
              <h2>03 — How we share information</h2>
              <p>
                Rydora may share necessary information with trusted service
                providers, payment processors, identity-verification providers,
                technology partners, drivers, riders, vehicle owners, corporate
                clients, professional advisers, regulators, or government
                authorities where necessary or legally permitted.
              </p>
              <p>
                <strong>Rydora does not sell your personal information.</strong>
              </p>
              <p>
                We only seek to share information that is reasonably necessary
                for the relevant purpose.
              </p>
            </article>

            <article className="prose prose-invert max-w-none">
              <h2>04 — Data security</h2>
              <p>
                We use reasonable technical and organizational safeguards
                designed to protect your information against unauthorized
                access, loss, misuse, alteration, or disclosure.
              </p>
              <p>
                While we take security seriously, no digital platform or internet
                transmission can be guaranteed to be completely secure.
              </p>
            </article>

            <article className="prose prose-invert max-w-none">
              <h2>05 — Cookies &amp; technology</h2>
              <p>
                Our website and digital platforms may use cookies and similar
                technologies to remember preferences, understand usage, improve
                performance, maintain security, and enhance your experience.
              </p>
              <p>
                You may manage cookie preferences through your browser or device
                settings.
              </p>
            </article>

            <article className="prose prose-invert max-w-none">
              <h2>06 — Your privacy rights</h2>
              <p>Subject to applicable law, you may have the right to:</p>
              <ul>
                <li>Access your personal information;</li>
                <li>Request correction of inaccurate information;</li>
                <li>Request deletion where legally applicable;</li>
                <li>Object to or restrict certain processing;</li>
                <li>Withdraw consent where applicable; and</li>
                <li>Ask questions or submit a privacy complaint.</li>
              </ul>
              <p>
                To exercise your rights, contact us using the details below.
              </p>
            </article>

            <article className="prose prose-invert max-w-none">
              <h2>07 — Data retention</h2>
              <p>
                We retain personal information only for as long as reasonably
                necessary to provide our services, fulfil contractual and
                operational requirements, comply with legal obligations,
                prevent fraud, resolve disputes, and protect our rights.
              </p>
              <p>
                When information is no longer required, we may securely delete
                or anonymize it in accordance with applicable requirements.
              </p>
            </article>

            <article className="prose prose-invert max-w-none">
              <h2>08 — Third-party services</h2>
              <p>
                Rydora may integrate with third-party services for payments,
                identity verification, mapping, hosting, analytics,
                communications, security, and other operational functions.
              </p>
              <p>
                These third parties may process information in accordance with
                their own applicable privacy policies.
              </p>
            </article>

            <article className="prose prose-invert max-w-none">
              <h2>09 — Policy updates</h2>
              <p>
                As Rydora evolves, we may update this Privacy Policy to reflect
                changes to our services, technology, business practices, or
                applicable laws.
              </p>
              <p>
                The “Last Updated” date above will indicate the latest version.
              </p>
            </article>

            <article className="prose prose-invert max-w-none">
              <h2>10 — Contact Rydora</h2>
              <p>
                Questions, privacy requests, or concerns? We&apos;re here to help.
              </p>
              <p>
                <strong>RYDORA MOBILITY LIMITED</strong>
              </p>
              <p>
                Website: <Link href="https://www.rydora.ng">www.rydora.ng</Link>
              </p>
              <p>
                Email: <Link href="mailto:info@rydora.com">info@rydora.com</Link>
              </p>
              <p>
                Phone: <Link href="https://wa.me/2348152399949">+234 815 239 9949</Link>
              </p>
              <p>
                Registered Address: 3rd Floor, Admiralty Mall by Admiralty Road,
                Lekki Phase 1, Lagos State. Nigeria.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
