"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const EMPTY = { name: "", email: "", type: "", message: "", website: "" };

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputBase = {
    fontFamily: "var(--font-body)",
    backgroundColor: "var(--surface-raised)",
    border: "1.5px solid var(--line-subtle)",
    color: "var(--ink-strong)",
  } as const;

  function focus(e: React.FocusEvent<HTMLElement>) {
    (e.currentTarget as HTMLElement).style.borderColor = "var(--brand-primary)";
  }
  function blur(e: React.FocusEvent<HTMLElement>) {
    (e.currentTarget as HTMLElement).style.borderColor = "var(--line-subtle)";
  }
  function field(key: keyof typeof EMPTY) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({ success: false, message: "Network error" }));
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Something went wrong. Please try again.");
      }
      setSent(true);
      setForm(EMPTY);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div
        className="rounded-2xl px-8 py-12 flex flex-col items-start gap-4"
        style={{ backgroundColor: "var(--surface-raised)", border: "1.5px solid var(--line-subtle)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--brand-royal)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-bold mb-1" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
            Message sent
          </p>
          <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-body)" }}>
            We received your message and will get back to you within one business day. Check your inbox — we've sent you a confirmation.
          </p>
        </div>
        <button
          onClick={() => setSent(false)}
          className="text-sm font-medium transition-opacity hover:opacity-70 mt-2"
          style={{ color: "var(--brand-primary)" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} aria-label="Contact form" noValidate>
      {/* Honeypot — hidden from humans, bots fill it */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={field("website")}
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: "none" }}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={form.name}
          onChange={field("name")}
          className="h-12 rounded-lg px-4 text-base outline-none transition-all duration-150"
          style={inputBase}
          onFocus={focus}
          onBlur={blur}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={field("email")}
          className="h-12 rounded-lg px-4 text-base outline-none transition-all duration-150"
          style={inputBase}
          onFocus={focus}
          onBlur={blur}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="type" className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
          Enquiry type
        </label>
        <select
          id="type"
          name="type"
          required
          value={form.type}
          onChange={field("type")}
          className="h-12 rounded-lg px-4 text-base outline-none transition-all duration-150 appearance-none cursor-pointer"
          style={inputBase}
          onFocus={focus}
          onBlur={blur}
        >
          <option value="" disabled>Select one</option>
          <option value="owner">I want to register a vehicle</option>
          <option value="driver">I want to apply as a driver</option>
          <option value="business">I need corporate fleet management</option>
          <option value="general">General enquiry</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-strong)" }}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          value={form.message}
          onChange={field("message")}
          className="rounded-lg px-4 py-3 text-base outline-none transition-all duration-150 resize-none"
          style={inputBase}
          onFocus={focus}
          onBlur={blur}
        />
      </div>

      {error && (
        <p className="text-sm rounded-lg px-4 py-3" style={{ backgroundColor: "#fef2f2", color: "var(--state-error)", border: "1px solid #fecaca" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="h-12 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
        style={{ fontFamily: "var(--font-body)", backgroundColor: "var(--brand-primary)", color: "var(--ink-on-brand)" }}
      >
        {busy ? (
          <>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}
