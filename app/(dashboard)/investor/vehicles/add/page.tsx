"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/dashboard/PageHeader";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const CAR_MAKES  = ["Toyota","Honda","Mercedes-Benz","BMW","Hyundai","Kia","Ford","Lexus","Volkswagen","Nissan","Suzuki","Peugeot","Mitsubishi","Mazda","Others"];
const CAR_COLORS = ["Black","White","Silver","Gray","Red","Blue","Green","Yellow","Orange","Brown","Gold","Beige","Other"];
const YEARS = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i);

const selectCls = "w-full rounded-lg px-3 py-2.5 text-sm text-[var(--rd-ink)] border border-[var(--rd-line)] bg-[var(--rd-panel)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors";
const inputCls  = "w-full rounded-lg px-3 py-2.5 text-sm text-[var(--rd-ink)] border border-[var(--rd-line)] bg-[var(--rd-panel)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors";
const labelCls  = "block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5";

type DocKey = "vehicleLicence" | "ownershipCert" | "roadworthinessCert" | "insuranceCert";

const DOC_FIELDS: { key: DocKey; label: string; required: boolean }[] = [
  { key: "vehicleLicence",     label: "Vehicle licence",              required: true },
  { key: "ownershipCert",      label: "Ownership certificate",        required: true },
  { key: "roadworthinessCert", label: "Road worthiness certificate",  required: true },
  { key: "insuranceCert",      label: "Insurance certificate",        required: false },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-6 shadow-[var(--rd-shadow-sm)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)] mb-5">{title}</p>
      {children}
    </div>
  );
}

function FileRow({ label, required, file, onChange }: {
  label: string; required?: boolean; file: File | undefined;
  onChange: (f: File | undefined) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const isImage = file?.type.startsWith("image/");
  const preview = file && isImage ? URL.createObjectURL(file) : null;

  return (
    <div className="flex items-center gap-3">
      {/* Thumbnail */}
      <div className="w-10 h-10 rounded-lg border border-[var(--rd-line)] bg-[var(--rd-surface)] flex items-center justify-center overflow-hidden shrink-0">
        {preview ? (
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : file ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--rd-primary)]">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--rd-ink-muted)]/40">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--rd-ink-body)] truncate">
          {label}{required && <span className="text-[var(--rd-error)] ml-0.5">*</span>}
        </p>
        <p className="text-xs text-[var(--rd-ink-muted)] truncate mt-0.5">
          {file ? file.name : "No file chosen"}
        </p>
      </div>

      <label className="shrink-0 cursor-pointer">
        <span className="px-3 py-1.5 text-xs font-medium border border-[var(--rd-line)] rounded-lg bg-[var(--rd-panel)] hover:bg-[var(--rd-surface)] transition-colors whitespace-nowrap">
          {file ? "Change" : "Choose File"}
        </span>
        <input
          ref={ref}
          type="file"
          accept="image/*,.pdf"
          className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0])}
        />
      </label>
    </div>
  );
}

export default function AddVehiclePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    plateNumber: "", make: "", model: "", color: "", year: "",
    registrationDate: "", hasSafetyInspection: false,
    insuranceNumber: "", insuranceExpiry: "",
  });
  const [vehiclePicture, setVehiclePicture] = useState<File | undefined>();
  const [docs, setDocs] = useState<Partial<Record<DocKey, File>>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const picturePreview = vehiclePicture ? URL.createObjectURL(vehiclePicture) : null;

  function setField(key: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vehiclePicture) { setError("Vehicle picture is required"); return; }
    if (!docs.vehicleLicence) { setError("Vehicle licence document is required"); return; }
    if (!docs.ownershipCert) { setError("Ownership certificate is required"); return; }
    if (!docs.roadworthinessCert) { setError("Road worthiness certificate is required"); return; }

    setBusy(true);
    setError(null);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    fd.append("vehiclePicture", vehiclePicture);
    Object.entries(docs).forEach(([k, f]) => { if (f) fd.append(k, f); });

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("rd_access") : null;
      const res = await fetch(`${API_BASE}/investor/vehicles`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || "Failed to submit vehicle");
      router.push("/investor/vehicles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit vehicle");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Add vehicle"
        description="Submit your vehicle to the Rydora platform. Our team will review and approve it."
        breadcrumb={[
          { label: "Dashboard", href: "/investor" },
          { label: "Manage Vehicles", href: "/investor/vehicles" },
          { label: "Add vehicle" },
        ]}
      />

      <form onSubmit={handleSubmit} className="flex gap-6 items-start">
        {/* ── Main form ── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Vehicle picture (hero upload) */}
          <SectionCard title="Vehicle Picture">
            <div className="flex gap-5 items-start">
              {/* Preview box */}
              <div className="w-40 h-32 rounded-xl border-2 border-dashed border-[var(--rd-line)] bg-[var(--rd-surface)] overflow-hidden flex items-center justify-center shrink-0">
                {picturePreview ? (
                  <img src={picturePreview} alt="Vehicle preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center px-3">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="mx-auto text-[var(--rd-ink-muted)]/30 mb-2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <p className="text-[11px] text-[var(--rd-ink-muted)]">No image</p>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--rd-ink)]">
                  Upload a clear photo of your vehicle <span className="text-[var(--rd-error)]">*</span>
                </p>
                <p className="text-xs text-[var(--rd-ink-muted)] mt-1 leading-relaxed">
                  Use a well-lit photo showing the full exterior. JPG, PNG or WebP · max 8 MB
                </p>
                <label className="mt-3 inline-flex items-center gap-2 cursor-pointer">
                  <span className="px-4 py-2 text-sm font-medium border border-[var(--rd-line)] rounded-lg bg-[var(--rd-panel)] hover:bg-[var(--rd-surface)] transition-colors">
                    {vehiclePicture ? "Change photo" : "Choose photo"}
                  </span>
                  <span className="text-xs text-[var(--rd-ink-muted)] truncate max-w-[180px]">
                    {vehiclePicture ? vehiclePicture.name : "No file chosen"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => setVehiclePicture(e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
          </SectionCard>

          {/* Car Details */}
          <SectionCard title="Car Details">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Car plate number <span className="text-[var(--rd-error)]">*</span></label>
                <input type="text" value={form.plateNumber} onChange={(e) => setField("plateNumber", e.target.value.toUpperCase())}
                  placeholder="e.g. ABC-123-XY" required className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Car make <span className="text-[var(--rd-error)]">*</span></label>
                  <select value={form.make} onChange={(e) => setField("make", e.target.value)} required className={selectCls}>
                    <option value="">Select car make</option>
                    {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Car model <span className="text-[var(--rd-error)]">*</span></label>
                  <input type="text" value={form.model} onChange={(e) => setField("model", e.target.value)}
                    placeholder="e.g. Camry" required className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Car color <span className="text-[var(--rd-error)]">*</span></label>
                  <select value={form.color} onChange={(e) => setField("color", e.target.value)} required className={selectCls}>
                    <option value="">Select car color</option>
                    {CAR_COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Year <span className="text-[var(--rd-error)]">*</span></label>
                  <select value={form.year} onChange={(e) => setField("year", e.target.value)} required className={selectCls}>
                    <option value="">Select year</option>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Registration date <span className="text-[var(--rd-error)]">*</span></label>
                  <input type="date" value={form.registrationDate} onChange={(e) => setField("registrationDate", e.target.value)}
                    required className={inputCls} />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2.5 cursor-pointer py-2.5">
                    <input type="checkbox" checked={form.hasSafetyInspection}
                      onChange={(e) => setField("hasSafetyInspection", e.target.checked)}
                      className="w-4 h-4 accent-[var(--rd-primary)]" />
                    <span className="text-sm text-[var(--rd-ink-body)]">Has safety inspection</span>
                  </label>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Insurance Details */}
          <SectionCard title="Insurance Details">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Insurance number</label>
                <input type="text" value={form.insuranceNumber} onChange={(e) => setField("insuranceNumber", e.target.value)}
                  placeholder="e.g. INS/2024/00123" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Insurance expiration date</label>
                <input type="date" value={form.insuranceExpiry} onChange={(e) => setField("insuranceExpiry", e.target.value)}
                  className={inputCls} />
              </div>
            </div>
          </SectionCard>

          {/* Document Uploads */}
          <SectionCard title="Document Uploads">
            <div className="space-y-4">
              {DOC_FIELDS.map(({ key, label, required }) => (
                <FileRow
                  key={key}
                  label={label}
                  required={required}
                  file={docs[key]}
                  onChange={(f) => setDocs((d) => ({ ...d, [key]: f }))}
                />
              ))}
            </div>
            <p className="text-[11px] text-[var(--rd-ink-muted)] mt-4">
              Accepted formats: JPG, PNG, PDF · max 8 MB per file
            </p>
          </SectionCard>

          {error && (
            <div className="bg-red-50 border border-red-200 text-[var(--rd-error)] text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pb-6">
            <button type="button" onClick={() => router.back()}
              className="px-6 py-2.5 rounded-lg text-sm font-medium border border-[var(--rd-line)] text-[var(--rd-ink-body)] hover:bg-[var(--rd-surface)] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={busy}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50 transition-colors">
              {busy ? "Submitting…" : "Submit Vehicle"}
            </button>
          </div>
        </div>

        {/* ── Right panel: upload checklist ── */}
        <aside className="w-52 shrink-0 hidden xl:block sticky top-8">
          <div className="bg-[var(--rd-surface)] border border-[var(--rd-line)] rounded-xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)] mb-3">
              Documents checklist
            </p>
            <div className="space-y-2.5">
              {([
                { label: "Vehicle Picture", done: !!vehiclePicture, required: true },
                { label: "Vehicle Licence", done: !!docs.vehicleLicence, required: true },
                { label: "Ownership Certificate", done: !!docs.ownershipCert, required: true },
                { label: "Road Worthiness Cert", done: !!docs.roadworthinessCert, required: true },
                { label: "Insurance Certificate", done: !!docs.insuranceCert, required: false },
              ] as const).map(({ label, done, required }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={[
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    done
                      ? "bg-[var(--rd-primary)] border-[var(--rd-primary)]"
                      : required ? "border-red-300" : "border-[var(--rd-line)]",
                  ].join(" ")}>
                    {done && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs leading-tight ${done ? "text-[var(--rd-ink)]" : "text-[var(--rd-ink-muted)]"}`}>
                    {label}{!required && <span className="text-[var(--rd-ink-muted)]"> (opt)</span>}
                  </span>
                </div>
              ))}
            </div>

            {/* Vehicle picture preview */}
            {picturePreview && (
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)] mb-2">
                  Photo preview
                </p>
                <div className="rounded-lg overflow-hidden aspect-video bg-[var(--rd-line)]">
                  <img src={picturePreview} alt="Vehicle" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </aside>
      </form>
    </>
  );
}
