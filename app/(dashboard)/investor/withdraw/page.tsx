"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface WalletInfo {
  availableKobo: number;
  totalWithdrawnKobo: number;
  pendingKobo: number;
}

interface Withdrawal {
  _id: string;
  amountKobo: number;
  status: string;
  bankNote?: string;
  createdAt: string;
}

const PRESETS = [5000, 10000, 25000, 50000];

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

export default function WithdrawPage() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function load() {
    api<{ available: number; totalWithdrawn: number; pending: number }>("/investor/wallet")
      .then((d) => setWallet({ availableKobo: d.available, totalWithdrawnKobo: d.totalWithdrawn, pendingKobo: d.pending }))
      .catch(() => setWallet({ availableKobo: 0, totalWithdrawnKobo: 0, pendingKobo: 0 }));
    api<Withdrawal[]>("/investor/withdrawals")
      .then(setWithdrawals)
      .catch(() => setWithdrawals([]));
  }

  useEffect(load, []);

  const available = wallet?.availableKobo ?? 0;
  const amountKobo = Math.round(Number(amount) * 100);
  const processingFee = 0;
  const youReceive = amountKobo - processingFee;

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/investor/payouts", {
        method: "POST",
        body: { amountKobo, bankNote: note.trim() || undefined },
      });
      setSuccess(true);
      setAmount("");
      setNote("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Withdraw Funds"
        description="Transfer your earnings directly to your bank account"
        breadcrumb={[
          { label: "Dashboard", href: "/investor" },
          { label: "Withdraw Funds" },
        ]}
      />

      {/* Balance cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Available */}
        <div className="col-span-1 rounded-xl p-5 text-white relative overflow-hidden" style={{ background: "var(--rd-primary)" }}>
          <div className="absolute right-3 top-3 opacity-20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="5" width="20" height="14" rx="2" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">Available Balance</p>
          <p className="mt-2 text-3xl font-bold tabular-nums">{naira(available)}</p>
          <p className="mt-1 text-xs text-white/70">Ready to withdraw</p>
        </div>

        {/* Total withdrawn */}
        <div className="rounded-xl p-5 bg-[var(--rd-panel)] border border-[var(--rd-line)] shadow-[var(--rd-shadow-sm)]">
          <div className="flex items-center gap-2 text-[var(--rd-ink-muted)] mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider">Total Withdrawn</span>
          </div>
          <p className="text-2xl font-bold tabular-nums text-[var(--rd-ink)]">{naira(wallet?.totalWithdrawnKobo ?? 0)}</p>
          <p className="mt-1 text-xs text-[var(--rd-ink-muted)]">All time</p>
        </div>

        {/* Pending */}
        <div className="rounded-xl p-5 bg-[var(--rd-panel)] border border-[var(--rd-line)] shadow-[var(--rd-shadow-sm)]">
          <div className="flex items-center gap-2 text-[var(--rd-ink-muted)] mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-2xl font-bold tabular-nums text-[var(--rd-ink)]">{naira(wallet?.pendingKobo ?? 0)}</p>
          <p className="mt-1 text-xs text-[var(--rd-ink-muted)]">Being processed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Withdrawal form */}
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-6 shadow-[var(--rd-shadow-sm)]">
          <div className="flex items-center gap-2 mb-5">
            <SendIcon />
            <h2 className="text-sm font-semibold text-[var(--rd-ink)]">New Withdrawal</h2>
          </div>

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              Withdrawal request submitted successfully. Processing within 1–2 business days.
              <button onClick={() => setSuccess(false)} className="ml-2 underline text-green-700">Dismiss</button>
            </div>
          )}

          <form onSubmit={handleWithdraw} className="space-y-5">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)] block mb-2">
                Amount
              </label>
              <div className="flex items-center gap-2 border border-[var(--rd-line)] rounded-lg px-4 py-3 focus-within:border-[var(--rd-primary)] transition-colors">
                <span className="text-sm font-medium text-[var(--rd-ink-muted)]">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min={100}
                  max={available / 100}
                  className="flex-1 text-sm text-[var(--rd-ink)] focus:outline-none bg-transparent"
                />
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(String(p))}
                    className="px-3 py-1.5 text-xs font-medium border border-[var(--rd-line)] rounded-lg hover:border-[var(--rd-primary)] hover:text-[var(--rd-primary)] transition-colors"
                  >
                    ₦{p.toLocaleString()}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAmount(String(available / 100))}
                  className="px-3 py-1.5 text-xs font-medium border border-[var(--rd-line)] rounded-lg hover:border-[var(--rd-primary)] hover:text-[var(--rd-primary)] transition-colors"
                >
                  Max
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)] block mb-1">
                Select Bank Account
              </label>
              <p className="text-xs text-[var(--rd-ink-muted)] mb-2">
                No bank accounts added.{" "}
                <button type="button" className="text-[var(--rd-primary)] hover:underline font-medium">
                  Add account →
                </button>
              </p>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)] block mb-2">
                Note <span className="normal-case text-[var(--rd-ink-muted)] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Monthly withdrawal"
                className="w-full rounded-lg px-4 py-3 text-sm border border-[var(--rd-line)] bg-[var(--rd-panel)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
              />
            </div>

            {/* Summary */}
            <div className="border border-[var(--rd-line)] rounded-lg px-4 py-3 space-y-2 bg-[var(--rd-surface)]">
              <div className="flex justify-between text-sm text-[var(--rd-ink-muted)]">
                <span>Withdrawal amount</span>
                <span className="tabular-nums">{naira(amountKobo)}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--rd-ink-muted)]">
                <span>Processing fee</span>
                <span className="tabular-nums">{naira(processingFee)}</span>
              </div>
              <div className="h-px bg-[var(--rd-line)]" />
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-[var(--rd-ink)]">You receive</span>
                <span className="tabular-nums text-[var(--rd-primary)]">{naira(youReceive)}</span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-[var(--rd-error)] bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy || amountKobo <= 0 || amountKobo > available}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50 transition-colors"
            >
              <SendIcon />
              {busy ? "Processing…" : "Withdraw Funds"}
            </button>
          </form>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Recent withdrawals */}
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-5 shadow-[var(--rd-shadow-sm)]">
            <div className="flex items-center gap-2 mb-4">
              <ClockIcon />
              <h2 className="text-sm font-semibold text-[var(--rd-ink)]">Recent Withdrawals</h2>
            </div>
            {withdrawals.length === 0 ? (
              <p className="text-xs text-[var(--rd-ink-muted)]">No withdrawals yet.</p>
            ) : (
              <div className="space-y-3">
                {withdrawals.slice(0, 5).map((w) => (
                  <div key={w._id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--rd-ink)] tabular-nums">{naira(w.amountKobo)}</p>
                      <p className="text-[11px] text-[var(--rd-ink-muted)]">{shortDate(w.createdAt)}</p>
                    </div>
                    <span className={[
                      "text-[11px] font-medium px-2 py-0.5 rounded-full",
                      w.status === "approved" ? "bg-green-100 text-green-700"
                        : w.status === "pending" ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700",
                    ].join(" ")}>
                      {w.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Processing times info */}
          <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="shrink-0 w-7 h-7 rounded-lg bg-[var(--rd-primary)] flex items-center justify-center text-white mt-0.5">
              <InfoIcon />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--rd-ink)]">Processing Times</p>
              <p className="text-xs text-[var(--rd-ink-muted)] mt-0.5 leading-relaxed">
                Withdrawals are processed within 1–2 business days. Requests after 4PM are queued for the next business day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
