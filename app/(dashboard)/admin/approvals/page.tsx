"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { shortDate, titleCase } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

const DOC_LABELS: Record<string, string> = {
  nin:             "NIN Slip",
  drivers_licence: "Driver's Licence",
  guarantor_form:  "Guarantor Form",
  utility_bill:    "Utility Bill",
  passport_photo:  "Passport Photo",
  other:           "Other",
};

interface KycDoc {
  _id: string;
  type: string;
  url: string;
  status: string;
}

interface PendingUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  kycStatus: string;
  kycDocuments: KycDoc[];
  driverProfile?: {
    licenceNumber?: string;
    licenceExpiry?: string;
    guarantorName?: string;
    guarantorPhone?: string;
  };
  createdAt: string;
}

function isPdf(url: string) {
  return url.toLowerCase().includes(".pdf") || url.toLowerCase().includes("/raw/upload/");
}

function KycReviewModal({
  user,
  onClose,
  onDecide,
  busyId,
}: {
  user: PendingUser;
  onClose: () => void;
  onDecide: (id: string, action: "approve" | "reject") => void;
  busyId: string | null;
}) {
  const busy = busyId === user._id;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--rd-line)]">
          <div>
            <h2 className="text-base font-semibold text-[var(--rd-ink)]">
              KYC Review — {user.firstName} {user.lastName}
            </h2>
            <p className="text-xs text-[var(--rd-ink-muted)] mt-0.5">
              {titleCase(user.role)} · {user.email} · {user.phone}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Driver profile details */}
          {user.role === "driver" && user.driverProfile && (
            <div className="grid grid-cols-2 gap-4 bg-[var(--rd-surface)] rounded-xl p-4 border border-[var(--rd-line)]">
              {user.driverProfile.licenceNumber && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[var(--rd-ink-muted)] font-medium">Licence number</p>
                  <p className="mt-0.5 text-sm font-mono text-[var(--rd-ink)]">{user.driverProfile.licenceNumber}</p>
                </div>
              )}
              {user.driverProfile.licenceExpiry && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[var(--rd-ink-muted)] font-medium">Licence expiry</p>
                  <p className="mt-0.5 text-sm text-[var(--rd-ink)]">{shortDate(user.driverProfile.licenceExpiry)}</p>
                </div>
              )}
              {user.driverProfile.guarantorName && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[var(--rd-ink-muted)] font-medium">Guarantor</p>
                  <p className="mt-0.5 text-sm text-[var(--rd-ink)]">{user.driverProfile.guarantorName}</p>
                </div>
              )}
              {user.driverProfile.guarantorPhone && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[var(--rd-ink-muted)] font-medium">Guarantor phone</p>
                  <p className="mt-0.5 text-sm font-mono text-[var(--rd-ink)]">{user.driverProfile.guarantorPhone}</p>
                </div>
              )}
            </div>
          )}

          {/* Documents */}
          {user.kycDocuments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-[var(--rd-ink-muted)]">No documents uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {user.kycDocuments.map((doc) => {
                const pdf = isPdf(doc.url);
                return (
                  <div
                    key={doc._id}
                    className="border border-[var(--rd-line)] rounded-xl overflow-hidden bg-[var(--rd-surface)]"
                  >
                    {/* Preview area */}
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-36 flex items-center justify-center bg-[var(--rd-surface)] hover:opacity-90 transition-opacity relative group"
                    >
                      {pdf ? (
                        <div className="flex flex-col items-center gap-1.5">
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-red-400">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span className="text-[11px] font-bold text-red-500 uppercase tracking-wide">PDF</span>
                        </div>
                      ) : (
                        <img
                          src={doc.url}
                          alt={DOC_LABELS[doc.type] ?? doc.type}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </div>
                    </a>

                    {/* Label */}
                    <div className="px-3 py-2.5 border-t border-[var(--rd-line)]">
                      <p className="text-xs font-semibold text-[var(--rd-ink)] truncate">
                        {DOC_LABELS[doc.type] ?? titleCase(doc.type)}
                      </p>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-[11px] text-[var(--rd-primary)] hover:underline"
                      >
                        {pdf ? "Open PDF" : "View full size"} →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[var(--rd-line)] bg-[var(--rd-surface)]">
          <p className="text-xs text-[var(--rd-ink-muted)]">Registered {shortDate(user.createdAt)}</p>
          <div className="flex gap-2">
            <button
              onClick={() => onDecide(user._id, "reject")}
              disabled={busy}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--rd-line)] text-[var(--rd-error)] hover:border-[var(--rd-error)] disabled:opacity-50 transition-colors"
            >
              {busy ? "…" : "Reject"}
            </button>
            <button
              onClick={() => onDecide(user._id, "approve")}
              disabled={busy}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--rd-primary)] text-white hover:bg-[var(--rd-primary-strong)] disabled:opacity-50 transition-colors"
            >
              {busy ? "…" : "Approve"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApprovalsPage() {
  const [rows, setRows]         = useState<PendingUser[]>([]);
  const [busyId, setBusyId]     = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<PendingUser | null>(null);

  const load = useCallback(() => {
    api<{ items: PendingUser[] }>("/admin/users?status=pending")
      .then((d) => setRows(d.items))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  async function decide(id: string, action: "approve" | "reject") {
    setBusyId(id);
    setError(null);
    try {
      await api(`/admin/users/${id}/${action}`, { method: "POST", body: {} });
      setReviewing(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  const columns: Column<PendingUser>[] = [
    {
      key: "name", header: "Name",
      render: (u) => <span className="font-medium">{u.firstName} {u.lastName}</span>,
    },
    { key: "role", header: "Role", render: (u) => titleCase(u.role) },
    {
      key: "contact", header: "Contact",
      render: (u) => <span className="text-[var(--rd-ink-muted)]">{u.email}<br />{u.phone}</span>,
    },
    {
      key: "kyc", header: "KYC",
      render: (u) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={u.kycStatus} />
          {u.kycDocuments?.length > 0 && (
            <span className="text-[11px] text-[var(--rd-ink-muted)]">
              {u.kycDocuments.length} doc{u.kycDocuments.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      ),
    },
    { key: "date", header: "Registered", render: (u) => shortDate(u.createdAt) },
    {
      key: "actions", header: "", align: "right",
      render: (u) => (
        <button
          onClick={() => setReviewing(u)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:border-[var(--rd-primary)] hover:text-[var(--rd-primary)] transition-colors"
        >
          Review
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Approvals"
        description="New registrations waiting for review. Click Review to inspect KYC documents before deciding."
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Approvals" },
        ]}
        action={
          rows.length > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {rows.length} pending
            </span>
          ) : null
        }
      />
      {error ? <p className="text-sm text-[var(--rd-error)] mb-4">{error}</p> : null}
      <DataTable columns={columns} rows={rows} emptyText="No pending registrations." />

      {reviewing && (
        <KycReviewModal
          user={reviewing}
          onClose={() => setReviewing(null)}
          onDecide={decide}
          busyId={busyId}
        />
      )}
    </>
  );
}
