"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/investors", label: "For owners" },
  { href: "/drivers", label: "For drivers" },
  { href: "/business", label: "For business" },
  { href: "/about", label: "About" },
];

const LIGHT_TOP_PAGES = ["/contact"];

export default function Nav() {
  const pathname = usePathname();
  const lightTop = LIGHT_TOP_PAGES.includes(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toggle = () => setMenuOpen((v) => !v);
  const light = scrolled || lightTop;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: light ? "rgba(244,247,251,0.96)" : "transparent",
          backdropFilter: light ? "blur(12px)" : "none",
          borderBottom: light
            ? "1px solid var(--line-subtle)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" aria-label="Rydora home">
            <Image
              src={light ? "/images/Logo origin.png" : "/images/Logo white.png"}
              alt="Rydora"
              height={50}
              width={50}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-body)",
                  color: light ? "var(--ink-body)" : "rgba(242,245,249,0.8)",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium transition-colors duration-200"
              style={{
                fontFamily: "var(--font-body)",
                color: light ? "var(--ink-body)" : "rgba(242,245,249,0.8)",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: "var(--brand-primary)",
                color: "var(--ink-on-brand)",
              }}
            >
              Get started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col justify-center gap-1.5 w-10 h-10 items-center cursor-pointer"
            onClick={toggle}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span
              className="block w-6 h-0.5 rounded-full transition-transform duration-200"
              style={{
                backgroundColor: light ? "var(--ink-strong)" : "var(--ink-on-dark)",
                transform: menuOpen ? "rotate(45deg) translate(0, 8px)" : "none",
              }}
            />
            <span
              className="block w-6 h-0.5 rounded-full transition-opacity duration-200"
              style={{
                backgroundColor: light ? "var(--ink-strong)" : "var(--ink-on-dark)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-0.5 rounded-full transition-transform duration-200"
              style={{
                backgroundColor: light ? "var(--ink-strong)" : "var(--ink-on-dark)",
                transform: menuOpen ? "rotate(-45deg) translate(0, -8px)" : "none",
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="lg:hidden fixed inset-0 z-40 flex flex-col"
        style={{
          backgroundColor: "var(--surface-inverse)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.76, 0, 0.24, 1)",
          visibility: menuOpen ? "visible" : "hidden",
        }}
      >
        <div className="flex flex-col h-full px-6 pt-24 pb-12">
          <nav className="flex flex-col gap-2 flex-1" aria-label="Mobile navigation">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block text-4xl font-black py-3 border-b transition-colors duration-150 hover:opacity-70"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--ink-on-dark)",
                  borderColor: "var(--line-subtle)",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center py-4 rounded-full text-base font-semibold transition-opacity hover:opacity-90"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: "var(--brand-primary)",
                color: "var(--ink-on-brand)",
              }}
            >
              Get started
            </Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center py-4 rounded-full text-base font-semibold border transition-opacity hover:opacity-70"
              style={{
                fontFamily: "var(--font-body)",
                borderColor: "var(--line-subtle)",
                color: "var(--ink-on-dark)",
              }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
