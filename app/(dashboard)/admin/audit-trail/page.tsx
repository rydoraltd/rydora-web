"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { titleCase } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface AuditLog {
  _id: string;
  actor?: { firstName: string; lastName: string; role: string } | null;
  action: string;
  entity?: string;
  entityId?: string;
  ip?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

interface AuditResponse {
  items: AuditLog[];
  total: number;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 2)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function exactTime(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function actionColor(action: string): string {
  if (action.includes("approve") || action.includes("complete") || action.includes("active")) return "text-emerald-600 bg-emerald-50";
  if (action.includes("reject") || action.includes("suspend") || action.includes("delete")) return "text-[var(--rd-error)] bg-red-50";
  if (action.includes("create") || action.includes("submit") || action.includes("request")) return "text-[var(--rd-primary)] bg-blue-50";
  return "text-[var(--rd-ink-muted)] bg-[var(--rd-surface)]";
}

export default function AuditTrailPage() {
  const [data, setData]       = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [page, setPage]       = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api<AuditResponse>(`/admin/audit-logs?page=${page}&limit=50`)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = data ? Math.ceil(data.total / 50) : 1;

  return (
    <>
      <PageHeader
        title="Audit Trail"
        description="Every significant action taken on the platform, who took it, and when."
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Audit Trail" },
        ]}
        action={
          data ? (
            <span className="text-sm text-[var(--rd-ink-muted)]">
              {data.total.toLocaleString()} events
            </span>
          ) : null
        }
      />

      {error && <p className="text-sm text-[var(--rd-error)] mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-[var(--rd-ink-muted)]">Loading…</p>
      ) : (
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl overflow-hidden shadow-[var(--rd-shadow-sm)]">
          {!data?.items.length ? (
            <div className="px-6 py-16 text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-[var(--rd-ink-muted)]/30 mx-auto mb-4">
                <path d="M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <p className="text-sm text-[var(--rd-ink-muted)]">No audit events recorded yet.</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-[var(--rd-line)]">
                {data.items.map((log) => (
                  <div key={log._id}>
                    <button
                      onClick={() => setExpanded(expanded === log._id ? null : log._id)}
                      className="w-full text-left px-5 py-4 hover:bg-[var(--rd-surface)] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {/* Action badge */}
                        <span className={`mt-0.5 shrink-0 inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${actionColor(log.action)}`}>
                          {log.action}
                        </span>

                        {/* Actor + entity */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--rd-ink)] truncate">
                            {log.actor
                              ? <><span className="font-medium">{log.actor.firstName} {log.actor.lastName}</span> <span className="text-[var(--rd-ink-muted)] text-xs">({titleCase(log.actor.role)})</span></>
                              : <span className="text-[var(--rd-ink-muted)] italic">System</span>
                            }
                          </p>
                          {(log.entity || log.entityId) && (
                            <p className="text-xs text-[var(--rd-ink-muted)] mt-0.5 font-mono">
                              {log.entity}{log.entityId ? ` · ${log.entityId.slice(-8)}` : ""}
                            </p>
                          )}
                        </div>

                        {/* Time */}
                        <div className="shrink-0 text-right">
                          <span className="text-xs text-[var(--rd-ink-muted)]" title={exactTime(log.createdAt)}>
                            {timeAgo(log.createdAt)}
                          </span>
                          {log.ip && (
                            <p className="text-[11px] text-[var(--rd-ink-muted)]/60 mt-0.5 font-mono">{log.ip}</p>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded meta */}
                    {expanded === log._id && log.meta && Object.keys(log.meta).length > 0 && (
                      <div className="px-5 pb-4">
                        <pre className="bg-[var(--rd-surface)] border border-[var(--rd-line)] rounded-lg px-4 py-3 text-[11px] font-mono text-[var(--rd-ink-muted)] overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(log.meta, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--rd-line)] bg-[var(--rd-surface)]">
                  <p className="text-xs text-[var(--rd-ink-muted)]">
                    Page {page} of {totalPages} · {data.total} total events
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 rounded-lg text-xs border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:bg-[var(--rd-panel)] disabled:opacity-40 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1.5 rounded-lg text-xs border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:bg-[var(--rd-panel)] disabled:opacity-40 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
