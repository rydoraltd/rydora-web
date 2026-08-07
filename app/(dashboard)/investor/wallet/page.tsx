"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Link from "next/link";

interface WalletData {
  available: number;
  totalEarned: number;
  totalWithdrawn: number;
  pending: number;
}

interface Transaction {
  _id: string;
  type: string;
  amountKobo: number;
  description?: string;
  entryDate: string;
  meta?: { state?: string };
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api<WalletData>("/investor/wallet")
      .then(setWallet)
      .catch(() => setWallet({ available: 0, totalEarned: 0, totalWithdrawn: 0, pending: 0 }));
    api<Transaction[]>("/investor/ledger")
      .then(setTransactions)
      .catch(() => setTransactions([]));
  }, []);

  const CREDIT_TYPES = new Set(["earnings_split_investor"]);
  const DEBIT_TYPES  = new Set(["vehicle_funding", "payout"]);

  return (
    <>
      <PageHeader
        title="My Wallet"
        description="Your Rydora earnings wallet overview."
        breadcrumb={[
          { label: "Dashboard", href: "/investor" },
          { label: "My Wallet" },
        ]}
        action={
          <Link
            href="/investor/withdraw"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
            Withdraw
          </Link>
        }
      />

      {/* Balance cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Available Balance", value: wallet?.available ?? 0, accent: true },
          { label: "Total Earned",      value: wallet?.totalEarned ?? 0 },
          { label: "Total Withdrawn",   value: wallet?.totalWithdrawn ?? 0 },
          { label: "Pending",           value: wallet?.pending ?? 0 },
        ].map(({ label, value, accent }) => (
          <div
            key={label}
            className={[
              "rounded-xl p-5 border",
              accent
                ? "bg-[var(--rd-primary)] border-transparent text-white"
                : "bg-[var(--rd-panel)] border-[var(--rd-line)] shadow-[var(--rd-shadow-sm)]",
            ].join(" ")}
          >
            <p className={`text-xs font-semibold uppercase tracking-wider ${accent ? "text-white/80" : "text-[var(--rd-ink-muted)]"}`}>
              {label}
            </p>
            <p className={`mt-2 text-2xl font-bold tabular-nums ${accent ? "text-white" : "text-[var(--rd-ink)]"}`}>
              {naira(value)}
            </p>
          </div>
        ))}
      </div>

      {/* Transaction history */}
      <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--rd-line)]">
          <h2 className="text-sm font-semibold text-[var(--rd-ink)]">Transaction History</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-[var(--rd-ink-muted)]">No transactions yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--rd-surface)] border-b border-[var(--rd-line)]">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">Description</th>
                <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-b border-[var(--rd-line)] last:border-0 hover:bg-[var(--rd-surface)] transition-colors">
                  <td className="px-5 py-3.5 text-[var(--rd-ink-muted)]">{shortDate(t.entryDate)}</td>
                  <td className="px-5 py-3.5 text-[var(--rd-ink-body)]">
                    {t.description ?? t.type.replace(/_/g, " ")}
                    {t.meta?.state ? ` · ${t.meta.state}` : ""}
                  </td>
                  <td className={[
                    "px-5 py-3.5 text-right font-semibold tabular-nums",
                    CREDIT_TYPES.has(t.type) ? "text-[var(--rd-success)]"
                      : DEBIT_TYPES.has(t.type) ? "text-[var(--rd-error)]"
                      : "text-[var(--rd-ink)]",
                  ].join(" ")}>
                    {DEBIT_TYPES.has(t.type) ? "−" : "+"}{naira(t.amountKobo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
