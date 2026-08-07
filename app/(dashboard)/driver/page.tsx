"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";

interface DriverHome {
  vehicle: { make: string; model: string; year: number; plateNumber: string } | null;
  virtualAccount: { bankName: string; accountNumber: string; accountName: string } | null;
  week: { targetKobo: number; paidKobo: number; remainingKobo: number };
}

export default function DriverHomePage() {
  const [data, setData] = useState<DriverHome | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<DriverHome>("/driver/home").then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-sm text-[var(--rd-error)]">{error}</p>;
  if (!data) return <p className="text-sm text-[var(--rd-ink-muted)]">Loading</p>;

  const pct = data.week.targetKobo ? Math.min(100, Math.round((data.week.paidKobo / data.week.targetKobo) * 100)) : 0;

  return (
    <>
      <PageHeader
        title={data.vehicle ? `${data.vehicle.make} ${data.vehicle.model} ${data.vehicle.year}` : "No vehicle assigned yet"}
        description={data.vehicle ? `Plate ${data.vehicle.plateNumber}` : "You will see your vehicle here once operations assigns one to you."}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="This week's target" value={naira(data.week.targetKobo)} />
        <StatCard label="Paid so far" value={naira(data.week.paidKobo)} tone="accent" />
        <StatCard label="Remaining" value={naira(data.week.remainingKobo)} />
      </div>

      <div className="mt-4 border border-[var(--rd-line)] bg-[var(--rd-panel)] p-5 rounded-xl shadow-[var(--rd-shadow-sm)]">
        <div className="flex justify-between text-xs text-[var(--rd-ink-muted)] mb-2">
          <span>Weekly progress</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 bg-[var(--rd-surface)] rounded-full overflow-hidden">
          <div className="h-2 bg-[var(--rd-primary)] rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {data.virtualAccount ? (
        <section className="mt-8 border border-[var(--rd-line)] bg-[var(--rd-inverse)] text-[var(--rd-ink-on-dark)] p-6 rounded-xl">
          <h2 className="text-[11px] uppercase tracking-[0.14em] opacity-70">Pay your remittance to</h2>
          <p className="mt-3 text-2xl font-semibold tracking-wide tabular-nums">{data.virtualAccount.accountNumber}</p>
          <p className="mt-1 text-sm opacity-80">{data.virtualAccount.bankName}</p>
          <p className="text-sm opacity-80">{data.virtualAccount.accountName}</p>
          <p className="mt-4 text-xs opacity-60">
            Transfers to this account are matched to you automatically. No screenshots, no proof needed.
          </p>
        </section>
      ) : null}
    </>
  );
}
