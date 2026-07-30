"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira, shortDate, titleCase } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface Row {
  _id: string;
  amountKobo: number;
  channel: string;
  status: string;
  paidAt: string;
  vehicle?: { plateNumber: string };
}

export default function DriverRemittancesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Row[]>("/driver/remittances").then(setRows).catch((e) => setError(e.message));
  }, []);

  const columns: Column<Row>[] = [
    { key: "date", header: "Date", render: (r) => shortDate(r.paidAt) },
    { key: "amount", header: "Amount", align: "right", render: (r) => <span className="font-medium">{naira(r.amountKobo)}</span> },
    { key: "channel", header: "Channel", render: (r) => titleCase(r.channel) },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <>
      <PageHeader title="Remittances" description="Every payment you have made, and its status." />
      {error ? <p className="text-sm text-[var(--rd-error)] mb-4">{error}</p> : null}
      <DataTable columns={columns} rows={rows} emptyText="No payments recorded yet." />
    </>
  );
}
