"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { shortDate, titleCase } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";

const API_ORIGIN =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
    : "http://localhost:5000";

function resolveUrl(path: string | undefined | null): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_ORIGIN}${path}`;
}

const DOC_LABELS: Record<string, string> = {
  proof_of_ownership: "Proof of Ownership",
  insurance:          "Insurance Certificate",
  roadworthiness:     "Road Worthiness Certificate",
  vehicle_licence:    "Vehicle Licence",
  hackney_permit:     "Hackney Permit",
  other:              "Other Document",
};

interface ExpiryRow {
  vehicleId: string;
  plateNumber: string;
  vehicle: string;
  vehiclePhoto: string | null;
  docType: string;
  docUrl: string;
  expiresAt: string;
  expired: boolean;
}

export default function DocumentRadarPage() {
  const [rows, setRows]       = useState<ExpiryRow[]>([]);
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays]       = useState(60);

  useEffect(() => {
    setLoading(true);
    api<ExpiryRow[]>(`/vehicles/expiring-documents?days=${days}`)
      .then(setRows)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [days]);

  const expired = rows.filter((r) => r.expired);
  const expiring = rows.filter((r) => !r.expired);

  return (
    <>
      <PageHeader
        title="Document Radar"
        description="Track vehicle documents that are expiring or already expired."
        breadcrumb={[{ label: "Fleet", href: "/fleet" }, { label: "Document Radar" }]}
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--rd-ink-muted)]">Show next</span>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="text-xs border border-[var(--rd-line)] rounded-lg px-2 py-1.5 bg-[var(--rd-panel)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)]"
            >
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>
        }
      />

      {error && <p className="text-sm text-[var(--rd-error)] mb-4">{error}</p>}

      {loading && <p className="text-sm text-[var(--rd-ink-muted)]">Loading…</p>}

      {!loading && rows.length === 0 && (
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-16 text-center shadow-[var(--rd-shadow-sm)]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-emerald-400 mx-auto mb-3">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p className="text-sm font-medium text-[var(--rd-ink)]">All clear</p>
          <p className="text-xs text-[var(--rd-ink-muted)] mt-1">No documents expiring in the next {days} days.</p>
        </div>
      )}

      {/* Expired (most urgent) */}
      {expired.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <h2 className="text-sm font-semibold text-[var(--rd-error)]">Expired ({expired.length})</h2>
          </div>
          <DocGrid rows={expired} />
        </section>
      )}

      {/* Expiring soon */}
      {expiring.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h2 className="text-sm font-semibold text-amber-700">Expiring within {days} days ({expiring.length})</h2>
          </div>
          <DocGrid rows={expiring} />
        </section>
      )}
    </>
  );
}

function DocGrid({ rows }: { rows: ExpiryRow[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {rows.map((row, i) => (
        <DocCard key={`${row.vehicleId}-${row.docType}-${i}`} row={row} />
      ))}
    </div>
  );
}

function DocCard({ row }: { row: ExpiryRow }) {
  const docUrl   = resolveUrl(row.docUrl);
  const photoUrl = resolveUrl(row.vehiclePhoto);
  const isPdf    = docUrl
    ? docUrl.toLowerCase().endsWith(".pdf") || docUrl.includes("/raw/upload/")
    : false;

  const daysLeft = Math.ceil(
    (new Date(row.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className={[
      "bg-[var(--rd-panel)] border rounded-xl overflow-hidden shadow-[var(--rd-shadow-sm)] flex flex-col",
      row.expired ? "border-red-200" : "border-amber-200",
    ].join(" ")}>

      {/* Document preview — clickable to open */}
      <a
        href={docUrl ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-36 bg-[var(--rd-surface)] relative group overflow-hidden"
        title={`View ${DOC_LABELS[row.docType] ?? row.docType}`}
      >
        {isPdf ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-red-400">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M9 15h6M9 11h6M9 7h3" />
            </svg>
            <span className="text-[11px] font-bold text-red-500 uppercase tracking-wide">PDF</span>
          </div>
        ) : docUrl ? (
          <img src={docUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-[var(--rd-ink-muted)]/25">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
        )}

        {/* Hover: "View document" overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-semibold px-3 py-1.5 rounded-full bg-black/40">
            {isPdf ? "Open PDF" : "View document"}
          </span>
        </div>

        {/* Expiry urgency badge */}
        <span className={[
          "absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold",
          row.expired ? "bg-red-500 text-white" : "bg-amber-400 text-amber-900",
        ].join(" ")}>
          {row.expired ? "Expired" : `${daysLeft}d left`}
        </span>
      </a>

      {/* Card body */}
      <div className="flex-1 p-3 flex flex-col gap-1.5">
        <p className="text-xs font-semibold text-[var(--rd-ink)] leading-tight">
          {DOC_LABELS[row.docType] ?? titleCase(row.docType)}
        </p>

        {/* Vehicle row — thumbnail + name + plate */}
        <Link
          href={`/fleet/${row.vehicleId}`}
          className="flex items-center gap-2 group/veh"
        >
          <div className="w-8 h-6 rounded overflow-hidden bg-[var(--rd-surface)] border border-[var(--rd-line)] shrink-0">
            {photoUrl ? (
              <img src={photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--rd-ink-muted)]/40">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-[var(--rd-ink-muted)] group-hover/veh:text-[var(--rd-primary)] transition-colors truncate leading-tight">
              {row.vehicle}
            </p>
            <p className="text-[10px] font-mono text-[var(--rd-ink-muted)]/70 leading-tight">{row.plateNumber}</p>
          </div>
        </Link>

        <p className={`text-[11px] font-medium ${row.expired ? "text-[var(--rd-error)]" : "text-amber-600"}`}>
          {row.expired ? "Expired " : "Expires "}{shortDate(row.expiresAt)}
        </p>
      </div>

      {/* Footer actions */}
      <div className="border-t border-[var(--rd-line)] px-3 py-2 flex gap-2">
        {docUrl && (
          <a
            href={docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-1.5 rounded-lg text-[11px] font-semibold text-[var(--rd-primary)] bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            {isPdf ? "Open PDF" : "View document"}
          </a>
        )}
        <Link
          href={`/fleet/${row.vehicleId}`}
          className="py-1.5 px-2.5 rounded-lg text-[11px] text-[var(--rd-ink-muted)] bg-[var(--rd-surface)] hover:bg-[var(--rd-line)] transition-colors whitespace-nowrap"
        >
          Vehicle →
        </Link>
      </div>
    </div>
  );
}
