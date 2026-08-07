"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAuth } from "@/lib/auth";

interface Overview {
  counts: { users: number; vehicles: number; pendingUsers: number; pendingMaintenance: number };
  remittances: { totalKobo: number; count: number };
  remittanceTrend: { _id: string; kobo: number }[];
}

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

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const [data, setData]       = useState<Overview | null>(null);
  const [admins, setAdmins]   = useState<Admin[]>([]);
  const [error, setError]     = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [busy, setBusy]       = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  function loadAdmins() {
    if (isSuperAdmin) {
      api<Admin[]>("/admin/admins").then(setAdmins).catch(() => {});
    }
  }

  useEffect(() => {
    api<Overview>("/admin/overview").then(setData).catch((e) => setError(e.message));
    loadAdmins();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdmin]);

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      await api("/admin/admins", { method: "POST", body: form as Record<string, unknown> });
      setFormSuccess(`Admin account created. A temporary password has been sent to ${form.email}.`);
      setForm(EMPTY_FORM);
      loadAdmins();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create admin");
    } finally {
      setBusy(false);
    }
  }

  const max = Math.max(1, ...(data?.remittanceTrend ?? []).map((d) => d.kobo));

  if (error) return <p className="text-sm text-[var(--rd-error)]">{error}</p>;
  if (!data) return <p className="text-sm text-[var(--rd-ink-muted)]">Loading</p>;

  return (
    <>
      <PageHeader
        title="Overview"
        description="The state of the platform right now."
        breadcrumb={[{ label: "Dashboard" }]}
        action={
          isSuperAdmin ? (
            <button
              onClick={() => { setShowModal(true); setFormError(null); setFormSuccess(null); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Admin
            </button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total remitted" value={naira(data.remittances.totalKobo)} hint={`${data.remittances.count} payments`} tone="accent" />
        <StatCard label="Vehicles" value={data.counts.vehicles} />
        <StatCard label="Users" value={data.counts.users} />
        <StatCard label="Pending approvals" value={data.counts.pendingUsers} hint={`${data.counts.pendingMaintenance} maintenance requests`} />
      </div>

      {/* Remittance trend chart */}
      <section className="mt-6 border border-[var(--rd-line)] bg-[var(--rd-panel)] p-5 rounded-xl shadow-[var(--rd-shadow-sm)]">
        <h2 className="text-[11px] uppercase tracking-[0.14em] text-[var(--rd-ink-muted)] mb-4">
          Remittances, last 30 days
        </h2>
        {data.remittanceTrend.length === 0 ? (
          <p className="text-sm text-[var(--rd-ink-muted)] py-6">No remittances recorded yet.</p>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {data.remittanceTrend.map((d) => (
              <div key={d._id} className="flex-1 flex flex-col justify-end group" title={`${d._id}: ${naira(d.kobo)}`}>
                <div className="bg-[var(--rd-primary)] group-hover:bg-[var(--rd-primary-strong)] rounded-t-sm" style={{ height: `${(d.kobo / max) * 100}%`, minHeight: 2 }} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Admin list — super_admin only */}
      {isSuperAdmin && (
        <section className="mt-6 border border-[var(--rd-line)] bg-[var(--rd-panel)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--rd-line)] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--rd-ink)]">Admin Accounts</h2>
            <span className="text-xs text-[var(--rd-ink-muted)]">{admins.length} admin{admins.length !== 1 ? "s" : ""}</span>
          </div>
          {admins.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-[var(--rd-ink-muted)]">No admin accounts yet.</p>
              <button
                onClick={() => setShowModal(true)}
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
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a._id} className="border-b border-[var(--rd-line)] last:border-0 hover:bg-[var(--rd-surface)] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[var(--rd-ink)]">{a.firstName} {a.lastName}</td>
                    <td className="px-5 py-3.5 text-[var(--rd-ink-muted)]">{a.email}</td>
                    <td className="px-5 py-3.5 text-[var(--rd-ink-muted)]">{a.phone}</td>
                    <td className="px-5 py-3.5">
                      <span className={[
                        "px-2 py-0.5 rounded-full text-[11px] font-medium",
                        a.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700",
                      ].join(" ")}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[var(--rd-ink-muted)]">{shortDate(a.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* Create Admin modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
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

            <form onSubmit={handleCreateAdmin} className="px-6 pt-5 pb-6 space-y-4">
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
                      required
                      minLength={2}
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
                <p className="text-sm text-[var(--rd-success)] bg-green-50 px-3 py-2 rounded-lg">{formSuccess}</p>
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
