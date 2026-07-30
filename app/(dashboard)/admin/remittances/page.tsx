"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira, shortDate, titleCase } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface RemittanceRow {
  _id: string;
  amountKobo: number;
  channel: string;
  status: string;
  paidAt: string;
  driver?: { firstName: string; lastName: string; phone: string };
  vehicle?: { plateNumber: string };
}

export default function RemittancesPage() {
  const [rows, setRows] = useState<RemittanceRow[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    api<{ items: RemittanceRow[] }>(`/admin/remittances${filter ? `?status=${filter}` : ""}`)
      .then((d) => setRows(d.items))
      .catch((e) => setError(e.message));
  }, [filter]);

  useEffect(load, [load]);

  const columns: Column<RemittanceRow>[] = [
    { key: "driver", header: "Driver", render: (r) => r.driver ? <span className="font-medium">{r.driver.firstName} {r.driver.lastName}</span> : <span className="text-[var(--rd-error)]">Unmatched</span> },
    { key: "vehicle", header: "Vehicle", render: (r) => r.vehicle?.plateNumber ?? "" },
    { key: "amount", header: "Amount", align: "right", render: (r) => <span className="font-medium">{naira(r.amountKobo)}</span> },
    { key: "channel", header: "Channel", render: (r) => titleCase(r.channel) },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "paid", header: "Paid", render: (r) => shortDate(r.paidAt) },
  ];

  return (
    <>
      <PageHeader
        title="Remittances"
        description="Every payment received, matched to driver and vehicle."
        action={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-[var(--rd-line)] bg-[var(--rd-panel)] text-sm px-3 py-2"
          >
            <option value="">All statuses</option>
            <option value="reconciled">Reconciled</option>
            <option value="received">Received</option>
            <option value="flagged">Flagged</option>
          </select>
        }
      />
      {error ? <p className="text-sm text-[var(--rd-error)] mb-4">{error}</p> : null}
      <DataTable columns={columns} rows={rows} emptyText="No remittances yet." />
    </>
  );
}
