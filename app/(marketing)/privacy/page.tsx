import type { Metadata } from "next";
import Image from "next/image";
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
        data-scene="night"
        className="relative min-h-[75vh] flex flex-col justify-end overflow-hidden"
        aria-label="Privacy Policy"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0"
            alt="Automotive garage with vehicles and equipment"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(8,44,86,0.94) 0%, rgba(8,44,86,0.72) 30%, rgba(8,44,86,0.18) 100%)",
            }}
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-24 pt-40 w-full">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
            style={{
              fontFamily: "var(--font-data)",
              color: "var(--brand-accent)",
            }}
          >
            Privacy Policy
          </p>
          <h1
            className="text-5xl lg:text-[72px] font-black leading-[1.04] tracking-tight max-w-3xl mb-6"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--ink-on-dark)",
            }}
          >
            Your privacy is how we build trust.
          </h1>
          <p
            className="text-xl leading-relaxed max-w-2xl"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(242,243,241,0.78)",
            }}
          >
            We collect and protect information only when necessary to deliver
            safe, reliable and compliant mobility services across our website,
            platforms, applications, and operations.
          </p>
        </div>
      </section>

      <section
        style={{ backgroundColor: "var(--surface-base)" }}
        className="py-24 lg:py-28"
        aria-label="Privacy Policy overview"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14">
            <div className="space-y-10">
              <div
                className="rounded-[1.5rem] p-10 border bg-[var(--surface-raised)] shadow-[var(--rd-shadow-sm)]"
                style={{ borderColor: "var(--line-subtle)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
                  style={{
                    fontFamily: "var(--font-data)",
                    color: "var(--brand-primary)",
                  }}
                >
                  Policy highlights
                </p>
                <h2
                  className="text-3xl font-black max-w-2xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--ink-strong)",
                  }}
                >
                  We collect what we need and protect what we hold.
                </h2>
                <p
                  className="text-base leading-relaxed max-w-2xl mt-4"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-body)",
                  }}
                >
                  Your personal information is used to operate the platform,
                  verify users, process payments, keep services secure, and
                  comply with applicable law. We do not sell your information.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    "Verified drivers and owners",
                    "Secure payments and remittances",
                    "Fraud prevention and safety monitoring",
                    "Transparent data handling",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-3xl border border-[var(--line-subtle)] bg-[var(--surface-base)] p-4"
                    >
                      <p
                        className="text-sm font-semibold"
                        style={{
                          fontFamily: "var(--font-body)",
                          color: "var(--ink-strong)",
                        }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-16">
                <article className="space-y-6">
                  <h3
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)" }}
                  >
                    01 — Information we collect
                  </h3>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    Depending on how you interact with Rydora, we may collect information such as:
                  </p>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {[
                      {
                        title: "Personal information",
                        details:
                          "Name, phone, email, residential or business address, profile and account details.",
                      },
                      {
                        title: "Verification information",
                        details:
                          "Government IDs, driver’s licence, NIN, BVN, guarantor documentation and compliance data.",
                      },
                      {
                        title: "Vehicle and fleet data",
                        details:
                          "Registration records, ownership documents, inspections, maintenance and trip assignments.",
                      },
                      {
                        title: "Transaction and usage data",
                        details:
                          "Payment details, remittances, location data, device and browser activity, and cookies.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-3xl border border-[var(--line-subtle)] bg-[var(--surface-raised)] p-6"
                      >
                        <p className="text-sm uppercase tracking-[0.18em] text-[var(--brand-primary)] font-semibold mb-3" style={{ fontFamily: "var(--font-data)" }}>
                          {item.title}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                          {item.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="space-y-6">
                  <h3
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)" }}
                  >
                    02 — How we use your information
                  </h3>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    We use information to operate the platform, support users, manage payments, improve safety, and comply with legal and regulatory obligations.
                  </p>
                  <ul className="grid gap-3 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    {[
                      "Provide and manage services",
                      "Create and maintain accounts",
                      "Verify drivers, owners, riders and other users",
                      "Process payments, remittances and payouts",
                      "Improve safety, security and service performance",
                      "Prevent fraud, misuse and unauthorized activity",
                    ].map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </article>

                <article className="space-y-6">
                  <h3
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)" }}
                  >
                    03 — How we share information
                  </h3>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    We may share information with trusted service providers, payment processors, identity verification partners, technology providers, and regulators when necessary and permitted by law.
                  </p>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    Rydora does not sell your personal information. We share only what is reasonably necessary for the relevant purpose.
                  </p>
                </article>

                <article className="space-y-6">
                  <h3
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)" }}
                  >
                    04 — Data security
                  </h3>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    We use reasonable technical and organizational safeguards designed to protect your information against unauthorized access, loss, misuse, alteration or disclosure.
                  </p>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    No digital platform or internet transmission can be guaranteed completely secure, but we treat security as a priority.
                  </p>
                </article>

                <article className="space-y-6">
                  <h3
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)" }}
                  >
                    05 — Cookies &amp; technology
                  </h3>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    Our website and digital platforms may use cookies and similar technologies to remember preferences, understand usage, improve performance, maintain security, and enhance your experience.
                  </p>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    You can manage cookie preferences through your browser or device settings.
                  </p>
                </article>

                <article className="space-y-6">
                  <h3
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)" }}
                  >
                    06 — Your privacy rights
                  </h3>
                  <ul className="grid gap-3 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    {[
                      "Access your personal information",
                      "Request correction of inaccurate information",
                      "Request deletion where legally applicable",
                      "Object to or restrict certain processing",
                      "Withdraw consent where applicable",
                      "Ask questions or submit a privacy complaint",
                    ].map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    To exercise your rights, contact us using the details below.
                  </p>
                </article>
              </div>
            </div>

            <aside className="space-y-6">
              <div
                className="rounded-[1.5rem] p-10 border bg-[var(--surface-raised)] shadow-[var(--rd-shadow-sm)]"
                style={{ borderColor: "var(--line-subtle)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
                  style={{
                    fontFamily: "var(--font-data)",
                    color: "var(--brand-primary)",
                  }}
                >
                  Quick summary
                </p>
                <h3
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--ink-strong)",
                  }}
                >
                  Your data is handled carefully.
                </h3>
                <p className="text-sm leading-relaxed mt-4" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                  We collect only what is needed to run the service, protect users, and comply with regulations. We use safeguards, never sell personal information, and keep your rights in focus.
                </p>
              </div>

              <div
                className="rounded-[1.5rem] p-10 border bg-[var(--surface-raised)] shadow-[var(--rd-shadow-sm)]"
                style={{ borderColor: "var(--line-subtle)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
                  style={{
                    fontFamily: "var(--font-data)",
                    color: "var(--brand-primary)",
                  }}
                >
                  Contact Rydora
                </p>
                <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                  Questions, privacy requests or concerns? Reach out any time.
                </p>
                <div className="mt-6 space-y-4 text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                  <p>
                    <strong>Email:</strong> <Link href="mailto:info@rydora.com" className="text-[var(--brand-primary)]">info@rydora.com</Link>
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    <Link href="https://wa.me/2348152399949" className="text-[var(--brand-primary)]">+234 815 239 9949</Link>
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    <Link href="https://www.rydora.ng" className="text-[var(--brand-primary)]">www.rydora.ng</Link>
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
