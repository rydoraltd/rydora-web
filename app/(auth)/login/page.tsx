"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth, homeForRole } from "@/lib/auth";
import { AuthSlider } from "@/components/auth/AuthSlider";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Redirect already-authenticated users straight to their portal
  useEffect(() => {
    if (!loading && user) {
      router.replace(homeForRole(user.role));
    }
  }, [user, loading, router]);

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    try {
      const u = await login(email, password);
      router.replace(homeForRole(u.role));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  // Don't flash the form while checking session or while redirect is in flight
  if (loading || (!loading && user)) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--rd-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="h-screen overflow-hidden flex">
      <AuthSlider className="lg:w-[58%]" />

      {/* Right panel — scrollable form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-white overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo — links to home (mobile + desktop) */}
          <div className="mb-8">
            <Link href="/">
              <Image src="/images/Logo origin.png" alt="Rydora" height={36} width={36} className="object-contain" />
            </Link>
          </div>

          <h1 className="text-[2rem] font-bold text-[var(--rd-ink)] leading-tight">
            Welcome{" "}
            <span className="relative inline-block">
              back
              <span
                className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full"
                style={{ background: "var(--rd-primary)" }}
              />
            </span>
          </h1>
          <p className="mt-3 text-sm text-[var(--rd-ink-muted)]">
            Please enter your details to continue
          </p>

          <div className="mt-8 space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">
                Username
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg px-4 py-3 text-sm text-[var(--rd-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--rd-primary)]/30 transition-all"
                style={{ background: "#f0f4fb", border: "1.5px solid transparent" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--rd-primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••"
                  className="w-full rounded-lg px-4 py-3 pr-11 text-sm text-[var(--rd-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--rd-primary)]/30 transition-all"
                  style={{ background: "#f0f4fb", border: "1.5px solid transparent" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--rd-primary)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)] transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-[var(--rd-error)] bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={busy || !email || !password}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
              style={{ background: "#111827" }}
            >
              {busy ? "Signing in…" : "Login"}
            </button>
          </div>

          <div className="mt-6 space-y-2 text-center">
            <p className="text-sm text-[var(--rd-ink-muted)]">
              Don&rsquo;t have an account?{" "}
              <Link href="/register" className="font-medium text-[var(--rd-primary)] hover:underline">
                Create here
              </Link>
            </p>
            <p className="text-sm text-[var(--rd-ink-muted)]">
              Forgot Password?{" "}
              <Link href="/forgot-password" className="font-medium text-[var(--rd-primary)] hover:underline">
                Reset here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
