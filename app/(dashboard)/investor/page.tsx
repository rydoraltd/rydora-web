"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface PortfolioVehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  status: string;
  assignedDriver?: { firstName: string; lastName: string };
}

interface Portfolio {
  vehicles: PortfolioVehicle[];
  summary: {
    earningsByVehicle: { _id: string; earnedKobo: number }[];
    fundingByVehicle: { _id: string; fundedKobo: number }[];
    paidOutKobo: number;
  };
}

const EMPTY_PAYOUT = { amount: "", bankNote: "", busy: false, err: null as string | null, done: false };

export default function InvestorPage() {
  const [data, setData] = useState<Portfolio | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPayout, setShowPayout] = useState(false);
  const [payout, setPayout] = useState(EMPTY_PAYOUT);

  function load() {
    api<Portfolio>("/investor/portfolio").then(setData).catch((e) => setError(e.message));
  }

  useEffect(load, []);

  async function handlePayout(e: React.FormEvent) {
    e.preventDefault();
    setPayout((p) => ({ ...p, busy: true, err: null }));
    try {
      await api("/investor/payouts", {
        method: "POST",
        body: {
          amountKobo: Math.round(Number(payout.amount) * 100),
          bankNote: payout.bankNote.trim() || undefined,
        },
      });
      setPayout({ ...EMPTY_PAYOUT, done: true });
      load();
    } catch (err) {
      setPayout((p) => ({
        ...p,
        busy: false,
        err: err instanceof Error ? err.message : "Request failed",
      }));
    }
  }

  if (error) return <p className="text-sm text-[var(--rd-error)]">{error}</p>;
  if (!data) return <p className="text-sm text-[var(--rd-ink-muted)]">Loading</p>;

  const earned = data.summary.earningsByVehicle.reduce((s, r) => s + r.earnedKobo, 0);
  const invested = data.summary.fundingByVehicle.reduce((s, r) => s + r.fundedKobo, 0);
  const available = earned - data.summary.paidOutKobo;
  const earningsMap = new Map(data.summary.earningsByVehicle.map((r) => [r._id, r.earnedKobo]));

  return (
    <>
      <PageHeader title="Portfolio" description="Your vehicles and what they have earned you." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total earned" value={naira(earned)} tone="accent" />
        <StatCard label="Invested" value={naira(invested)} />
        <StatCard label="Paid out" value={naira(data.summary.paidOutKobo)} />
        <StatCard label="Available" value={naira(available)} hint="Ready for payout request" />
      </div>

      {/* Payout request */}
      {available > 0 && (
        <div className="mt-6 border border-[var(--rd-line)] bg-[var(--rd-panel)] p-5 rounded-xl shadow-[var(--rd-shadow-sm)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--rd-ink)]">Request a payout</p>
              <p className="text-xs text-[var(--rd-ink-muted)] mt-0.5">
                {naira(available)} available. Payouts are processed within 2 business days after admin approval.
              </p>
            </div>
            {!showPayout && (
              <button
                onClick={() => { setShowPayout(true); setPayout(EMPTY_PAYOUT); }}
                className="px-4 py-2 text-sm font-medium bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] hover:bg-[var(--rd-primary-strong)] shrink-0"
              >
                Request payout
              </button>
            )}
          </div>

          {showPayout && (
            payout.done ? (
              <div className="mt-4 p-4 border border-[var(--rd-line)] bg-[var(--rd-surface)] text-sm text-[var(--rd-ink)] rounded-lg">
                Payout request submitted. Our team will process it within 2 business days.{" "}
                <button
                  onClick={() => { setShowPayout(false); setPayout(EMPTY_PAYOUT); }}
                  className="underline text-[var(--rd-primary)]"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <form onSubmit={handlePayout} className="mt-4 flex flex-wrap gap-3 items-end">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">
                    Amount (₦)
                  </span>
                  <div className="flex items-center border border-[var(--rd-line)] mt-1 rounded-lg overflow-hidden">
                    <span className="px-3 py-2 text-sm text-[var(--rd-ink-muted)] bg-[var(--rd-surface)] border-r border-[var(--rd-line)]">₦</span>
                    <input
                      type="number"
                      placeholder="e.g. 50000"
                      value={payout.amount}
                      onChange={(e) => setPayout((p) => ({ ...p, amount: e.target.value }))}
                      min={1}
                      max={available / 100}
                      required
                      className="px-3 py-2 text-sm w-36 bg-[var(--rd-panel)] text-[var(--rd-ink)] focus:outline-none"
                    />
                  </div>
                </label>
                <label className="block flex-1 min-w-[160px]">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">
                    Bank note (optional)
                  </span>
                  <input
                    type="text"
                    placeholder="Account number or note"
                    value={payout.bankNote}
                    onChange={(e) => setPayout((p) => ({ ...p, bankNote: e.target.value }))}
                    className="mt-1 w-full border border-[var(--rd-line)] px-3 py-2 text-sm bg-[var(--rd-panel)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)]"
                  />
                </label>
                <div className="flex gap-2 items-center">
                  <button
                    type="submit"
                    disabled={payout.busy || !payout.amount}
                    className="px-4 py-2 text-sm font-medium bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50"
                  >
                    {payout.busy ? "Submitting…" : "Submit request"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPayout(false)}
                    className="text-sm text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]"
                  >
                    Cancel
                  </button>
                </div>
                {payout.err && (
                  <p className="w-full text-xs text-[var(--rd-error)]">{payout.err}</p>
                )}
              </form>
            )
          )}
        </div>
      )}

      <section className="mt-8 grid gap-4">
        {data.vehicles.length === 0 ? (
          <div className="border border-[var(--rd-line)] bg-[var(--rd-panel)] p-8 text-center rounded-xl">
            <p className="text-sm text-[var(--rd-ink-muted)]">
              You have not funded a vehicle yet.{" "}
              <Link href="/investor/opportunities" className="text-[var(--rd-primary)] hover:underline">
                Browse opportunities
              </Link>
            </p>
          </div>
        ) : (
          data.vehicles.map((v) => (
            <Link
              key={v._id}
              href={`/investor/statements/${v._id}`}
              className="border border-[var(--rd-line)] bg-[var(--rd-panel)] p-5 flex items-center justify-between gap-4 hover:border-[var(--rd-primary)] rounded-xl shadow-[var(--rd-shadow-sm)] transition-colors"
            >
              <div className="min-w-0">
                <p className="font-medium text-[var(--rd-ink)] truncate">
                  {v.make} {v.model} {v.year}
                </p>
                <p className="text-xs text-[var(--rd-ink-muted)] mt-1 font-mono">
                  {v.plateNumber}
                </p>
                <p className="text-xs text-[var(--rd-ink-muted)] mt-1 truncate">
                  {v.assignedDriver
                    ? `Driven by ${v.assignedDriver.firstName} ${v.assignedDriver.lastName}`
                    : "Awaiting driver"}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-semibold tabular-nums">
                  {naira(earningsMap.get(v._id) ?? 0)}
                </p>
                <div className="mt-1">
                  <StatusBadge status={v.status} />
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </>
  );
}
