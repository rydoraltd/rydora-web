"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

const API_ORIGIN =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
    : "http://localhost:5000";

function resolveUrl(path: string | undefined) {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_ORIGIN}${path}`;
}

interface Vehicle {
  _id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  color: string;
  status: string;
  photos: string[];
  insuranceNumber?: string;
  insuranceExpiry?: string;
  assignedDriver?: { firstName: string; lastName: string };
  createdAt: string;
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function StatusNote({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft:       "Submitted, awaiting admin review",
    listed:      "Approved and listed on platform",
    funded:      "Funded, awaiting driver assignment",
    assigned:    "Driver assigned",
    active:      "Active — generating earnings",
    maintenance: "Under maintenance",
    retired:     "Retired",
  };
  return <span className="text-xs text-[var(--rd-ink-muted)]">{map[status] ?? status}</span>;
}

export default function InvestorVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Vehicle[]>("/investor/vehicles")
      .then(setVehicles)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        title="Vehicle List"
        description="All vehicles you have submitted to the Rydora platform."
        breadcrumb={[
          { label: "Dashboard", href: "/investor" },
          { label: "Vehicle List" },
        ]}
        action={
          <Link
            href="/investor/vehicles/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Vehicle
          </Link>
        }
      />

      {loading && <p className="text-sm text-[var(--rd-ink-muted)]">Loading vehicles…</p>}
      {error   && <p className="text-sm text-[var(--rd-error)]">{error}</p>}

      {!loading && !error && vehicles.length === 0 && (
        <div className="border border-dashed border-[var(--rd-line)] bg-[var(--rd-panel)] rounded-xl p-16 flex flex-col items-center text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-[var(--rd-ink-muted)]/25 mb-4">
            <rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          <p className="text-sm font-medium text-[var(--rd-ink-muted)]">No vehicles yet</p>
          <p className="text-xs text-[var(--rd-ink-muted)] mt-1 max-w-xs leading-relaxed">
            Submit your first vehicle to the platform. Our team will review and approve it within 48 hours.
          </p>
          <Link
            href="/investor/vehicles/add"
            className="mt-6 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] transition-colors"
          >
            Add Vehicle
          </Link>
        </div>
      )}

      {!loading && vehicles.length > 0 && (
        <div className="space-y-4">
          {vehicles.map((v) => {
            const photo = resolveUrl(v.photos?.[0]);
            return (
              <div
                key={v._id}
                className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl overflow-hidden shadow-[var(--rd-shadow-sm)] flex hover:border-[var(--rd-primary)] transition-colors"
              >
                {/* Photo */}
                <div className="w-36 h-28 shrink-0 bg-[var(--rd-surface)] relative">
                  {photo ? (
                    <img src={photo} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-[var(--rd-ink-muted)]/25">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 items-start justify-between p-4 gap-4 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[var(--rd-ink)]">
                        {v.make} {v.model} {v.year}
                      </p>
                      <StatusBadge status={v.status} />
                    </div>
                    <p className="text-xs font-mono text-[var(--rd-ink-muted)] mt-1">{v.plateNumber}</p>
                    <StatusNote status={v.status} />

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {v.color && (
                        <span className="text-xs text-[var(--rd-ink-muted)]">
                          Color: <span className="text-[var(--rd-ink-body)]">{v.color}</span>
                        </span>
                      )}
                      {v.assignedDriver && (
                        <span className="text-xs text-[var(--rd-ink-muted)]">
                          Driver: <span className="text-[var(--rd-ink-body)]">{v.assignedDriver.firstName} {v.assignedDriver.lastName}</span>
                        </span>
                      )}
                      {v.insuranceNumber && (
                        <span className="text-xs text-[var(--rd-ink-muted)]">
                          Insurance: <span className="text-[var(--rd-ink-body)] font-mono">{v.insuranceNumber}</span>
                        </span>
                      )}
                      {v.insuranceExpiry && (
                        <span className="text-xs text-[var(--rd-ink-muted)]">
                          Expires: <span className="text-[var(--rd-ink-body)]">{shortDate(v.insuranceExpiry)}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[11px] text-[var(--rd-ink-muted)]">Submitted</p>
                    <p className="text-xs text-[var(--rd-ink-body)] mt-0.5">{shortDate(v.createdAt)}</p>
                    <Link
                      href={`/investor/vehicles/${v._id}`}
                      className="mt-2 inline-block text-xs font-medium text-[var(--rd-primary)] hover:underline"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
