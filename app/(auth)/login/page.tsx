"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, homeForRole } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    try {
      const user = await login(email, password);
      router.replace(homeForRole(user.role));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--rd-surface)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-[var(--rd-line)] bg-[var(--rd-panel)] p-8 rounded-2xl shadow-[var(--rd-shadow-md)]">
        <span className="font-semibold tracking-tight text-lg text-[var(--rd-ink)]">RYDORA</span>
        <h1 className="mt-6 text-lg font-medium text-[var(--rd-ink)]">Sign in</h1>
        <p className="text-sm text-[var(--rd-ink-muted)] mt-1">
          Access your Rydora dashboard.{" "}
          <Link href="/register" className="text-[var(--rd-primary)] hover:underline">
            Create an account
          </Link>
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-[var(--rd-line)] px-3 py-2 text-sm bg-[var(--rd-panel)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] rounded-lg"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="mt-1 w-full border border-[var(--rd-line)] px-3 py-2 text-sm bg-[var(--rd-panel)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] rounded-lg"
            />
          </label>
          {error ? <p className="text-sm text-[var(--rd-error)]">{error}</p> : null}
          <button
            onClick={handleSubmit}
            disabled={busy || !email || !password}
            className="w-full bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] py-2.5 text-sm font-medium hover:bg-[var(--rd-primary-strong)] disabled:opacity-50 rounded-lg"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}
