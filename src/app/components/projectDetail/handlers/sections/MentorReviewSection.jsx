// app/projectDetail/handlers/sections/MentorReviewSection.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import DetailCard from "../DetailCard";

export default function MentorReviewSection({ project, onUpdated }) {
  const [status, setStatus] = useState(project.status || "Pending Approval");
  const [comment, setComment] = useState(project.mentorComment || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
      console.log("Save clicked", { status, comment, projectId: project._id });

    try {
      setSaving(true);

      const response = await fetch(`/api/projects/${project._id}/mentor-review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, comment }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update review.");
      }

      toast.success("Review saved.");
      onUpdated?.(result.project);
    } catch (error) {
      console.error("MENTOR_REVIEW_SAVE_ERROR:", error);
      toast.error(error.message || "Failed to save review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DetailCard title="Mentor Review" icon={<ClipboardCheck />}>
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 focus:border-[#f2792a] focus:outline-none"
          >
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">
            Comment for Student
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Write feedback the student will see..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 focus:border-[#f2792a] focus:outline-none"
          />
        </div>

        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#f2792a] text-white hover:bg-[#df681c]"
        >
          {saving ? "Saving..." : "Save Review"}
        </Button>
      </div>
    </DetailCard>
  );
}