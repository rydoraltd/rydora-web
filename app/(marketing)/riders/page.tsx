import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RideBookingForm from "@/components/marketing/RideBookingForm";

export const metadata: Metadata = {
  title: "Book a Ride | Rydora Mobility",
  description:
    "Safe, professional rides across Lagos. Drop-offs, full-day bookings, airport transfers, corporate transport and more. Book a Rydora ride today.",
};

const rideOptions = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" />
        <circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    ),
    title: "Drop-off Rides",
    body: "Need to get somewhere fast? Our drivers take you directly to your destination, safely and on time. Ideal for daily commutes and city travel.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    title: "Full-Day Booking",
    body: "Have a driver at your disposal from morning to evening. Perfect for busy schedules, multi-stop errands, or days when you simply need reliability.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.47 2 2 0 0 1 3.04 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.68a16 16 0 0 0 6.29 6.29l1.5-1.5a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        <path d="M17 3l4 4-4 4M21 7H13" />
      </svg>
    ),
    title: "Airport Pickup & Drop-off",
    body: "Stress-free transfers to and from any Lagos airport. Your driver will be there on time, every time, so you never miss a flight or wait at arrivals.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Corporate & Event Transport",
    body: "Coordinated transport for your team, clients, or event guests. Multiple vehicles, professional presentation, and punctual execution — every time.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Child / School Pickup & Delivery",
    body: "Background-verified drivers who specialise in safe child transport. Parents receive confirmation at every stage of the journey for peace of mind.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Custom Ride Request",
    body: "Have a requirement that doesn't fit a standard category? Tell us what you need and we will arrange a solution tailored to your situation.",
  },
];

const benefits = [
  {
    title: "Clean, air-conditioned vehicles",
    body: "Every Rydora vehicle is inspected and maintained on a scheduled basis. You get in and it is exactly what you expect — clean, functional, comfortable.",
  },
  {
    title: "Background-checked drivers",
    body: "All drivers go through identity verification, licence checks, and a Rydora induction before they ever carry a passenger. No exceptions.",
  },
  {
    title: "Real-time tracking",
    body: "Every trip is tracked on the platform. You know where your ride is, from the moment it starts to the moment you arrive.",
  },
  {
    title: "Transparent pricing",
    body: "No hidden fees, no surprises at the end of a trip. What you see when you book is what you pay.",
  },
  {
    title: "Suited for every need",
    body: "Whether you are an executive, a parent, a student, or planning a corporate event — Rydora has the right service level for you.",
  },
];

const faqs = [
  {
    q: "How do I book a ride?",
    a: "Fill in the booking form on this page with your details, ride type, pick-up and drop-off locations, and preferred date and time. Our team will contact you to confirm within a short period.",
  },
  {
    q: "How far in advance should I book?",
    a: "For standard drop-off rides, we recommend booking at least 2 hours in advance. For full-day bookings, airport transfers, and corporate transport, 24 hours notice is preferred.",
  },
  {
    q: "Are your drivers vetted?",
    a: "Yes. Every Rydora driver goes through identity verification, driving licence checks, and a structured induction programme before they are assigned to any passenger.",
  },
  {
    q: "Can I book for someone else?",
    a: "Absolutely. Many of our corporate and school transport bookings are made on behalf of others. Just include the relevant details in the additional information field.",
  },
  {
    q: "What areas do you cover?",
    a: "We currently operate across Lagos. If you are unsure whether we cover your specific route, mention it in the booking form and we will let you know.",
  },
  {
    q: "How is pricing determined?",
    a: "Pricing is based on the ride type, distance, and duration. After you submit your booking request, our team will provide you with the exact cost before confirmation.",
  },
  {
    q: "What if I need to cancel or reschedule?",
    a: "Contact us as early as possible via WhatsApp or email. We are flexible and will do our best to accommodate changes to your booking.",
  },
];

export default function RidersPage() {
  return (
    <>
      {/* Hero */}
      <section
        data-scene="night"
        className="relative min-h-[85vh] flex flex-col justify-end overflow-hidden"
        aria-label="Book a ride with Rydora"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0"
            alt="Sleek professional vehicle on the road"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(8,44,86,0.97) 0%, rgba(8,44,86,0.60) 50%, rgba(8,44,86,0.25) 100%)",
            }}
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-24 pt-40 w-full">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
            style={{ fontFamily: "var(--font-data)", color: "var(--brand-accent)" }}
          >
            For riders
          </p>
          <h1
            className="text-5xl lg:text-[72px] font-black leading-[1.04] tracking-tight max-w-2xl mb-6"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink-on-dark)" }}
          >
            Your ride, your way.
          </h1>
          <p
            className="text-xl leading-relaxed max-w-xl mb-10"
            style={{ fontFamily: "var(--font-body)", color: "rgba(242,243,241,0.72)" }}
          >
            Professional drivers. Verified vehicles. Drop-offs, full-day hires,
            airport runs, corporate fleets and more — delivered with the
            reliability Lagos demands.
          </p>
          <a
            href="#book"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            style={{ fontFamily: "var(--font-body)", backgroundColor: "var(--brand-accent)", color: "var(--ink-strong)" }}
          >
            Book a ride
          </a>
        </div>
      </section>

      {/* Ride options */}
      <section
        style={{ backgroundColor: "var(--surface-base)" }}
        className="py-28 lg:py-36"
        aria-label="Available ride services"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "var(--font-data)", color: "var(--brand-primary)" }}
            >
              Ride services
            </p>
            <h2
              className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)" }}
            >
              Choose from a range of flexible ride options.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rideOptions.map((opt) => (
              <div
                key={opt.title}
                className="p-7 rounded-2xl border flex flex-col gap-4 transition-shadow hover:shadow-md"
                style={{ borderColor: "var(--line-subtle)", backgroundColor: "var(--surface-raised)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(30,95,175,0.08)", color: "var(--brand-primary)" }}
                >
                  {opt.icon}
                </div>
                <div>
                  <h3
                    className="text-base font-bold mb-2"
                    style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}
                  >
                    {opt.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}
                  >
                    {opt.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Rydora */}
      <section
        data-scene="night"
        style={{ backgroundColor: "var(--surface-inverse)" }}
        className="py-28 lg:py-36"
        aria-label="Why ride with Rydora"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                style={{ fontFamily: "var(--font-data)", color: "var(--brand-accent)" }}
              >
                Why choose Rydora
              </p>
              <h2
                className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-6"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink-on-dark)" }}
              >
                Safe, reliable, and professional. Every trip.
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ fontFamily: "var(--font-body)", color: "rgba(242,243,241,0.65)" }}
              >
                We built Rydora around a simple promise: the ride you book is
                the ride you get. No surprises, no compromise.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {benefits.map((b, i) => (
                <div
                  key={b.title}
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(242,245,249,0.10)" }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="shrink-0 text-sm font-bold mt-0.5"
                      style={{ fontFamily: "var(--font-data)", color: "var(--brand-accent)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3
                        className="text-base font-bold mb-1.5"
                        style={{ fontFamily: "var(--font-body)", color: "var(--ink-on-dark)" }}
                      >
                        {b.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ fontFamily: "var(--font-body)", color: "rgba(242,243,241,0.65)" }}
                      >
                        {b.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section
        id="book"
        style={{ backgroundColor: "var(--surface-base)" }}
        className="py-28 lg:py-36"
        aria-label="Book a ride"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="lg:sticky lg:top-28">
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                style={{ fontFamily: "var(--font-data)", color: "var(--brand-primary)" }}
              >
                Ready to ride?
              </p>
              <h2
                className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-6"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)" }}
              >
                Book your ride now.
              </h2>
              <p
                className="text-base leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}
              >
                Fill in your details and we will contact you to confirm.
                For urgent bookings, reach us directly on WhatsApp.
              </p>

              <a
                href="https://wa.me/2349036468772"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full border text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ borderColor: "var(--line-subtle)", color: "var(--ink-body)", backgroundColor: "var(--surface-raised)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#25D366" }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                WhatsApp us directly
              </a>

              <div className="mt-8 pt-8 border-t" style={{ borderColor: "var(--line-subtle)" }}>
                <p className="text-xs uppercase tracking-wider font-semibold mb-4" style={{ fontFamily: "var(--font-data)", color: "var(--ink-muted)" }}>
                  Response time
                </p>
                <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
                  Booking requests submitted via this form are responded to within a few hours during business hours. Airport and corporate bookings confirmed within 24 hours.
                </p>
              </div>
            </div>

            <div>
              <RideBookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        data-scene="night"
        style={{ backgroundColor: "var(--surface-inverse)" }}
        className="py-28 lg:py-36"
        aria-label="Frequently asked questions"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-xl mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "var(--font-data)", color: "var(--brand-accent)" }}
            >
              FAQ
            </p>
            <h2
              className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink-on-dark)" }}
            >
              Questions we hear often.
            </h2>
          </div>

          <div className="flex flex-col">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 py-8 border-t"
                style={{ borderColor: "rgba(242,245,249,0.10)" }}
              >
                <div className="lg:col-span-5">
                  <h3
                    className="text-base font-bold"
                    style={{ fontFamily: "var(--font-body)", color: "var(--ink-on-dark)" }}
                  >
                    {faq.q}
                  </h3>
                </div>
                <div className="lg:col-span-7">
                  <p
                    className="text-base leading-relaxed"
                    style={{ fontFamily: "var(--font-body)", color: "rgba(242,243,241,0.65)" }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
            <div className="border-t" style={{ borderColor: "rgba(242,245,249,0.10)" }} />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{ backgroundColor: "var(--surface-base)" }}
        className="py-24 lg:py-32"
        aria-label="Get started"
      >
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <h2
            className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)" }}
          >
            Ready for a better ride experience?
          </h2>
          <p
            className="text-lg leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}
          >
            Fill in the booking form above or get in touch directly. Our team
            will have you moving in no time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a
              href="#book"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              style={{ fontFamily: "var(--font-body)", backgroundColor: "var(--brand-primary)", color: "var(--ink-on-brand)" }}
            >
              Book a ride
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold border transition-all duration-200 hover:scale-[1.02]"
              style={{ fontFamily: "var(--font-body)", borderColor: "var(--line-subtle)", color: "var(--ink-body)" }}
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
