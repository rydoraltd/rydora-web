import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Rydora Mobility Limited Terms & Conditions for using our website, platform, and mobility services.",
};

export default function TermsPage() {
  return (
    <>
      <section
        style={{ backgroundColor: "var(--surface-base)" }}
        className="pt-40 pb-16"
        aria-label="Terms and conditions"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
            style={{
              fontFamily: "var(--font-data)",
              color: "var(--brand-primary)",
            }}
          >
            Terms & Conditions
          </p>
          <h1
            className="text-5xl lg:text-[72px] font-black leading-[1.04] tracking-tight max-w-3xl mb-6"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--ink-strong)",
            }}
          >
            Move with confidence.
          </h1>
          <p
            className="text-xl leading-relaxed max-w-3xl"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--ink-body)",
            }}
          >
            These Terms & Conditions govern your access to and use of Rydora's
            website, digital platforms, applications, mobility services,
            fleet-management services, and related products.
          </p>
        </div>
      </section>

      <section
        style={{ backgroundColor: "var(--surface-base)" }}
        className="pb-36"
        aria-label="Terms and conditions details"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-16 prose prose-invert max-w-none">
            <article>
              <h2>01 — About Rydora</h2>
              <p>
                Rydora is a technology-driven mobility and fleet-management
                company that connects riders, drivers, vehicle owners, businesses,
                and mobility partners through a unified platform.
              </p>
              <p>
                Our services may include transportation coordination, vehicle
                management, driver management, fleet monitoring, vehicle
                assignment, payment and revenue management, maintenance
                coordination, and related technology services.
              </p>
              <p>
                Specific services may be subject to additional agreements,
                policies, or service terms.
              </p>
            </article>

            <article>
              <h2>02 — Eligibility &amp; accounts</h2>
              <p>
                To use certain Rydora services, you must provide accurate and
                complete information and meet any applicable eligibility
                requirements.
              </p>
              <p>You are responsible for:</p>
              <ul>
                <li>Providing accurate registration and verification information;</li>
                <li>Maintaining the security of your account credentials;</li>
                <li>Keeping your account information up to date;</li>
                <li>Using your account only for lawful purposes; and</li>
                <li>Immediately notifying Rydora of unauthorized access or suspected misuse.</li>
              </ul>
              <p>
                Rydora may suspend or restrict an account where information is
                inaccurate, fraudulent, incomplete, or where there is a security,
                safety, compliance, or contractual concern.
              </p>
            </article>

            <article>
              <h2>03 — Rider terms</h2>
              <p>
                Riders must provide accurate trip and account information and use
                Rydora services responsibly.
              </p>
              <p>Riders agree to:</p>
              <ul>
                <li>Treat drivers and vehicles with respect;</li>
                <li>Follow applicable safety instructions;</li>
                <li>Not use Rydora services for unlawful purposes;</li>
                <li>Not damage, misuse, or interfere with vehicles or equipment;</li>
                <li>Pay applicable charges and fees associated with their services.</li>
              </ul>
              <p>
                Trip availability, pricing, estimated arrival times, routes, and
                other service information may vary based on operational
                circumstances.
              </p>
            </article>

            <article>
              <h2>04 — Driver terms</h2>
              <p>
                Drivers using Rydora must satisfy all applicable verification,
                licensing, safety, and eligibility requirements.
              </p>
              <p>Drivers must:</p>
              <ul>
                <li>Hold valid and appropriate driving credentials;</li>
                <li>Provide truthful identification and verification information;</li>
                <li>Operate vehicles responsibly and safely;</li>
                <li>Follow Rydora's driver policies and applicable laws;</li>
                <li>Maintain assigned vehicles in appropriate condition;</li>
                <li>Make required remittances or payments on time;</li>
                <li>Report accidents, incidents, damage, or mechanical issues promptly;</li>
                <li>Comply with applicable vehicle, traffic, and transportation regulations.</li>
              </ul>
              <p>
                Rydora may suspend or terminate a driver's access where safety,
                compliance, performance, payment, or contractual requirements are
                not met.
              </p>
            </article>

            <article>
              <h2>05 — Vehicle owner terms</h2>
              <p>
                Vehicle owners who place vehicles under Rydora's management must
                provide accurate ownership and vehicle documentation.
              </p>
              <p>
                Vehicle owners are responsible for ensuring that vehicles provided
                to Rydora are legally owned, properly documented, insured where
                required, and suitable for the agreed service.
              </p>
              <p>
                Rydora may conduct inspections, maintenance coordination,
                monitoring, driver assignment, operational management, and
                performance reporting in accordance with the applicable vehicle or
                fleet-management agreement.
              </p>
              <p>
                Ownership of a vehicle remains with the vehicle owner unless
                otherwise agreed in writing.
              </p>
            </article>

            <article>
              <h2>06 — Fleet &amp; vehicle management</h2>
              <p>
                Rydora may manage or coordinate aspects of vehicle operations,
                including driver assignment, vehicle inspection, maintenance
                scheduling, vehicle tracking where applicable, revenue and
                remittance monitoring, performance reporting, operational
                records, and owner payout administration.
              </p>
              <p>
                The specific responsibilities of Rydora, vehicle owners, drivers,
                and other parties may be defined in separate agreements.
              </p>
            </article>

            <article>
              <h2>07 — Payments &amp; fees</h2>
              <p>
                Users agree to pay all applicable fees, charges, deposits,
                remittances, service costs, or other amounts associated with the
                services they use.
              </p>
              <p>
                Payment terms may vary depending on the service, agreement,
                vehicle, trip, or user category.
              </p>
              <p>
                Rydora may use third-party payment providers to process
                transactions.
              </p>
              <p>
                Where a payment is unsuccessful, reversed, disputed, or otherwise
                outstanding, Rydora may take reasonable steps to recover the
                amount or restrict the relevant service, subject to applicable law.
              </p>
            </article>

            <article>
              <h2>08 — Prohibited conduct</h2>
              <p>You must not use Rydora to:</p>
              <ul>
                <li>Commit or facilitate illegal activities;</li>
                <li>Provide false, fraudulent, or misleading information;</li>
                <li>Circumvent verification or security procedures;</li>
                <li>Misuse or damage vehicles, equipment, or the platform;</li>
                <li>Harass, threaten, abuse, or discriminate against another person;</li>
                <li>Attempt unauthorized access to Rydora systems;</li>
                <li>Interfere with platform operations or security;</li>
                <li>Use another person's account without authorization;</li>
                <li>Engage in any activity that may harm Rydora, its users, partners, or the public.</li>
              </ul>
            </article>

            <article>
              <h2>09 — Safety &amp; incidents</h2>
              <p>
                Safety is a fundamental part of the Rydora platform.
              </p>
              <p>
                Users must promptly report serious incidents, accidents, suspected
                fraud, security concerns, vehicle damage, or other events that
                may affect people, vehicles, or the operation of our services.
              </p>
              <p>
                Rydora may investigate reported incidents and take appropriate
                action, including account restrictions, suspension, termination,
                or referral to relevant authorities where required.
              </p>
            </article>

            <article>
              <h2>10 — Intellectual property</h2>
              <p>
                All Rydora trademarks, logos, designs, software, website content,
                technology, text, graphics, interfaces, and other intellectual
                property are owned by or licensed to Rydora unless otherwise stated.
              </p>
              <p>
                You may not copy, reproduce, modify, distribute, reverse engineer,
                sell, or commercially exploit Rydora's intellectual property
                without prior written authorization.
              </p>
            </article>

            <article>
              <h2>11 — Third-party services</h2>
              <p>
                Rydora may integrate with third-party services, including payment
                providers, mapping services, identity-verification providers,
                technology providers, insurers, and other partners.
              </p>
              <p>
                Third-party services may be subject to their own terms and
                policies. Rydora is not responsible for third-party services beyond
                the extent required by applicable law.
              </p>
            </article>

            <article>
              <h2>12 — Availability of services</h2>
              <p>
                We work to keep Rydora reliable and available, but we do not
                guarantee uninterrupted or error-free operation.
              </p>
              <p>Services may occasionally be unavailable due to:</p>
              <ul>
                <li>Maintenance;</li>
                <li>Technical failures;</li>
                <li>Network interruptions;</li>
                <li>Security incidents;</li>
                <li>Third-party service disruptions;</li>
                <li>Weather or operational conditions;</li>
                <li>Government restrictions; or</li>
                <li>Circumstances beyond our reasonable control.</li>
              </ul>
            </article>

            <article>
              <h2>13 — Limitation of liability</h2>
              <p>
                To the extent permitted by applicable law, Rydora will not be
                responsible for indirect, incidental, special, or consequential
                losses arising from your use of our services.
              </p>
              <p>
                Nothing in these Terms excludes or limits liability that cannot
                legally be excluded or limited under applicable law.
              </p>
              <p>
                Where a specific service is governed by a separate written
                agreement, the liability provisions of that agreement may also apply.
              </p>
            </article>

            <article>
              <h2>14 — Suspension &amp; termination</h2>
              <p>
                Rydora may suspend, restrict, or terminate access to its services
                where a user violates these Terms, provides false or misleading
                information, fails to meet payment or contractual obligations,
                creates a safety or security risk, engages in fraudulent or unlawful
                conduct, or otherwise misuses the platform.
              </p>
              <p>
                Users may also request closure of their account, subject to
                outstanding obligations and applicable legal requirements.
              </p>
            </article>

            <article>
              <h2>15 — Privacy</h2>
              <p>
                Your use of Rydora is also governed by our Privacy Policy,
                which explains how we collect, use, store, and protect personal
                information.
              </p>
              <p>
                By using Rydora, you acknowledge that you have reviewed our
                Privacy Policy.
              </p>
              <p>
                <Link href="/privacy" className="text-[var(--brand-primary)]">
                  View our Privacy Policy
                </Link>
              </p>
            </article>

            <article>
              <h2>16 — Changes to these terms</h2>
              <p>
                Rydora may update these Terms from time to time to reflect
                changes to our services, technology, business operations, or
                applicable laws.
              </p>
              <p>
                Updated Terms will be published on our website with a revised
                “Last Updated” date.
              </p>
              <p>
                Your continued use of Rydora after an update constitutes
                acceptance of the revised Terms, to the extent permitted by
                applicable law.
              </p>
            </article>

            <article>
              <h2>17 — Governing law &amp; disputes</h2>
              <p>
                These Terms shall be governed by the applicable laws of the
                Federal Republic of Nigeria.
              </p>
              <p>
                Where a dispute arises, the parties should first attempt to
                resolve the matter through good-faith communication and negotiation.
              </p>
              <p>
                Where the dispute cannot be resolved amicably, it may be referred to
                an appropriate court or dispute-resolution process with jurisdiction,
                subject to any applicable agreement between the parties.
              </p>
            </article>

            <article>
              <h2>18 — Contact Rydora</h2>
              <p>
                For questions regarding these Terms & Conditions, please contact us:
              </p>
              <p>
                <strong>RYDORA MOBILITY LIMITED</strong>
              </p>
              <p>
                Website: <Link href="https://www.rydora.ng">rydora.ng</Link>
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
