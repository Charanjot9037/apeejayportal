"use client";

import Image from "next/image";
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              {member?.profileImage ? (
                <img
                  src={member.profileImage}
                  alt={member?.fullName || "Team member"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-slate-600">
                  {member?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                {member.fullName}
              </p>

              <p className="truncate text-xs text-slate-400">
                {member.userId.email || "Team Member"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">No team members.</p>
        )}
      </div>
    </SideCard>
  );
}
