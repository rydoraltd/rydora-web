"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface DriverWallet {
  balanceKobo: number;
  totalEarnedKobo: number;
  totalPaidKobo: number;
  pendingKobo: number;
}

interface Transaction {
  _id: string;
  type: string;
  amountKobo: number;
  description?: string;
  createdAt: string;
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function DriverWalletPage() {
  const [wallet, setWallet] = useState<DriverWallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api<DriverWallet>("/driver/wallet")
      .then(setWallet)
      .catch(() => setWallet({ balanceKobo: 0, totalEarnedKobo: 0, totalPaidKobo: 0, pendingKobo: 0 }));
    api<Transaction[]>("/driver/transactions")
      .then(setTransactions)
      .catch(() => setTransactions([]));
  }, []);

  const stats = [
    { label: "Wallet Balance",   value: wallet?.balanceKobo ?? 0,    accent: true },
    { label: "Total Earned",     value: wallet?.totalEarnedKobo ?? 0 },
    { label: "Total Paid",       value: wallet?.totalPaidKobo ?? 0 },
    { label: "Pending Clearance",value: wallet?.pendingKobo ?? 0 },
  ];

  return (
    <>
      <PageHeader
        title="My Wallet"
        description="Your earnings and payment summary."
        breadcrumb={[{ label: "Home", href: "/driver" }, { label: "My Wallet" }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, accent }) => (
          <div
            key={label}
            className={["rounded-xl p-5 border",
              accent
                ? "bg-[var(--rd-primary)] border-transparent text-white"
                : "bg-[var(--rd-panel)] border-[var(--rd-line)] shadow-[var(--rd-shadow-sm)]"].join(" ")}
          >
            <p className={`text-xs font-semibold uppercase tracking-wider ${accent ? "text-white/80" : "text-[var(--rd-ink-muted)]"}`}>{label}</p>
            <p className={`mt-2 text-2xl font-bold tabular-nums ${accent ? "text-white" : "text-[var(--rd-ink)]"}`}>{naira(value)}</p>
          </div>
        ))}
      </div>

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
                {["Date", "Description", "Amount"].map((h, i) => (
                  <th key={h} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)] ${i === 2 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-b border-[var(--rd-line)] last:border-0 hover:bg-[var(--rd-surface)] transition-colors">
                  <td className="px-5 py-3.5 text-[var(--rd-ink-muted)]">{shortDate(t.createdAt)}</td>
                  <td className="px-5 py-3.5 text-[var(--rd-ink-body)]">{t.description ?? t.type.replace(/_/g, " ")}</td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-[var(--rd-ink)]">{naira(t.amountKobo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
