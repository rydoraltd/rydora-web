"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth, homeForRole } from "@/lib/auth";
import { AuthSlider } from "@/components/auth/AuthSlider";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const COUNTRY_CODES = [
  { code: "+234", label: "NG" },
  { code: "+1",   label: "US" },
  { code: "+44",  label: "GB" },
  { code: "+27",  label: "ZA" },
  { code: "+233", label: "GH" },
  { code: "+254", label: "KE" },
];

function InputField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-(--rd-ink-muted) mb-1.5">
        {label}
        {required && <span className="text-(--rd-error) ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg px-4 py-3 text-sm text-[var(--rd-ink)] focus:outline-none transition-all";
const inputStyle = { background: "#f0f4fb", border: "1.5px solid transparent" };

function focusIn(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "var(--rd-primary)";
}
function focusOut(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "transparent";
}

function RegisterForm() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const defaultRole = params.get("role") === "driver" ? "driver" : "investor";

  const [countryCode, setCountryCode] = useState("+234");
  const [role, setRole] = useState<"investor" | "driver">(defaultRole);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Redirect already-authenticated users straight to their portal
  useEffect(() => {
    if (!loading && user) {
      router.replace(homeForRole(user.role));
    }
  }, [user, loading, router]);

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions");
      return;
    }
    setBusy(true);
    setError(null);
    const phone = `${countryCode}${form.phone.replace(/^0/, "")}`;
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone,
          password: form.password,
          role,
        }),
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

  if (loading || (!loading && user)) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--rd-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="h-screen overflow-hidden flex">
      <AuthSlider className="lg:w-[42%]" />

      {/* Right panel — scrollable form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-14 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-lg mx-auto">
          {/* Logo — links to home */}
          <div className="mb-6">
            <Link href="/">
              <Image src="/images/Logo origin.png" alt="Rydora" height={34} width={34} className="object-contain" />
            </Link>
          </div>

          <h1 className="text-[1.9rem] font-bold text-[var(--rd-ink)] leading-tight">
            Let&rsquo;s get you{" "}
            <span className="relative inline-block">
              Onboard
              <span
                className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full"
                style={{ background: "var(--rd-primary)" }}
              />
            </span>
          </h1>
          <p className="mt-2.5 text-sm text-[var(--rd-ink-muted)]">
            Create an account to start earning monthly or booking rides
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {/* First name + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <InputField label="First name" required>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={field("firstName")}
                  placeholder="e.g. John"
                  required
                  minLength={2}
                  className={inputCls}
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </InputField>
              <InputField label="Last name" required>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={field("lastName")}
                  placeholder="e.g. Doe"
                  required
                  minLength={2}
                  className={inputCls}
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </InputField>
            </div>

            {/* Email */}
            <InputField label="Email" required>
              <input
                type="email"
                value={form.email}
                onChange={field("email")}
                placeholder="you@example.com"
                required
                className={inputCls}
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
              <p className="text-[11px] text-[var(--rd-ink-muted)] mt-1">
                enter a valid email address
              </p>
            </InputField>

            {/* Phone + User type */}
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Phone Number" required>
                <div className="flex gap-1.5">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="rounded-lg px-2 py-3 text-sm text-[var(--rd-ink)] focus:outline-none w-25 shrink-0"
                    style={{ background: "#f0f4fb", border: "1.5px solid transparent" }}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label} {c.code}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={field("phone")}
                    placeholder="Phone number"
                    required
                    className={inputCls + " flex-1"}
                    style={inputStyle}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
              </InputField>
              <InputField label="User type" required>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "investor" | "driver")}
                  className="w-full rounded-lg px-4 py-3 text-sm text-[var(--rd-ink)] focus:outline-none transition-all"
                  style={{ background: "#f0f4fb", border: "1.5px solid transparent" }}
                  onFocus={focusIn}
                  onBlur={focusOut}
                >
                  <option value="">Select account type</option>
                  <option value="investor">Owner / Investor</option>
                  <option value="driver">Professional Driver</option>
                </select>
              </InputField>
            </div>

            {/* Password */}
            <InputField label="Password" required>
              <input
                type="password"
                value={form.password}
                onChange={field("password")}
                placeholder="••••••••"
                required
                minLength={8}
                className={inputCls}
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
              <p className="text-[11px] text-[var(--rd-ink-muted)] mt-1">
                at least 8 characters, include an uppercase letter, a number, and a special character
              </p>
            </InputField>

            {/* Confirm password */}
            <InputField label="Confirm password" required>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={field("confirmPassword")}
                placeholder="••••••••"
                required
                className={inputCls}
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
              <p className="text-[11px] text-[var(--rd-ink-muted)] mt-1">
                enter confirm password
              </p>
            </InputField>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[var(--rd-primary)] shrink-0"
              />
              <span className="text-sm text-[var(--rd-ink-muted)]">
                I agree to all{" "}
                <span className="text-[var(--rd-primary)] font-medium">Terms &amp; conditions</span>{" "}
                and the{" "}
                <span className="text-[var(--rd-primary)] font-medium">privacy policy</span>.
              </span>
            </label>

            {error && (
              <p className="text-sm text-[var(--rd-error)] bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
              style={{ background: "#111827" }}
            >
              {busy ? "Creating account…" : "Create Account"}
            </button>

            <p className="text-sm text-center text-[var(--rd-ink-muted)]">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[var(--rd-primary)] hover:underline">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
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
