import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Rydora",
  description:
    "Rydora Mobility Ltd is building Africa's most trusted mobility management and transportation technology company.",
};

const values = [
  {
    name: "Integrity",
    statement:
      "We say what we do and do what we say. Every transaction is documented. Every commitment is kept or explained.",
  },
  {
    name: "Safety",
    statement:
      "Vehicles are inspected. Drivers are vetted. Records are kept. Safety is not a checklist item; it is the condition on which we operate.",
  },
  {
    name: "Excellence",
    statement:
      "We hold high standards for vehicle condition, driver conduct and platform reliability. Average performance is not an acceptable target.",
  },
  {
    name: "Innovation",
    statement:
      "We build systems that improve with use. Technology at Rydora serves the driver, the owner and the business, not the other way around.",
  },
  {
    name: "Customer centricity",
    statement:
      "Every decision passes a simple test: does this make life better for the people who depend on Rydora? If not, we reconsider.",
  },
  {
    name: "Sustainability",
    statement:
      "We are building for decades, not quarters. Our financial model, our operations and our relationships are designed to last.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section
        data-scene="night"
        className="relative min-h-[65vh] flex flex-col justify-end overflow-hidden"
        aria-label="About Rydora"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1920&q=85"
            alt="Professional team meeting representing Rydora's mission in Africa"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(8,44,86,0.96) 0%, rgba(8,44,86,0.55) 55%, rgba(8,44,86,0.15) 100%)",
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
            About Rydora
          </p>
          <h1
            className="text-5xl lg:text-[72px] font-black leading-[1.04] tracking-tight max-w-3xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--ink-on-dark)",
            }}
          >
            Building Africa&rsquo;s most trusted mobility platform.
          </h1>
        </div>
      </section>

      {/* Vision and mission */}
      <section
        style={{ backgroundColor: "var(--surface-base)" }}
        className="py-28 lg:py-36"
        aria-label="Vision and mission"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                style={{
                  fontFamily: "var(--font-data)",
                  color: "var(--brand-primary)",
                }}
              >
                Vision
              </p>
              <p
                className="text-2xl lg:text-3xl font-bold leading-[1.3]"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-strong)",
                }}
              >
                To become Africa&rsquo;s most trusted mobility management and
                transportation technology company.
              </p>
            </div>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                style={{
                  fontFamily: "var(--font-data)",
                  color: "var(--brand-primary)",
                }}
              >
                Mission
              </p>
              <p
                className="text-lg leading-relaxed"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-body)",
                }}
              >
                To build a mobility ecosystem that maximises the value of
                vehicle assets, creates sustainable income for professional
                drivers, and delivers reliable transportation for businesses and
                individuals across Africa. We do this by combining rigorous
                operational standards with technology that makes every naira and
                every trip visible.
              </p>
            </div>
          </div>

          {/* What we do */}
          <div
            className="border-t pt-20"
            style={{ borderColor: "var(--line-subtle)" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-8"
              style={{
                fontFamily: "var(--font-data)",
                color: "var(--brand-primary)",
              }}
            >
              What we do
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Fleet management",
                  body: "We assign vetted drivers to owner vehicles, track every trip, manage maintenance schedules and distribute earnings transparently. Owners see everything. Drivers earn fairly.",
                },
                {
                  title: "Driver recruitment",
                  body: "We find, verify and train professional drivers. Our recruitment process covers identity, licensing, driving history and conduct. We invest in drivers because the platform depends on them.",
                },
                {
                  title: "Corporate solutions",
                  body: "We manage fleets for businesses that cannot afford unplanned downtime. GPS monitoring, compliance records, driver scheduling and monthly reporting, all from one account.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <h3
                    className="text-xl font-bold mb-4"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--ink-strong)",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-base leading-relaxed"
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

      {/* Values */}
      <section
        data-scene="night"
        style={{ backgroundColor: "var(--surface-inverse)" }}
        className="py-28 lg:py-36"
        aria-label="Our values"
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
              Our values
            </p>
            <h2
              className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--ink-on-dark)",
              }}
            >
              What we stand for.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {values.map((v, i) => (
              <div
                key={v.name}
                className="p-8 border-b border-r"
                style={{
                  borderColor: "var(--line-subtle)",
                  borderRight:
                    (i + 1) % 3 === 0 ? "none" : undefined,
                  borderBottom:
                    i >= values.length - 3 ? "none" : undefined,
                }}
              >
                <h3
                  className="text-xl font-black mb-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--ink-on-dark)",
                  }}
                >
                  {v.name}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-body)",
                  }}
                >
                  {v.statement}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand line + CTA */}
      <section
        style={{ backgroundColor: "var(--surface-base)" }}
        className="py-24 lg:py-32"
        aria-label="Join Rydora"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2
              className="text-4xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-8"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--ink-strong)",
              }}
            >
              Moving Africa Smarter.
              <br />
              <span style={{ color: "var(--brand-primary)" }}>
                Driving the Future Together.
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register?role=investor"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                style={{
                  fontFamily: "var(--font-body)",
                  backgroundColor: "var(--brand-primary)",
                  color: "var(--ink-on-brand)",
                }}
              >
                For owners
              </Link>
              <Link
                href="/register?role=driver"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold border transition-all duration-200 hover:bg-black/5 cursor-pointer"
                style={{
                  fontFamily: "var(--font-body)",
                  borderColor: "var(--line-subtle)",
                  color: "var(--ink-strong)",
                }}
              >
                For drivers
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold border transition-all duration-200 hover:bg-black/5 cursor-pointer"
                style={{
                  fontFamily: "var(--font-body)",
                  borderColor: "var(--line-subtle)",
                  color: "var(--ink-strong)",
                }}
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
