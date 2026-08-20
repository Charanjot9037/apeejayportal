"use client";

import { toast } from "sonner";
import { UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import SideCard from "../SideCard";

/* =========================================================
   MENTOR SECTION
========================================================= */

export default function MentorSection({ project }) {
  const mentorName = project.mentor?.userId?.name;

  return (
    <SideCard title="Assigned Mentor">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-200 bg-orange-50">
          <UserRound className="h-4 w-4 text-orange-500" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-800">
            {mentorName || "Not assigned"}
          </p>

          <p className="mt-0.5 truncate text-xs text-slate-400">
            {project.mentor?.designation || "Project Mentor"}
          </p>
        </div>
      </div>

      {mentorName && (
        <Button
          className="mt-4 h-9 w-full bg-orange-500 text-xs text-white hover:bg-orange-600"
          onClick={() =>
            toast.info("Mentor contact functionality can be added here.")
          }
        >
          Contact Mentor
        </Button>
      )}
    </SideCard>
  );
}