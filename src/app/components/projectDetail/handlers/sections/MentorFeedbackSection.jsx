// app/projectDetail/handlers/sections/MentorFeedbackSection.jsx
"use client";

import { MessageSquareText } from "lucide-react";
import DetailCard from "../DetailCard";
import { formatDate } from "../../helpers";

export default function MentorFeedbackSection({ project }) {
  const reviews = [...(project.mentorReviews || [])].reverse();

  if (reviews.length === 0) return null;

  return (
    <DetailCard title="Mentor Feedback" icon={<MessageSquareText />}>
      <div className="space-y-3">
        {reviews.map((entry) => (
          <div
            key={entry._id}
            className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
          >
            <div className="flex items-center justify-between">
              {entry.status && (
                <span className="rounded-full bg-[#f2792a]/10 px-2 py-0.5 text-xs font-semibold text-[#f2792a]">
                  {entry.status}
                </span>
              )}
              <span className="text-xs text-slate-400">
                {formatDate(entry.reviewedAt)}
              </span>
            </div>
            {entry.comment && (
              <p className="mt-1.5 text-sm leading-6 text-slate-600">
                {entry.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </DetailCard>
  );
}