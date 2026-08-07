"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira, shortDate } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface PayoutEntry {
  _id: string;
  amountKobo: number;
  entryDate: string;
  description?: string;
  meta?: { state?: string; bankNote?: string };
  toUser?: { firstName: string; lastName: string; email: string; phone?: string };
  approvedBy?: { firstName: string; lastName: string };
}

const STATE_LABELS: Record<string, string> = {
  requested: "Requested",
  approved: "Approved",
  rejected: "Rejected",
};

const STATE_COLORS: Record<string, string> = {
  requested: "var(--rd-warning, #E8A33D)",
  approved: "var(--rd-success)",
  rejected: "var(--rd-error)",
};

export default function AdminPayoutsPage() {
  const [items, setItems] = useState<PayoutEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [actErr, setActErr] = useState<string | null>(null);

  function load() {
    api<PayoutEntry[]>("/admin/payouts")
      .then(setItems)
      .catch((e) => setError(e.message));
  }

  useEffect(load, []);

  async function decide(id: string, action: "approve" | "reject") {
    setActing(id + action);
    setActErr(null);
    try {
      await api(`/admin/payouts/${id}/${action}`, { method: "POST" });
      load();
    } catch (e) {
      setActErr(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActing(null);
    }
  }

  const requested = items.filter((i) => i.meta?.state === "requested");
  const processed = items.filter((i) => i.meta?.state !== "requested");

  return (
    <>
      <PageHeader
        title="Payout Requests"
        description="Review and approve investor payout requests. Approved payouts must be disbursed manually via bank transfer."
      />

      {error && <p className="text-sm text-[var(--rd-error)] mb-4">{error}</p>}
      {actErr && <p className="text-sm text-[var(--rd-error)] mb-4">{actErr}</p>}

      {/* Pending */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rd-ink-muted)] mb-3">
          Pending approval ({requested.length})
        </h2>
        {requested.length === 0 ? (
          <div className="border border-[var(--rd-line)] bg-[var(--rd-panel)] p-8 text-center text-sm text-[var(--rd-ink-muted)] rounded-xl">
            No pending payout requests.
          </div>
        ) : (
          <div className="grid gap-3">
            {requested.map((entry) => (
              <div
                key={entry._id}
                className="border border-[var(--rd-line)] bg-[var(--rd-panel)] p-5 flex flex-wrap items-start justify-between gap-4 rounded-xl shadow-[var(--rd-shadow-sm)]"
              >
                <div>
                  <p className="font-medium text-[var(--rd-ink)]">
                    {entry.toUser
                      ? `${entry.toUser.firstName} ${entry.toUser.lastName}`
                      : "Unknown investor"}
                  </p>
                  <p className="text-xs text-[var(--rd-ink-muted)] mt-0.5">
                    {entry.toUser?.email}
                    {entry.toUser?.phone ? ` · ${entry.toUser.phone}` : ""}
                  </p>
                  {entry.meta?.bankNote && (
                    <p className="text-xs text-[var(--rd-ink-muted)] mt-1">
                      Note: {entry.meta.bankNote}
                    </p>
                  )}
                  <p className="text-xs text-[var(--rd-ink-muted)] mt-1">
                    {shortDate(entry.entryDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold tabular-nums text-[var(--rd-ink)]">
                    {naira(entry.amountKobo)}
                  </p>
                  <div className="mt-3 flex gap-2 justify-end">
                    <button
                      onClick={() => decide(entry._id, "approve")}
                      disabled={!!acting}
                      className="px-3 py-1.5 text-xs font-medium bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50"
                    >
                      {acting === entry._id + "approve" ? "Approving…" : "Approve"}
                    </button>
                    <button
                      onClick={() => decide(entry._id, "reject")}
                      disabled={!!acting}
                      className="px-3 py-1.5 text-xs font-medium border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:text-[var(--rd-error)] hover:border-[var(--rd-error)] disabled:opacity-50"
                    >
                      {acting === entry._id + "reject" ? "Rejecting…" : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* History */}
      {processed.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rd-ink-muted)] mb-3">
            History ({processed.length})
          </h2>
          <div className="grid gap-3">
            {processed.map((entry) => {
              const state = entry.meta?.state ?? "unknown";
              return (
                <div
                  key={entry._id}
                  className="border border-[var(--rd-line)] bg-[var(--rd-panel)] p-4 flex flex-wrap items-center justify-between gap-3 opacity-75 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--rd-ink)]">
                      {entry.toUser
                        ? `${entry.toUser.firstName} ${entry.toUser.lastName}`
                        : "Unknown"}
                    </p>
                    <p className="text-xs text-[var(--rd-ink-muted)]">
                      {shortDate(entry.entryDate)}
                      {entry.approvedBy
                        ? ` · by ${entry.approvedBy.firstName} ${entry.approvedBy.lastName}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold tabular-nums">
                      {naira(entry.amountKobo)}
                    </p>
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.1em]"
                      style={{ color: STATE_COLORS[state] ?? "var(--rd-ink-muted)" }}
                    >
                      {STATE_LABELS[state] ?? state}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
