"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { naira, shortDate, titleCase } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface MaintenanceRow {
  _id: string;
  category: string;
  description: string;
  status: string;
  estimatedCostKobo?: number;
  actualCostKobo?: number;
  deductFromEarnings: boolean;
  createdAt: string;
  completedAt?: string;
  vehicle?: { plateNumber: string; make: string; model: string };
  requestedBy?: { firstName: string; lastName: string };
}

type Filter = "" | "requested" | "approved" | "in_progress" | "completed" | "rejected";

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "",           label: "All" },
  { value: "requested",  label: "Pending" },
  { value: "approved",   label: "Approved" },
  { value: "in_progress",label: "In progress" },
  { value: "completed",  label: "Completed" },
  { value: "rejected",   label: "Rejected" },
];

interface DecideModal {
  item: MaintenanceRow;
  mode: "decide" | "complete";
}

export default function AdminMaintenancePage() {
  const [rows, setRows]         = useState<MaintenanceRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [filter, setFilter]     = useState<Filter>("");
  const [modal, setModal]       = useState<DecideModal | null>(null);
  const [busy, setBusy]         = useState(false);
  const [actionErr, setActionErr] = useState<string | null>(null);

  // Decide form state
  const [decision, setDecision]   = useState<"approved" | "rejected">("approved");
  const [estCost, setEstCost]     = useState("");
  const [actualCost, setActualCost] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    api<MaintenanceRow[]>(`/admin/maintenance${filter ? `?status=${filter}` : ""}`)
      .then(setRows)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  function openDecide(item: MaintenanceRow) {
    setModal({ item, mode: "decide" });
    setDecision("approved");
    setEstCost("");
    setActionErr(null);
  }

  function openComplete(item: MaintenanceRow) {
    setModal({ item, mode: "complete" });
    setActualCost("");
    setActionErr(null);
  }

  async function handleDecide(e: React.FormEvent) {
    e.preventDefault();
    if (!modal) return;
    setBusy(true);
    setActionErr(null);
    try {
      await api(`/admin/maintenance/${modal.item._id}/decide`, {
        method: "POST",
        body: {
          decision,
          ...(estCost ? { estimatedCostKobo: Math.round(Number(estCost) * 100) } : {}),
        },
      });
      setModal(null);
      load();
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleComplete(e: React.FormEvent) {
    e.preventDefault();
    if (!modal) return;
    setBusy(true);
    setActionErr(null);
    try {
      await api(`/admin/maintenance/${modal.item._id}/complete`, {
        method: "POST",
        body: { actualCostKobo: Math.round(Number(actualCost) * 100) },
      });
      setModal(null);
      load();
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  const pending = rows.filter((r) => r.status === "requested").length;

  return (
    <>
      <PageHeader
        title="Maintenance Requests"
        description="Review, approve, and track vehicle maintenance requests from drivers."
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Maintenance" },
        ]}
        action={
          pending > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {pending} pending
            </span>
          ) : null
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 flex-wrap">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={[
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              filter === opt.value
                ? "bg-[var(--rd-primary)] text-white"
                : "border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)] hover:bg-[var(--rd-surface)]",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-[var(--rd-error)] mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-[var(--rd-ink-muted)]">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="border border-dashed border-[var(--rd-line)] bg-[var(--rd-panel)] rounded-xl p-16 text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-[var(--rd-ink-muted)]/30 mx-auto mb-4">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <p className="text-sm text-[var(--rd-ink-muted)]">No maintenance requests{filter ? ` with status "${filter}"` : ""}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r._id}
              className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-5 shadow-[var(--rd-shadow-sm)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--rd-ink-muted)]">
                      {titleCase(r.category)}
                    </span>
                    <StatusBadge status={r.status} />
                    {r.deductFromEarnings && (
                      <span className="text-[11px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                        Deduct from earnings
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 text-sm text-[var(--rd-ink)]">{r.description}</p>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {r.vehicle && (
                      <span className="text-xs text-[var(--rd-ink-muted)]">
                        Vehicle: <span className="text-[var(--rd-ink-body)] font-mono">{r.vehicle.plateNumber}</span>
                        <span className="text-[var(--rd-ink-muted)]"> · {r.vehicle.make} {r.vehicle.model}</span>
                      </span>
                    )}
                    {r.requestedBy && (
                      <span className="text-xs text-[var(--rd-ink-muted)]">
                        Driver: <span className="text-[var(--rd-ink-body)]">{r.requestedBy.firstName} {r.requestedBy.lastName}</span>
                      </span>
                    )}
                    {r.estimatedCostKobo !== undefined && (
                      <span className="text-xs text-[var(--rd-ink-muted)]">
                        Est: <span className="text-[var(--rd-ink-body)]">{naira(r.estimatedCostKobo)}</span>
                      </span>
                    )}
                    {r.actualCostKobo !== undefined && (
                      <span className="text-xs text-[var(--rd-ink-muted)]">
                        Actual: <span className="text-[var(--rd-ink-body)] font-medium">{naira(r.actualCostKobo)}</span>
                      </span>
                    )}
                    <span className="text-xs text-[var(--rd-ink-muted)]">
                      Requested {shortDate(r.createdAt)}
                    </span>
                    {r.completedAt && (
                      <span className="text-xs text-[var(--rd-ink-muted)]">
                        Completed {shortDate(r.completedAt)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex gap-2">
                  {r.status === "requested" && (
                    <button
                      onClick={() => openDecide(r)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--rd-primary)] text-white hover:bg-[var(--rd-primary-strong)] transition-colors"
                    >
                      Review
                    </button>
                  )}
                  {(r.status === "approved" || r.status === "in_progress") && (
                    <button
                      onClick={() => openComplete(r)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                    >
                      Mark complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--rd-panel)] rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 pt-6 pb-0 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--rd-ink)]">
                {modal.mode === "decide" ? "Review Request" : "Mark as Completed"}
              </h2>
              <button onClick={() => setModal(null)} className="text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 pt-3 pb-0">
              <p className="text-sm text-[var(--rd-ink-muted)]">{titleCase(modal.item.category)}</p>
              <p className="text-sm text-[var(--rd-ink)] mt-1">{modal.item.description}</p>
            </div>

            <form
              onSubmit={modal.mode === "decide" ? handleDecide : handleComplete}
              className="px-6 pt-5 pb-6 space-y-4"
            >
              {modal.mode === "decide" ? (
                <>
                  <div className="flex gap-3">
                    {(["approved", "rejected"] as const).map((d) => (
                      <label
                        key={d}
                        className={[
                          "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-colors",
                          decision === d
                            ? d === "approved"
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-[var(--rd-error)] bg-red-50 text-[var(--rd-error)]"
                            : "border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:bg-[var(--rd-surface)]",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="decision"
                          value={d}
                          checked={decision === d}
                          onChange={() => setDecision(d)}
                          className="sr-only"
                        />
                        {titleCase(d)}
                      </label>
                    ))}
                  </div>

                  {decision === "approved" && (
                    <div>
                      <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">
                        Estimated cost (₦) — optional
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={estCost}
                        onChange={(e) => setEstCost(e.target.value)}
                        placeholder="e.g. 25000"
                        className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">
                    Actual cost (₦) <span className="text-[var(--rd-error)]">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={actualCost}
                    onChange={(e) => setActualCost(e.target.value)}
                    placeholder="e.g. 30000"
                    required
                    className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
                  />
                  {modal.item.deductFromEarnings && (
                    <p className="mt-1.5 text-xs text-amber-600">
                      This cost will be deducted from the driver/investor earnings ledger.
                    </p>
                  )}
                </div>
              )}

              {actionErr && (
                <p className="text-sm text-[var(--rd-error)] bg-red-50 px-3 py-2 rounded-lg">{actionErr}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-[var(--rd-line)] text-[var(--rd-ink-body)] hover:bg-[var(--rd-surface)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50 transition-colors"
                >
                  {busy ? "Saving…" : modal.mode === "decide" ? "Confirm decision" : "Mark complete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
