import type { Metadata } from "next";
import Image from "next/image";
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
        data-scene="night"
        className="relative min-h-[75vh] flex flex-col justify-end overflow-hidden"
        aria-label="Terms and conditions"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0"
            alt="Vehicle inspection in a garage setting"
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
            Terms & Conditions
          </p>
          <h1
            className="text-5xl lg:text-[72px] font-black leading-[1.04] tracking-tight max-w-3xl mb-6"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--ink-on-dark)",
            }}
          >
            Move with confidence.
          </h1>
          <p
            className="text-xl leading-relaxed max-w-2xl"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(242,243,241,0.78)",
            }}
          >
            These Terms govern how you access and use Rydora’s website,
            platforms, applications, mobility services, fleet management and
            related products.
          </p>
        </div>
      </section>

      <section
        style={{ backgroundColor: "var(--surface-base)" }}
        className="py-24 lg:py-28"
        aria-label="Terms and conditions overview"
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
                  What this means
                </p>
                <h2
                  className="text-3xl font-black max-w-2xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--ink-strong)",
                  }}
                >
                  Clear rules for every user and partner.
                </h2>
                <p
                  className="text-base leading-relaxed max-w-2xl mt-4"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-body)",
                  }}
                >
                  These Terms outline obligations, safety expectations, payment
                  responsibilities, dispute resolution, and the boundaries of
                  our service.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    "User eligibility and accounts",
                    "Driver and owner responsibilities",
                    "Payments, safety and conduct",
                    "Service availability and liability",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-3xl border border-[var(--line-subtle)] bg-[var(--surface-base)] p-4"
                    >
                      <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
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
                    01 — About Rydora
                  </h3>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    Rydora is a technology-driven mobility and fleet-management company that connects riders, drivers, vehicle owners, businesses, and mobility partners through a unified platform.
                  </p>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    Our services may include transportation coordination, vehicle management, driver management, fleet monitoring, vehicle assignment, payment and revenue management, maintenance coordination, and related technology services.
                  </p>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    Specific services may be subject to additional agreements, policies, or service terms.
                  </p>
                </article>

                <article className="space-y-6">
                  <h3
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)" }}
                  >
                    02 — Eligibility &amp; accounts
                  </h3>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    To use certain Rydora services, you must provide accurate and complete information and meet any applicable eligibility requirements.
                  </p>
                  <ul className="grid gap-3 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    {[
                      "Providing accurate registration and verification information",
                      "Maintaining the security of your account credentials",
                      "Keeping your account information up to date",
                      "Using your account only for lawful purposes",
                      "Promptly notifying Rydora of unauthorized access or suspected misuse",
                    ].map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    Rydora may suspend or restrict an account where information is inaccurate, fraudulent, incomplete, or where there is a safety, security, compliance, or contractual concern.
                  </p>
                </article>

                <article className="space-y-6">
                  <h3
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)" }}
                  >
                    03 — Rider terms
                  </h3>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    Riders must provide accurate trip and account information and use Rydora services responsibly.
                  </p>
                  <ul className="grid gap-3 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    {[
                      "Treat drivers and vehicles with respect",
                      "Follow applicable safety instructions",
                      "Not use Rydora services for unlawful purposes",
                      "Not damage, misuse, or interfere with vehicles or equipment",
                      "Pay applicable charges and fees associated with their services",
                    ].map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    Trip availability, pricing, routes and service details may vary based on operational circumstances.
                  </p>
                </article>

                <article className="space-y-6">
                  <h3
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)" }}
                  >
                    04 — Driver terms
                  </h3>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    Drivers using Rydora must satisfy all applicable verification, licensing, safety, and eligibility requirements.
                  </p>
                  <ul className="grid gap-3 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    {[
                      "Hold valid and appropriate driving credentials",
                      "Provide truthful identification and verification information",
                      "Operate vehicles responsibly and safely",
                      "Follow Rydora's driver policies and applicable laws",
                      "Maintain assigned vehicles in appropriate condition",
                      "Make required remittances or payments on time",
                      "Report accidents, incidents, damage, or mechanical issues promptly",
                      "Comply with applicable vehicle, traffic, and transportation regulations",
                    ].map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    Rydora may suspend or terminate a driver's access where safety, compliance, performance, payment, or contractual requirements are not met.
                  </p>
                </article>

                <article className="space-y-6">
                  <h3
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)" }}
                  >
                    05 — Vehicle owner terms
                  </h3>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    Vehicle owners who place vehicles under Rydora's management must provide accurate ownership and vehicle documentation.
                  </p>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    Owners are responsible for ensuring that vehicles are legally owned, properly documented, insured where required, and suitable for the agreed service.
                  </p>
                  <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                    Rydora may conduct inspections, maintenance coordination, monitoring, driver assignment, operational management, and performance reporting in accordance with the applicable agreement.
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
                  Key obligations
                </p>
                <h3
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--ink-strong)",
                  }}
                >
                  Stay compliant and keep services running.
                </h3>
                <p className="text-sm leading-relaxed mt-4" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                  Accurate information, safe behaviour, timely payments, and prompt reporting are the baseline for using Rydora.
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
                  Need help?
                </p>
                <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                  If you have questions about these Terms, reach out and we will help clarify how they apply to your account.
                </p>
                <div className="mt-6 text-sm space-y-4" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                  <p>
                    <strong>Email:</strong>{" "}
                    <Link href="mailto:info@rydora.com" className="text-[var(--brand-primary)]">
                      info@rydora.com
                    </Link>
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    <Link href="https://wa.me/2348152399949" className="text-[var(--brand-primary)]">
                      +234 815 239 9949
                    </Link>
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    <Link href="https://www.rydora.ng" className="text-[var(--brand-primary)]">
                      rydora.ng
                    </Link>
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
