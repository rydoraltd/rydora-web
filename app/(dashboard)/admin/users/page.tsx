"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { shortDate, titleCase } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  kycStatus: string;
  emailVerified: boolean;
  createdAt: string;
}

interface UsersResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

type Action = "approve" | "reject" | "suspend";

function ActionMenu({
  user,
  onAction,
  busy,
}: {
  user: User;
  onAction: (id: string, action: Action) => void;
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const canApprove = user.status === "pending" && user.emailVerified;
  const canReject  = user.status === "pending";
  const canSuspend = user.status === "active";

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={busy}
        className="p-1.5 rounded-lg text-[var(--rd-ink-muted)] hover:bg-[var(--rd-surface)] hover:text-[var(--rd-ink)] transition-colors disabled:opacity-40"
        aria-label="Actions"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-1 w-40 bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow)] py-1 text-sm">
          {canApprove && (
            <button
              onClick={() => { setOpen(false); onAction(user._id, "approve"); }}
              className="w-full text-left px-4 py-2 hover:bg-[var(--rd-surface)] text-emerald-600 font-medium transition-colors"
            >
              Approve
            </button>
          )}
          {canReject && (
            <button
              onClick={() => { setOpen(false); onAction(user._id, "reject"); }}
              className="w-full text-left px-4 py-2 hover:bg-[var(--rd-surface)] text-[var(--rd-error)] transition-colors"
            >
              Reject
            </button>
          )}
          {canSuspend && (
            <button
              onClick={() => { setOpen(false); onAction(user._id, "suspend"); }}
              className="w-full text-left px-4 py-2 hover:bg-[var(--rd-surface)] text-amber-600 transition-colors"
            >
              Suspend
            </button>
          )}
          {!canApprove && !canReject && !canSuspend && (
            <p className="px-4 py-2 text-[var(--rd-ink-muted)] text-xs">No actions available</p>
          )}
        </div>
      )}
    </div>
  );
}

const ROLES = ["investor", "driver", "fleet_operator"] as const;
const STATUSES = ["pending", "active", "suspended", "rejected"] as const;

export default function AdminUsersPage() {
  const [data, setData]       = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [busyId, setBusyId]   = useState<string | null>(null);

  const [q, setQ]           = useState("");
  const [role, setRole]     = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage]     = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (q)      params.set("q", q);
    if (role)   params.set("role", role);
    if (status) params.set("status", status);
    api<UsersResponse>(`/admin/users?${params}`)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [q, role, status, page]);

  useEffect(() => { load(); }, [load]);

  // Debounce search
  const qRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleSearch(v: string) {
    setQ(v);
    setPage(1);
    if (qRef.current) clearTimeout(qRef.current);
    qRef.current = setTimeout(() => {}, 0); // page change triggers load via useEffect
  }

  async function handleAction(id: string, action: Action) {
    setBusyId(id);
    setError(null);
    try {
      await api(`/admin/users/${id}/${action}`, { method: "POST", body: {} });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  const totalPages = data ? Math.ceil(data.total / 20) : 1;

  return (
    <>
      <PageHeader
        title="Users"
        description="All drivers, investors, and fleet operators on the platform."
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Users" },
        ]}
        action={
          data ? (
            <span className="text-sm text-[var(--rd-ink-muted)]">
              {data.total.toLocaleString()} total
            </span>
          ) : null
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rd-ink-muted)] pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search name, email, phone…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] placeholder:text-[var(--rd-ink-muted)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
          />
        </div>

        <select
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm rounded-lg border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
        >
          <option value="">All roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{titleCase(r)}</option>)}
        </select>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm rounded-lg border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
        </select>

        {(q || role || status) && (
          <button
            onClick={() => { setQ(""); setRole(""); setStatus(""); setPage(1); }}
            className="px-3 py-2 text-sm rounded-lg border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)] hover:border-[var(--rd-ink-muted)] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {error && <p className="text-sm text-[var(--rd-error)] mb-4">{error}</p>}

      {/* Table */}
      <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl overflow-hidden shadow-[var(--rd-shadow-sm)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--rd-line)] bg-[var(--rd-surface)]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--rd-ink-muted)] uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--rd-ink-muted)] uppercase tracking-wide">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--rd-ink-muted)] uppercase tracking-wide">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--rd-ink-muted)] uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--rd-ink-muted)] uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--rd-ink-muted)] uppercase tracking-wide">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--rd-ink-muted)]">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && data?.items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--rd-ink-muted)]">
                    No users match your filters.
                  </td>
                </tr>
              )}
              {!loading && data?.items.map((u) => (
                <tr key={u._id} className="border-b border-[var(--rd-line)] last:border-0 hover:bg-[var(--rd-surface)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--rd-ink)]">{u.firstName} {u.lastName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--rd-surface)] border border-[var(--rd-line)] text-[var(--rd-ink-body)]">
                      {titleCase(u.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--rd-ink-muted)]">
                    <p>{u.email}</p>
                    <p className="text-xs mt-0.5">{u.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-4 py-3">
                    {u.emailVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">Unverified</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--rd-ink-muted)] text-xs">{shortDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <ActionMenu user={u} onAction={handleAction} busy={busyId === u._id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--rd-line)] bg-[var(--rd-surface)]">
            <p className="text-xs text-[var(--rd-ink-muted)]">
              Showing {((page - 1) * 20) + 1}–{Math.min(page * 20, data.total)} of {data.total}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:bg-[var(--rd-panel)] disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:bg-[var(--rd-panel)] disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
