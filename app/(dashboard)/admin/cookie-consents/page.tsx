"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface ConsentItem {
  _id: string;
  action: "accept_all" | "reject_all" | "custom";
  preferences: { essential: boolean; analytics: boolean; marketing: boolean };
  ip: string;
  userAgent: string;
  page: string;
  createdAt: string;
}

interface Summary { _id: string; count: number }

interface ListResponse {
  items: ConsentItem[];
  total: number;
  page: number;
  limit: number;
  summary: Summary[];
}

const ACTION_LABELS: Record<string, string> = {
  accept_all: "Accept All",
  reject_all: "Reject Non-essential",
  custom: "Custom",
};

const ACTION_COLORS: Record<string, string> = {
  accept_all: "bg-green-100 text-green-700",
  reject_all: "bg-red-100 text-red-700",
  custom: "bg-amber-100 text-amber-700",
};

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function Dot({ on }: { on: boolean }) {
  return (
    <span className={["inline-block w-2 h-2 rounded-full", on ? "bg-green-500" : "bg-[var(--rd-line)]"].join(" ")} />
  );
}

export default function CookieConsentsPage() {
  const [data, setData] = useState<ListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);

  function load(p = page, af = actionFilter) {
    const params = new URLSearchParams({ page: String(p), limit: "30" });
    if (af) params.set("action", af);
    api<ListResponse>(`/admin/cookie-consents?${params}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function applyFilter(af: string) {
    setActionFilter(af);
    setPage(1);
    load(1, af);
  }

  function goPage(p: number) {
    setPage(p);
    load(p, actionFilter);
  }

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  const summaryMap: Record<string, number> = {};
  data?.summary.forEach((s) => { summaryMap[s._id] = s.count; });

  if (error) return <p className="text-sm text-[var(--rd-error)]">{error}</p>;

  return (
    <>
      <PageHeader
        title="Cookie Consents"
        description="Consent records collected from the marketing site."
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Cookie Consents" }]}
      />

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { key: "", label: "All", count: data?.total ?? 0 },
          { key: "accept_all", label: "Accept All", count: summaryMap["accept_all"] ?? 0 },
          { key: "reject_all", label: "Reject Non-essential", count: summaryMap["reject_all"] ?? 0 },
          { key: "custom", label: "Custom", count: summaryMap["custom"] ?? 0 },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => applyFilter(f.key)}
            className={[
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              actionFilter === f.key
                ? "bg-[var(--rd-primary)] text-white border-[var(--rd-primary)]"
                : "border-[var(--rd-line)] text-[var(--rd-ink-body)] hover:bg-[var(--rd-surface)]",
            ].join(" ")}
          >
            {f.label} <span className="opacity-70 ml-1">{f.count}</span>
          </button>
        ))}
      </div>

      <div className="border border-[var(--rd-line)] bg-[var(--rd-panel)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
        {!data ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-[var(--rd-ink-muted)]">Loading…</p>
          </div>
        ) : data.items.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-[var(--rd-ink-muted)]">No records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--rd-surface)] border-b border-[var(--rd-line)]">
                  {["Date", "Action", "Analytics", "Marketing", "IP Address", "Page"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item._id} className="border-b border-[var(--rd-line)] last:border-0 hover:bg-[var(--rd-surface)] transition-colors">
                    <td className="px-5 py-3.5 text-[var(--rd-ink-muted)] whitespace-nowrap text-xs">
                      {shortDate(item.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={["px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap", ACTION_COLORS[item.action] ?? ""].join(" ")}>
                        {ACTION_LABELS[item.action] ?? item.action}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Dot on={item.preferences.analytics} />
                    </td>
                    <td className="px-5 py-3.5">
                      <Dot on={item.preferences.marketing} />
                    </td>
                    <td className="px-5 py-3.5 text-[var(--rd-ink-muted)] font-mono text-xs">
                      {item.ip || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-[var(--rd-ink-muted)] text-xs max-w-[180px] truncate">
                      {item.page || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-[var(--rd-line)] flex items-center justify-between">
            <p className="text-xs text-[var(--rd-ink-muted)]">
              Page {page} of {totalPages} &mdash; {data?.total} records
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => goPage(page - 1)}
                className="px-3 py-1.5 rounded-lg text-xs border border-[var(--rd-line)] text-[var(--rd-ink-body)] hover:bg-[var(--rd-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => goPage(page + 1)}
                className="px-3 py-1.5 rounded-lg text-xs border border-[var(--rd-line)] text-[var(--rd-ink-body)] hover:bg-[var(--rd-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
