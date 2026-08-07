"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira, shortDate, titleCase } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, Column } from "@/components/dashboard/DataTable";

interface LedgerEntry {
  _id: string;
  type: string;
  amountKobo: number;
  description?: string;
  entryDate: string;
  vehicle?: { plateNumber: string; make: string; model: string };
  meta?: { state?: string };
}

const CREDIT = new Set(["earnings_split_investor"]);
const DEBIT = new Set(["vehicle_funding"]);

export default function LedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<LedgerEntry[]>("/investor/ledger")
      .then(setEntries)
      .catch((e) => setError(e.message));
  }, []);

  const columns: Column<LedgerEntry>[] = [
    { key: "date", header: "Date", render: (e) => shortDate(e.entryDate) },
    {
      key: "type",
      header: "Entry",
      render: (e) => (
        <span className="font-medium">{titleCase(e.type)}</span>
      ),
    },
    {
      key: "vehicle",
      header: "Vehicle",
      render: (e) =>
        e.vehicle ? (
          <span className="text-xs font-mono text-[var(--rd-ink-muted)]">
            {e.vehicle.plateNumber}
          </span>
        ) : (
          <span className="text-[var(--rd-ink-muted)]">—</span>
        ),
    },
    {
      key: "desc",
      header: "Description",
      render: (e) => (
        <span className="text-[var(--rd-ink-muted)]">
          {e.description ?? ""}
          {e.meta?.state ? ` (${e.meta.state})` : ""}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (e) => (
        <span
          className="font-medium tabular-nums"
          style={{
            color: CREDIT.has(e.type)
              ? "var(--rd-success)"
              : DEBIT.has(e.type)
              ? "var(--rd-error)"
              : "var(--rd-ink)",
          }}
        >
          {DEBIT.has(e.type) ? "−" : ""}
          {naira(e.amountKobo)}
        </span>
      ),
    },
  ];

  if (error) return <p className="text-sm text-[var(--rd-error)]">{error}</p>;

  return (
    <>
      <PageHeader
        title="Earnings Statement"
        description="See how each vehicle is performing and what you earn per payout cycle."
        breadcrumb={[
          { label: "Dashboard", href: "/investor" },
          { label: "Earnings Statement" },
        ]}
      />
      <DataTable
        columns={columns}
        rows={entries}
        emptyText="No ledger activity yet."
      />
    </>
  );
}
