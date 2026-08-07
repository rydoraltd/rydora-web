import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
  title: "Contact Rydora",
  description:
    "Get in touch with Rydora Mobility. Reach us about vehicle registration, driver applications, corporate fleet or general enquiries.",
};

const channels = [
  {
    label: "Email",
    value: "hello@rydora.africa",
    detail: "We respond within one business day.",
    href: "mailto:hello@rydora.africa",
  },
  {
    label: "Driver recruitment",
    value: "drivers@rydora.africa",
    detail: "For driver applications and questions.",
    href: "mailto:drivers@rydora.africa",
  },
  {
    label: "Fleet enquiries",
    value: "fleet@rydora.africa",
    detail: "For corporate and business accounts.",
    href: "mailto:fleet@rydora.africa",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section
        style={{ backgroundColor: "var(--surface-base)" }}
        className="pt-40 pb-16"
        aria-label="Contact Rydora"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
            style={{
              fontFamily: "var(--font-data)",
              color: "var(--brand-primary)",
            }}
          >
            Contact
          </p>
          <h1
            className="text-5xl lg:text-[72px] font-black leading-[1.04] tracking-tight max-w-2xl mb-6"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--ink-strong)",
            }}
          >
            Get in touch.
          </h1>
          <p
            className="text-xl leading-relaxed max-w-lg"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--ink-body)",
            }}
          >
            Whether you are a vehicle owner, a driver or a business, send us a
            message and the right person will reply.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section
        style={{ backgroundColor: "var(--surface-base)" }}
        className="py-16 pb-36"
        aria-label="Contact form and details"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Form */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-8"
                style={{
                  fontFamily: "var(--font-data)",
                  color: "var(--ink-muted)",
                }}
              >
                Send a message
              </p>

              <ContactForm />
            </div>

            {/* Direct channels */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-8"
                style={{
                  fontFamily: "var(--font-data)",
                  color: "var(--ink-muted)",
                }}
              >
                Direct channels
              </p>

              <div className="flex flex-col gap-0">
                {channels.map((ch, i) => (
                  <div
                    key={ch.label}
                    className="py-8 border-t"
                    style={{ borderColor: "var(--line-subtle)" }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{
                        fontFamily: "var(--font-data)",
                        color: "var(--ink-muted)",
                      }}
                    >
                      {ch.label}
                    </p>
                    <a
                      href={ch.href}
                      className="text-xl font-bold block mb-1 transition-colors duration-150 hover:opacity-70"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--brand-primary)",
                      }}
                    >
                      {ch.value}
                    </a>
                    <p
                      className="text-sm"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--ink-muted)",
                      }}
                    >
                      {ch.detail}
                    </p>
                  </div>
                ))}
                <div
                  className="border-t"
                  style={{ borderColor: "var(--line-subtle)" }}
                />
              </div>

              <div
                className="mt-12 p-6 rounded-xl"
                style={{
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--line-subtle)",
                }}
              >
                <p
                  className="text-sm font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-strong)",
                  }}
                >
                  Response time
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-body)",
                  }}
                >
                  We respond to all enquiries within one business day. Driver
                  applications receive an initial response within 48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
