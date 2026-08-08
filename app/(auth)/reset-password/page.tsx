"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-[var(--rd-error)]">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-sm font-medium text-[var(--rd-primary)] hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || "Reset failed");
      setDone(true);
      setTimeout(() => router.replace("/login"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-emerald-600">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-[var(--rd-ink)]">Password updated</h2>
        <p className="mt-2 text-sm text-[var(--rd-ink-muted)]">Redirecting you to sign in…</p>
      </div>
    );
  }

  const inputBase = "w-full rounded-lg px-4 py-3 pr-11 text-sm text-[var(--rd-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--rd-primary)]/30 transition-all";
  const inputStyle = { background: "#f0f4fb", border: "1.5px solid transparent" };

  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--rd-ink)] leading-tight">
        Set a new{" "}
        <span className="relative inline-block">
          password
          <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full" style={{ background: "var(--rd-primary)" }} />
        </span>
      </h1>
      <p className="mt-3 text-sm text-[var(--rd-ink-muted)]">
        Must be at least 8 characters with an uppercase letter, number, and special character.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        {/* New password */}
        <div>
          <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">New password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className={inputBase}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--rd-primary)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
            />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]">
              <EyeIcon open={showPw} />
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">Confirm new password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              className={inputBase}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--rd-primary)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
            />
            <button type="button" onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]">
              <EyeIcon open={showConfirm} />
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-[var(--rd-error)] bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy || !password || !confirm}
          className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          style={{ background: "#111827" }}
        >
          {busy ? "Updating…" : "Update password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8f9fb] px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src="/images/Logo origin.png" alt="Rydora" height={40} width={40} className="object-contain" />
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ecf4] px-8 py-9">
          <Suspense>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
