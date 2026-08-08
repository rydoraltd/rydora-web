"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    // Driver at wheel, dusk — original auth page image
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote:
      "Redefining mobility across Africa by connecting people, technology, vehicles, and investment through one intelligent, transparent ecosystem.",
  },
  {
    // Professional driver / dark sedan exterior
    image:
      "/images/driver.avif",
    quote:
      "At Rydora, every vehicle is more than transportation — it’s an opportunity to create value, generate returns, and drive progress.",
  },
  {
    // Clean modern sedan — investors hero
    image:
      "/images/sedan.avif",
    quote:
      "One vehicle can become an income-generating asset. A fleet can become a scalable mobility portfolio.",
  },
];

interface AuthSliderProps {
  className?: string;
}

export function AuthSlider({ className = "lg:w-[58%]" }: AuthSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`hidden lg:flex ${className} relative overflow-hidden flex-col justify-between p-12`}>
      {/* Slides — CSS background, crossfade via opacity */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            backgroundImage: `url('${slide.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden={i !== current}
        />
      ))}

      {/* Dark overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(145deg, rgba(6,13,26,0.88) 0%, rgba(9,24,40,0.82) 55%, rgba(7,17,31,0.88) 100%)",
        }}
      />

      {/* Ambient glows */}
      <div
        className="absolute -right-40 -top-40 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(30,95,175,0.18) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute -left-24 bottom-10 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(63,196,201,0.10) 0%, transparent 65%)",
        }}
      />

      {/* Logo — links to home */}
      <Link href="/" className="relative z-10">
        <Image
          src="/images/Logo white.png"
          alt="Rydora"
          height={36}
          width={36}
          className="object-contain"
        />
      </Link>

      {/* Quote + dot indicators */}
      <div className="relative z-10">
        <div className="relative" style={{ minHeight: "140px" }}>
          {slides.map((slide, i) => (
            <blockquote
              key={i}
              className="absolute inset-x-0 top-0 text-white/90 text-xl font-medium leading-relaxed max-w-md transition-all duration-700 ease-in-out"
              style={{
                opacity: i === current ? 1 : 0,
                transform: i === current ? "translateY(0)" : "translateY(10px)",
                pointerEvents: i === current ? "auto" : "none",
              }}
            >
              &ldquo;{slide.quote}&rdquo;
            </blockquote>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: i === current ? "20px" : "8px",
                height: "4px",
                background:
                  i === current
                    ? "var(--rd-primary)"
                    : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
