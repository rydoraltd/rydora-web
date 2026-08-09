"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface TripRecord {
  _id: string;
  date: string;
  vehicle: string;
  remittanceKobo: number;
  status: string;
  notes?: string;
}

interface HistorySummary {
  totalDaysKobo: number;
  totalTrips: number;
  avgDailyKobo: number;
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function DriverHistoryPage() {
  const [rows, setRows] = useState<TripRecord[]>([]);
  const [summary, setSummary] = useState<HistorySummary | null>(null);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  useEffect(() => {
    api<TripRecord[]>(`/driver/history?month=${month}`)
      .then(setRows)
      .catch(() => setRows([]));
    api<HistorySummary>("/driver/history/summary")
      .then(setSummary)
      .catch(() => setSummary({ totalDaysKobo: 0, totalTrips: 0, avgDailyKobo: 0 }));
  }, [month]);

  const columns: Column<TripRecord>[] = [
    { key: "date",    header: "Date",       render: (r) => shortDate(r.date) },
    { key: "vehicle", header: "Vehicle",    render: (r) => r.vehicle },
    { key: "amount",  header: "Remittance", align: "right", render: (r) => <span className="font-semibold tabular-nums">{naira(r.remittanceKobo)}</span> },
    { key: "status",  header: "Status",     render: (r) => <StatusBadge status={r.status} /> },
    { key: "notes",   header: "Notes",      render: (r) => <span className="text-[var(--rd-ink-muted)]">{r.notes ?? "—"}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Trip History"
        description="Your daily activity and remittance record."
        breadcrumb={[{ label: "Home", href: "/driver" }, { label: "Trip History" }]}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Remitted",    value: summary ? naira(summary.totalDaysKobo) : "—" },
          { label: "Days Recorded",     value: String(summary?.totalTrips ?? "—") },
          { label: "Daily Average",     value: summary ? naira(summary.avgDailyKobo) : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-4 shadow-[var(--rd-shadow-sm)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">{label}</p>
            <p className="mt-2 text-xl font-bold tabular-nums text-[var(--rd-ink)]">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[var(--rd-ink)]">Activity Log</h2>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm border border-[var(--rd-line)] bg-[var(--rd-panel)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
        />
      </div>

      <DataTable columns={columns} rows={rows} emptyText="No activity recorded for this period." />
    </>
  );
}
