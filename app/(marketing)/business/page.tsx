import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Corporate Fleet Solutions",
  description:
    "Rydora manages corporate fleets with GPS monitoring, driver scheduling, compliance reporting and a single point of contact.",
};

const features = [
  {
    id: "01",
    title: "GPS monitoring",
    body: "Live location for every vehicle in your fleet. Trip history, idle time reports and route summaries, accessible at any time.",
  },
  {
    id: "02",
    title: "Driver scheduling",
    body: "Managed rosters, shift planning and cover drivers on demand. You specify operational requirements. We fill them.",
  },
  {
    id: "03",
    title: "Compliance reporting",
    body: "Licensing, insurance, inspection and maintenance records for every vehicle and driver, always current. Audit-ready.",
  },
  {
    id: "04",
    title: "Maintenance management",
    body: "Scheduled servicing, unplanned repairs and vehicle condition reporting. You approve any significant expenditure.",
  },
  {
    id: "05",
    title: "Monthly fleet reports",
    body: "Usage data, cost summaries, incident logs and driver performance scores. Formatted for your finance and operations teams.",
  },
  {
    id: "06",
    title: "Single point of contact",
    body: "One account manager who knows your fleet and your operational context. No ticket queues or call centres.",
  },
];

const industries = [
  "Logistics and courier services",
  "Corporate executive transport",
  "Healthcare and pharmaceutical distribution",
  "Financial services and banking",
  "Construction and site operations",
  "NGOs and international organisations",
];

export default function BusinessPage() {
  return (
    <>
      {/* Hero */}
      <section
        data-scene="night"
        className="relative min-h-[75vh] flex flex-col justify-end overflow-hidden"
        aria-label="Corporate fleet solutions"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1920&q=85"
            alt="Aerial view of a busy highway interchange at night"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(16,20,24,0.96) 0%, rgba(16,20,24,0.55) 55%, rgba(16,20,24,0.2) 100%)",
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
            For business
          </p>
          <h1
            className="text-5xl lg:text-[72px] font-black leading-[1.04] tracking-tight max-w-2xl mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: "'opsz' 72, 'SOFT' 0, 'WONK' 0",
              color: "var(--ink-on-dark)",
            }}
          >
            Your fleet. Under control.
          </h1>
          <p
            className="text-xl leading-relaxed max-w-xl"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(242,243,241,0.72)",
            }}
          >
            Corporate accounts get dedicated fleet management with GPS
            monitoring, driver scheduling, compliance reporting and one person
            who picks up the phone.
          </p>
        </div>
      </section>

      {/* Features grid */}
      <section
        id="monitoring"
        style={{ backgroundColor: "var(--surface-base)" }}
        className="py-28 lg:py-36"
        aria-label="Fleet management features"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-xl mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              style={{
                fontFamily: "var(--font-data)",
                color: "var(--brand-primary)",
              }}
            >
              What is included
            </p>
            <h2
              className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: "'opsz' 48, 'SOFT' 0, 'WONK' 0",
                color: "var(--ink-strong)",
              }}
            >
              Every tool your operations team needs.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.id}
                className="rounded-xl p-7 border flex flex-col gap-4"
                style={{
                  borderColor: "var(--line-subtle)",
                  backgroundColor: "var(--surface-raised)",
                }}
              >
                <span
                  className="text-xs font-bold"
                  style={{
                    fontFamily: "var(--font-data)",
                    color: "var(--ink-muted)",
                  }}
                >
                  {f.id}
                </span>
                <h3
                  className="text-lg font-bold"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-strong)",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-body)",
                  }}
                >
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section
        data-scene="night"
        style={{ backgroundColor: "var(--surface-inverse)" }}
        className="py-28 lg:py-36"
        aria-label="Industries served"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                style={{
                  fontFamily: "var(--font-data)",
                  color: "var(--brand-accent)",
                }}
              >
                Industries we serve
              </p>
              <h2
                className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-8"
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: "'opsz' 48, 'SOFT' 0, 'WONK' 0",
                  color: "var(--ink-on-dark)",
                }}
              >
                Built for businesses that cannot afford downtime.
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-body)",
                }}
              >
                Whether you operate two vehicles or two hundred, Rydora
                scales to your requirements. Our account structure is built
                for organisations, not individuals.
              </p>
            </div>
            <div>
              <ul className="flex flex-col gap-0">
                {industries.map((industry, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 py-5 border-b"
                    style={{ borderColor: "var(--line-subtle)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: "var(--brand-accent)" }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-base"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--ink-on-dark)",
                      }}
                    >
                      {industry}
                    </span>
                  </li>
                ))}
                <li
                  className="border-t"
                  style={{ borderColor: "var(--line-subtle)" }}
                />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reporting */}
      <section
        id="reporting"
        style={{ backgroundColor: "var(--surface-base)" }}
        className="py-28 lg:py-36"
        aria-label="Fleet reporting"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                style={{
                  fontFamily: "var(--font-data)",
                  color: "var(--brand-primary)",
                }}
              >
                Reporting
              </p>
              <h2
                className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-8"
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: "'opsz' 48, 'SOFT' 0, 'WONK' 0",
                  color: "var(--ink-strong)",
                }}
              >
                Your finance team will want these reports.
              </h2>
              <p
                className="text-base leading-relaxed mb-8"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-body)",
                }}
              >
                Monthly fleet reports include fuel and maintenance costs per
                vehicle, driver performance scores, trip utilisation rates and
                compliance status. Delivered formatted for direct use in your
                reporting stack.
              </p>
              <Link
                href="/contact?type=business"
                className="inline-flex items-center gap-2 text-base font-semibold transition-all duration-200 hover:gap-3 cursor-pointer"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--brand-primary)",
                }}
              >
                Talk to our fleet team
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10m-4-4 4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            <div
              className="rounded-2xl p-8"
              style={{
                backgroundColor: "var(--surface-inverse)",
                color: "var(--ink-on-dark)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-6"
                style={{
                  fontFamily: "var(--font-data)",
                  color: "var(--ink-muted)",
                }}
              >
                Monthly report summary
              </p>
              {[
                { label: "Total fleet trips", value: "1,842" },
                { label: "Fleet utilisation rate", value: "84%" },
                { label: "On-time departure rate", value: "96%" },
                { label: "Compliance status", value: "All clear" },
                { label: "Maintenance events", value: "3 scheduled" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center py-3.5 border-b last:border-b-0"
                  style={{ borderColor: "var(--line-subtle)" }}
                >
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--ink-body)",
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{
                      fontFamily: "var(--font-data)",
                      color: "var(--ink-on-dark)",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
              <p
                className="text-xs mt-4"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-muted)",
                }}
              >
                Illustrative figures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        data-scene="night"
        style={{ backgroundColor: "var(--surface-inverse)" }}
        className="py-24 lg:py-32"
        aria-label="Get fleet management"
      >
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <h2
            className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: "'opsz' 48, 'SOFT' 0, 'WONK' 0",
              color: "var(--ink-on-dark)",
            }}
          >
            Ready to talk fleet management?
          </h2>
          <p
            className="text-lg leading-relaxed mb-10"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(242,243,241,0.65)",
            }}
          >
            Share your requirements and our fleet team will respond within one
            business day.
          </p>
          <Link
            href="/contact?type=business"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            style={{
              fontFamily: "var(--font-body)",
              backgroundColor: "var(--brand-primary)",
              color: "var(--ink-on-brand)",
            }}
          >
            Contact the fleet team
          </Link>
        </div>
      </section>
    </>
  );
}
