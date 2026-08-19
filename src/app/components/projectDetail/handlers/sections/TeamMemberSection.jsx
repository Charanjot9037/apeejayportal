"use client";

import { UserRound } from "lucide-react";

import SideCard from "../SideCard";

/* =========================================================
   TEAM MEMBERS SECTION
========================================================= */

export default function TeamMembersSection({ project }) {
  if (project.projectType !== "team") {
    return null;
  }

  const member = project.teamMembers;

  return (
    <SideCard title="Team Members">
      <div className="space-y-3">
        {member ? (
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
              <UserRound className="h-4 w-4 text-slate-500" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                {member.name}
              </p>

              <p className="truncate text-xs text-slate-400">
                {member.email || "Team Member"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No team members.
          </p>
        )}
      </div>
    </SideCard>
  );
}