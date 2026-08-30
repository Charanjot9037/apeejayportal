"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageSquarePlus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import DetailCard from "../DetailCard";
import { formatDate } from "../../helpers";

export default function MentorReviewSection({ project, onUpdated }) {
  const [comment, setComment] = useState("");
  const [savingComment, setSavingComment] = useState(false);

  // =========================================================
  // ADD COMMENT
  // =========================================================

  const handleCommentSave = async () => {
    if (!comment.trim()) {
      toast.error("Write a comment before submitting.");
      return;
    }

    try {
      setSavingComment(true);

      const response = await fetch(
        `/api/projects/${project._id}/mentor-review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit review.");
      }

      toast.success("Review submitted.");
      setComment("");

      onUpdated?.(result.project);
    } catch (error) {
      console.error("MENTOR_COMMENT_SAVE_ERROR:", error);

      toast.error(error.message || "Failed to submit review.");
    } finally {
      setSavingComment(false);
    }
  };

  // =========================================================
  // DELETE REVIEW
  // =========================================================

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `/api/projects/${project._id}/mentor-review`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviewId,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete review.");
      }

      toast.success("Review deleted.");

      onUpdated?.(result.project);
    } catch (error) {
      console.error("MENTOR_REVIEW_DELETE_ERROR:", error);

      toast.error(error.message || "Failed to delete review.");
    }
  };

  // Latest review first
  // Show only actual feedback/comments.
  // Status-only updates are excluded.
  const history = [...(project.mentorReviews || [])]
    .filter((entry) => entry.comment?.trim())
    .reverse();

  return (
    <DetailCard title="Mentor Feedback" icon={<MessageSquarePlus />}>
      <div className="space-y-4">
        {/* =====================================================
            ADD FEEDBACK
        ===================================================== */}

        <div className="rounded-xl border bg-primary text-white border-orange-200  p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            {/* Heading */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgb(242,121,42)] text-white shadow-sm">
                <MessageSquarePlus className="h-4 w-4" />
              </div>

              <div className="min-w-0 text-white">
                <p className="text-sm font-semibold text-white">Add Feedback</p>

                <p className="text-xs text-slate-500">
                  Share feedback or suggestions with the student.
                </p>
              </div>
            </div>

            {/* Input + Button */}
            <div className="flex w-full gap-2 sm:w-auto sm:flex-[1.5]">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="Write feedback..."
                className="min-h-[42px] flex-1 resize-none rounded-lg border border-orange-200 bg-slate-100 px-3 py-2 text-sm text-primary shadow-sm outline-none transition placeholder:text-primary focus:border-[rgb(242,121,42)] focus:ring-1 focus:ring-[rgb(242,121,42)]"
              />

              <Button
                type="button"
                onClick={handleCommentSave}
                disabled={savingComment}
                className="h-auto min-h-[42px] shrink-0 gap-2 rounded-lg bg-[rgb(242,121,42)] px-4 text-white shadow-sm hover:bg-[#df681c]"
              >
                <MessageSquarePlus className="h-4 w-4" />

                <span className="hidden sm:inline">
                  {savingComment ? "Submitting..." : "Submit"}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* =====================================================
            REVIEW HISTORY
        ===================================================== */}

        {history.length > 0 && (
          <div className="border-t  border-slate-100 pt-3">
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
                  className="flex items-center justify-between gap-4 rounded-lg border border-primary-orange px-3 py-2 shadow-sm transition hover:border-orange-500 hover:bg-orange-50/30"
                >
                  {/* COMMENT - LEFT */}
                  {/* COMMENT - LEFT */}
                  <div className="min-w-0 flex-1 max-h-20 overflow-y-auto pr-2">
                    <p className="text-sm leading-relaxed text-primary break-words">
                      <span className="font-semibold text-primary-orange">
                        {entry.reviewedBy?.name || "Mentor"}:
                      </span>{" "}
                      {entry.comment}
                    </p>
                  </div>
                  {/* DATE + DELETE - RIGHT */}
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="whitespace-nowrap text-sm font-medium text-primary">
                      {formatDate(entry.reviewedAt)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteReview(entry._id)}
                      className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[11px] font-medium text-primary-orange shadow-sm transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DetailCard>
  );
}
