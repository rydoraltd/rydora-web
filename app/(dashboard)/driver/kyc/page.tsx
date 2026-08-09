"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";

const API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000/api/v1";

const DOC_FIELDS = [
  { name: "passport_photo",    label: "Passport Photograph",       required: true,  accept: "image/*",      note: "Clear, recent passport-style photo" },
  { name: "selfie",            label: "Selfie / Live Photo",       required: true,  accept: "image/*",      note: "Clear selfie — face fully visible, good lighting" },
  { name: "nin",               label: "NIN Slip / Capture",        required: true,  accept: "image/*,.pdf", note: "National Identity Number document" },
  { name: "drivers_licence",   label: "Driver's Licence",          required: true,  accept: "image/*,.pdf", note: "Front page, clearly readable" },
  { name: "utility_bill",      label: "Utility Bill",              required: true,  accept: "image/*,.pdf", note: "Not older than 3 months — confirms residential address" },
  { name: "medical_report",    label: "Medical Report",            required: false, accept: "image/*,.pdf", note: "Fitness to drive certificate from a certified doctor" },
  { name: "police_clearance",  label: "Police Clearance",          required: false, accept: "image/*,.pdf", note: "Character certificate from Nigerian Police Force" },
] as const;

const GUARANTOR_DOC_FIELDS = [
  { name: "guarantor_nin",     label: "Guarantor NIN",             required: true,  accept: "image/*,.pdf", note: "Guarantor's National Identity Number document" },
  { name: "guarantor_bvn_doc", label: "Guarantor BVN Document",   required: false, accept: "image/*,.pdf", note: "Guarantor's bank verification document" },
  { name: "guarantor_licence", label: "Guarantor Driver's Licence",required: false, accept: "image/*,.pdf", note: "Only if guarantor holds a driving licence" },
] as const;

type DocFieldName =
  | typeof DOC_FIELDS[number]["name"]
  | typeof GUARANTOR_DOC_FIELDS[number]["name"];

const ALL_FIELDS = [...DOC_FIELDS, ...GUARANTOR_DOC_FIELDS];

const LANGUAGES = ["English", "Hausa", "Yoruba", "Igbo", "Pidgin", "Fulfulde", "Kanuri", "Tiv", "Ijaw"];

type Tab = "documents" | "details" | "guarantor";

interface FileState { file: File }

function DocPreviewModal({ file, onClose }: { file: File; onClose: () => void }) {
  const isImage = file.type.startsWith("image/");
  const objectUrl = URL.createObjectURL(file);
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--rd-line)]">
          <p className="text-sm font-semibold text-[var(--rd-ink)] truncate max-w-[80%]">{file.name}</p>
          <button onClick={onClose} className="text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-5">
          {isImage ? (
            <img src={objectUrl} alt="" className="w-full max-h-[65vh] object-contain rounded-xl" />
          ) : (
            <div className="flex flex-col items-center gap-4 py-12">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-red-400">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="text-sm text-[var(--rd-ink-muted)]">PDF — cannot preview in browser</p>
              <a href={objectUrl} download={file.name} className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--rd-primary)] text-white">Download to view</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FileRow({ field, value, onChange }: {
  field: { name: string; label: string; required: boolean; accept: string; note: string };
  value: FileState | null;
  onChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewing, setPreviewing] = useState(false);
  const isImage = value?.file.type.startsWith("image/");

  return (
    <>
      <div className="flex items-center gap-4 py-3.5 border-b border-[var(--rd-line)] last:border-0">
        <div
          onClick={() => value ? setPreviewing(true) : inputRef.current?.click()}
          className={["w-14 h-14 shrink-0 rounded-xl border-2 bg-[var(--rd-surface)] flex items-center justify-center cursor-pointer overflow-hidden transition-all",
            value ? "border-[var(--rd-primary)] hover:opacity-80" : "border-dashed border-[var(--rd-line)] hover:border-[var(--rd-primary)]"].join(" ")}
        >
          {value ? (
            isImage ? <img src={URL.createObjectURL(value.file)} alt="" className="w-full h-full object-cover" /> : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-red-400">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
            )
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--rd-ink-muted)]/40">
              <path d="M12 5v14M5 12h14" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--rd-ink)]">{field.label}{field.required && <span className="text-[var(--rd-error)] ml-1">*</span>}</p>
          <p className="text-xs text-[var(--rd-ink-muted)] mt-0.5">{field.note}</p>
          {value && (
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-emerald-600 truncate font-medium">✓ {value.file.name}</p>
              <button type="button" onClick={() => setPreviewing(true)} className="text-[11px] text-[var(--rd-primary)] hover:underline shrink-0">Preview</button>
            </div>
          )}
        </div>
        <div className="shrink-0">
          <input ref={inputRef} type="file" accept={field.accept} onChange={(e) => onChange(e.target.files?.[0] ?? null)} className="hidden" />
          <button type="button" onClick={() => inputRef.current?.click()} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:border-[var(--rd-primary)] hover:text-[var(--rd-primary)] transition-colors">
            {value ? "Change" : "Choose"}
          </button>
        </div>
      </div>
      {previewing && value && <DocPreviewModal file={value.file} onClose={() => setPreviewing(false)} />}
    </>
  );
}

function Input({ label, required, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">{label}{required && <span className="text-[var(--rd-error)] ml-1">*</span>}</label>
      <input {...props} className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors" />
    </div>
  );
}

function Textarea({ label, required, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">{label}{required && <span className="text-[var(--rd-error)] ml-1">*</span>}</label>
      <textarea {...props} rows={3} className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors resize-none" />
    </div>
  );
}

export default function DriverRegistrationPage() {
  const { user } = useAuth() as { user: NonNullable<ReturnType<typeof useAuth>["user"]> };

  const [tab, setTab] = useState<Tab>("documents");
  const [files, setFiles] = useState<Partial<Record<DocFieldName, FileState>>>({});

  // Personal details
  const [bvn, setBvn]                         = useState("");
  const [licenceNumber, setLicenceNumber]     = useState("");
  const [licenceExpiry, setLicenceExpiry]     = useState("");
  const [address, setAddress]                 = useState("");
  const [emergencyName, setEmergencyName]     = useState("");
  const [emergencyPhone, setEmergencyPhone]   = useState("");
  const [emergencyRel, setEmergencyRel]       = useState("");
  const [employment, setEmployment]           = useState("");
  const [experience, setExperience]           = useState("");
  const [languages, setLanguages]             = useState<string[]>([]);

  // Guarantor details
  const [guarantorName, setGuarantorName]   = useState("");
  const [guarantorPhone, setGuarantorPhone] = useState("");
  const [guarantorNin, setGuarantorNin]     = useState("");
  const [guarantorBvn, setGuarantorBvn]     = useState("");
  const [guarantorRel, setGuarantorRel]     = useState("");

  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const alreadySubmitted = user?.kycStatus === "submitted" || user?.kycStatus === "approved";

  function setFile(name: DocFieldName, file: File | null) {
    setFiles((prev) => {
      if (!file) { const next = { ...prev }; delete next[name]; return next; }
      return { ...prev, [name]: { file } };
    });
  }

  function toggleLanguage(lang: string) {
    setLanguages((prev) => prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    for (const field of DOC_FIELDS) {
      if (field.required && !files[field.name as DocFieldName]) {
        setError(`${field.label} is required.`);
        setTab("documents");
        return;
      }
    }
    for (const field of GUARANTOR_DOC_FIELDS) {
      if (field.required && !files[field.name as DocFieldName]) {
        setError(`${field.label} is required.`);
        setTab("guarantor");
        return;
      }
    }
    if (!licenceNumber || !licenceExpiry || !address) {
      setError("Licence number, expiry date and residential address are required.");
      setTab("details");
      return;
    }
    if (!guarantorName || !guarantorPhone || !guarantorNin) {
      setError("Guarantor name, phone and NIN are required.");
      setTab("guarantor");
      return;
    }

    setBusy(true);
    const fd = new FormData();
    for (const [name, state] of Object.entries(files)) {
      if (state) fd.append(name, state.file);
    }
    fd.append("bvn", bvn);
    fd.append("licenceNumber", licenceNumber);
    fd.append("licenceExpiry", licenceExpiry);
    fd.append("residentialAddress", address);
    fd.append("emergencyContactName", emergencyName);
    fd.append("emergencyContactPhone", emergencyPhone);
    fd.append("emergencyContactRelationship", emergencyRel);
    fd.append("employmentHistory", employment);
    fd.append("drivingExperience", experience);
    fd.append("languages", languages.join(","));
    fd.append("guarantorName", guarantorName);
    fd.append("guarantorPhone", guarantorPhone);
    fd.append("guarantorNin", guarantorNin);
    fd.append("guarantorBvn", guarantorBvn);
    fd.append("guarantorRelationship", guarantorRel);

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

  const doneCount = ALL_FIELDS.filter((f) => files[f.name as DocFieldName]).length;
  const totalRequired = ALL_FIELDS.filter((f) => f.required).length;
  const doneRequired = ALL_FIELDS.filter((f) => f.required && files[f.name as DocFieldName]).length;

  if (success) {
    return (
      <>
        <PageHeader title="Driver Registration" breadcrumb={[{ label: "Home", href: "/driver" }, { label: "Registration" }]} />
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-12 text-center shadow-[var(--rd-shadow-sm)]">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-emerald-600"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h2 className="text-base font-semibold text-[var(--rd-ink)]">Registration submitted</h2>
          <p className="text-sm text-[var(--rd-ink-muted)] mt-2 max-w-xs mx-auto leading-relaxed">Your documents and details are under review. Our team will process them within 48 hours.</p>
        </div>
      </>
    );
  }

  if (alreadySubmitted) {
    return (
      <>
        <PageHeader title="Driver Registration" breadcrumb={[{ label: "Home", href: "/driver" }, { label: "Registration" }]} />
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-12 text-center shadow-[var(--rd-shadow-sm)]">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--rd-primary)]">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8M16 17H8M10 9H8" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-[var(--rd-ink)]">
            {user?.kycStatus === "approved" ? "Registration Approved" : "Documents under review"}
          </h2>
          <p className="text-sm text-[var(--rd-ink-muted)] mt-2 max-w-xs mx-auto leading-relaxed">
            {user?.kycStatus === "approved"
              ? "Your identity has been verified. You are fully onboarded."
              : "Your registration documents are being reviewed by our team."}
          </p>
        </div>
      </>
    );
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "documents", label: "Identity Documents" },
    { key: "details",   label: "Personal Details" },
    { key: "guarantor", label: "Guarantor" },
  ];

  return (
    <>
      <PageHeader
        title="Driver Registration"
        description="Complete your onboarding by submitting all required documents and information."
        breadcrumb={[{ label: "Home", href: "/driver" }, { label: "Registration" }]}
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Tab bar */}
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
            <div className="flex border-b border-[var(--rd-line)]">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={["flex-1 py-3 text-xs font-semibold transition-colors",
                    tab === t.key
                      ? "text-[var(--rd-primary)] border-b-2 border-[var(--rd-primary)] bg-[var(--rd-surface)]"
                      : "text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]"].join(" ")}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Documents tab */}
            {tab === "documents" && (
              <div>
                <div className="px-5 py-3 border-b border-[var(--rd-line)] bg-[var(--rd-surface)]">
                  <p className="text-xs text-[var(--rd-ink-muted)]">JPG, PNG, or PDF · max 5 MB each</p>
                </div>
                <div className="px-5">
                  {DOC_FIELDS.map((field) => (
                    <FileRow key={field.name} field={field} value={files[field.name] ?? null} onChange={(f) => setFile(field.name, f)} />
                  ))}
                </div>
              </div>
            )}

            {/* Personal details tab */}
            {tab === "details" && (
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="BVN" value={bvn} onChange={(e) => setBvn(e.target.value)} placeholder="12345678901" maxLength={11} />
                  <Input label="Licence Number" required value={licenceNumber} onChange={(e) => setLicenceNumber(e.target.value)} placeholder="ABC-1234567" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Licence Expiry Date" required type="date" value={licenceExpiry} onChange={(e) => setLicenceExpiry(e.target.value)} />
                  <Input label="Years of Driving Experience" type="number" min={0} max={50} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5" />
                </div>
                <Textarea label="Residential Address" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House number, street, area, city, state" />
                <Textarea label="Employment History" value={employment} onChange={(e) => setEmployment(e.target.value)} placeholder="Previous employers, roles, and duration" />

                <div>
                  <p className="text-xs font-medium text-[var(--rd-ink-muted)] mb-2">Languages Spoken</p>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={["px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                          languages.includes(lang)
                            ? "bg-[var(--rd-primary)] border-[var(--rd-primary)] text-white"
                            : "border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:border-[var(--rd-primary)] hover:text-[var(--rd-primary)]"].join(" ")}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--rd-line)]">
                  <p className="text-xs font-semibold text-[var(--rd-ink-muted)] uppercase tracking-wide mb-3">Emergency Contact</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Full Name" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} placeholder="e.g. Amina Bello" />
                    <Input label="Phone Number" type="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} placeholder="+2348012345678" />
                  </div>
                  <div className="mt-4">
                    <Input label="Relationship" value={emergencyRel} onChange={(e) => setEmergencyRel(e.target.value)} placeholder="e.g. Spouse, Parent, Sibling" />
                  </div>
                </div>
              </div>
            )}

            {/* Guarantor tab */}
            {tab === "guarantor" && (
              <div>
                <div className="px-5 py-3 border-b border-[var(--rd-line)] bg-[var(--rd-surface)]">
                  <p className="text-xs text-[var(--rd-ink-muted)]">A guarantor vouches for your character and reliability.</p>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Guarantor Full Name" required value={guarantorName} onChange={(e) => setGuarantorName(e.target.value)} placeholder="e.g. Chukwuemeka Obi" />
                    <Input label="Guarantor Phone" required type="tel" value={guarantorPhone} onChange={(e) => setGuarantorPhone(e.target.value)} placeholder="+2348012345678" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Guarantor NIN" required value={guarantorNin} onChange={(e) => setGuarantorNin(e.target.value)} placeholder="12345678901" maxLength={11} />
                    <Input label="Guarantor BVN" value={guarantorBvn} onChange={(e) => setGuarantorBvn(e.target.value)} placeholder="12345678901" maxLength={11} />
                  </div>
                  <Input label="Guarantor Relationship" value={guarantorRel} onChange={(e) => setGuarantorRel(e.target.value)} placeholder="e.g. Uncle, Pastor, Employer" />
                </div>
                <div className="px-5 border-t border-[var(--rd-line)]">
                  <div className="py-3 mb-1">
                    <p className="text-xs font-semibold text-[var(--rd-ink-muted)] uppercase tracking-wide">Guarantor Documents</p>
                    <p className="text-xs text-[var(--rd-ink-muted)] mt-0.5">JPG, PNG, or PDF · max 5 MB each</p>
                  </div>
                  {GUARANTOR_DOC_FIELDS.map((field) => (
                    <FileRow key={field.name} field={field} value={files[field.name] ?? null} onChange={(f) => setFile(field.name, f)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Progress */}
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold text-[var(--rd-ink-muted)] uppercase tracking-wide">Completion</h3>
              <span className="text-xs font-semibold text-[var(--rd-primary)]">{doneCount}/{ALL_FIELDS.length} docs</span>
            </div>
            <div className="h-1.5 bg-[var(--rd-surface)] rounded-full overflow-hidden mb-4">
              <div className="h-1.5 bg-[var(--rd-primary)] rounded-full transition-all" style={{ width: `${(doneRequired / totalRequired) * 100}%` }} />
            </div>
            <div className="space-y-2">
              {ALL_FIELDS.map((field) => {
                const done = !!files[field.name as DocFieldName];
                return (
                  <div key={field.name} className="flex items-center gap-2.5">
                    <div className={["w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors",
                      done ? "bg-[var(--rd-primary)]" : "border-2 border-[var(--rd-line)]"].join(" ")}>
                      {done && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>}
                    </div>
                    <span className={`text-xs ${done ? "text-[var(--rd-ink-body)]" : "text-[var(--rd-ink-muted)]"}`}>
                      {field.label}{!field.required && <span className="ml-1 opacity-60">(optional)</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verification status */}
          <div className="bg-[var(--rd-surface)] border border-[var(--rd-line)] rounded-xl p-4">
            <p className="text-xs font-semibold text-[var(--rd-ink-muted)] uppercase tracking-wide mb-2">Verification Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-medium text-[var(--rd-ink)]">{user?.kycStatus ?? "not_started"}</span>
            </div>
            <p className="text-xs text-[var(--rd-ink-muted)] mt-2 leading-relaxed">
              Complete all required fields and submit. Verification takes up to 48 hours.
            </p>
          </div>

          {error && (
            <p className="text-sm text-[var(--rd-error)] bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50 transition-colors"
          >
            {busy ? "Submitting…" : "Submit Registration"}
          </button>
        </div>
      </form>
    </>
  );
}
