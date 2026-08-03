import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TheLoop from "@/components/marketing/TheLoop";

export const metadata: Metadata = {
  title: "Rydora Mobility | Professional Fleet Management",
  description:
    "Your vehicles, professionally driven. Your returns, fully visible. Rydora assigns vetted drivers to your fleet, tracks every trip and pays out earnings transparently.",
};

/* ─── TRUST STAT ROW ──────────────────────────────────────────── */
const trustStats = [
  { value: "100%", label: "Trips recorded" },
  { value: "48h", label: "Driver verification" },
  { value: "Every", label: "Payment documented" },
];

/* ─── BUSINESS FEATURES ───────────────────────────────────────── */
const bizFeatures = [
  {
    label: "GPS monitoring",
    detail: "Live vehicle location and trip history for every asset in your fleet.",
  },
  {
    label: "Driver scheduling",
    detail: "Managed rosters, shift planning and replacement cover on demand.",
  },
  {
    label: "Compliance reporting",
    detail: "Licensing, inspection and maintenance records, always current.",
  },
  {
    label: "Single point of contact",
    detail: "One account manager. No ticket queues.",
  },
];

/* ─── TRUST VERIFICATION POINTS ──────────────────────────────── */
const trustPoints = [
  { label: "Driver identity and licensing, verified before first assignment." },
  { label: "Vehicle inspection completed before the vehicle joins the platform." },
  { label: "Compliance checks run quarterly, records kept indefinitely." },
  { label: "Every transaction recorded, reconciled and accessible to owners." },
  { label: "Every trip logged: start time, end time, distance, earnings." },
];

export default function HomePage() {
  return (
    <>
      {/* ─── 1. HERO ──────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-[70vh] sm:min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Rydora hero"
        style={{ backgroundColor: "var(--surface-inverse)" }}
      >
        {/* Full-bleed background */}
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="https://images.unsplash.com/photo-1616805111699-0e52fa62f779?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: "rgba(16,20,24,0.60)" }} />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(16,20,24,0.1) 0%, rgba(16,20,24,0.55) 100%)" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 text-center pt-16">
          <h1
            className="anim-fade-up font-black tracking-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: "'opsz' 72, 'SOFT' 0, 'WONK' 0",
              fontSize: "clamp(2.25rem, 5vw + 1rem, 5.5rem)",
              lineHeight: "1.05",
              color: "var(--ink-on-dark)",
            }}
          >
            Professionally driven.{" "}
            <span style={{ color: "var(--brand-accent)" }}>Fully&nbsp;visible.</span>
          </h1>

          <p
            className="anim-fade-up anim-delay-1 mt-6 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)", color: "rgba(242,243,241,0.65)" }}
          >
            Vetted drivers. Every trip tracked. Every naira accounted for and paid out automatically.
          </p>

          <div className="anim-fade-up anim-delay-2 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register?role=investor"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 text-sm font-semibold transition-opacity duration-200 hover:opacity-90 cursor-pointer"
              style={{ fontFamily: "var(--font-body)", backgroundColor: "var(--brand-primary)", color: "#fff" }}
            >
              Start investing
            </Link>
            <Link
              href="/register?role=driver"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 text-sm font-semibold border transition-colors duration-200 hover:bg-white/10 cursor-pointer"
              style={{ fontFamily: "var(--font-body)", borderColor: "rgba(242,243,241,0.30)", color: "var(--ink-on-dark)" }}
            >
              Drive with Rydora
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 2. THE LOOP (client, GSAP pinned) ───────────────────── */}
      <TheLoop />

      {/* ─── 3. WHAT SETS US APART ───────────────────────────────── */}
      <section
        id="difference"
        className="relative"
        style={{ backgroundColor: "var(--surface-base)" }}
        aria-label="What sets Rydora apart"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28 lg:py-36">
          <div className="max-w-2xl mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "var(--font-data)", color: "var(--brand-primary)" }}
            >
              Why Rydora
            </p>
            <h2
              className="text-4xl lg:text-[56px] font-black leading-[1.05] tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: "'opsz' 56, 'SOFT' 0, 'WONK' 0",
                color: "var(--ink-strong)",
              }}
            >
              Built for trust.
              <br /> Engineered for Africa.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line-subtle)]">
            {[
              {
                title: "Automatic remittance reconciliation",
                body: "Every driver has a dedicated virtual account number. Transfers match to a driver and vehicle the moment they land — no manual matching, no disputes.",
                accent: true,
              },
              {
                title: "Transparent investor statements",
                body: "Every naira in and out of your vehicle — earnings, maintenance deductions, platform fees, payouts — visible in real time. The trust engine that brings repeat capital.",
                accent: false,
              },
              {
                title: "WhatsApp and SMS first",
                body: "Drivers live on SMS and WhatsApp, not email. Remittance reminders, assignment notices and compliance alerts delivered where your team actually is.",
                accent: false,
              },
              {
                title: "Document-expiry radar",
                body: "Proactive alerts on insurance, roadworthiness and licence renewals across the entire fleet — before an expiry becomes an incident.",
                accent: false,
              },
              {
                title: "Audit trail on every naira",
                body: "Every approval, adjustment and payout carries who, when and why. Immutable ledger entries. The foundation that makes Rydora investable at institutional level.",
                accent: false,
              },
              {
                title: "Safety as a platform feature",
                body: "Driver identity, licensing, driving history and vehicle inspection records live in the platform — not filing cabinets. Safety is not a checklist; it is the condition we operate on.",
                accent: false,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 flex flex-col gap-4"
                style={{ backgroundColor: item.accent ? "var(--brand-primary)" : "var(--surface-raised)" }}
              >
                <h3
                  className="text-lg font-bold leading-snug"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: item.accent ? "var(--ink-on-brand)" : "var(--ink-strong)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: item.accent ? "rgba(255,255,255,0.8)" : "var(--ink-muted)",
                  }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. FOR OWNERS ────────────────────────────────────────── */}
      <section
        id="owners"
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--surface-base)" }}
        aria-label="For vehicle owners and investors"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Content */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                style={{
                  fontFamily: "var(--font-data)",
                  color: "var(--brand-primary)",
                }}
              >
                For owners and investors
              </p>
              <h2
                className="text-4xl lg:text-[56px] font-black leading-[1.05] tracking-tight mb-8"
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: "'opsz' 56, 'SOFT' 0, 'WONK' 0",
                  color: "var(--ink-strong)",
                }}
              >
                Your asset.
                <br /> Working harder.
              </h2>
              <p
                className="text-lg leading-relaxed mb-8 max-w-md"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-body)",
                }}
              >
                When your vehicle is on the Rydora platform, it does not sit
                idle. We handle driver assignment, scheduling, maintenance and
                compliance. You get a dashboard with trip history, income
                statements and service records.
              </p>

              {/* Feature list */}
              <ul className="flex flex-col gap-4 mb-10">
                {[
                  "Earnings visibility, updated after every trip",
                  "Maintenance scheduling and service records",
                  "Driver assignment and performance tracking",
                  "Monthly income statements, downloadable",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--brand-primary)" }}
                      aria-hidden="true"
                    >
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span
                      className="text-base"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--ink-body)",
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/investors"
                className="inline-flex items-center gap-2 text-base font-semibold transition-all duration-200 hover:gap-3 cursor-pointer"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--brand-primary)",
                }}
              >
                See how it works
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85"
                  alt="A professional reviewing fleet performance data on a laptop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(14,90,67,0.15) 0%, transparent 60%)",
                  }}
                  aria-hidden="true"
                />
              </div>
              {/* Floating stat card */}
              <div
                className="absolute -bottom-6 -left-6 lg:-left-10 rounded-xl px-6 py-5 shadow-xl"
                style={{ backgroundColor: "var(--surface-raised)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{
                    fontFamily: "var(--font-data)",
                    color: "var(--ink-muted)",
                  }}
                >
                  This month
                </p>
                <p
                  className="text-3xl font-black"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontVariationSettings: "'opsz' 32, 'SOFT' 0, 'WONK' 0",
                    color: "var(--ink-strong)",
                  }}
                >
                  &#8358;248,000
                </p>
                <p
                  className="text-sm mt-1"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--state-success)",
                  }}
                >
                  +12% on last month
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. FOR DRIVERS ───────────────────────────────────────── */}
      <section
        id="drivers"
        data-scene="night"
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--surface-inverse)" }}
        aria-label="For professional drivers"
      >
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1671128972815-17ed4f000580?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(16,20,24,0.95) 0%, rgba(16,20,24,0.6) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-28 lg:py-36">
          <div className="max-w-xl">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              style={{
                fontFamily: "var(--font-data)",
                color: "var(--brand-accent)",
              }}
            >
              For professional drivers
            </p>
            <h2
              className="text-4xl lg:text-[56px] font-black leading-[1.05] tracking-tight mb-8"
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: "'opsz' 56, 'SOFT' 0, 'WONK' 0",
                color: "var(--ink-on-dark)",
              }}
            >
              Serious work.
              <br /> Fair pay.
            </h2>
            <p
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--ink-body)",
              }}
            >
              Rydora recruits drivers who take the work seriously. You get
              matched to a verified vehicle, receive clear income targets and
              have the support of a team that wants you to succeed.
            </p>

            <ul className="flex flex-col gap-4 mb-10">
              {[
                "Verified vehicles, maintained to schedule",
                "Clear income targets, paid on time",
                "Dedicated support line for drivers",
                "Performance bonuses for consistent drivers",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 shrink-0 text-sm font-bold"
                    style={{
                      fontFamily: "var(--font-data)",
                      color: "var(--brand-accent)",
                    }}
                    aria-hidden="true"
                  >
                    /
                  </span>
                  <span
                    className="text-base"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--ink-body)",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/drivers"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold border transition-all duration-200 hover:bg-white/10 cursor-pointer"
              style={{
                fontFamily: "var(--font-body)",
                borderColor: "var(--brand-accent)",
                color: "var(--brand-accent)",
              }}
            >
              Apply to drive
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 6. FOR BUSINESS ──────────────────────────────────────── */}
      <section
        id="business"
        className="relative"
        style={{ backgroundColor: "var(--surface-base)" }}
        aria-label="For businesses"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28 lg:py-36">
          <div className="max-w-2xl mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              style={{
                fontFamily: "var(--font-data)",
                color: "var(--brand-primary)",
              }}
            >
              For business
            </p>
            <h2
              className="text-4xl lg:text-[56px] font-black leading-[1.05] tracking-tight mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: "'opsz' 56, 'SOFT' 0, 'WONK' 0",
                color: "var(--ink-strong)",
              }}
            >
              Your fleet.
              <br /> Under control.
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--ink-body)",
              }}
            >
              Corporate accounts get dedicated fleet management with one point of
              contact. Built for businesses that cannot afford downtime.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {bizFeatures.map((f) => (
              <div
                key={f.label}
                className="rounded-xl p-6"
                style={{ backgroundColor: "var(--surface-raised)", border: "1px solid var(--line-subtle)" }}
              >
                <h3
                  className="text-base font-bold mb-3"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-strong)",
                  }}
                >
                  {f.label}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-muted)",
                  }}
                >
                  {f.detail}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/business"
            className="inline-flex items-center gap-2 text-base font-semibold transition-all duration-200 hover:gap-3 cursor-pointer"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--brand-primary)",
            }}
          >
            Talk to our fleet team
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ─── 7. TRUST AND SAFETY ──────────────────────────────────── */}
      <section
        id="trust"
        data-scene="night"
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--surface-inverse)" }}
        aria-label="Trust and safety"
      >
        {/* Background texture layer */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1627384011575-8e7d934f3d23?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            fill
            className="object-cover object-top"
            sizes="100vw"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{ background: "rgba(16,20,24,0.7)" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Headline */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                style={{
                  fontFamily: "var(--font-data)",
                  color: "var(--brand-accent)",
                }}
              >
                Trust and safety
              </p>
              <h2
                className="text-4xl lg:text-[56px] font-black leading-[1.05] tracking-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: "'opsz' 56, 'SOFT' 0, 'WONK' 0",
                  color: "var(--ink-on-dark)",
                }}
              >
                Every vehicle,
                <br /> every driver,
                <br /> every naira.
              </h2>
            </div>

            {/* Verification list */}
            <div>
              <p
                className="text-base leading-relaxed mb-10"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-body)",
                }}
              >
                We verify driver identity and licensing, inspect every vehicle
                before it joins the platform, run compliance checks quarterly
                and record every transaction. Nothing moves without
                documentation.
              </p>

              <ul className="flex flex-col gap-0">
                {trustPoints.map((pt, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 py-5 border-b"
                    style={{ borderColor: "var(--line-subtle)" }}
                  >
                    <span
                      className="shrink-0 text-xs font-bold mt-0.5 w-8"
                      style={{
                        fontFamily: "var(--font-data)",
                        color: "var(--brand-accent)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="text-sm leading-relaxed"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--ink-body)",
                      }}
                    >
                      {pt.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. CLOSING CTA ───────────────────────────────────────── */}
      <section
        id="cta"
        data-scene="night"
        className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden"
        aria-label="Get started with Rydora"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?auto=format&fit=crop&w=1920&q=85"
            alt="Night highway with headlights stretching into the distance"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(16,20,24,0.65) 0%, rgba(16,20,24,0.85) 100%)",
            }}
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-28 lg:py-40 text-center">
          <h2
            className="text-5xl lg:text-[80px] font-black leading-[1.02] tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: "'opsz' 80, 'SOFT' 0, 'WONK' 0",
              color: "var(--ink-on-dark)",
            }}
          >
            Moving Africa Smarter.
          </h2>
          <p
            className="text-2xl lg:text-4xl font-black tracking-tight mb-12"
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: "'opsz' 36, 'SOFT' 0, 'WONK' 0",
              color: "var(--brand-accent)",
            }}
          >
            Driving the Future Together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register?role=investor"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: "var(--brand-primary)",
                color: "var(--ink-on-brand)",
              }}
            >
              Invest with Rydora
            </Link>
            <Link
              href="/register?role=driver"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold border transition-all duration-200 hover:bg-white/10 cursor-pointer"
              style={{
                fontFamily: "var(--font-body)",
                borderColor: "rgba(242,243,241,0.35)",
                color: "var(--ink-on-dark)",
              }}
            >
              Drive with Rydora
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
