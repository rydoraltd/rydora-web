"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  targetKobo: number;
  paidKobo: number;
  daysActive: number;
  compliance: number;
}

interface MonthlyReport {
  month: string;
  totalRemittedKobo: number;
  totalTargetKobo: number;
  daysActive: number;
  avgDailyKobo: number;
  complianceRate: number;
}

interface ReportsData {
  currentWeek: WeeklyReport | null;
  monthly: MonthlyReport[];
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

function monthLabel(iso: string) {
  return new Date(iso + "-01").toLocaleDateString("en-NG", { month: "long", year: "numeric" });
}

function CompliancePill({ value }: { value: number }) {
  const color = value >= 80 ? "bg-emerald-100 text-emerald-700" : value >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{value.toFixed(0)}%</span>;
}

export default function DriverReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);

  useEffect(() => {
    api<ReportsData>("/driver/reports")
      .then(setData)
      .catch(() => setData({ currentWeek: null, monthly: [] }));
  }, []);

  const week = data?.currentWeek;
  const weekPct = week && week.targetKobo ? Math.min(100, Math.round((week.paidKobo / week.targetKobo) * 100)) : 0;

  return (
    <>
      <PageHeader
        title="Reports"
        description="Your weekly and monthly performance at a glance."
        breadcrumb={[{ label: "Home", href: "/driver" }, { label: "Reports" }]}
      />

      {/* This week */}
      <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--rd-ink)]">This Week</h2>
          {week && (
            <span className="text-xs text-[var(--rd-ink-muted)]">{shortDate(week.weekStart)} – {shortDate(week.weekEnd)}</span>
          )}
        </div>

        {week ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              {[
                { label: "Target",      value: naira(week.targetKobo) },
                { label: "Paid",        value: naira(week.paidKobo) },
                { label: "Days Active", value: String(week.daysActive) },
                { label: "Compliance",  value: `${week.compliance.toFixed(0)}%` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[var(--rd-surface)] rounded-xl p-3">
                  <p className="text-xs text-[var(--rd-ink-muted)]">{label}</p>
                  <p className="text-lg font-bold text-[var(--rd-ink)] mt-1">{value}</p>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-xs text-[var(--rd-ink-muted)] mb-1.5">
                <span>Weekly progress</span><span>{weekPct}%</span>
              </div>
              <div className="h-2 bg-[var(--rd-surface)] rounded-full overflow-hidden">
                <div className="h-2 bg-[var(--rd-primary)] rounded-full transition-all" style={{ width: `${weekPct}%` }} />
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-[var(--rd-ink-muted)]">No data available for this week.</p>
        )}
      </div>

      {/* Monthly history */}
      <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--rd-line)]">
          <h2 className="text-sm font-semibold text-[var(--rd-ink)]">Monthly Summary</h2>
        </div>
        {(data?.monthly.length ?? 0) === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-[var(--rd-ink-muted)]">No monthly data available yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--rd-surface)] border-b border-[var(--rd-line)]">
                {["Month", "Total Remitted", "Target", "Days Active", "Avg / Day", "Compliance"].map((h, i) => (
                  <th key={h} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)] ${i >= 1 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data!.monthly.map((m) => (
                <tr key={m.month} className="border-b border-[var(--rd-line)] last:border-0 hover:bg-[var(--rd-surface)] transition-colors">
                  <td className="px-5 py-3.5 text-[var(--rd-ink-body)] font-medium">{monthLabel(m.month)}</td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-[var(--rd-ink)]">{naira(m.totalRemittedKobo)}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-[var(--rd-ink-muted)]">{naira(m.totalTargetKobo)}</td>
                  <td className="px-5 py-3.5 text-right text-[var(--rd-ink-body)]">{m.daysActive}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-[var(--rd-ink-body)]">{naira(m.avgDailyKobo)}</td>
                  <td className="px-5 py-3.5 text-right"><CompliancePill value={m.complianceRate} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
