"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

const API_ORIGIN =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL)
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
    : "http://localhost:5000";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function resolveAvatarSrc(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const avatarSrc = resolveAvatarSrc(user.avatarUrl);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const access = typeof window !== "undefined" ? localStorage.getItem("rd_access") : null;
      const res = await fetch(`${API_BASE}/auth/avatar`, {
        method: "POST",
        headers: access ? { Authorization: `Bearer ${access}` } : {},
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || "Upload failed");
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <>
      <PageHeader title="Profile" description="Your account details." />

      <div className="max-w-lg space-y-4">
        {/* Avatar + identity card */}
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-6 shadow-[var(--rd-shadow-sm)]">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[var(--rd-line)]"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[var(--rd-primary)] flex items-center justify-center text-[var(--rd-ink-on-dark)] text-xl font-bold">
                  {initials}
                </div>
              )}

              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--rd-panel)] border border-[var(--rd-line)] flex items-center justify-center text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)] shadow-[var(--rd-shadow-sm)] disabled:opacity-50"
                title="Change photo"
              >
                {uploading ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                )}
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="sr-only"
              />
            </div>

            {/* Name + upload link */}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[var(--rd-ink)] text-base">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-[var(--rd-ink-muted)] mt-0.5 truncate">{user.email}</p>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="mt-2 text-xs text-[var(--rd-primary)] hover:underline disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Change photo"}
              </button>
            </div>
          </div>

          {success && (
            <p className="mt-4 text-sm text-[var(--rd-success)] bg-[rgba(29,122,79,0.07)] rounded-lg px-3 py-2">
              Profile photo updated.
            </p>
          )}
          {error && (
            <p className="mt-4 text-sm text-[var(--rd-error)] bg-[rgba(179,64,58,0.07)] rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <p className="mt-4 text-[11px] text-[var(--rd-ink-muted)]">
            JPG, PNG or WebP · max 2 MB
          </p>
        </div>

        {/* Account details */}
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--rd-line)]">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rd-ink-muted)]">
              Account details
            </h2>
          </div>
          <dl>
            {[
              { label: "Email", value: user.email },
              { label: "Role", value: user.role.replace(/_/g, " "), capitalize: true },
            ].map(({ label, value, capitalize }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--rd-line)] last:border-b-0">
                <dt className="text-sm text-[var(--rd-ink-muted)]">{label}</dt>
                <dd className={`text-sm font-medium text-[var(--rd-ink)] ${capitalize ? "capitalize" : ""}`}>{value}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-3.5">
              <dt className="text-sm text-[var(--rd-ink-muted)]">Account status</dt>
              <dd><StatusBadge status={user.status} /></dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
