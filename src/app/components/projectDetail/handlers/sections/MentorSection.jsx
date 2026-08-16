"use client";

import { toast } from "sonner";
import { UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import SideCard from "../SideCard";

/* =========================================================
   MENTOR SECTION
========================================================= */

export default function MentorSection({ project }) {
  return (
    <SideCard title="Assigned Mentor">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-200 bg-orange-50">
          <UserRound className="h-4 w-4 text-orange-500" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-800">
            {project.mentor || "Not assigned"}
          </p>

          <p className="mt-0.5 text-[8px] text-slate-400">Project Mentor</p>
        </div>
      </div>

      {project.mentor && (
        <Button
          className="mt-4 h-8 w-full bg-orange-500 text-[10px] text-white hover:bg-orange-600"
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