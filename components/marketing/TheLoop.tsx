"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

const beats = [
  {
    id: "01",
    title: "Capital",
    headline: "Investors fund the fleet.",
    body: "Vehicle owners and investors provide the assets. Your capital goes to work from day one.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h1.5m-1.5 0h-1.5m-9 0h1.5m-1.5 0h-1.5" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Vehicles",
    headline: "Rydora assigns each vehicle.",
    body: "We match every vehicle to a vetted, trained driver. Inspected before it moves. Monitored while it does.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "Drivers",
    headline: "Drivers earn on the road.",
    body: "Professional drivers operate on clear terms. Every trip is recorded. Every kilometre counts toward their income.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Revenue",
    headline: "Earnings paid out transparently.",
    body: "Revenue is reconciled automatically and distributed to drivers, owners and Rydora. Every naira accounted for.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
];

export default function TheLoop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gsapCtxRef = useRef<{ revert: () => void } | null>(null);

  // useLayoutEffect fires synchronously before React removes the DOM —
  // critical for GSAP pin cleanup, which calls removeChild on spacer divs.
  // useEffect cleanup fires after DOM removal in React 18 concurrent mode,
  // causing the removeChild crash we saw navigating away from this page.
  useLayoutEffect(() => {
    return () => {
      gsapCtxRef.current?.revert();
      gsapCtxRef.current = null;
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    if (!containerRef.current) return;

    let cancelled = false;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      if (cancelled) return;

      const gsap = gsapMod.default;
      const { ScrollTrigger } = stMod;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

        if (isDesktop) {
          const nodes = containerRef.current!.querySelectorAll("[data-beat]");
          const lines = containerRef.current!.querySelectorAll("[data-connector]");
          const descriptions = containerRef.current!.querySelectorAll("[data-desc]");

          gsap.set(Array.from(nodes).slice(1), { opacity: 0.2 });
          gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(Array.from(descriptions).slice(1), { opacity: 0, y: 12 });

          const tl = gsap.timeline();
          tl.to(lines[0], { scaleX: 1, duration: 0.4, ease: "none" })
            .to(nodes[1], { opacity: 1, duration: 0.5 }, "<0.3")
            .to(descriptions[1], { opacity: 1, y: 0, duration: 0.4 }, "<0.1");
          tl.to(lines[1], { scaleX: 1, duration: 0.4, ease: "none" })
            .to(nodes[2], { opacity: 1, duration: 0.5 }, "<0.3")
            .to(descriptions[2], { opacity: 1, y: 0, duration: 0.4 }, "<0.1");
          tl.to(lines[2], { scaleX: 1, duration: 0.4, ease: "none" })
            .to(nodes[3], { opacity: 1, duration: 0.5 }, "<0.3")
            .to(descriptions[3], { opacity: 1, y: 0, duration: 0.4 }, "<0.1");

          ScrollTrigger.create({
            animation: tl,
            trigger: containerRef.current,
            start: "top top",
            end: "+=280%",
            pin: true,
            pinSpacing: true,
            scrub: 1.2,
            anticipatePin: 1,
          });
        } else {
          const nodes = containerRef.current!.querySelectorAll("[data-beat]");
          nodes.forEach((node) => {
            gsap.from(node, {
              opacity: 0,
              y: 32,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: node,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            });
          });
        }
      }, containerRef);

      gsapCtxRef.current = ctx;
    })();

    return () => {
      cancelled = true;
      // GSAP revert is handled by useLayoutEffect above (runs before DOM removal).
      // Setting cancelled here prevents the async closure from assigning a stale
      // context after the component has unmounted.
    };
  }, []);

  return (
    <section
      ref={containerRef}
      data-scene="night"
      className="min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ backgroundColor: "var(--surface-inverse)" }}
      aria-label="How Rydora works"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-24 lg:py-32">
        {/* Section label */}
        <div className="mb-16 lg:mb-24">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
            style={{
              fontFamily: "var(--font-data)",
              color: "var(--brand-accent)",
            }}
          >
            The Rydora Loop
          </p>
          <h2
            className="text-4xl lg:text-6xl font-black leading-[1.05] tracking-tight max-w-xl"
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: "'opsz' 64, 'SOFT' 0, 'WONK' 0",
              color: "var(--ink-on-dark)",
            }}
          >
            One loop.
            <br />
            Every stakeholder wins.
          </h2>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:block">
          {/* Connector row */}
          <div className="relative flex items-start gap-0 mb-0">
            {beats.map((beat, i) => (
              <div key={beat.id} className="flex-1 flex items-center">
                {/* Node */}
                <div data-beat={beat.id} className="flex flex-col items-start">
                  {/* Circle with icon */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-6 border"
                    style={{
                      backgroundColor: "rgba(232, 163, 61, 0.12)",
                      borderColor: "rgba(232, 163, 61, 0.35)",
                      color: "var(--brand-accent)",
                    }}
                  >
                    {beat.icon}
                  </div>

                  {/* Number label */}
                  <p
                    className="text-xs font-semibold tracking-[0.15em] mb-2"
                    style={{
                      fontFamily: "var(--font-data)",
                      color: "var(--brand-accent)",
                    }}
                  >
                    {beat.id}
                  </p>

                  {/* Title */}
                  <h3
                    className="text-2xl font-black mb-3"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontVariationSettings: "'opsz' 24, 'SOFT' 0, 'WONK' 0",
                      color: "var(--ink-on-dark)",
                    }}
                  >
                    {beat.title}
                  </h3>

                  {/* Description */}
                  <div data-desc={beat.id} className="max-w-[200px]">
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--ink-on-dark)",
                      }}
                    >
                      {beat.headline}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--ink-body)",
                      }}
                    >
                      {beat.body}
                    </p>
                  </div>
                </div>

                {/* Connector line */}
                {i < beats.length - 1 && (
                  <div className="flex-1 px-4 mb-[88px] self-start mt-7">
                    <div
                      data-connector={i}
                      className="h-px w-full"
                      style={{
                        backgroundColor: "var(--brand-accent)",
                        opacity: 0.5,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical stack */}
        <div className="lg:hidden flex flex-col gap-10">
          {beats.map((beat, i) => (
            <div
              key={beat.id}
              data-beat={beat.id}
              className="flex gap-5 items-start"
            >
              {/* Left: number + line */}
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border shrink-0"
                  style={{
                    backgroundColor: "rgba(232, 163, 61, 0.12)",
                    borderColor: "rgba(232, 163, 61, 0.35)",
                    color: "var(--brand-accent)",
                  }}
                >
                  {beat.icon}
                </div>
                {i < beats.length - 1 && (
                  <div
                    className="w-px flex-1 mt-3 min-h-[40px]"
                    style={{ backgroundColor: "var(--line-subtle)" }}
                  />
                )}
              </div>

              {/* Right: content */}
              <div className="pb-6">
                <p
                  className="text-xs font-semibold tracking-[0.15em] mb-1"
                  style={{
                    fontFamily: "var(--font-data)",
                    color: "var(--brand-accent)",
                  }}
                >
                  {beat.id}
                </p>
                <h3
                  className="text-xl font-black mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontVariationSettings: "'opsz' 20, 'SOFT' 0, 'WONK' 0",
                    color: "var(--ink-on-dark)",
                  }}
                >
                  {beat.title}
                </h3>
                <p
                  className="text-sm font-semibold mb-1"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-on-dark)",
                  }}
                >
                  {beat.headline}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-body)",
                  }}
                >
                  {beat.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
