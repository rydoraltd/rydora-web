"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { shortDate, titleCase } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, Column } from "@/components/dashboard/DataTable";

interface ExpiryRow {
  _id?: string;
  vehicleId: string;
  plateNumber: string;
  vehicle: string;
  docType: string;
  expiresAt: string;
  expired: boolean;
}

export default function DocumentRadarPage() {
  const [rows, setRows] = useState<ExpiryRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<ExpiryRow[]>("/vehicles/expiring-documents?days=60")
      .then(setRows)
      .catch((e) => setError(e.message));
  }, []);

  const columns: Column<ExpiryRow>[] = [
    { key: "vehicle", header: "Vehicle", render: (r) => <span className="font-medium">{r.vehicle}</span> },
    { key: "plate", header: "Plate", render: (r) => <span className="font-mono text-xs">{r.plateNumber}</span> },
    { key: "doc", header: "Document", render: (r) => titleCase(r.docType) },
    {
      key: "expiry", header: "Expires", render: (r) => (
        <span style={{ color: r.expired ? "var(--rd-error)" : "var(--rd-warning)" }} className="font-medium">
          {shortDate(r.expiresAt)}{r.expired ? " (expired)" : ""}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Document Radar" description="Insurance, roadworthiness, and licences expiring in the next 60 days." />
      {error ? <p className="text-sm text-[var(--rd-error)] mb-4">{error}</p> : null}
      <DataTable columns={columns} rows={rows} emptyText="Nothing expiring in the next 60 days." />
    </>
  );
}
