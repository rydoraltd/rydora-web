"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "rd_cookie_consent";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface ConsentRecord {
  action: "accept_all" | "reject_all" | "custom";
  preferences: ConsentPreferences;
  timestamp: string;
}

function loadStored(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function postConsent(action: ConsentRecord["action"], preferences: ConsentPreferences) {
  try {
    await fetch(`${API_BASE}/consent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        preferences,
        page: typeof window !== "undefined" ? window.location.pathname : "",
      }),
    });
  } catch {
    // non-blocking — consent banner should never break the page
  }
}

function saveConsent(action: ConsentRecord["action"], preferences: ConsentPreferences) {
  const record: ConsentRecord = { action, preferences, timestamp: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  postConsent(action, preferences);
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none shrink-0",
        checked ? "bg-[var(--brand-royal)]" : "bg-[var(--line-subtle)]",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      <span className={[
        "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
        checked ? "translate-x-4" : "translate-x-0.5",
      ].join(" ")} />
    </button>
  );
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prefs, setPrefs] = useState<ConsentPreferences>({ essential: true, analytics: false, marketing: false });

  useEffect(() => {
    if (!loadStored()) setVisible(true);
  }, []);

  function acceptAll() {
    const p = { essential: true, analytics: true, marketing: true };
    saveConsent("accept_all", p);
    setVisible(false);
    setShowModal(false);
  }

  function rejectAll() {
    const p = { essential: true, analytics: false, marketing: false };
    saveConsent("reject_all", p);
    setVisible(false);
    setShowModal(false);
  }

  function saveCustom() {
    saveConsent("custom", prefs);
    setVisible(false);
    setShowModal(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Banner */}
      <div
        className="fixed bottom-0 inset-x-0 z-50 px-4 pb-4 pt-0"
        style={{ pointerEvents: showModal ? "none" : "auto" }}
      >
        <div
          className="max-w-2xl mx-auto rounded-2xl shadow-2xl border px-6 py-5"
          style={{
            backgroundColor: "var(--surface-raised)",
            borderColor: "var(--line-subtle)",
            color: "var(--ink-body)",
          }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--ink-strong)" }}>
                We use cookies
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                We use essential cookies to keep the site working and optional cookies to improve your experience and measure how the site is used.{" "}
                <a href="/privacy" className="underline hover:opacity-80" style={{ color: "var(--brand-royal)" }}>
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={acceptAll}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
              style={{ backgroundColor: "var(--brand-royal)" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--brand-primary-strong)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--brand-royal)")}
            >
              Accept all
            </button>
            <button
              onClick={rejectAll}
              className="px-4 py-2 rounded-lg text-xs font-semibold border transition-colors"
              style={{ borderColor: "var(--line-subtle)", color: "var(--ink-body)", backgroundColor: "transparent" }}
            >
              Reject non-essential
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--brand-royal)" }}
            >
              Manage preferences
            </button>
          </div>
        </div>
      </div>

      {/* Preferences modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50">
          <div
            className="w-full max-w-md rounded-2xl shadow-2xl"
            style={{ backgroundColor: "var(--surface-raised)", color: "var(--ink-body)" }}
          >
            <div className="px-6 pt-6 pb-0 flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ color: "var(--ink-strong)" }}>
                Cookie Preferences
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="transition-opacity hover:opacity-60"
                style={{ color: "var(--ink-muted)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {([
                {
                  key: "essential" as const,
                  label: "Essential cookies",
                  desc: "Required for the site to function. Cannot be disabled.",
                  locked: true,
                },
                {
                  key: "analytics" as const,
                  label: "Analytics cookies",
                  desc: "Help us understand how visitors interact with our site so we can improve it.",
                  locked: false,
                },
                {
                  key: "marketing" as const,
                  label: "Marketing cookies",
                  desc: "Used to deliver ads relevant to you and measure campaign effectiveness.",
                  locked: false,
                },
              ] as const).map(({ key, label, desc, locked }) => (
                <div key={key} className="flex items-start justify-between gap-4 py-3 border-b last:border-0" style={{ borderColor: "var(--line-subtle)" }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "var(--ink-strong)" }}>{label}</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--ink-muted)" }}>{desc}</p>
                  </div>
                  <Toggle
                    checked={prefs[key]}
                    disabled={locked}
                    onChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
                  />
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={rejectAll}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors"
                style={{ borderColor: "var(--line-subtle)", color: "var(--ink-body)", backgroundColor: "transparent" }}
              >
                Reject all
              </button>
              <button
                onClick={saveCustom}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "var(--brand-royal)" }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--brand-primary-strong)")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--brand-royal)")}
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
