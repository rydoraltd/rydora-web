import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For Owners and Investors",
  description:
    "Put your vehicles to work. Rydora manages your fleet, assigns vetted drivers and gives you full earnings visibility every month.",
};

const steps = [
  {
    id: "01",
    title: "Register your vehicle",
    body: "You submit your vehicle details and documentation. We assess it for platform eligibility within 48 hours.",
  },
  {
    id: "02",
    title: "We inspect and onboard",
    body: "A Rydora technician inspects the vehicle. Once cleared, it is registered on the platform and assigned a tracking unit.",
  },
  {
    id: "03",
    title: "Driver assignment",
    body: "We match the vehicle to a vetted, trained driver. The assignment is documented and you receive driver details.",
  },
  {
    id: "04",
    title: "Your vehicle earns",
    body: "Trips begin. Every trip is logged: start and end time, distance, earnings. You can view all of this in your owner dashboard.",
  },
  {
    id: "05",
    title: "Monthly payout",
    body: "At the end of each cycle, revenue is reconciled. Your share is paid directly to your account with a full income statement.",
  },
];

const faqs = [
  {
    q: "What kind of vehicles can I register?",
    a: "Sedans, SUVs and small commercial vans. The vehicle must be a recent model, in good working condition and clear of outstanding obligations. We will tell you within 48 hours whether your vehicle qualifies.",
  },
  {
    q: "How much can I expect to earn?",
    a: "Earnings depend on vehicle type, usage and market conditions. We do not guarantee a fixed return, but we give you full visibility into everything the vehicle earns. You can track performance in real time.",
  },
  {
    q: "What happens if the vehicle needs repairs?",
    a: "Rydora schedules and coordinates maintenance. Minor maintenance is managed as part of the platform service. Major repairs are logged and discussed with you before proceeding.",
  },
  {
    q: "Can I take my vehicle back?",
    a: "Yes. You give 30 days notice and we manage the offboarding process: driver reassignment, vehicle handover and final earnings settlement.",
  },
  {
    q: "Who is responsible if the driver has an accident?",
    a: "All vehicles on the platform must be covered by commercial insurance. We work with you to ensure coverage is in place before operations begin. Our driver vetting also includes defensive driving assessment.",
  },
];

export default function InvestorsPage() {
  return (
    <>
      {/* Hero */}
      <section
        data-scene="night"
        className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden"
        aria-label="For owners and investors"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1714703394111-a4ef8bfc750f?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="A clean professional sedan on a city road"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(16,20,24,0.92) 0%, rgba(16,20,24,0.45) 60%, rgba(16,20,24,0.2) 100%)",
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
            For owners and investors
          </p>
          <h1
            className="text-5xl lg:text-[72px] font-black leading-[1.04] tracking-tight max-w-2xl"
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: "'opsz' 72, 'SOFT' 0, 'WONK' 0",
              color: "var(--ink-on-dark)",
            }}
          >
            Put your vehicles to work.
          </h1>
          <p
            className="text-xl leading-relaxed mt-6 max-w-xl"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(242,243,241,0.7)",
            }}
          >
            Rydora manages your fleet, assigns vetted drivers and gives you full
            earnings visibility. Your vehicles earn. You see every naira.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        style={{ backgroundColor: "var(--surface-base)" }}
        className="py-28 lg:py-36"
        aria-label="How it works for owners"
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
              How it works
            </p>
            <h2
              className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: "'opsz' 48, 'SOFT' 0, 'WONK' 0",
                color: "var(--ink-strong)",
              }}
            >
              From registration to payout in five steps.
            </h2>
          </div>

          <div className="flex flex-col gap-0">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 py-8 border-t items-start"
                style={{ borderColor: "var(--line-subtle)" }}
              >
                <div className="lg:col-span-1">
                  <span
                    className="text-sm font-bold"
                    style={{
                      fontFamily: "var(--font-data)",
                      color: "var(--ink-muted)",
                    }}
                  >
                    {step.id}
                  </span>
                </div>
                <div className="lg:col-span-4">
                  <h3
                    className="text-xl font-bold"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--ink-strong)",
                    }}
                  >
                    {step.title}
                  </h3>
                </div>
                <div className="lg:col-span-7">
                  <p
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--ink-body)",
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
            <div
              className="border-t"
              style={{ borderColor: "var(--line-subtle)" }}
            />
          </div>
        </div>
      </section>

      {/* Earnings section */}
      <section
        id="earnings"
        data-scene="night"
        style={{ backgroundColor: "var(--surface-inverse)" }}
        className="py-28 lg:py-36"
        aria-label="Earnings visibility"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                style={{
                  fontFamily: "var(--font-data)",
                  color: "var(--brand-accent)",
                }}
              >
                Earnings visibility
              </p>
              <h2
                className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-8"
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: "'opsz' 48, 'SOFT' 0, 'WONK' 0",
                  color: "var(--ink-on-dark)",
                }}
              >
                You see what your vehicle earns, after every trip.
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-body)",
                }}
              >
                The owner dashboard shows trip-by-trip earnings, cumulative
                monthly income, maintenance deductions and net payout. Nothing is
                hidden in a percentage. Every line item is explained.
              </p>
            </div>
            <div
              className="rounded-2xl p-8"
              style={{
                backgroundColor: "var(--surface-raised)",
                color: "var(--ink-strong)",
              }}
            >
              {/* Mock dashboard card */}
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-6"
                style={{
                  fontFamily: "var(--font-data)",
                  color: "var(--ink-muted)",
                }}
              >
                Dashboard preview
              </p>
              {[
                { label: "Gross trips revenue", value: "₦310,000" },
                { label: "Rydora platform fee (20%)", value: "-₦62,000" },
                { label: "Maintenance deductions", value: "-₦18,000" },
                { label: "Driver share (60%)", value: "-₦138,000" },
                { label: "Owner payout", value: "₦92,000", bold: true },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center py-3 border-b last:border-b-0"
                  style={{ borderColor: "var(--line-subtle)" }}
                >
                  <span
                    className={`text-sm ${row.bold ? "font-bold" : ""}`}
                    style={{
                      fontFamily: "var(--font-body)",
                      color: row.bold ? "var(--ink-strong)" : "var(--ink-body)",
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    className={`text-sm ${row.bold ? "font-bold text-lg" : ""}`}
                    style={{
                      fontFamily: "var(--font-data)",
                      color: row.bold
                        ? "var(--state-success)"
                        : "var(--ink-strong)",
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
                Illustrative figures. Actual earnings vary by vehicle, route and
                market conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{ backgroundColor: "var(--surface-base)" }}
        className="py-28 lg:py-36"
        aria-label="Frequently asked questions"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              style={{
                fontFamily: "var(--font-data)",
                color: "var(--brand-primary)",
              }}
            >
              Questions
            </p>
            <h2
              className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: "'opsz' 48, 'SOFT' 0, 'WONK' 0",
                color: "var(--ink-strong)",
              }}
            >
              Things owners ask before they start.
            </h2>
          </div>

          <div className="max-w-3xl flex flex-col gap-0">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="py-8 border-t"
                style={{ borderColor: "var(--line-subtle)" }}
              >
                <h3
                  className="text-lg font-bold mb-3"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-strong)",
                  }}
                >
                  {faq.q}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-body)",
                  }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
            <div
              className="border-t"
              style={{ borderColor: "var(--line-subtle)" }}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        data-scene="night"
        style={{ backgroundColor: "var(--surface-inverse)" }}
        className="py-24 lg:py-32"
        aria-label="Register your vehicle"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-2xl mx-auto">
          <h2
            className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: "'opsz' 48, 'SOFT' 0, 'WONK' 0",
              color: "var(--ink-on-dark)",
            }}
          >
            Ready to register your vehicle?
          </h2>
          <p
            className="text-lg leading-relaxed mb-10"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(242,243,241,0.65)",
            }}
          >
            Submit your details and our team will contact you within 48 hours.
          </p>
          <Link
            href="/register?role=investor"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            style={{
              fontFamily: "var(--font-body)",
              backgroundColor: "var(--brand-primary)",
              color: "var(--ink-on-brand)",
            }}
          >
            Register your vehicle
          </Link>
        </div>
      </section>
    </>
  );
}
