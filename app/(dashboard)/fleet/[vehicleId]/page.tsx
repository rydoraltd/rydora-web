"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

function isPdf(url: string) {
  return url.toLowerCase().endsWith(".pdf");
}

const DOC_LABELS: Record<string, string> = {
  proof_of_ownership: "Proof of Ownership",
  insurance:          "Insurance Certificate",
  roadworthiness:     "Road Worthiness Certificate",
  vehicle_licence:    "Vehicle Licence",
  hackney_permit:     "Hackney Permit",
  other:              "Other Document",
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
  vin?: string;
  color?: string;
  status: string;
  photos: string[];
  documents: VehicleDoc[];
  registrationDate?: string;
  hasSafetyInspection: boolean;
  insuranceNumber?: string;
  insuranceExpiry?: string;
  fundingTargetKobo: number;
  fundedKobo: number;
  weeklyRemittanceTargetKobo: number;
  split: { driverPct: number; investorPct: number; rydoraPct: number };
  investor?: { firstName: string; lastName: string; email: string };
  assignedDriver?: { firstName: string; lastName: string; phone: string; driverProfile?: { licenceNumber?: string; virtualAccount?: { bankName: string; accountNumber: string } } };
  odometerKm?: number;
  notes?: string;
  createdAt: string;
}

interface Driver { _id: string; firstName: string; lastName: string; phone?: string }

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft:       ["listed"],
  listed:      ["draft", "funded"],
  funded:      ["listed", "assigned"],
  assigned:    ["active", "funded"],
  active:      ["maintenance", "funded"],
  maintenance: ["active"],
};

const TRANSITION_LABELS: Record<string, Record<string, string>> = {
  draft:       { listed:      "Approve & list" },
  listed:      { draft:       "Move back to draft", funded: "Mark as funded" },
  funded:      { listed:      "Back to listed", assigned: "Mark as assigned" },
  assigned:    { active:      "Mark active", funded: "Back to funded" },
  active:      { maintenance: "Send to maintenance", funded: "Unassign & reopen" },
  maintenance: { active:      "Mark active" },
};

function PhotoLightbox({ photos, index, onClose }: { photos: string[]; index: number; onClose: () => void }) {
  const [current, setCurrent] = useState(index);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % photos.length);
      if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + photos.length) % photos.length);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [photos.length, onClose]);

  const url = resolveUrl(photos[current]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + photos.length) % photos.length); }}
            className="absolute left-4 text-white/70 hover:text-white p-2"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % photos.length); }}
            className="absolute right-4 text-white/70 hover:text-white p-2"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      <img
        src={url ?? ""}
        alt={`Photo ${current + 1}`}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {photos.length > 1 && (
        <div className="absolute bottom-4 flex gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DocCard({ doc }: { doc: VehicleDoc }) {
  const url = resolveUrl(doc.url);
  const pdf = url ? isPdf(url) : false;
  const expired = doc.expiresAt ? new Date(doc.expiresAt) < new Date() : false;
  const expiringSoon = doc.expiresAt && !expired
    ? new Date(doc.expiresAt).getTime() - Date.now() < 30 * 864e5
    : false;

  return (
    <div className="border border-[var(--rd-line)] rounded-xl overflow-hidden bg-[var(--rd-panel)]">
      {/* Preview */}
      <div className="h-32 bg-[var(--rd-surface)] flex items-center justify-center relative">
        {pdf ? (
          <div className="flex flex-col items-center gap-1.5">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-red-400">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M9 15h6M9 11h6M9 7h3" />
            </svg>
            <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">PDF</span>
          </div>
        ) : url ? (
          <img src={url} alt={DOC_LABELS[doc.type] ?? doc.type} className="w-full h-full object-cover" />
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-[var(--rd-ink-muted)]/30">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
          </svg>
        )}

        {/* Expiry badge */}
        {doc.expiresAt && (
          <span className={[
            "absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-semibold",
            expired        ? "bg-red-100 text-red-600"
            : expiringSoon ? "bg-amber-100 text-amber-600"
                           : "bg-emerald-100 text-emerald-600",
          ].join(" ")}>
            {expired ? "Expired" : expiringSoon ? "Expiring soon" : "Valid"}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="text-xs font-semibold text-[var(--rd-ink)] truncate">
          {DOC_LABELS[doc.type] ?? titleCase(doc.type)}
        </p>
        {doc.expiresAt && (
          <p className={`text-[11px] mt-0.5 ${expired ? "text-[var(--rd-error)]" : "text-[var(--rd-ink-muted)]"}`}>
            {expired ? "Expired " : "Expires "}{shortDate(doc.expiresAt)}
          </p>
        )}
      </div>

      {/* Actions */}
      {url && (
        <div className="border-t border-[var(--rd-line)] px-3 py-2 flex gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-1 rounded-lg text-xs font-medium text-[var(--rd-primary)] bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            {pdf ? "View PDF" : "View full size"}
          </a>
          <a
            href={url}
            download
            className="py-1 px-2 rounded-lg text-xs text-[var(--rd-ink-muted)] bg-[var(--rd-surface)] hover:bg-[var(--rd-line)] transition-colors"
            title="Download"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

export default function FleetVehicleDetailPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const router = useRouter();

  const [vehicle, setVehicle]     = useState<Vehicle | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [lightboxIdx, setLightbox] = useState<number | null>(null);

  // Status change
  const [statusBusy, setStatusBusy] = useState<string | null>(null);
  const [statusErr, setStatusErr]   = useState<string | null>(null);

  // Driver assignment
  const [drivers, setDrivers]       = useState<Driver[]>([]);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedDriver, setSelected] = useState("");
  const [assignBusy, setAssignBusy] = useState(false);
  const [assignErr, setAssignErr]   = useState<string | null>(null);
  const [driversLoading, setDriversLoading] = useState(false);

  const load = useCallback(() => {
    api<Vehicle>(`/vehicles/${vehicleId}`)
      .then(setVehicle)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [vehicleId]);

  useEffect(() => { load(); }, [load]);

  async function handleStatusChange(next: string) {
    setStatusBusy(next);
    setStatusErr(null);
    try {
      await api(`/vehicles/${vehicleId}`, { method: "PATCH", body: { status: next } });
      load();
    } catch (err) {
      setStatusErr(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setStatusBusy(null);
    }
  }

  async function openAssign() {
    setShowAssign(true);
    setSelected("");
    setAssignErr(null);
    setDriversLoading(true);
    try {
      const data = await api<Driver[]>("/vehicles/available-drivers");
      setDrivers(data);
    } catch {
      setDrivers([]);
    } finally {
      setDriversLoading(false);
    }
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    setAssignBusy(true);
    setAssignErr(null);
    try {
      await api(`/vehicles/${vehicleId}/assign-driver`, { method: "POST", body: { driverId: selectedDriver } });
      setShowAssign(false);
      load();
    } catch (err) {
      setAssignErr(err instanceof Error ? err.message : "Assignment failed");
    } finally {
      setAssignBusy(false);
    }
  }

  async function handleUnassign() {
    setStatusBusy("unassign");
    setStatusErr(null);
    try {
      await api(`/vehicles/${vehicleId}/unassign-driver`, { method: "POST" });
      load();
    } catch (err) {
      setStatusErr(err instanceof Error ? err.message : "Unassign failed");
    } finally {
      setStatusBusy(null);
    }
  }

  if (loading) return <p className="text-sm text-[var(--rd-ink-muted)]">Loading…</p>;
  if (error)   return <p className="text-sm text-[var(--rd-error)]">{error}</p>;
  if (!vehicle) return null;

  const transitions = VALID_TRANSITIONS[vehicle.status] ?? [];
  const canAssign   = ["funded", "listed", "assigned"].includes(vehicle.status) && !vehicle.assignedDriver;
  const canUnassign = !!vehicle.assignedDriver;
  const fundPct     = vehicle.fundingTargetKobo > 0
    ? Math.min(100, Math.round((vehicle.fundedKobo / vehicle.fundingTargetKobo) * 100))
    : null;

  return (
    <>
      <PageHeader
        title={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
        description={vehicle.plateNumber}
        breadcrumb={[
          { label: "Fleet", href: "/fleet" },
          { label: vehicle.plateNumber },
        ]}
        action={<StatusBadge status={vehicle.status} />}
      />

      {/* Photo gallery */}
      {vehicle.photos.length > 0 && (
        <section className="mb-6">
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

      {lightboxIdx !== null && (
        <PhotoLightbox
          photos={vehicle.photos}
          index={lightboxIdx}
          onClose={() => setLightbox(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — details */}
        <div className="lg:col-span-2 space-y-5">

          {/* Vehicle info */}
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
                { label: "VIN", value: vehicle.vin },
                { label: "Registration date", value: vehicle.registrationDate ? shortDate(vehicle.registrationDate) : undefined },
                { label: "Safety inspection", value: vehicle.hasSafetyInspection ? "Yes" : "No" },
                { label: "Odometer", value: vehicle.odometerKm != null ? `${vehicle.odometerKm.toLocaleString()} km` : undefined },
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
            {vehicle.notes && (
              <div className="px-5 pb-5">
                <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--rd-ink-muted)] font-medium">Notes</p>
                <p className="mt-0.5 text-sm text-[var(--rd-ink-body)]">{vehicle.notes}</p>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--rd-line)] bg-[var(--rd-surface)] flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">
                Documents ({vehicle.documents.length})
              </h2>
              {vehicle.documents.length === 0 && (
                <span className="text-xs text-amber-600 font-medium">No documents uploaded</span>
              )}
            </div>
            {vehicle.documents.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-[var(--rd-ink-muted)]">
                  No documents were uploaded for this vehicle.
                </p>
              </div>
            ) : (
              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {vehicle.documents.map((doc) => (
                  <DocCard key={doc._id} doc={doc} />
                ))}
              </div>
            )}
          </div>

          {/* Commercial */}
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--rd-line)] bg-[var(--rd-surface)]">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">Commercial Terms</h2>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--rd-ink-muted)] font-medium">Funding target</p>
                <p className="mt-0.5 text-sm font-semibold text-[var(--rd-ink)]">{naira(vehicle.fundingTargetKobo)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--rd-ink-muted)] font-medium">Funded</p>
                <p className="mt-0.5 text-sm font-semibold text-[var(--rd-ink)]">{naira(vehicle.fundedKobo)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--rd-ink-muted)] font-medium">Weekly remittance</p>
                <p className="mt-0.5 text-sm font-semibold text-[var(--rd-ink)]">{naira(vehicle.weeklyRemittanceTargetKobo)}</p>
              </div>
              <div className="col-span-full">
                <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--rd-ink-muted)] font-medium mb-2">Revenue split</p>
                <div className="flex gap-0 rounded-lg overflow-hidden h-6 text-[11px] font-semibold">
                  <div
                    className="flex items-center justify-center bg-[var(--rd-primary)] text-white"
                    style={{ width: `${vehicle.split.driverPct}%` }}
                  >
                    Driver {vehicle.split.driverPct}%
                  </div>
                  <div
                    className="flex items-center justify-center bg-emerald-500 text-white"
                    style={{ width: `${vehicle.split.investorPct}%` }}
                  >
                    Investor {vehicle.split.investorPct}%
                  </div>
                  <div
                    className="flex items-center justify-center bg-[var(--rd-ink-muted)] text-white"
                    style={{ width: `${vehicle.split.rydoraPct}%` }}
                  >
                    Rydora {vehicle.split.rydoraPct}%
                  </div>
                </div>
              </div>
              {fundPct !== null && (
                <div className="col-span-full">
                  <div className="flex justify-between text-xs text-[var(--rd-ink-muted)] mb-1">
                    <span>Funding progress</span>
                    <span>{fundPct}%</span>
                  </div>
                  <div className="h-2 bg-[var(--rd-surface)] rounded-full overflow-hidden">
                    <div className="h-2 bg-[var(--rd-primary)] rounded-full" style={{ width: `${fundPct}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column — people + actions */}
        <div className="space-y-5">

          {/* Status actions */}
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)] mb-3">Status Actions</p>

            <div className="flex items-center gap-2 mb-4">
              <StatusBadge status={vehicle.status} />
              <span className="text-xs text-[var(--rd-ink-muted)]">current status</span>
            </div>

            {statusErr && (
              <p className="text-xs text-[var(--rd-error)] mb-3 bg-red-50 px-3 py-2 rounded-lg">{statusErr}</p>
            )}

            <div className="space-y-2">
              {transitions.map((next) => (
                <button
                  key={next}
                  onClick={() => handleStatusChange(next)}
                  disabled={!!statusBusy}
                  className={[
                    "w-full py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50",
                    next === "listed"
                      ? "bg-[var(--rd-primary)] text-white hover:bg-[var(--rd-primary-strong)]"
                      : next === "active"
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)] hover:bg-[var(--rd-surface)]",
                  ].join(" ")}
                >
                  {statusBusy === next ? "Saving…" : (TRANSITION_LABELS[vehicle.status]?.[next] ?? titleCase(next))}
                </button>
              ))}

              {canAssign && (
                <button
                  onClick={openAssign}
                  disabled={!!statusBusy}
                  className="w-full py-2 rounded-lg text-xs font-semibold border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)] hover:bg-[var(--rd-surface)] transition-colors"
                >
                  Assign driver
                </button>
              )}

              {canUnassign && (
                <button
                  onClick={handleUnassign}
                  disabled={statusBusy === "unassign"}
                  className="w-full py-2 rounded-lg text-xs font-semibold border border-[var(--rd-error)]/30 text-[var(--rd-error)] hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {statusBusy === "unassign" ? "Removing…" : "Unassign driver"}
                </button>
              )}
            </div>
          </div>

          {/* Investor */}
          {vehicle.investor && (
            <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)] mb-3">Investor</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--rd-primary)] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {vehicle.investor.firstName[0]}{vehicle.investor.lastName[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--rd-ink)] truncate">
                    {vehicle.investor.firstName} {vehicle.investor.lastName}
                  </p>
                  <p className="text-xs text-[var(--rd-ink-muted)] truncate">{vehicle.investor.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Assigned driver */}
          {vehicle.assignedDriver ? (
            <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)] mb-3">Assigned Driver</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {vehicle.assignedDriver.firstName[0]}{vehicle.assignedDriver.lastName[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--rd-ink)] truncate">
                    {vehicle.assignedDriver.firstName} {vehicle.assignedDriver.lastName}
                  </p>
                  <p className="text-xs text-[var(--rd-ink-muted)] truncate">{vehicle.assignedDriver.phone}</p>
                </div>
              </div>
              {vehicle.assignedDriver.driverProfile?.licenceNumber && (
                <p className="text-xs text-[var(--rd-ink-muted)]">
                  Licence: <span className="font-mono text-[var(--rd-ink-body)]">{vehicle.assignedDriver.driverProfile.licenceNumber}</span>
                </p>
              )}
              {vehicle.assignedDriver.driverProfile?.virtualAccount && (
                <div className="mt-3 bg-[var(--rd-surface)] rounded-lg px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--rd-ink-muted)] mb-0.5">Virtual account</p>
                  <p className="text-sm font-mono font-semibold text-[var(--rd-ink)]">
                    {vehicle.assignedDriver.driverProfile.virtualAccount.accountNumber}
                  </p>
                  <p className="text-xs text-[var(--rd-ink-muted)]">
                    {vehicle.assignedDriver.driverProfile.virtualAccount.bankName}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[var(--rd-surface)] border border-dashed border-[var(--rd-line)] rounded-xl p-5 text-center">
              <p className="text-xs text-[var(--rd-ink-muted)]">No driver assigned yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Assign driver modal */}
      {showAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] w-full max-w-md rounded-2xl shadow-2xl">
            <div className="px-6 pt-6 pb-0 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--rd-ink)]">
                Assign driver — {vehicle.plateNumber}
              </h2>
              <button onClick={() => setShowAssign(false)} className="text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAssign} className="px-6 pt-4 pb-6">
              {driversLoading ? (
                <p className="text-sm text-[var(--rd-ink-muted)] py-4">Loading drivers…</p>
              ) : drivers.length === 0 ? (
                <p className="text-sm text-[var(--rd-ink-muted)] py-4">
                  No available drivers. Approve a driver from the Users page first.
                </p>
              ) : (
                <div className="max-h-52 overflow-y-auto border border-[var(--rd-line)] rounded-xl mb-4">
                  {drivers.map((d) => (
                    <label
                      key={d._id}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-[var(--rd-line)] last:border-b-0 transition-colors ${selectedDriver === d._id ? "bg-blue-50" : "hover:bg-[var(--rd-surface)]"}`}
                    >
                      <input
                        type="radio" name="driver" value={d._id}
                        checked={selectedDriver === d._id}
                        onChange={() => setSelected(d._id)}
                        className="accent-[var(--rd-primary)]"
                      />
                      <div>
                        <p className="text-sm font-medium text-[var(--rd-ink)]">{d.firstName} {d.lastName}</p>
                        {d.phone && <p className="text-xs text-[var(--rd-ink-muted)]">{d.phone}</p>}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {assignErr && <p className="text-xs text-[var(--rd-error)] mb-3">{assignErr}</p>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={assignBusy || !selectedDriver}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50 transition-colors"
                >
                  {assignBusy ? "Assigning…" : "Assign driver"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssign(false)}
                  className="px-4 py-2.5 rounded-lg text-sm text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)] border border-[var(--rd-line)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
