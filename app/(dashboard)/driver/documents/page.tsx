"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import Link from "next/link";

interface KycDoc {
  name: string;
  label: string;
  status: "verified" | "pending" | "rejected" | "missing";
  uploadedAt?: string;
  note?: string;
}

interface KycData {
  overallStatus: string;
  documents: KycDoc[];
}

const DOC_LABELS: Record<string, string> = {
  passport_photo:    "Passport Photograph",
  selfie:            "Selfie / Live Photo",
  nin:               "NIN Slip",
  drivers_licence:   "Driver's Licence",
  utility_bill:      "Utility Bill",
  medical_report:    "Medical Report",
  police_clearance:  "Police Clearance",
  guarantor_nin:     "Guarantor NIN",
  guarantor_bvn_doc: "Guarantor BVN Document",
  guarantor_licence: "Guarantor Driver's Licence",
};

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function DocIcon({ status }: { status: string }) {
  if (status === "verified") {
    return (
      <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-emerald-600"><path d="M20 6L9 17l-5-5" /></svg>
      </div>
    );
  }
  if (status === "rejected") {
    return (
      <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-red-500"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </div>
    );
  }
  if (status === "pending") {
    return (
      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-600"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-[var(--rd-surface)] border-2 border-dashed border-[var(--rd-line)] flex items-center justify-center shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--rd-ink-muted)]/50"><path d="M12 5v14M5 12h14" /></svg>
    </div>
  );
}

export default function DriverDocumentsPage() {
  const [data, setData] = useState<KycData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<KycData>("/driver/kyc/status")
      .then(setData)
      .catch(() => {
        // Fallback: show all documents as missing
        setData({
          overallStatus: "not_started",
          documents: Object.entries(DOC_LABELS).map(([name, label]) => ({
            name, label, status: "missing",
          })),
        });
      });
  }, []);

  const verified = data?.documents.filter((d) => d.status === "verified").length ?? 0;
  const total    = data?.documents.length ?? 0;

  return (
    <>
      <PageHeader
        title="My Documents"
        description="Track the status of each submitted document."
        breadcrumb={[{ label: "Home", href: "/driver" }, { label: "My Documents" }]}
        action={
          <Link
            href="/driver/kyc"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Update Documents
          </Link>
        }
      />

      {error && <p className="text-sm text-[var(--rd-error)] mb-4">{error}</p>}

      {/* Summary bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Overall Status", value: data?.overallStatus?.replace(/_/g, " ") ?? "—" },
          { label: "Verified",       value: `${verified} / ${total}` },
          { label: "Pending Review", value: String(data?.documents.filter((d) => d.status === "pending").length ?? 0) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-4 shadow-[var(--rd-shadow-sm)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)]">{label}</p>
            <p className="mt-1.5 text-lg font-bold text-[var(--rd-ink)] capitalize">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--rd-line)]">
          <h2 className="text-sm font-semibold text-[var(--rd-ink)]">Document Status</h2>
        </div>
        <div className="divide-y divide-[var(--rd-line)]">
          {(data?.documents ?? Object.entries(DOC_LABELS).map(([name, label]) => ({ name, label, status: "missing" as const })) as KycDoc[]).map((doc) => (
            <div key={doc.name} className="flex items-center gap-4 px-5 py-4">
              <DocIcon status={doc.status} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--rd-ink)]">{doc.label}</p>
                {doc.uploadedAt && (
                  <p className="text-xs text-[var(--rd-ink-muted)] mt-0.5">Uploaded {shortDate(doc.uploadedAt)}</p>
                )}
                {doc.note && (
                  <p className="text-xs text-[var(--rd-error)] mt-0.5">{doc.note}</p>
                )}
              </div>
              <StatusBadge status={doc.status} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
