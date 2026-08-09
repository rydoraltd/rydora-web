"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

/* Pages exempt from blocking screens — always render children */
const EXEMPT: Record<string, string[]> = {
  driver:   ["/driver/kyc", "/profile"],
  investor: ["/investor/kyc", "/profile"],
};

function isExempt(role: string, pathname: string): boolean {
  return (EXEMPT[role] ?? []).some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/* ── Not-started banner (non-blocking) ── */
function KycBanner({ kycPath }: { kycPath: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="mb-6 flex items-center gap-4 px-4 py-3.5 rounded-xl border border-amber-200 bg-amber-50">
      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-600">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-900">Complete your KYC verification</p>
        <p className="text-xs text-amber-700 mt-0.5">
          Submit your identity documents to unlock full platform access. It only takes a few minutes.
        </p>
      </div>
      <Link
        href={kycPath}
        className="shrink-0 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
      >
        Submit now
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-amber-400 hover:text-amber-600 transition-colors"
        aria-label="Dismiss"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function PendingScreen({ kycPath }: { kycPath: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-amber-500">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-[var(--rd-ink)] mb-2">Documents under review</h1>
      <p className="text-sm text-[var(--rd-ink-muted)] max-w-sm leading-relaxed mb-8">
        Your KYC documents have been submitted and are being reviewed by our team.
        This usually takes up to 48 hours. You'll be notified once it's done.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href={kycPath}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-[var(--rd-line)] text-[var(--rd-ink-body)] hover:border-[var(--rd-primary)] hover:text-[var(--rd-primary)] transition-colors"
        >
          View submission
        </Link>
      </div>
    </div>
  );
}

function RejectedScreen({ kycPath }: { kycPath: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-red-500">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-[var(--rd-ink)] mb-2">Verification not successful</h1>
      <p className="text-sm text-[var(--rd-ink-muted)] max-w-sm leading-relaxed mb-8">
        Your KYC submission was reviewed but could not be approved. Please check
        your documents and resubmit. Contact support if you need help.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href={kycPath}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[var(--rd-primary)] hover:bg-[var(--rd-primary-strong)] transition-colors"
        >
          Resubmit documents
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* ── Gate ── */
export function KycGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return <>{children}</>;

  const { role, kycStatus } = user;

  // Admins and fleet operators are never gated
  if (role !== "driver" && role !== "investor") return <>{children}</>;

  const kycPath = role === "driver" ? "/driver/kyc" : "/investor/kyc";
  const status = kycStatus ?? "not_started";

  // KYC page and profile always render children directly (no banner needed there)
  if (isExempt(role, pathname)) return <>{children}</>;

  // Approved — full access, no banner
  if (status === "approved") return <>{children}</>;

  // Submitted — block until approved
  if (status === "submitted") return <PendingScreen kycPath={kycPath} />;

  // Rejected — block until resubmitted
  if (status === "rejected") return <RejectedScreen kycPath={kycPath} />;

  // not_started — portal is accessible, but show a persistent reminder banner
  return (
    <>
      <KycBanner kycPath={kycPath} />
      {children}
    </>
  );
}
