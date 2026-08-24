// app/projectDetail/handlers/sections/MentorReviewSection.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ClipboardCheck, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DetailCard from "../DetailCard";
import { formatDate } from "../../helpers";

const STATUS_OPTIONS = ["Pending Approval", "Approved", "Rejected"];

export default function MentorReviewSection({ project, onUpdated }) {
  const [status, setStatus] = useState(project.status || "Pending Approval");
  const [comment, setComment] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingComment, setSavingComment] = useState(false);

  const patchReview = async (payload) => {
    const response = await fetch(`/api/projects/${project._id}/mentor-review`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update review.");
    }

    return result.project;
  };

  const handleStatusSave = async () => {
    try {
      setSavingStatus(true);
      const updated = await patchReview({ status });
      toast.success("Status updated.");
      onUpdated?.(updated);
    } catch (error) {
      console.error("MENTOR_STATUS_SAVE_ERROR:", error);
      toast.error(error.message || "Failed to update status.");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleCommentSave = async () => {
    if (!comment.trim()) {
      toast.error("Write a comment before submitting.");
      return;
    }
    try {
      setSavingComment(true);
      const updated = await patchReview({ comment });
      toast.success("Review submitted.");
      setComment("");
      onUpdated?.(updated);
    } catch (error) {
      console.error("MENTOR_COMMENT_SAVE_ERROR:", error);
      toast.error(error.message || "Failed to submit review.");
    } finally {
      setSavingComment(false);
    }
  };

  const history = [...(project.mentorReviews || [])].reverse();

  return (
    <DetailCard title="Mentor Review" icon={<ClipboardCheck />}>
      <div className="space-y-5">
        {/* Status action */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500">
            Project Status
          </label>
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 focus:border-[#f2792a] focus:outline-none"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <Button
              type="button"
              onClick={handleStatusSave}
              disabled={savingStatus || status === project.status}
              className="bg-[#f2792a] text-white hover:bg-[#df681c] mt-3"
            >
              {savingStatus ? "Saving..." : "Update Status"}
            </Button>
          </div>
        </div>

        {/* New review/comment action */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500">
            Add Feedback for Student
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Write feedback the student will see..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 focus:border-[#f2792a] focus:outline-none"
          />
          <Button
            type="button"
            onClick={handleCommentSave}
            disabled={savingComment}
            variant="outline"
            className="w-full gap-2 border-[#f2792a] text-[#f2792a] hover:bg-[#f2792a]/10"
          >
            <MessageSquarePlus className="h-4 w-4" />
            {savingComment ? "Submitting..." : "Submit Review"}
          </Button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <p className="text-xs font-semibold text-slate-500">Review History</p>
            <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
              {history.map((entry) => (
                <div
                  key={entry._id}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span>{formatDate(entry.reviewedAt)}</span>
                    {entry.status && (
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 font-medium text-slate-600">
                        {entry.status}
                      </span>
                    )}
                  </div>
                  {entry.comment && (
                    <p className="mt-1 text-sm text-slate-600">{entry.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DetailCard>
  );
}