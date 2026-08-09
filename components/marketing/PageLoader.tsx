"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const HOLD_MS = 200;
const SWEEP_MS = 4000;

export default function PageLoader() {
  const [sweeping, setSweeping] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("rydora-loaded")) {
      setDone(true);
      return;
    }

    const t1 = setTimeout(() => {
      // Double rAF: guarantees initial position is painted before transition starts
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSweeping(true));
      });
    }, HOLD_MS);

    const t2 = setTimeout(() => {
      setDone(true);
      sessionStorage.setItem("rydora-loaded", "1");
    }, HOLD_MS + SWEEP_MS + 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (done) return null;

  const dur = `${SWEEP_MS}ms`;
  // Smooth ease — not too slow at the start, readable across the full 3 s
  const ease = "cubic-bezier(0.45, 0, 0.55, 1)";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        pointerEvents: sweeping ? "none" : "all",
      }}
    >
      {/* Overlay — clips away from left as the logo sweeps right */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#F4F7FB",
          clipPath: sweeping ? "inset(0 0 0 100%)" : "inset(0 0 0 0%)",
          transition: sweeping ? `clip-path ${dur} ${ease}` : "none",
        }}
      />

      {/* Logo + trail unit */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          // transform drives the movement — more reliable than animating `left`
          transform: sweeping
            ? `translate(calc(100vw + 120px), -50%)`
            : `translate(40px, -50%)`,
          transition: sweeping ? `transform ${dur} ${ease}` : "none",
        }}
      >
        {/* Trail (sits to the left of the logo) */}
        <div
          style={{
            position: "absolute",
            right: "100%",
            top: "50%",
            transform: "translateY(-50%)",
            width: 380,
            height: 120,
            pointerEvents: "none",
          }}
        >
          {/* Diffuse glow */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: 380,
              height: 120,
              background:
                "linear-gradient(to right, transparent, rgba(30,95,175,0.08))",
              filter: "blur(12px)",
            }}
          />
          {/* Main streak */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: 240,
              height: 2.5,
              borderRadius: 2,
              background:
                "linear-gradient(to right, transparent, rgba(62,196,201,0.95))",
            }}
          />
          {/* Upper streak */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(50% - 11px)",
              transform: "translateY(-50%)",
              width: 150,
              height: 1.5,
              borderRadius: 2,
              background:
                "linear-gradient(to right, transparent, rgba(62,196,201,0.55))",
            }}
          />
          {/* Lower streak */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(50% + 11px)",
              transform: "translateY(-50%)",
              width: 100,
              height: 1,
              borderRadius: 2,
              background:
                "linear-gradient(to right, transparent, rgba(62,196,201,0.4))",
            }}
          />
        </div>

        {/* Logo */}
        <Image
          src="/images/Logo black.png"
          alt="Rydora"
          width={110}
          height={66}
          style={{ objectFit: "contain", display: "block" }}
          priority
        />
      </div>
    </div>
  );
}
