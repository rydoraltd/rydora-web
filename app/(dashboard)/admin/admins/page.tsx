"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { shortDate } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

const EMPTY_FORM = { firstName: "", lastName: "", email: "", phone: "" };

export default function AdminsPage() {
  const [admins, setAdmins]   = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const [showModal, setShowModal]     = useState(false);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [busy, setBusy]               = useState(false);
  const [formError, setFormError]     = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  function load() {
    setLoading(true);
    api<Admin[]>("/admin/admins")
      .then(setAdmins)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      await api("/admin/admins", { method: "POST", body: form as Record<string, unknown> });
      setFormSuccess(`Admin created. A temporary password has been emailed to ${form.email}.`);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create admin");
    } finally {
      setBusy(false);
    }
  }

  function openModal() {
    setShowModal(true);
    setFormError(null);
    setFormSuccess(null);
  }

  return (
    <>
      <PageHeader
        title="Admin Accounts"
        description="Manage who has administrative access to the Rydora platform."
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Admin Accounts" },
        ]}
        action={
          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create Admin
          </button>
        }
      />

      {error && <p className="text-sm text-[var(--rd-error)] mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-[var(--rd-ink-muted)]">Loading…</p>
      ) : (
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl overflow-hidden shadow-[var(--rd-shadow-sm)]">
          {admins.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-[var(--rd-ink-muted)]/30 mx-auto mb-4">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p className="text-sm font-medium text-[var(--rd-ink-muted)]">No admin accounts yet</p>
              <button
                onClick={openModal}
                className="mt-3 text-sm text-[var(--rd-primary)] hover:underline font-medium"
              >
                Create the first admin →
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--rd-surface)] border-b border-[var(--rd-line)]">
                  {["Name", "Email", "Phone", "Status", "Created"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a._id} className="border-b border-[var(--rd-line)] last:border-0 hover:bg-[var(--rd-surface)] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[var(--rd-ink)]">
                      {a.firstName} {a.lastName}
                    </td>
                    <td className="px-5 py-3.5 text-[var(--rd-ink-muted)]">{a.email}</td>
                    <td className="px-5 py-3.5 text-[var(--rd-ink-muted)]">{a.phone}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-5 py-3.5 text-[var(--rd-ink-muted)] text-xs">{shortDate(a.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Create Admin modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--rd-panel)] rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 pt-6 pb-0 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--rd-ink)]">Create Admin Account</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="px-6 pt-1.5 pb-0 text-sm text-[var(--rd-ink-muted)]">
              A temporary password will be generated and emailed to the new admin.
            </p>

            <form onSubmit={handleCreate} className="px-6 pt-5 pb-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {(["firstName", "lastName"] as const).map((key) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">
                      {key === "firstName" ? "First name" : "Last name"} <span className="text-[var(--rd-error)]">*</span>
                    </label>
                    <input
                      type="text"
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      required minLength={2}
                      placeholder={key === "firstName" ? "e.g. Emeka" : "e.g. Obi"}
                      className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">
                  Email address <span className="text-[var(--rd-error)]">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="admin@rydora.ng"
                  className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">
                  Phone number <span className="text-[var(--rd-error)]">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  required
                  placeholder="+2348012345678"
                  className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
                />
              </div>

              {formError && (
                <p className="text-sm text-[var(--rd-error)] bg-red-50 px-3 py-2 rounded-lg">{formError}</p>
              )}
              {formSuccess && (
                <p className="text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">{formSuccess}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-[var(--rd-line)] text-[var(--rd-ink-body)] hover:bg-[var(--rd-surface)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50 transition-colors"
                >
                  {busy ? "Creating…" : "Create & send email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
