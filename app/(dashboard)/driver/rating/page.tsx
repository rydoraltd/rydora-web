"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface RatingData {
  overallRating: number;
  totalReviews: number;
  punctuality: number;
  vehicleCare: number;
  remittanceCompliance: number;
  communication: number;
  reviews: Review[];
}

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer?: string;
}

function Star({ filled, half }: { filled: boolean; half?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className={filled ? "text-amber-400" : "text-[var(--rd-line)]"}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function StarRow({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} filled={i < Math.round(rating)} />
      ))}
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100;
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs text-[var(--rd-ink-body)]">{label}</span>
        <span className="text-xs font-semibold text-[var(--rd-ink)]">{value.toFixed(1)}</span>
      </div>
      <div className="h-1.5 bg-[var(--rd-surface)] rounded-full overflow-hidden">
        <div className="h-1.5 bg-[var(--rd-primary)] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function DriverRatingPage() {
  const [data, setData] = useState<RatingData | null>(null);

  useEffect(() => {
    api<RatingData>("/driver/rating")
      .then(setData)
      .catch(() => setData({
        overallRating: 0, totalReviews: 0, punctuality: 0, vehicleCare: 0,
        remittanceCompliance: 0, communication: 0, reviews: [],
      }));
  }, []);

  const rating = data?.overallRating ?? 0;
  const ratingLabel = rating >= 4.5 ? "Excellent" : rating >= 3.5 ? "Good" : rating >= 2.5 ? "Average" : rating > 0 ? "Needs Improvement" : "No ratings yet";

  return (
    <>
      <PageHeader
        title="My Rating"
        description="Performance scores and feedback from the Rydora operations team."
        breadcrumb={[{ label: "Home", href: "/driver" }, { label: "My Rating" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall score */}
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-6 flex flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--rd-ink-muted)] mb-3">Overall Rating</p>
          <p className="text-6xl font-black text-[var(--rd-ink)]">{rating > 0 ? rating.toFixed(1) : "—"}</p>
          <div className="my-3">
            <StarRow rating={rating} />
          </div>
          <p className="text-sm font-medium text-[var(--rd-ink-muted)]">{ratingLabel}</p>
          <p className="text-xs text-[var(--rd-ink-muted)] mt-1">{data?.totalReviews ?? 0} review{data?.totalReviews !== 1 ? "s" : ""}</p>
        </div>

        {/* Score breakdown */}
        <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] p-5 space-y-4">
          <h3 className="text-xs font-semibold text-[var(--rd-ink-muted)] uppercase tracking-wide">Score Breakdown</h3>
          <ScoreBar label="Punctuality"            value={data?.punctuality ?? 0} />
          <ScoreBar label="Vehicle Care"           value={data?.vehicleCare ?? 0} />
          <ScoreBar label="Remittance Compliance"  value={data?.remittanceCompliance ?? 0} />
          <ScoreBar label="Communication"          value={data?.communication ?? 0} />
        </div>

        {/* Tips */}
        <div className="bg-[var(--rd-inverse)] text-[var(--rd-ink-on-dark)] rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide opacity-70">Tips to Improve</h3>
          {[
            "Pay remittances on time, every day",
            "Keep the vehicle clean inside and out",
            "Respond promptly to operations messages",
            "Report any vehicle issues immediately",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">{i + 1}</div>
              <p className="text-sm opacity-80 leading-snug">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      {(data?.reviews.length ?? 0) > 0 && (
        <div className="mt-6 bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--rd-line)]">
            <h2 className="text-sm font-semibold text-[var(--rd-ink)]">Recent Feedback</h2>
          </div>
          <div className="divide-y divide-[var(--rd-line)]">
            {data!.reviews.map((r) => (
              <div key={r._id} className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <StarRow rating={r.rating} />
                  <span className="text-xs text-[var(--rd-ink-muted)]">{shortDate(r.createdAt)}</span>
                </div>
                {r.comment && <p className="text-sm text-[var(--rd-ink-body)] leading-relaxed">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {(data?.reviews.length ?? 0) === 0 && (
        <div className="mt-6 bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl p-10 text-center shadow-[var(--rd-shadow-sm)]">
          <p className="text-sm text-[var(--rd-ink-muted)]">No reviews yet. Keep performing and ratings will appear here.</p>
        </div>
      )}
    </>
  );
}
