"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth, homeForRole } from "@/lib/auth";

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
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
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
    <main className="h-screen overflow-hidden flex">
      {/* Left panel — background image hero, fixed height */}
      <div
        className="hidden lg:flex lg:w-[58%] relative overflow-hidden flex-col justify-between p-12"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(145deg, rgba(6,13,26,0.88) 0%, rgba(9,24,40,0.82) 55%, rgba(7,17,31,0.88) 100%)" }}
        />
        {/* Ambient glows */}
        <div
          className="absolute -right-40 -top-40 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(30,95,175,0.18) 0%, transparent 65%)" }}
        />
        <div
          className="absolute -left-24 bottom-10 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(63,196,201,0.10) 0%, transparent 65%)" }}
        />

        {/* Top logo */}
        <div className="relative z-10">
          <Image src="/images/Logo white.png" alt="Rydora" height={36} width={36} className="object-contain" />
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <blockquote className="text-white/90 text-xl font-medium leading-relaxed max-w-md">
            &ldquo;Redefining mobility across Africa by connecting people, technology, vehicles, and investment through one intelligent, transparent ecosystem.&rdquo;
          </blockquote>
          <div className="flex gap-2 mt-6">
            <span className="w-5 h-1 rounded-full bg-white/25" />
            <span className="w-5 h-1 rounded-full bg-[var(--rd-primary)]" />
            <span className="w-5 h-1 rounded-full bg-white/25" />
          </div>
        </div>
      </div>

      {/* Right panel — scrollable form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-white overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Link href="/">
              <Image src="/images/Logo origin.png" alt="Rydora" height={36} width={36} className="object-contain" />
            </Link>
          </div>

          {/* Desktop: show logo top */}
          <div className="hidden lg:block mb-8">
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
            {/* Email field */}
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

            {/* Password field */}
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
              <Link href="/register" className="font-medium text-[var(--rd-primary)] hover:underline">
                Reset here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
