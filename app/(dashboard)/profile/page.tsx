"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { clearTokens } from "@/lib/api";

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

  // Deletion request state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteShowPw, setDeleteShowPw] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);

  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const avatarSrc = resolveAvatarSrc(user.avatarUrl);
  const canDeleteAccount = user.role === "investor" || user.role === "driver";

  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      const access = typeof window !== "undefined" ? localStorage.getItem("rd_access") : null;
      const res = await fetch(`${API_BASE}/auth/account/deletion-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(access ? { Authorization: `Bearer ${access}` } : {}),
        },
        body: JSON.stringify({ password: deletePassword }),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || "Request failed");
      setShowDeleteModal(false);
      setDeletionRequested(true);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setDeleteBusy(false);
    }
  }

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
      <PageHeader
        title="Profile"
        description="Your account details."
        breadcrumb={[
          { label: "Dashboard" },
          { label: "Profile" },
        ]}
      />

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

        {/* Danger zone */}
        {canDeleteAccount && (
          <div className="bg-[var(--rd-panel)] border border-red-200 rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
            <div className="px-5 py-4 border-b border-red-100 bg-red-50/60">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rd-error)]">
                Danger Zone
              </h2>
            </div>
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--rd-ink)]">Delete account</p>
                {deletionRequested ? (
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    Deletion request submitted — pending admin approval. You will be notified once a decision is made.
                  </p>
                ) : (
                  <p className="text-xs text-[var(--rd-ink-muted)] mt-0.5 leading-relaxed">
                    Request permanent removal of your account. This requires admin approval before taking effect.
                  </p>
                )}
              </div>
              {!deletionRequested && (
                <button
                  onClick={() => { setShowDeleteModal(true); setDeleteError(null); setDeletePassword(""); }}
                  className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium text-[var(--rd-error)] border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Request deletion
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 pt-6 pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--rd-error)]">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)] mt-0.5"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h2 className="mt-3 text-base font-semibold text-[var(--rd-ink)]">Request account deletion?</h2>
              <p className="mt-1.5 text-sm text-[var(--rd-ink-muted)] leading-relaxed">
                This submits a deletion request to our admin team. Your account will only be removed after they review and approve it.
              </p>
              {user.role === "investor" && (
                <div className="mt-3 flex gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-600 shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Accounts with active vehicles on the platform cannot be deleted. Contact support to offboard your vehicles first.
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleDeleteAccount} className="px-6 pb-6 pt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">
                  Confirm your password to continue
                </label>
                <div className="relative">
                  <input
                    type={deleteShowPw ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-lg px-4 py-2.5 pr-10 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-error)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setDeleteShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                      {deleteShowPw
                        ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                        : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                      }
                    </svg>
                  </button>
                </div>
              </div>

              {deleteError && (
                <p className="text-sm text-[var(--rd-error)] bg-red-50 px-3 py-2 rounded-lg">{deleteError}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-[var(--rd-line)] text-[var(--rd-ink-body)] hover:bg-[var(--rd-surface)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteBusy || !deletePassword}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-[var(--rd-error)] hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {deleteBusy ? "Submitting…" : "Submit request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
