"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface Ticket {
  _id: string;
  subject: string;
  category: string;
  status: string;
  createdAt: string;
  lastReply?: string;
}

const CATEGORIES = [
  "Vehicle Issue",
  "Remittance / Payment",
  "Assignment Problem",
  "Account / Profile",
  "KYC / Documents",
  "Other",
];

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function DriverSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function loadTickets() {
    api<Ticket[]>("/driver/support/tickets")
      .then(setTickets)
      .catch(() => setTickets([]));
  }

  useEffect(loadTickets, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) { setError("Subject and message are required."); return; }
    setBusy(true);
    setError(null);
    try {
      await api("/driver/support/tickets", { method: "POST", body: { category, subject, message } });
      setSent(true);
      setSubject("");
      setMessage("");
      setCategory(CATEGORIES[0]);
      loadTickets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit ticket");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Get Support"
        description="Contact the Rydora operations team for help with any issue."
        breadcrumb={[{ label: "Home", href: "/driver" }, { label: "Support" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* New ticket form */}
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-6">
          <h2 className="text-sm font-semibold text-[var(--rd-ink)] mb-5">Submit a Request</h2>

          {sent && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="shrink-0"><path d="M20 6L9 17l-5-5" /></svg>
              Ticket submitted. Our team will respond within 24 hours.
              <button onClick={() => setSent(false)} className="ml-auto text-emerald-700 underline text-xs">Dismiss</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">Subject <span className="text-[var(--rd-error)]">*</span></label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of the issue"
                className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--rd-ink-muted)] mb-1.5">Message <span className="text-[var(--rd-error)]">*</span></label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Describe your issue in detail — include any relevant dates, vehicle plate, or amounts"
                className="w-full rounded-lg px-3 py-2.5 text-sm border border-[var(--rd-line)] bg-[var(--rd-surface)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)] transition-colors resize-none"
              />
            </div>

            {error && <p className="text-sm text-[var(--rd-error)] bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50 transition-colors"
            >
              {busy ? "Submitting…" : "Submit Ticket"}
            </button>
          </form>
        </div>

        {/* Ticket history + contact info */}
        <div className="space-y-5">
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--rd-line)]">
              <h3 className="text-sm font-semibold text-[var(--rd-ink)]">My Tickets</h3>
            </div>
            {tickets.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[var(--rd-ink-muted)] text-center">No tickets submitted yet.</p>
            ) : (
              <div className="divide-y divide-[var(--rd-line)]">
                {tickets.map((t) => (
                  <div key={t._id} className="px-5 py-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-[var(--rd-ink)] leading-snug">{t.subject}</p>
                      <StatusBadge status={t.status} />
                    </div>
                    <p className="text-xs text-[var(--rd-ink-muted)] mt-1">{t.category} · {shortDate(t.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[var(--rd-inverse)] text-[var(--rd-ink-on-dark)] rounded-xl p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Direct Contact</p>
            <div>
              <p className="text-xs opacity-60 mb-0.5">WhatsApp Operations</p>
              <p className="text-sm font-medium">+234 000 000 0000</p>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-0.5">Email</p>
              <p className="text-sm font-medium">operations@rydora.ng</p>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-0.5">Hours</p>
              <p className="text-sm font-medium">Mon – Sat · 7am – 9pm</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
