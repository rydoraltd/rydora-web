import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Drive with Rydora",
  description:
    "Apply to join Rydora as a professional driver. Vetted vehicles, clear targets, fair pay. For drivers who take the work seriously.",
};

const qualifications = [
  "Valid Nigerian driver's licence, minimum 2 years",
  "Clean driving record, verifiable",
  "Smartphone capable of running the driver app",
  "Ability to communicate professionally with clients",
  "Willingness to complete Rydora's driver induction",
];

const steps = [
  {
    id: "01",
    title: "Submit your application",
    body: "Fill in the driver application form. It takes under 10 minutes. We ask for your licence details, driving history and basic personal information.",
  },
  {
    id: "02",
    title: "Identity and licence verification",
    body: "We verify your identity and check your licence history through official channels. This takes 24 to 48 hours.",
  },
  {
    id: "03",
    title: "Driver induction",
    body: "All accepted drivers complete a Rydora induction: platform operations, vehicle care standards, client conduct expectations and safety protocols.",
  },
  {
    id: "04",
    title: "Vehicle assignment",
    body: "You are matched to a verified vehicle. You inspect it with a Rydora coordinator, confirm its condition and begin operations.",
  },
  {
    id: "05",
    title: "You drive, you earn",
    body: "Trips are assigned through the driver app. You see your earnings after every trip. Payouts are processed at the end of each cycle.",
  },
];

export default function DriversPage() {
  return (
    <>
      {/* Hero */}
      <section
        data-scene="night"
        className="relative min-h-[80vh] flex flex-col justify-end overflow-hidden"
        aria-label="Drive with Rydora"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=85"
            alt="A professional driver behind the wheel of a clean vehicle at dusk"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(16,20,24,0.95) 0%, rgba(16,20,24,0.5) 55%, rgba(16,20,24,0.2) 100%)",
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
            For professional drivers
          </p>
          <h1
            className="text-5xl lg:text-[72px] font-black leading-[1.04] tracking-tight max-w-2xl mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: "'opsz' 72, 'SOFT' 0, 'WONK' 0",
              color: "var(--ink-on-dark)",
            }}
          >
            For drivers who take the work seriously.
          </h1>
          <p
            className="text-xl leading-relaxed max-w-xl mb-10"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(242,243,241,0.72)",
            }}
          >
            Verified vehicles. Clear targets. Pay you can count on. Rydora
            is built for drivers who want a sustainable income and a platform
            that treats them professionally.
          </p>
          <Link
            href="/register?role=driver"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            style={{
              fontFamily: "var(--font-body)",
              backgroundColor: "var(--brand-accent)",
              color: "var(--ink-strong)",
            }}
          >
            Apply to drive
          </Link>
        </div>
      </section>

      {/* What you get */}
      <section
        id="standards"
        style={{ backgroundColor: "var(--surface-base)" }}
        className="py-28 lg:py-36"
        aria-label="Driver benefits"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                style={{
                  fontFamily: "var(--font-data)",
                  color: "var(--brand-primary)",
                }}
              >
                What you get
              </p>
              <h2
                className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: "'opsz' 48, 'SOFT' 0, 'WONK' 0",
                  color: "var(--ink-strong)",
                }}
              >
                Serious work. Fair pay.
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {[
                {
                  title: "Verified, maintained vehicles",
                  body: "Every vehicle is inspected before assignment and maintained on schedule. You do not get handed a vehicle and left to figure it out.",
                },
                {
                  title: "Clear income targets",
                  body: "You know what you are working toward. Trip targets are communicated clearly, and you can see your progress in the driver app.",
                },
                {
                  title: "Consistent pay cycles",
                  body: "Earnings are reconciled at the end of each cycle and paid to your account. No chasing. No ambiguity.",
                },
                {
                  title: "Driver support",
                  body: "A dedicated support line for Rydora drivers. If something goes wrong on a trip or with your vehicle, you have someone to call.",
                },
                {
                  title: "Performance bonuses",
                  body: "Drivers who maintain high ratings and consistent trip completion receive bonuses at the end of each quarterly review.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-xl border"
                  style={{
                    borderColor: "var(--line-subtle)",
                    backgroundColor: "var(--surface-raised)",
                  }}
                >
                  <h3
                    className="text-base font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--ink-strong)",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--ink-body)",
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application process */}
      <section
        data-scene="night"
        style={{ backgroundColor: "var(--surface-inverse)" }}
        className="py-28 lg:py-36"
        aria-label="How to apply"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-xl mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              style={{
                fontFamily: "var(--font-data)",
                color: "var(--brand-accent)",
              }}
            >
              Application process
            </p>
            <h2
              className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: "'opsz' 48, 'SOFT' 0, 'WONK' 0",
                color: "var(--ink-on-dark)",
              }}
            >
              From application to first trip in five steps.
            </h2>
          </div>

          <div className="flex flex-col">
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
                      color: "var(--brand-accent)",
                    }}
                  >
                    {step.id}
                  </span>
                </div>
                <div className="lg:col-span-4">
                  <h3
                    className="text-lg font-bold"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--ink-on-dark)",
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

      {/* Qualifications */}
      <section
        style={{ backgroundColor: "var(--surface-base)" }}
        className="py-28 lg:py-36"
        aria-label="Who qualifies"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                style={{
                  fontFamily: "var(--font-data)",
                  color: "var(--brand-primary)",
                }}
              >
                Who qualifies
              </p>
              <h2
                className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-6"
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: "'opsz' 48, 'SOFT' 0, 'WONK' 0",
                  color: "var(--ink-strong)",
                }}
              >
                We recruit drivers, not just anyone who drives.
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-body)",
                }}
              >
                Our vetting is thorough because our platform promise to vehicle
                owners depends on it. Here is what you need to qualify.
              </p>
            </div>
            <div>
              <ul className="flex flex-col gap-0">
                {qualifications.map((q, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 py-5 border-b"
                    style={{ borderColor: "var(--line-subtle)" }}
                  >
                    <span
                      className="shrink-0 w-1.5 h-1.5 rounded-full mt-2.5"
                      style={{ backgroundColor: "var(--brand-primary)" }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-base leading-relaxed"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--ink-body)",
                      }}
                    >
                      {q}
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

      {/* Apply CTA */}
      <section
        id="apply"
        data-scene="night"
        style={{ backgroundColor: "var(--surface-inverse)" }}
        className="py-24 lg:py-32"
        aria-label="Apply to drive"
      >
        <div
          className="max-w-2xl mx-auto px-6 lg:px-8 text-center"
          id="support"
        >
          <h2
            className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: "'opsz' 48, 'SOFT' 0, 'WONK' 0",
              color: "var(--ink-on-dark)",
            }}
          >
            Ready to drive with Rydora?
          </h2>
          <p
            className="text-lg leading-relaxed mb-10"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(242,243,241,0.65)",
            }}
          >
            Submit your application and our recruitment team will contact you
            within 48 hours.
          </p>
          <Link
            href="/register?role=driver"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            style={{
              fontFamily: "var(--font-body)",
              backgroundColor: "var(--brand-accent)",
              color: "var(--ink-strong)",
            }}
          >
            Start your application
          </Link>
        </div>
      </section>
    </>
  );
}
