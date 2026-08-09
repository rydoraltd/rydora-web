"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira, shortDate, titleCase } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface Payment {
  _id: string;
  type: string;
  amountKobo: number;
  channel: string;
  status: string;
  description?: string;
  paidAt: string;
}

interface Summary {
  totalPaidKobo: number;
  thisMonthKobo: number;
  pendingKobo: number;
}

export default function DriverPaymentsPage() {
  const [rows, setRows] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  useEffect(() => {
    api<Payment[]>(`/driver/payments?month=${month}`)
      .then(setRows)
      .catch(() => setRows([]));
    api<Summary>("/driver/payments/summary")
      .then(setSummary)
      .catch(() => setSummary({ totalPaidKobo: 0, thisMonthKobo: 0, pendingKobo: 0 }));
  }, [month]);

  const columns: Column<Payment>[] = [
    { key: "date",        header: "Date",        render: (r) => shortDate(r.paidAt) },
    { key: "type",        header: "Type",        render: (r) => <span className="capitalize">{titleCase(r.type)}</span> },
    { key: "description", header: "Description", render: (r) => r.description ?? "—" },
    { key: "channel",     header: "Channel",     render: (r) => titleCase(r.channel) },
    { key: "amount",      header: "Amount",      align: "right", render: (r) => <span className="font-semibold tabular-nums">{naira(r.amountKobo)}</span> },
    { key: "status",      header: "Status",      render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Payments"
        description="All payments and remittances recorded against your account."
        breadcrumb={[{ label: "Home", href: "/driver" }, { label: "Payments" }]}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "All-time Paid",  value: summary?.totalPaidKobo ?? 0, accent: true },
          { label: "This Month",     value: summary?.thisMonthKobo ?? 0 },
          { label: "Pending",        value: summary?.pendingKobo ?? 0 },
        ].map(({ label, value, accent }) => (
          <div key={label} className={["rounded-xl p-5 border",
            accent
              ? "bg-[var(--rd-primary)] border-transparent text-white"
              : "bg-[var(--rd-panel)] border-[var(--rd-line)] shadow-[var(--rd-shadow-sm)]"].join(" ")}>
            <p className={`text-xs font-semibold uppercase tracking-wider ${accent ? "text-white/80" : "text-[var(--rd-ink-muted)]"}`}>{label}</p>
            <p className={`mt-2 text-2xl font-bold tabular-nums ${accent ? "text-white" : "text-[var(--rd-ink)]"}`}>{naira(value)}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[var(--rd-ink)]">Payment History</h2>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm border border-[var(--rd-line)] bg-[var(--rd-panel)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
        />
      </div>

      <DataTable columns={columns} rows={rows} emptyText="No payments found for this period." />
    </>
  );
}
