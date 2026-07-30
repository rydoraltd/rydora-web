"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { shortDate, titleCase } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface PendingUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  kycStatus: string;
  createdAt: string;
}

export default function ApprovalsPage() {
  const [rows, setRows] = useState<PendingUser[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  const columns: Column<PendingUser>[] = [
    { key: "name", header: "Name", render: (u) => <span className="font-medium">{u.firstName} {u.lastName}</span> },
    { key: "role", header: "Role", render: (u) => titleCase(u.role) },
    { key: "contact", header: "Contact", render: (u) => <span className="text-[var(--rd-ink-muted)]">{u.email}<br />{u.phone}</span> },
    { key: "kyc", header: "KYC", render: (u) => <StatusBadge status={u.kycStatus} /> },
    { key: "date", header: "Registered", render: (u) => shortDate(u.createdAt) },
    {
      key: "actions", header: "", align: "right",
      render: (u) => (
        <span className="inline-flex gap-2">
          <button
            onClick={() => decide(u._id, "approve")}
            disabled={busyId === u._id}
            className="px-3 py-1.5 text-xs font-medium bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => decide(u._id, "reject")}
            disabled={busyId === u._id}
            className="px-3 py-1.5 text-xs font-medium border border-[var(--rd-line)] text-[var(--rd-error)] hover:border-[var(--rd-error)] disabled:opacity-50"
          >
            Reject
          </button>
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Approvals" description="New registrations waiting for review. Approving a driver also creates their virtual account." />
      {error ? <p className="text-sm text-[var(--rd-error)] mb-4">{error}</p> : null}
      <DataTable columns={columns} rows={rows} emptyText="No pending registrations." />
    </>
  );
}
