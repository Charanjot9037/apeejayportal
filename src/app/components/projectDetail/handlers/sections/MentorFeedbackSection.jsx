// app/projectDetail/handlers/sections/MentorFeedbackSection.jsx
"use client";

import { MessageSquareText } from "lucide-react";
import DetailCard from "../DetailCard";
import { formatDate } from "../../helpers";

export default function MentorFeedbackSection({ project }) {
  if (!project.mentorComment) return null;

  return (
    <DetailCard title="Mentor Feedback" icon={<MessageSquareText />}>
      <p className="text-sm leading-6 text-slate-600">{project.mentorComment}</p>
      {project.mentorReviewedAt && (
        <p className="mt-2 text-xs text-slate-400">
          Reviewed on {formatDate(project.mentorReviewedAt)}
        </p>
      )}
    </DetailCard>
  );
}