"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { naira, shortDate, titleCase } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

const API_ORIGIN =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
    : "http://localhost:5000";

function resolveUrl(path: string | undefined | null): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_ORIGIN}${path}`;
}

function isPdf(url: string) { return url.toLowerCase().endsWith(".pdf"); }

const DOC_LABELS: Record<string, string> = {
  proof_of_ownership: "Proof of Ownership",
  insurance:          "Insurance Certificate",
  roadworthiness:     "Road Worthiness Certificate",
  vehicle_licence:    "Vehicle Licence",
  hackney_permit:     "Hackney Permit",
  other:              "Other Document",
};

const STATUS_EXPLAIN: Record<string, string> = {
  draft:       "Your vehicle has been submitted and is waiting for our team to review your documents and approve it.",
  listed:      "Your vehicle has been approved and is now listed on the platform. An investor can fund it or it is awaiting driver assignment.",
  funded:      "Your vehicle has been funded and is awaiting driver assignment.",
  assigned:    "A driver has been assigned and the vehicle is being prepared for active operation.",
  active:      "Your vehicle is active and generating daily remittances. You can track earnings in your wallet.",
  maintenance: "Your vehicle has been sent for maintenance. It will return to active status once serviced.",
  retired:     "This vehicle has been retired from the platform.",
};

interface VehicleDoc {
  _id: string;
  type: string;
  url: string;
  expiresAt?: string;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  color?: string;
  status: string;
  photos: string[];
  documents: VehicleDoc[];
  registrationDate?: string;
  hasSafetyInspection: boolean;
  insuranceNumber?: string;
  insuranceExpiry?: string;
  weeklyRemittanceTargetKobo: number;
  split: { driverPct: number; investorPct: number; rydoraPct: number };
  assignedDriver?: { firstName: string; lastName: string };
  createdAt: string;
}

export default function InvestorVehicleDetailPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    api<Vehicle>(`/investor/vehicles/${vehicleId}`)
      .then(setVehicle)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [vehicleId]);

  if (loading) return <p className="text-sm text-[var(--rd-ink-muted)]">Loading…</p>;
  if (error)   return <p className="text-sm text-[var(--rd-error)]">{error}</p>;
  if (!vehicle) return null;

  return (
    <>
      <PageHeader
        title={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
        description={vehicle.plateNumber}
        breadcrumb={[
          { label: "Dashboard", href: "/investor" },
          { label: "Vehicle List", href: "/investor/vehicles" },
          { label: vehicle.plateNumber },
        ]}
        action={<StatusBadge status={vehicle.status} />}
      />

      {/* Status banner */}
      <div className="mb-6 bg-[var(--rd-surface)] border border-[var(--rd-line)] rounded-xl px-5 py-4 flex items-start gap-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--rd-primary)] shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
        </svg>
        <p className="text-sm text-[var(--rd-ink-body)] leading-relaxed">
          {STATUS_EXPLAIN[vehicle.status] ?? `Status: ${vehicle.status}`}
        </p>
      </div>

      {/* Photo gallery */}
      {vehicle.photos.length > 0 && (
        <section className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)] mb-3">
            Vehicle Photos
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {vehicle.photos.map((photo, i) => {
              const url = resolveUrl(photo);
              return (
                <button
                  key={i}
                  onClick={() => setLightbox(i)}
                  className="shrink-0 w-40 h-28 rounded-xl overflow-hidden border border-[var(--rd-line)] bg-[var(--rd-surface)] hover:opacity-90 transition-opacity"
                >
                  {url && <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <img
            src={resolveUrl(vehicle.photos[lightbox]) ?? ""}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Vehicle details */}
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--rd-line)] bg-[var(--rd-surface)]">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">Vehicle Details</h2>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
              {[
                { label: "Make", value: vehicle.make },
                { label: "Model", value: vehicle.model },
                { label: "Year", value: String(vehicle.year) },
                { label: "Color", value: vehicle.color },
                { label: "Plate number", value: vehicle.plateNumber },
                { label: "Registration date", value: vehicle.registrationDate ? shortDate(vehicle.registrationDate) : undefined },
                { label: "Safety inspection", value: vehicle.hasSafetyInspection ? "Passed" : "Not confirmed" },
                { label: "Insurance number", value: vehicle.insuranceNumber },
                { label: "Insurance expiry", value: vehicle.insuranceExpiry ? shortDate(vehicle.insuranceExpiry) : undefined },
                { label: "Submitted", value: shortDate(vehicle.createdAt) },
              ].filter((r) => r.value).map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--rd-ink-muted)] font-medium">{label}</p>
                  <p className="mt-0.5 text-sm text-[var(--rd-ink)]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--rd-line)] bg-[var(--rd-surface)]">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">
                Uploaded Documents ({vehicle.documents.length})
              </h2>
            </div>
            {vehicle.documents.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-[var(--rd-ink-muted)]">No documents uploaded.</p>
                <Link href={`/investor/vehicles/add`} className="mt-2 text-sm text-[var(--rd-primary)] hover:underline">
                  Resubmit with documents →
                </Link>
              </div>
            ) : (
              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {vehicle.documents.map((doc) => {
                  const url = resolveUrl(doc.url);
                  const pdf = url ? isPdf(url) : false;
                  return (
                    <div key={doc._id} className="border border-[var(--rd-line)] rounded-xl overflow-hidden bg-[var(--rd-surface)]">
                      <div className="h-28 flex items-center justify-center bg-[var(--rd-surface)]">
                        {pdf ? (
                          <div className="flex flex-col items-center gap-1">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-red-400">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span className="text-[11px] font-bold text-red-500 uppercase">PDF</span>
                          </div>
                        ) : url ? (
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div className="px-3 py-2 border-t border-[var(--rd-line)]">
                        <p className="text-xs font-medium text-[var(--rd-ink)] truncate">
                          {DOC_LABELS[doc.type] ?? titleCase(doc.type)}
                        </p>
                        {doc.expiresAt && (
                          <p className="text-[11px] text-[var(--rd-ink-muted)] mt-0.5">
                            Expires {shortDate(doc.expiresAt)}
                          </p>
                        )}
                        {url && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1.5 inline-block text-xs text-[var(--rd-primary)] hover:underline"
                          >
                            {pdf ? "View PDF" : "View full size"} →
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Earnings terms */}
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)] mb-4">Earnings Terms</p>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--rd-ink-muted)]">Weekly remittance target</p>
                <p className="mt-0.5 text-base font-semibold text-[var(--rd-ink)]">{naira(vehicle.weeklyRemittanceTargetKobo)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--rd-ink-muted)] mb-1.5">Your share</p>
                <div className="flex gap-0 rounded-lg overflow-hidden h-5 text-[10px] font-semibold">
                  <div className="flex items-center justify-center bg-[var(--rd-primary)] text-white" style={{ width: `${vehicle.split.driverPct}%` }}>
                    Driver {vehicle.split.driverPct}%
                  </div>
                  <div className="flex items-center justify-center bg-emerald-500 text-white" style={{ width: `${vehicle.split.investorPct}%` }}>
                    You {vehicle.split.investorPct}%
                  </div>
                  <div className="flex items-center justify-center bg-[var(--rd-ink-muted)] text-white" style={{ width: `${vehicle.split.rydoraPct}%` }}>
                    Rydora {vehicle.split.rydoraPct}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver */}
          {vehicle.assignedDriver ? (
            <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)] mb-3">Assigned Driver</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {vehicle.assignedDriver.firstName[0]}{vehicle.assignedDriver.lastName[0]}
                </div>
                <p className="text-sm font-medium text-[var(--rd-ink)]">
                  {vehicle.assignedDriver.firstName} {vehicle.assignedDriver.lastName}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--rd-surface)] border border-dashed border-[var(--rd-line)] rounded-xl p-5 text-center">
              <p className="text-xs text-[var(--rd-ink-muted)]">No driver assigned yet</p>
            </div>
          )}

          {/* Quick links */}
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)] mb-3">Quick Links</p>
            <Link
              href={`/investor/statements/${vehicleId}`}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[var(--rd-surface)] hover:bg-[var(--rd-line)] transition-colors text-sm text-[var(--rd-ink-body)]"
            >
              <span>Earnings Statement</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
            <Link
              href="/investor/vehicles"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[var(--rd-surface)] hover:bg-[var(--rd-line)] transition-colors text-sm text-[var(--rd-ink-body)]"
            >
              <span>Back to Vehicle List</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
