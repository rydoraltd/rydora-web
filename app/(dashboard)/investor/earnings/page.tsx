"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface DailyEarning {
  date: string;
  earnedKobo: number;
  vehicleId?: string;
  plateNumber?: string;
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-[var(--rd-ink-muted)]/30 mb-3">
        <rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
      <p className="text-sm font-medium text-[var(--rd-ink-muted)]">No records found</p>
      <p className="text-xs text-[var(--rd-ink-muted)] mt-1 max-w-[180px] leading-relaxed">{label}</p>
    </div>
  );
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function DailyEarningsPage() {
  const [earnings, setEarnings] = useState<DailyEarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    api<DailyEarning[]>("/investor/earnings/daily")
      .then(setEarnings)
      .catch(() => setEarnings([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = selectedMonth
    ? earnings.filter((e) => {
        const d = new Date(e.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === selectedMonth;
      })
    : earnings;

  const total = filtered.reduce((s, e) => s + e.earnedKobo, 0);

  return (
    <>
      <PageHeader
        title="Daily Earnings"
        description="See how much each vehicle earns per day."
        breadcrumb={[
          { label: "Dashboard", href: "/investor" },
          { label: "Daily Earnings" },
        ]}
      />

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="appearance-none rounded-lg px-4 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-panel)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] pr-8"
          >
            <option value="">Select Month</option>
            {MONTHS.map((m, i) => {
              const v = `${new Date().getFullYear()}-${String(i + 1).padStart(2, "0")}`;
              return <option key={m} value={v}>{m} {new Date().getFullYear()}</option>;
            })}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--rd-ink-muted)]">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="border border-[var(--rd-line)] bg-[var(--rd-panel)] rounded-xl">
              <EmptyState label="No earnings available for the selected filters." />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[var(--rd-ink-muted)]">{filtered.length} entries</p>
            <p className="text-sm font-semibold text-[var(--rd-ink)]">
              Total: <span className="text-[var(--rd-primary)]">{naira(total)}</span>
            </p>
          </div>
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--rd-line)] bg-[var(--rd-surface)]">
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">Vehicle</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">Earned</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => (
                  <tr key={i} className="border-b border-[var(--rd-line)] last:border-0 hover:bg-[var(--rd-surface)] transition-colors">
                    <td className="px-5 py-3.5 text-[var(--rd-ink-body)]">{shortDate(e.date)}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-[var(--rd-ink-muted)]">
                      {e.plateNumber ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-[var(--rd-primary)]">
                      {naira(e.earnedKobo)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
