"use client";

import { MessageSquarePlus } from "lucide-react";

import DetailCard from "../DetailCard";
import { formatDate } from "../../helpers";

export default function MentorFeedbackSection({ project }) {
  // Only show actual comments.
  // Status-only updates are excluded.
  const history = [...(project.mentorReviews || [])]
    .filter((entry) => entry.comment?.trim())
    .reverse();

  return (
    <DetailCard title="Mentor Feedback" icon={<MessageSquarePlus />}>
      <div className="space-y-4">
        {history.length > 0 ? (
          <div className="border-t border-slate-100 pt-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Review History
              </p>

              <span className="text-[11px] text-slate-400">
                {history.length} {history.length === 1 ? "review" : "reviews"}
              </span>
            </div>

            <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
              {history.map((entry, index) => (
                <div
                  key={entry._id || `${entry.reviewedAt}-${index}`}
                  className="flex items-center justify-between bg-primary gap-4 rounded-lg border border-primary-orange px-3 py-2 shadow-sm transition hover:border-orange-500 hover:bg-orange-50/30"
                >
                  {/* COMMENT - LEFT */}
                  <div className="min-w-0 max-h-20 flex-1 overflow-y-auto pr-2">
                    <p className="break-words text-sm text-white leading-relaxed hover:text-primary">
                      <span className="font-semibold text-primary-orange">
                        {entry.reviewedBy?.name || "Mentor"}:
                      </span>{" "}
                      {entry.comment}
                    </p>
                  </div>

                  {/* DATE - RIGHT */}
                  <span className="shrink-0 whitespace-nowrap text-sm font-medium text-primary">
                    {formatDate(entry.reviewedAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-6 text-center">
            <MessageSquarePlus className="mx-auto mb-2 h-5 w-5 text-slate-400" />

            <p className="text-sm font-medium text-slate-600">
              No mentor feedback yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Mentor feedback will appear here.
            </p>
          </div>
        )}
      </div>
    </DetailCard>
  );
}
