"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok && json.success === false) throw new Error(json.message || "Request failed");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8f9fb] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src="/images/Logo origin.png" alt="Rydora" height={40} width={40} className="object-contain" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ecf4] px-8 py-9">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-emerald-600">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-[var(--rd-ink)]">Check your email</h1>
              <p className="mt-2 text-sm text-[var(--rd-ink-muted)] leading-relaxed">
                If an account exists for <span className="font-medium text-[var(--rd-ink)]">{email}</span>, we've sent a password reset link. Check your inbox and spam folder.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block text-sm font-medium text-[var(--rd-primary)] hover:underline"
              >
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[var(--rd-ink)] leading-tight">
                Reset your{" "}
                <span className="relative inline-block">
                  password
                  <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full" style={{ background: "var(--rd-primary)" }} />
                </span>
              </h1>
              <p className="mt-3 text-sm text-[var(--rd-ink-muted)]">
                Enter your account email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-lg px-4 py-3 text-sm text-[var(--rd-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--rd-primary)]/30 transition-all"
                    style={{ background: "#f0f4fb", border: "1.5px solid transparent" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--rd-primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
                  />
                </div>

                {error && (
                  <p className="text-sm text-[var(--rd-error)] bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={busy || !email}
                  className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                  style={{ background: "#111827" }}
                >
                  {busy ? "Sending…" : "Send reset link"}
                </button>
              </form>

              <p className="mt-5 text-sm text-center text-[var(--rd-ink-muted)]">
                Remembered it?{" "}
                <Link href="/login" className="font-medium text-[var(--rd-primary)] hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
