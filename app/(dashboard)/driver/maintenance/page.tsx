"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { shortDate, titleCase, naira } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface Row {
  _id: string;
  category: string;
  description: string;
  status: string;
  actualCostKobo?: number;
  createdAt: string;
}

const CATEGORIES = ["routine_service", "repair", "tyres", "electrical", "bodywork", "other"] as const;

export default function DriverMaintenancePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [category, setCategory] = useState<string>("repair");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api<Row[]>("/driver/maintenance").then(setRows).catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await api("/driver/maintenance", { method: "POST", body: { category, description } });
      setDescription("");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit request");
    } finally {
      setBusy(false);
    }
  }

  const columns: Column<Row>[] = [
    { key: "date", header: "Date", render: (r) => shortDate(r.createdAt) },
    { key: "category", header: "Category", render: (r) => titleCase(r.category) },
    { key: "desc", header: "Description", render: (r) => <span className="text-[var(--rd-ink-muted)]">{r.description}</span> },
    { key: "cost", header: "Cost", align: "right", render: (r) => (r.actualCostKobo ? naira(r.actualCostKobo) : "") },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <>
      <PageHeader title="Maintenance" description="Report a fault or request service on your vehicle." />

      <div className="border border-[var(--rd-line)] bg-[var(--rd-panel)] p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-[var(--rd-line)] bg-[var(--rd-panel)] text-sm px-3 py-2"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{titleCase(c)}</option>)}
          </select>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue (at least 10 characters)"
            className="flex-1 border border-[var(--rd-line)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--rd-primary)]"
          />
          <button
            onClick={submit}
            disabled={busy || description.trim().length < 10}
            className="px-4 py-2 text-sm font-medium bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50"
          >
            {busy ? "Submitting" : "Submit request"}
          </button>
        </div>
        {error ? <p className="text-sm text-[var(--rd-error)] mt-3">{error}</p> : null}
      </div>

      <DataTable columns={columns} rows={rows} emptyText="No maintenance requests yet." />
    </>
  );
}
