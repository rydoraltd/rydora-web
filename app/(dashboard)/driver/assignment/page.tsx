"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface Assignment {
  vehicle: {
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    colour: string;
    type: string;
    imageUrl?: string;
  } | null;
  assignedSince?: string;
  remittanceTarget?: number;
  remittanceFrequency?: string;
  schedule?: string;
  status: string;
  investor?: { firstName: string; lastName: string };
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function naira(kobo: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(kobo / 100);
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 border-b border-[var(--rd-line)] last:border-0">
      <span className="text-xs font-medium text-[var(--rd-ink-muted)] uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-[var(--rd-ink)]">{value}</span>
    </div>
  );
}

export default function DriverAssignmentPage() {
  const [data, setData] = useState<Assignment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Assignment>("/driver/assignment")
      .then(setData)
      .catch((e) => {
        setError(e.message);
        setData({ vehicle: null, status: "unassigned" });
      });
  }, []);

  if (!data) {
    return <p className="text-sm text-[var(--rd-ink-muted)]">Loading…</p>;
  }

  if (!data.vehicle) {
    return (
      <>
        <PageHeader title="My Assignment" breadcrumb={[{ label: "Home", href: "/driver" }, { label: "My Assignment" }]} />
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-12 text-center shadow-[var(--rd-shadow-sm)]">
          <div className="w-14 h-14 rounded-full bg-[var(--rd-surface)] flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--rd-ink-muted)]">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" />
              <circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-[var(--rd-ink)]">No vehicle assigned yet</h2>
          <p className="text-sm text-[var(--rd-ink-muted)] mt-2 max-w-xs mx-auto leading-relaxed">
            Operations will assign a vehicle once your KYC is verified. Check back soon.
          </p>
        </div>
      </>
    );
  }

  const v = data.vehicle;

  return (
    <>
      <PageHeader
        title="My Assignment"
        description="Details of your current vehicle and remittance schedule."
        breadcrumb={[{ label: "Home", href: "/driver" }, { label: "My Assignment" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle card */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
            {v.imageUrl && (
              <div className="h-48 bg-[var(--rd-surface)] overflow-hidden">
                <img src={v.imageUrl} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="px-5 py-4 border-b border-[var(--rd-line)] flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[var(--rd-ink)]">{v.make} {v.model} {v.year}</h2>
                <p className="text-sm text-[var(--rd-ink-muted)]">{v.plateNumber}</p>
              </div>
              <StatusBadge status={data.status} />
            </div>
            <div className="px-5 py-2">
              <InfoRow label="Colour"     value={v.colour} />
              <InfoRow label="Type"       value={v.type} />
              <InfoRow label="Plate"      value={v.plateNumber} />
              {data.assignedSince && <InfoRow label="Assigned Since" value={shortDate(data.assignedSince)} />}
              {data.investor && <InfoRow label="Vehicle Owner" value={`${data.investor.firstName} ${data.investor.lastName}`} />}
            </div>
          </div>
        </div>

        {/* Schedule card */}
        <div className="space-y-5">
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-5">
            <h3 className="text-xs font-semibold text-[var(--rd-ink-muted)] uppercase tracking-wide mb-4">Remittance Schedule</h3>
            <div className="space-y-3">
              {data.remittanceTarget != null && (
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--rd-ink-muted)]">Weekly Target</span>
                  <span className="text-sm font-semibold text-[var(--rd-ink)]">{naira(data.remittanceTarget)}</span>
                </div>
              )}
              {data.remittanceFrequency && (
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--rd-ink-muted)]">Frequency</span>
                  <span className="text-sm font-medium text-[var(--rd-ink)] capitalize">{data.remittanceFrequency}</span>
                </div>
              )}
              {data.schedule && (
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--rd-ink-muted)]">Schedule</span>
                  <span className="text-sm font-medium text-[var(--rd-ink)]">{data.schedule}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-800 mb-1.5">Need help?</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              If you have issues with your vehicle or assignment, contact operations via the Support page.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
