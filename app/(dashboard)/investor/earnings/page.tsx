"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";

/* ── types ── */
interface WeeklyEarning {
  weekStart: string;
  weekEnd: string;
  earnedKobo: number;
  vehicles: { plateNumber: string; earnedKobo: number }[];
}

interface MonthlyEarning {
  month: string;          // "2025-08"
  earnedKobo: number;
  vehicles: { plateNumber: string; earnedKobo: number }[];
}

interface YearlyEarning {
  year: number;
  earnedKobo: number;
  vehicles: { plateNumber: string; earnedKobo: number }[];
}

type Period = "weekly" | "monthly" | "yearly";

/* ── helpers ── */
function fmt(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleDateString("en-NG", opts);
}

function monthLabel(iso: string) {
  return new Date(iso + "-01").toLocaleDateString("en-NG", { month: "long", year: "numeric" });
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
        className="text-[var(--rd-ink-muted)]/30 mx-auto mb-3">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
      <p className="text-sm text-[var(--rd-ink-muted)]">No earnings found for this period.</p>
    </div>
  );
}

/* ── sub-tables ── */
function WeeklyTable({ rows }: { rows: WeeklyEarning[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!rows.length) return <EmptyState />;
  const total = rows.reduce((s, r) => s + r.earnedKobo, 0);
  return (
    <>
      <div className="flex justify-between items-center px-5 py-3 border-b border-[var(--rd-line)] bg-[var(--rd-surface)]">
        <span className="text-xs text-[var(--rd-ink-muted)]">{rows.length} week{rows.length !== 1 ? "s" : ""}</span>
        <span className="text-xs font-semibold text-[var(--rd-ink)]">Total: <span className="text-[var(--rd-primary)]">{naira(total)}</span></span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--rd-line)]">
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">Week</th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)] hidden sm:table-cell">Vehicles</th>
            <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">Earned</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const key = r.weekStart;
            const isOpen = open === key;
            return (
              <>
                <tr
                  key={key}
                  onClick={() => setOpen(isOpen ? null : key)}
                  className="border-b border-[var(--rd-line)] hover:bg-[var(--rd-surface)] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5 text-[var(--rd-ink-body)]">
                    <span className="font-medium">{fmt(r.weekStart, { day: "numeric", month: "short" })}</span>
                    <span className="text-[var(--rd-ink-muted)] mx-1">–</span>
                    {fmt(r.weekEnd, { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-[var(--rd-ink-muted)] hidden sm:table-cell">{r.vehicles.length} vehicle{r.vehicles.length !== 1 ? "s" : ""}</td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-[var(--rd-primary)]">{naira(r.earnedKobo)}</td>
                </tr>
                {isOpen && r.vehicles.map((v) => (
                  <tr key={v.plateNumber} className="border-b border-[var(--rd-line)] bg-[var(--rd-surface)]">
                    <td className="pl-10 pr-5 py-2.5 text-xs font-mono text-[var(--rd-ink-muted)]">{v.plateNumber}</td>
                    <td className="hidden sm:table-cell" />
                    <td className="px-5 py-2.5 text-right text-xs font-semibold tabular-nums text-[var(--rd-ink)]">{naira(v.earnedKobo)}</td>
                  </tr>
                ))}
              </>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function MonthlyTable({ rows }: { rows: MonthlyEarning[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!rows.length) return <EmptyState />;
  const total = rows.reduce((s, r) => s + r.earnedKobo, 0);
  return (
    <>
      <div className="flex justify-between items-center px-5 py-3 border-b border-[var(--rd-line)] bg-[var(--rd-surface)]">
        <span className="text-xs text-[var(--rd-ink-muted)]">{rows.length} month{rows.length !== 1 ? "s" : ""}</span>
        <span className="text-xs font-semibold text-[var(--rd-ink)]">Total: <span className="text-[var(--rd-primary)]">{naira(total)}</span></span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--rd-line)]">
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">Month</th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)] hidden sm:table-cell">Vehicles</th>
            <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">Earned</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const isOpen = open === r.month;
            return (
              <>
                <tr
                  key={r.month}
                  onClick={() => setOpen(isOpen ? null : r.month)}
                  className="border-b border-[var(--rd-line)] hover:bg-[var(--rd-surface)] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5 font-medium text-[var(--rd-ink-body)]">{monthLabel(r.month)}</td>
                  <td className="px-5 py-3.5 text-[var(--rd-ink-muted)] hidden sm:table-cell">{r.vehicles.length} vehicle{r.vehicles.length !== 1 ? "s" : ""}</td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-[var(--rd-primary)]">{naira(r.earnedKobo)}</td>
                </tr>
                {isOpen && r.vehicles.map((v) => (
                  <tr key={v.plateNumber} className="border-b border-[var(--rd-line)] bg-[var(--rd-surface)]">
                    <td className="pl-10 pr-5 py-2.5 text-xs font-mono text-[var(--rd-ink-muted)]">{v.plateNumber}</td>
                    <td className="hidden sm:table-cell" />
                    <td className="px-5 py-2.5 text-right text-xs font-semibold tabular-nums text-[var(--rd-ink)]">{naira(v.earnedKobo)}</td>
                  </tr>
                ))}
              </>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function YearlyTable({ rows }: { rows: YearlyEarning[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!rows.length) return <EmptyState />;
  const total = rows.reduce((s, r) => s + r.earnedKobo, 0);
  return (
    <>
      <div className="flex justify-between items-center px-5 py-3 border-b border-[var(--rd-line)] bg-[var(--rd-surface)]">
        <span className="text-xs text-[var(--rd-ink-muted)]">{rows.length} year{rows.length !== 1 ? "s" : ""}</span>
        <span className="text-xs font-semibold text-[var(--rd-ink)]">Total: <span className="text-[var(--rd-primary)]">{naira(total)}</span></span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--rd-line)]">
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">Year</th>
            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)] hidden sm:table-cell">Vehicles</th>
            <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">Earned</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const isOpen = open === r.year;
            return (
              <>
                <tr
                  key={r.year}
                  onClick={() => setOpen(isOpen ? null : r.year)}
                  className="border-b border-[var(--rd-line)] hover:bg-[var(--rd-surface)] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5 font-semibold text-[var(--rd-ink)]">{r.year}</td>
                  <td className="px-5 py-3.5 text-[var(--rd-ink-muted)] hidden sm:table-cell">{r.vehicles.length} vehicle{r.vehicles.length !== 1 ? "s" : ""}</td>
                  <td className="px-5 py-3.5 text-right font-bold tabular-nums text-[var(--rd-primary)] text-base">{naira(r.earnedKobo)}</td>
                </tr>
                {isOpen && r.vehicles.map((v) => (
                  <tr key={v.plateNumber} className="border-b border-[var(--rd-line)] bg-[var(--rd-surface)]">
                    <td className="pl-10 pr-5 py-2.5 text-xs font-mono text-[var(--rd-ink-muted)]">{v.plateNumber}</td>
                    <td className="hidden sm:table-cell" />
                    <td className="px-5 py-2.5 text-right text-xs font-semibold tabular-nums text-[var(--rd-ink)]">{naira(v.earnedKobo)}</td>
                  </tr>
                ))}
              </>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

/* ── page ── */
export default function EarningsPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [weekly,  setWeekly]  = useState<WeeklyEarning[]>([]);
  const [monthly, setMonthly] = useState<MonthlyEarning[]>([]);
  const [yearly,  setYearly]  = useState<YearlyEarning[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded,  setLoaded]  = useState<Set<Period>>(new Set());

  useEffect(() => {
    if (loaded.has(period)) return;
    setLoading(true);
    const ep =
      period === "weekly"  ? "/investor/earnings/weekly"  :
      period === "monthly" ? "/investor/earnings/monthly" :
                             "/investor/earnings/yearly";
    api<WeeklyEarning[] | MonthlyEarning[] | YearlyEarning[]>(ep)
      .then((data) => {
        if (period === "weekly")  setWeekly(data as WeeklyEarning[]);
        if (period === "monthly") setMonthly(data as MonthlyEarning[]);
        if (period === "yearly")  setYearly(data as YearlyEarning[]);
        setLoaded((prev) => new Set([...prev, period]));
      })
      .catch(() => {
        if (period === "weekly")  setWeekly([]);
        if (period === "monthly") setMonthly([]);
        if (period === "yearly")  setYearly([]);
        setLoaded((prev) => new Set([...prev, period]));
      })
      .finally(() => setLoading(false));
  }, [period, loaded]);

  const TABS: { key: Period; label: string }[] = [
    { key: "weekly",  label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "yearly",  label: "Yearly" },
  ];

  return (
    <>
      <PageHeader
        title="Earnings"
        description="Your investment returns broken down by week, month, and year. Click any row to see a per-vehicle breakdown."
        breadcrumb={[{ label: "Dashboard", href: "/investor" }, { label: "Earnings" }]}
      />

      <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-[var(--rd-line)]">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setPeriod(t.key)}
              className={[
                "flex-1 py-3.5 text-sm font-semibold transition-colors",
                period === t.key
                  ? "text-[var(--rd-primary)] border-b-2 border-[var(--rd-primary)] bg-[var(--rd-surface)]"
                  : "text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)] hover:bg-[var(--rd-surface)]",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center">
            <p className="text-sm text-[var(--rd-ink-muted)]">Loading…</p>
          </div>
        ) : (
          <>
            {period === "weekly"  && <WeeklyTable  rows={weekly} />}
            {period === "monthly" && <MonthlyTable rows={monthly} />}
            {period === "yearly"  && <YearlyTable  rows={yearly} />}
          </>
        )}
      </div>

      <p className="mt-3 text-xs text-[var(--rd-ink-muted)]">
        Click any row to expand the per-vehicle breakdown for that period.
      </p>
    </>
  );
}
