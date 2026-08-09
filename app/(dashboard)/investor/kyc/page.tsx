"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";

const API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000/api/v1";

const DOC_FIELDS = [
  { name: "passport_photo",   label: "Passport Photograph",        required: true,  accept: "image/*",      note: "Clear, recent passport-style photo" },
  { name: "nin_document",     label: "NIN Slip / Capture",         required: true,  accept: "image/*,.pdf", note: "National Identity Number document" },
  { name: "proof_of_address", label: "Proof of Address",           required: true,  accept: "image/*,.pdf", note: "Utility bill or bank statement — not older than 3 months" },
  { name: "bank_statement",   label: "Bank Statement",             required: false, accept: "image/*,.pdf", note: "Last 3 months — for payout verification" },
  { name: "cac_document",     label: "CAC Certificate",            required: false, accept: "image/*,.pdf", note: "Only required if registering as a business entity" },
  { name: "tin_document",     label: "TIN Certificate",            required: false, accept: "image/*,.pdf", note: "Tax Identification Number — required if TIN is provided" },
  { name: "tax_clearance",    label: "Tax Clearance Certificate",  required: false, accept: "image/*,.pdf", note: "Current year tax clearance from FIRS or state authority" },
] as const;

type DocFieldName = typeof DOC_FIELDS[number]["name"];

const BANKS = [
  "Access Bank", "Fidelity Bank", "First Bank", "GTBank", "Keystone Bank",
  "Kuda Bank", "Opay", "Palmpay", "Polaris Bank", "Stanbic IBTC", "Sterling Bank",
  "UBA", "Union Bank", "Unity Bank", "Wema Bank", "Zenith Bank",
];

type Tab = "documents" | "identity" | "bank" | "company";

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
        <div onClick={() => value ? setPreviewing(true) : inputRef.current?.click()}
          className={["w-14 h-14 shrink-0 rounded-xl border-2 bg-[var(--rd-surface)] flex items-center justify-center cursor-pointer overflow-hidden transition-all",
            value ? "border-[var(--rd-primary)] hover:opacity-80" : "border-dashed border-[var(--rd-line)] hover:border-[var(--rd-primary)]"].join(" ")}>
          {value ? (isImage ? <img src={URL.createObjectURL(value.file)} alt="" className="w-full h-full object-cover" /> : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-red-400">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
          )) : (
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

function Input({ label, required, optional, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean; optional?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">
        {label}
        {required && <span className="text-[var(--rd-error)] ml-1">*</span>}
        {optional && <span className="ml-1 opacity-60">(optional)</span>}
      </label>
      <input {...props} className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors" />
    </div>
  );
}

export default function InvestorKycPage() {
  const { user } = useAuth() as { user: NonNullable<ReturnType<typeof useAuth>["user"]> };
  const [tab, setTab] = useState<Tab>("documents");
  const [files, setFiles] = useState<Partial<Record<DocFieldName, FileState>>>({});

  // Identity
  const [nin, setNin]   = useState("");
  const [bvn, setBvn]   = useState("");
  const [tin, setTin]   = useState("");
  const [address, setAddress] = useState("");

  // Bank
  const [bankName, setBankName]         = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName]   = useState("");

  // Company
  const [companyName, setCompanyName]     = useState("");
  const [rcNumber, setRcNumber]           = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [taxInfo, setTaxInfo]             = useState("");

  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const alreadySubmitted = user?.kycStatus === "submitted" || user?.kycStatus === "approved";

  function setFile(name: DocFieldName, file: File | null) {
    setFiles((prev) => {
      if (!file) { const next = { ...prev }; delete next[name]; return next; }
      return { ...prev, [name]: { file } };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    for (const field of DOC_FIELDS) {
      if (field.required && !files[field.name]) { setError(`${field.label} is required.`); setTab("documents"); return; }
    }
    if (!nin || !bvn || !address) { setError("NIN, BVN and address are required."); setTab("identity"); return; }
    if (!bankName || !accountNumber || !accountName) { setError("Bank details are required."); setTab("bank"); return; }

    setBusy(true);
    const fd = new FormData();
    for (const [name, state] of Object.entries(files)) { if (state) fd.append(name, state.file); }
    fd.append("nin", nin);
    fd.append("bvn", bvn);
    fd.append("tin", tin);
    fd.append("residentialAddress", address);
    fd.append("bankName", bankName);
    fd.append("accountNumber", accountNumber);
    fd.append("accountName", accountName);
    fd.append("companyName", companyName);
    fd.append("rcNumber", rcNumber);
    fd.append("companyAddress", companyAddress);
    fd.append("taxInfo", taxInfo);

    try {
      const token = localStorage.getItem("rd_access");
      const res = await fetch(`${API_BASE}/investor/kyc/files`, {
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

  const doneRequired = DOC_FIELDS.filter((f) => f.required && files[f.name]).length;
  const totalRequired = DOC_FIELDS.filter((f) => f.required).length;

  if (success) {
    return (
      <>
        <PageHeader title="KYC Verification" breadcrumb={[{ label: "Dashboard", href: "/investor" }, { label: "KYC Verification" }]} />
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-12 text-center shadow-[var(--rd-shadow-sm)]">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-emerald-600"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h2 className="text-base font-semibold text-[var(--rd-ink)]">Documents submitted</h2>
          <p className="text-sm text-[var(--rd-ink-muted)] mt-2 max-w-xs mx-auto leading-relaxed">Your KYC documents are under review. Our team will process them within 48 hours.</p>
        </div>
      </>
    );
  }

  if (alreadySubmitted) {
    return (
      <>
        <PageHeader title="KYC Verification" breadcrumb={[{ label: "Dashboard", href: "/investor" }, { label: "KYC Verification" }]} />
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-12 text-center shadow-[var(--rd-shadow-sm)]">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--rd-primary)]">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8M16 17H8M10 9H8" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-[var(--rd-ink)]">
            {user?.kycStatus === "approved" ? "Identity Verified" : "Documents under review"}
          </h2>
          <p className="text-sm text-[var(--rd-ink-muted)] mt-2 max-w-xs mx-auto leading-relaxed">
            {user?.kycStatus === "approved"
              ? "Your identity has been verified. Your account is fully active."
              : "Your documents have been submitted and are being reviewed by our team."}
          </p>
        </div>
      </>
    );
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "documents", label: "Documents" },
    { key: "identity",  label: "Identity" },
    { key: "bank",      label: "Bank Details" },
    { key: "company",   label: "Company" },
  ];

  return (
    <>
      <PageHeader
        title="KYC Verification"
        description="Submit your identity and financial details to verify your account."
        breadcrumb={[{ label: "Dashboard", href: "/investor" }, { label: "KYC Verification" }]}
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-[var(--rd-line)]">
              {TABS.map((t) => (
                <button key={t.key} type="button" onClick={() => setTab(t.key)}
                  className={["flex-1 py-3 text-xs font-semibold transition-colors",
                    tab === t.key
                      ? "text-[var(--rd-primary)] border-b-2 border-[var(--rd-primary)] bg-[var(--rd-surface)]"
                      : "text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]"].join(" ")}>
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

            {/* Identity tab */}
            {tab === "identity" && (
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="NIN" required value={nin} onChange={(e) => setNin(e.target.value)} placeholder="12345678901" maxLength={11} />
                  <Input label="BVN" required value={bvn} onChange={(e) => setBvn(e.target.value)} placeholder="12345678901" maxLength={11} />
                </div>
                <Input label="TIN" optional value={tin} onChange={(e) => setTin(e.target.value)} placeholder="Tax Identification Number" />
                <div>
                  <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">Residential Address <span className="text-[var(--rd-error)]">*</span></label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    placeholder="House number, street, area, city, state"
                    className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors resize-none"
                  />
                </div>
              </div>
            )}

            {/* Bank tab */}
            {tab === "bank" && (
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">Bank Name <span className="text-[var(--rd-error)]">*</span></label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
                  >
                    <option value="">Select bank…</option>
                    {BANKS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <Input label="Account Number" required value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="0123456789" maxLength={10} />
                <Input label="Account Name" required value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="As shown on bank records" />
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs text-blue-800 leading-relaxed">
                    This is the account your earnings will be paid into. Ensure the name matches your verified identity.
                  </p>
                </div>
              </div>
            )}

            {/* Company tab */}
            {tab === "company" && (
              <div className="p-5 space-y-4">
                <p className="text-xs text-[var(--rd-ink-muted)] bg-[var(--rd-surface)] rounded-lg px-4 py-3">
                  Only required if you are registering as a business entity. Individual investors may skip this tab.
                </p>
                <Input label="Company / Business Name" optional value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Okafor Investments Ltd" />
                <Input label="RC Number (CAC)" optional value={rcNumber} onChange={(e) => setRcNumber(e.target.value)} placeholder="RC 1234567" />
                <div>
                  <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">Company Address <span className="ml-1 opacity-60">(optional)</span></label>
                  <textarea value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} rows={2}
                    placeholder="Registered office address"
                    className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">Tax Information <span className="ml-1 opacity-60">(optional)</span></label>
                  <textarea value={taxInfo} onChange={(e) => setTaxInfo(e.target.value)} rows={2}
                    placeholder="Any additional tax details or notes"
                    className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors resize-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-5">
          {/* Checklist */}
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-5">
            <div className="flex justify-between mb-3">
              <h3 className="text-xs font-semibold text-[var(--rd-ink-muted)] uppercase tracking-wide">Documents</h3>
              <span className="text-xs font-semibold text-[var(--rd-primary)]">{doneRequired}/{totalRequired} required</span>
            </div>
            <div className="h-1.5 bg-[var(--rd-surface)] rounded-full overflow-hidden mb-4">
              <div className="h-1.5 bg-[var(--rd-primary)] rounded-full transition-all" style={{ width: `${(doneRequired / totalRequired) * 100}%` }} />
            </div>
            <div className="space-y-2">
              {DOC_FIELDS.map((field) => {
                const done = !!files[field.name];
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

          {/* Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-blue-800 mb-2">Why we need this</h3>
            <p className="text-xs text-blue-700 leading-relaxed">
              KYC verification complies with Nigerian financial regulations (CBN/SEC) and protects all investors on the platform. Documents are reviewed securely and confidentially.
            </p>
          </div>

          {error && <p className="text-sm text-[var(--rd-error)] bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{error}</p>}

          <button type="submit" disabled={busy}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50 transition-colors">
            {busy ? "Submitting…" : "Submit KYC"}
          </button>
        </div>
      </form>
    </>
  );
}
