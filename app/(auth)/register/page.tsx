"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const inputCls = "mt-1 w-full border border-[var(--rd-line)] px-3 py-2 text-sm bg-[var(--rd-panel)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] rounded-lg";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultRole = params.get("role") === "driver" ? "driver" : "investor";

  const [role, setRole] = useState<"investor" | "driver">(defaultRole);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });
      const json = await res.json();
      if (!res.ok || json.success === false)
        throw new Error(json.message || "Registration failed");
      router.push(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  const roles: { value: "investor" | "driver"; label: string; description: string }[] = [
    { value: "investor", label: "Owner / Investor", description: "I want to put a vehicle on the platform and earn returns." },
    { value: "driver", label: "Professional driver", description: "I want to drive a Rydora vehicle and earn income." },
  ];

  return (
    <main className="min-h-screen bg-[var(--rd-surface)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md border border-[var(--rd-line)] bg-[var(--rd-panel)] p-8 rounded-2xl shadow-[var(--rd-shadow-md)]">
        <Link href="/" className="font-semibold tracking-tight text-lg text-[var(--rd-ink)]">
          RYDORA
        </Link>
        <h1 className="mt-6 text-lg font-medium text-[var(--rd-ink)]">Create your account</h1>
        <p className="text-sm text-[var(--rd-ink-muted)] mt-1">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--rd-primary)] hover:underline">
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Role selector */}
          <div>
            <span className="text-xs uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">
              I am joining as
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`text-left p-3 border text-sm transition-colors rounded-xl ${
                    role === r.value
                      ? "border-[var(--rd-primary)] bg-[var(--rd-surface)]"
                      : "border-[var(--rd-line)] hover:border-[var(--rd-ink-muted)]"
                  }`}
                >
                  <span
                    className={`block font-medium text-xs ${
                      role === r.value ? "text-[var(--rd-primary)]" : "text-[var(--rd-ink)]"
                    }`}
                  >
                    {r.label}
                  </span>
                  <span className="block text-[11px] text-[var(--rd-ink-muted)] mt-0.5 leading-tight">
                    {r.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            {(["firstName", "lastName"] as const).map((key) => (
              <label key={key} className="block">
                <span className="text-xs uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">
                  {key === "firstName" ? "First name" : "Last name"}
                </span>
                <input type="text" value={form[key]} onChange={field(key)} required className={inputCls} />
              </label>
            ))}
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">Email address</span>
            <input type="email" value={form.email} onChange={field("email")} required className={inputCls} />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">Phone number</span>
            <input type="tel" value={form.phone} onChange={field("phone")} required placeholder="+2348012345678" className={inputCls} />
            <span className="text-[11px] text-[var(--rd-ink-muted)] mt-1 block">Used for your account profile.</span>
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">Password</span>
            <input type="password" value={form.password} onChange={field("password")} required minLength={8} className={inputCls} />
            <span className="text-[11px] text-[var(--rd-ink-muted)] mt-1 block">Minimum 8 characters.</span>
          </label>

          {error && <p className="text-sm text-[var(--rd-error)]">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] py-2.5 text-sm font-medium hover:bg-[var(--rd-primary-strong)] disabled:opacity-50 rounded-lg"
          >
            {busy ? "Creating account…" : "Create account"}
          </button>

          <p className="text-[11px] text-[var(--rd-ink-muted)] leading-relaxed">
            By registering you confirm that the information you provide is accurate.
            Your account will be reviewed by the Rydora team before activation.
          </p>
        </form>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
