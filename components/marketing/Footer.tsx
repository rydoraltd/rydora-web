import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  company: {
    label: "Company",
    links: [
      { href: "/about", label: "About Rydora" },
      { href: "/contact", label: "Contact" },
    ],
  },
  owners: {
    label: "For owners",
    links: [
      { href: "/investors", label: "How it works" },
      { href: "/investors#earnings", label: "Earnings visibility" },
      { href: "/investors#management", label: "Fleet management" },
    ],
  },
  drivers: {
    label: "For drivers",
    links: [
      { href: "/drivers", label: "Apply to drive" },
      { href: "/drivers#standards", label: "Our standards" },
      { href: "/drivers#support", label: "Driver support" },
    ],
  },
  business: {
    label: "For business",
    links: [
      { href: "/business", label: "Corporate fleet" },
      { href: "/business#monitoring", label: "GPS monitoring" },
      { href: "/business#reporting", label: "Fleet reporting" },
    ],
  },
};

export default function Footer() {
  return (
    <footer 
    style={{
        backgroundColor: "var(--surface-inverse)",
        color: "var(--ink-on-dark)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {/* Top: logo + tagline + links */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b"
          style={{ borderColor: "var(--line-subtle)" }}>
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/images/rydora-footer.png"
                alt="Rydora"
                height={120}
                width={120}
                className="object-contain"
              />
            </div>
            <p
              className="text-sm leading-relaxed max-w-[220px]"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--ink-muted)",
              }}
            >
              Africa&rsquo;s trusted mobility management and transportation
              technology company.
            </p>
          </div>

          {/* Link columns */}
          {Object.values(footerLinks).map((col) => (
            <div key={col.label}>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-5"
                style={{
                  fontFamily: "var(--font-data)",
                  color: "var(--ink-muted)",
                }}
              >
                {col.label}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm transition-colors duration-150 hover:opacity-100"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "rgba(242, 243, 241, 0.65)",
                      }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col-reverse lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <p
              className="text-xs"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--ink-muted)",
              }}
            suppressHydrationWarning
            >
              &copy; {new Date().getFullYear()} Rydora Mobility Ltd. All rights
              reserved.
            </p>
            <p
              className="text-xs"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--ink-muted)",
              }}
            >
              Registered in Nigeria.
            </p>
          </div>

          <p
            className="text-lg font-black tracking-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--ink-on-dark)",
            }}
          >
            Moving Africa Smarter.{" "}
            <span style={{ color: "var(--brand-accent)" }}>
              Driving the Future Together.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
