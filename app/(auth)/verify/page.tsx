"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API}/auth/verify-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const json = await res.json();
      if (!res.ok || json.success === false)
        throw new Error(json.message || "Verification failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <main className="min-h-screen bg-[var(--rd-surface)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm border border-[var(--rd-line)] bg-[var(--rd-panel)] p-8 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "var(--rd-primary)" }}
          >
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-[var(--rd-ink)]">Phone verified</h1>
          <p className="mt-3 text-sm text-[var(--rd-ink-muted)] leading-relaxed">
            Your account is now under review. The Rydora team will approve it
            within 48 hours and you will be notified.
          </p>
          <div className="mt-8 space-y-3">
            <Link
              href="/login"
              className="block w-full bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] py-2.5 text-sm font-medium text-center hover:bg-[var(--rd-primary-strong)]"
            >
              Go to sign in
            </Link>
            <Link
              href="/"
              className="block w-full border border-[var(--rd-line)] text-[var(--rd-ink-muted)] py-2.5 text-sm text-center hover:border-[var(--rd-ink-muted)]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--rd-surface)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-[var(--rd-line)] bg-[var(--rd-panel)] p-8">
        <Link href="/" className="font-semibold tracking-tight text-lg text-[var(--rd-ink)]">
          RYDORA
        </Link>
        <h1 className="mt-6 text-lg font-medium text-[var(--rd-ink)]">Verify your phone</h1>
        <p className="text-sm text-[var(--rd-ink-muted)] mt-1 leading-relaxed">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-[var(--rd-ink)]">{phone || "your phone"}</span>.
          Enter it below.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">
              Verification code
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              required
              className="mt-1 w-full border border-[var(--rd-line)] px-3 py-2 text-sm bg-[var(--rd-panel)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] tracking-[0.3em] font-mono"
            />
          </label>

          {error && <p className="text-sm text-[var(--rd-error)]">{error}</p>}

          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className="w-full bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] py-2.5 text-sm font-medium hover:bg-[var(--rd-primary-strong)] disabled:opacity-50"
          >
            {busy ? "Verifying…" : "Verify phone"}
          </button>

          <p className="text-xs text-[var(--rd-ink-muted)]">
            Didn&apos;t receive the code?{" "}
            <Link href="/register" className="text-[var(--rd-primary)] hover:underline">
              Go back and try again
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
