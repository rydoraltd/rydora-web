"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface Opportunity {
  _id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  fundingTargetKobo: number;
  fundedKobo: number;
  weeklyRemittanceTargetKobo: number;
  split: { driverPct: number; investorPct: number; rydoraPct: number };
}

type FundState = { id: string; amount: string; busy: boolean; err: string | null };

export default function OpportunitiesPage() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fund, setFund] = useState<FundState | null>(null);

  function load() {
    api<Opportunity[]>("/investor/opportunities")
      .then(setItems)
      .catch((e) => setError(e.message));
  }

  useEffect(load, []);

  async function handleFund(vehicleId: string) {
    if (!fund || fund.id !== vehicleId) return;
    setFund((f) => f && { ...f, busy: true, err: null });
    try {
      await api(`/investor/vehicles/${vehicleId}/fund`, {
        method: "POST",
        body: { amountKobo: Math.round(Number(fund.amount) * 100) },
      });
      setFund(null);
      load();
    } catch (e) {
      setFund((f) => f && { ...f, busy: false, err: e instanceof Error ? e.message : "Failed" });
    }
  }

  return (
    <>
      <PageHeader
        title="Opportunities"
        description="Vehicles open for investor funding. Fund a vehicle and start earning your share of every remittance."
      />

      {error && <p className="text-sm text-[var(--rd-error)] mb-4">{error}</p>}

      {!error && items.length === 0 && (
        <div className="border border-[var(--rd-line)] bg-[var(--rd-panel)] p-12 text-center">
          <p className="text-sm text-[var(--rd-ink-muted)]">
            No vehicles are open for funding right now. Check back soon.
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {items.map((v) => {
          const pct =
            v.fundingTargetKobo > 0
              ? Math.min(Math.round((v.fundedKobo / v.fundingTargetKobo) * 100), 100)
              : 0;
          const remaining = v.fundingTargetKobo - v.fundedKobo;
          const isOpen = fund?.id === v._id;

          return (
            <div
              key={v._id}
              className="border border-[var(--rd-line)] bg-[var(--rd-panel)] p-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium text-[var(--rd-ink)]">
                    {v.make} {v.model} {v.year}
                  </p>
                  <p className="text-xs font-mono text-[var(--rd-ink-muted)] mt-0.5">
                    {v.plateNumber}
                  </p>
                  <p className="text-xs text-[var(--rd-ink-muted)] mt-2">
                    Driver {v.split.driverPct}% &middot; Investor{" "}
                    {v.split.investorPct}% &middot; Rydora {v.split.rydoraPct}%
                  </p>
                  <p className="text-xs text-[var(--rd-ink-muted)] mt-0.5">
                    Weekly remittance target:{" "}
                    {naira(v.weeklyRemittanceTargetKobo)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">
                    Funding target
                  </p>
                  <p className="text-sm font-semibold tabular-nums mt-1">
                    {naira(v.fundingTargetKobo)}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-1.5 bg-[var(--rd-surface)] overflow-hidden">
                <div
                  className="h-full bg-[var(--rd-primary)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[11px] text-[var(--rd-ink-muted)] mt-1.5">
                {pct}% funded &middot; {naira(remaining)} remaining &middot;{" "}
                {naira(v.fundedKobo)} raised
              </p>

              <div className="mt-4 border-t border-[var(--rd-line)] pt-4">
                {!isOpen ? (
                  <button
                    onClick={() =>
                      setFund({ id: v._id, amount: "", busy: false, err: null })
                    }
                    className="px-4 py-2 text-sm font-medium bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] hover:bg-[var(--rd-primary-strong)]"
                  >
                    Fund this vehicle
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center border border-[var(--rd-line)]">
                      <span className="px-3 py-2 text-sm text-[var(--rd-ink-muted)] bg-[var(--rd-surface)] border-r border-[var(--rd-line)]">
                        ₦
                      </span>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={fund.amount}
                        onChange={(e) =>
                          setFund((f) => f && { ...f, amount: e.target.value })
                        }
                        className="px-3 py-2 text-sm w-36 bg-[var(--rd-panel)] text-[var(--rd-ink)] focus:outline-none"
                        min={1}
                        max={remaining / 100}
                      />
                    </div>
                    <button
                      onClick={() => handleFund(v._id)}
                      disabled={fund.busy || !fund.amount || Number(fund.amount) <= 0}
                      className="px-4 py-2 text-sm font-medium bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50"
                    >
                      {fund.busy ? "Confirming…" : "Confirm"}
                    </button>
                    <button
                      onClick={() => setFund(null)}
                      className="text-sm text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]"
                    >
                      Cancel
                    </button>
                    {fund.err && (
                      <span className="text-xs text-[var(--rd-error)]">
                        {fund.err}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
