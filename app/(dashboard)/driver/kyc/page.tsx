"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";

const API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000/api/v1";

const DOC_FIELDS = [
  { name: "passport_photo",  label: "Passport Photograph",     required: true,  accept: "image/*",       note: "Clear, recent passport-style photo" },
  { name: "nin",             label: "NIN Slip / Capture",       required: true,  accept: "image/*,.pdf",  note: "National Identity Number document" },
  { name: "drivers_licence", label: "Driver's Licence",         required: true,  accept: "image/*,.pdf",  note: "Front page, clearly readable" },
  { name: "guarantor_form",  label: "Guarantor Form",           required: true,  accept: "image/*,.pdf",  note: "Completed and signed by guarantor" },
  { name: "utility_bill",    label: "Utility Bill",             required: false, accept: "image/*,.pdf",  note: "Not older than 3 months" },
] as const;

type DocFieldName = typeof DOC_FIELDS[number]["name"];

interface FileState {
  file: File;
  preview: string | null;
}

function FileRow({
  field,
  value,
  onChange,
}: {
  field: typeof DOC_FIELDS[number];
  value: FileState | null;
  onChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
  }

  const isImage = value?.file.type.startsWith("image/");

  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-[var(--rd-line)] last:border-0">
      {/* Thumbnail */}
      <div
        onClick={() => inputRef.current?.click()}
        className="w-14 h-14 shrink-0 rounded-xl border-2 border-dashed border-[var(--rd-line)] bg-[var(--rd-surface)] flex items-center justify-center cursor-pointer hover:border-[var(--rd-primary)] transition-colors overflow-hidden"
      >
        {value ? (
          isImage ? (
            <img src={URL.createObjectURL(value.file)} alt="" className="w-full h-full object-cover" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--rd-primary)]">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          )
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--rd-ink-muted)]/50">
            <path d="M12 5v14M5 12h14" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--rd-ink)]">
          {field.label}
          {field.required && <span className="text-[var(--rd-error)] ml-1">*</span>}
        </p>
        <p className="text-xs text-[var(--rd-ink-muted)] mt-0.5">{field.note}</p>
        {value && (
          <p className="text-xs text-emerald-600 mt-0.5 truncate font-medium">
            ✓ {value.file.name}
          </p>
        )}
      </div>

      {/* Button */}
      <div className="shrink-0">
        <input
          ref={inputRef}
          type="file"
          accept={field.accept}
          onChange={handleChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:border-[var(--rd-primary)] hover:text-[var(--rd-primary)] transition-colors"
        >
          {value ? "Change" : "Choose"}
        </button>
      </div>
    </div>
  );
}

export default function DriverKycPage() {
  const { user, refreshUser } = useAuth() as { user: NonNullable<ReturnType<typeof useAuth>["user"]>; refreshUser?: () => void };

  const [files, setFiles]             = useState<Partial<Record<DocFieldName, FileState>>>({});
  const [licenceNumber, setLicenceNumber] = useState("");
  const [licenceExpiry, setLicenceExpiry] = useState("");
  const [guarantorName, setGuarantorName] = useState("");
  const [guarantorPhone, setGuarantorPhone] = useState("");

  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const alreadySubmitted = user?.kycStatus === "submitted" || user?.kycStatus === "approved";

  function setFile(name: DocFieldName, file: File | null) {
    setFiles((prev) => {
      if (!file) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: { file, preview: null } };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate required docs
    for (const field of DOC_FIELDS) {
      if (field.required && !files[field.name]) {
        setError(`${field.label} is required.`);
        return;
      }
    }

    setBusy(true);
    const fd = new FormData();

    for (const [name, state] of Object.entries(files)) {
      if (state) fd.append(name, state.file);
    }
    if (licenceNumber) fd.append("licenceNumber", licenceNumber);
    if (licenceExpiry) fd.append("licenceExpiry", licenceExpiry);
    if (guarantorName) fd.append("guarantorName", guarantorName);
    if (guarantorPhone) fd.append("guarantorPhone", guarantorPhone);

    try {
      const token = localStorage.getItem("rd_access");
      const res = await fetch(`${API_BASE}/driver/kyc/files`, {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Submission failed");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <>
        <PageHeader title="KYC Documents" breadcrumb={[{ label: "Home", href: "/driver" }, { label: "KYC Documents" }]} />
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-12 text-center shadow-[var(--rd-shadow-sm)]">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-emerald-600">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-[var(--rd-ink)]">Documents submitted</h2>
          <p className="text-sm text-[var(--rd-ink-muted)] mt-2 max-w-xs mx-auto leading-relaxed">
            Your KYC documents are under review. Our team will process them within 48 hours.
          </p>
        </div>
      </>
    );
  }

  if (alreadySubmitted) {
    return (
      <>
        <PageHeader title="KYC Documents" breadcrumb={[{ label: "Home", href: "/driver" }, { label: "KYC Documents" }]} />
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-12 text-center shadow-[var(--rd-shadow-sm)]">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--rd-primary)]">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M16 13H8M16 17H8M10 9H8" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-[var(--rd-ink)]">
            {user?.kycStatus === "approved" ? "KYC Approved" : "Documents under review"}
          </h2>
          <p className="text-sm text-[var(--rd-ink-muted)] mt-2 max-w-xs mx-auto leading-relaxed">
            {user?.kycStatus === "approved"
              ? "Your identity has been verified. You are fully onboarded."
              : "Your documents have been submitted and are being reviewed by our team."}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="KYC Documents"
        description="Submit your identity and background documents to complete onboarding."
        breadcrumb={[
          { label: "Home", href: "/driver" },
          { label: "KYC Documents" },
        ]}
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Documents panel */}
        <div className="lg:col-span-2 bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--rd-line)]">
            <h2 className="text-sm font-semibold text-[var(--rd-ink)]">Identity Documents</h2>
            <p className="text-xs text-[var(--rd-ink-muted)] mt-0.5">JPG, PNG, or PDF · max 5 MB each</p>
          </div>
          <div className="px-5">
            {DOC_FIELDS.map((field) => (
              <FileRow
                key={field.name}
                field={field}
                value={files[field.name] ?? null}
                onChange={(f) => setFile(field.name, f)}
              />
            ))}
          </div>
        </div>

        {/* Details panel */}
        <div className="space-y-5">
          {/* Licence info */}
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--rd-ink)]">Licence Details</h2>

            <div>
              <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">Licence number</label>
              <input
                type="text"
                value={licenceNumber}
                onChange={(e) => setLicenceNumber(e.target.value)}
                placeholder="e.g. ABC-1234567"
                className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">Licence expiry date</label>
              <input
                type="date"
                value={licenceExpiry}
                onChange={(e) => setLicenceExpiry(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
              />
            </div>
          </div>

          {/* Guarantor info */}
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--rd-ink)]">Guarantor Details</h2>

            <div>
              <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">Guarantor full name</label>
              <input
                type="text"
                value={guarantorName}
                onChange={(e) => setGuarantorName(e.target.value)}
                placeholder="e.g. Chukwuemeka Obi"
                className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">Guarantor phone</label>
              <input
                type="tel"
                value={guarantorPhone}
                onChange={(e) => setGuarantorPhone(e.target.value)}
                placeholder="+2348012345678"
                className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-[var(--rd-surface)] border border-[var(--rd-line)] rounded-xl p-5">
            <h3 className="text-xs font-semibold text-[var(--rd-ink-muted)] uppercase tracking-wide mb-3">Checklist</h3>
            <div className="space-y-2">
              {DOC_FIELDS.map((field) => {
                const done = !!files[field.name];
                return (
                  <div key={field.name} className="flex items-center gap-2.5">
                    <div className={[
                      "w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors",
                      done ? "bg-[var(--rd-primary)]" : "border-2 border-[var(--rd-line)]",
                    ].join(" ")}>
                      {done && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs ${done ? "text-[var(--rd-ink-body)]" : "text-[var(--rd-ink-muted)]"}`}>
                      {field.label}
                      {!field.required && <span className="ml-1 opacity-60">(optional)</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-sm text-[var(--rd-error)] bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50 transition-colors"
          >
            {busy ? "Submitting…" : "Submit documents"}
          </button>
        </div>
      </form>
    </>
  );
}
