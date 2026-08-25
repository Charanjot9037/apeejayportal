"use client";

import { UserRound } from "lucide-react";

import SideCard from "../SideCard";

/* =========================================================
   MENTOR SECTION
========================================================= */

export default function MentorSection({ project }) {
  const mentors = [project.mentor, project.mentor2]
    .filter(Boolean)
    .filter(
      (mentor, index, self) =>
        index ===
        self.findIndex((m) => m._id?.toString() === mentor._id?.toString()),
    );

  console.log(mentors);
  return (
    <SideCard title="Assigned Mentor">
      <div className="space-y-3">
        {mentors.length > 0 ? (
          mentors.map((mentor) => {
            const mentorName = mentor?.name;

            return (
              <div key={mentor._id} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange-200 bg-orange-50">
                  <UserRound className="h-4 w-4 text-orange-500" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {mentorName || "Not assigned"}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {mentor?.designation || "Project Mentor"}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-slate-400">No mentor assigned</p>
        )}
      </div>
    </SideCard>
  );
}
