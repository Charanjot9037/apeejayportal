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

  return (
    <SideCard title="Team Members">
      <div className="space-y-3">
        {project.teamMembers?.length ? (
          project.teamMembers.map((member, index) => (
            <div key={index} className="flex items-center gap-2.5">
              {/* Avatar */}
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
                <UserRound className="h-3.5 w-3.5 text-slate-500" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[10px] font-medium text-slate-800">
                  {member.name}
                </p>

                <p className="truncate text-[8px] text-slate-400">
                  {member.role || "Team Member"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400">No team members.</p>
        )}
      </div>
    </SideCard>
  );
}