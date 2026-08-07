"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface Overview {
  counts: { users: number; vehicles: number; pendingUsers: number; pendingMaintenance: number };
  remittances: { totalKobo: number; count: number };
  remittanceTrend: { _id: string; kobo: number }[];
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Overview>("/admin/overview").then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-sm text-[var(--rd-error)]">{error}</p>;
  if (!data) return <p className="text-sm text-[var(--rd-ink-muted)]">Loading</p>;

  const max = Math.max(1, ...data.remittanceTrend.map((d) => d.kobo));

  return (
    <>
      <PageHeader title="Overview" description="The state of the platform right now." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total remitted" value={naira(data.remittances.totalKobo)} hint={`${data.remittances.count} payments`} tone="accent" />
        <StatCard label="Vehicles" value={data.counts.vehicles} />
        <StatCard label="Users" value={data.counts.users} />
        <StatCard label="Pending approvals" value={data.counts.pendingUsers} hint={`${data.counts.pendingMaintenance} maintenance requests`} />
      </div>

      <section className="mt-8 border border-[var(--rd-line)] bg-[var(--rd-panel)] p-5 rounded-xl shadow-[var(--rd-shadow-sm)]">
        <h2 className="text-[11px] uppercase tracking-[0.14em] text-[var(--rd-ink-muted)] mb-4">
          Remittances, last 30 days
        </h2>
        {data.remittanceTrend.length === 0 ? (
          <p className="text-sm text-[var(--rd-ink-muted)] py-6">No remittances recorded yet.</p>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {data.remittanceTrend.map((d) => (
              <div key={d._id} className="flex-1 flex flex-col justify-end group" title={`${d._id}: ${naira(d.kobo)}`}>
                <div className="bg-[var(--rd-primary)] group-hover:bg-[var(--rd-primary-strong)] rounded-t-sm" style={{ height: `${(d.kobo / max) * 100}%`, minHeight: 2 }} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
