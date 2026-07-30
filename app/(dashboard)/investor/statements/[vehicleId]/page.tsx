"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { naira, shortDate, titleCase } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, Column } from "@/components/dashboard/DataTable";

interface Entry {
  _id: string;
  type: string;
  amountKobo: number;
  description?: string;
  entryDate: string;
}

interface Statement {
  vehicle: { plateNumber: string; make: string; model: string };
  entries: Entry[];
  totals: Record<string, number>;
}

const CREDIT_TYPES = new Set(["earnings_split_investor", "payout"]);

export default function StatementPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [data, setData] = useState<Statement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Statement>(`/investor/statements/${vehicleId}`).then(setData).catch((e) => setError(e.message));
  }, [vehicleId]);

  if (error) return <p className="text-sm text-[var(--rd-error)]">{error}</p>;
  if (!data) return <p className="text-sm text-[var(--rd-ink-muted)]">Loading</p>;

  const columns: Column<Entry>[] = [
    { key: "date", header: "Date", render: (e) => shortDate(e.entryDate) },
    { key: "type", header: "Entry", render: (e) => <span className="font-medium">{titleCase(e.type)}</span> },
    { key: "desc", header: "Description", render: (e) => <span className="text-[var(--rd-ink-muted)]">{e.description ?? ""}</span> },
    {
      key: "amount", header: "Amount", align: "right",
      render: (e) => (
        <span className="font-medium" style={{ color: CREDIT_TYPES.has(e.type) ? "var(--rd-success)" : "var(--rd-ink)" }}>
          {naira(e.amountKobo)}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={`${data.vehicle.make} ${data.vehicle.model}`}
        description={`Full ledger for ${data.vehicle.plateNumber}. Every entry is permanent.`}
      />
      <div className="mb-6 flex flex-wrap gap-x-8 gap-y-2 border border-[var(--rd-line)] bg-[var(--rd-panel)] p-5">
        {Object.entries(data.totals).map(([type, kobo]) => (
          <div key={type}>
            <span className="block text-[11px] uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">{titleCase(type)}</span>
            <span className="text-sm font-semibold tabular-nums">{naira(kobo)}</span>
          </div>
        ))}
      </div>
      <DataTable columns={columns} rows={data.entries} emptyText="No ledger activity yet." />
    </>
  );
}
