"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { statusStyles } from "../../helpers";

/* =========================================================
   DETAIL HEADER
========================================================= */

export default function DetailHeader({ project, deleting, onDelete }) {
  return (
    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
     
      <div>
          <Link
              href="/student"
              className="mb-5 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
        {/* Project Title */}
        <h1 className="text-xl font-semibold tracking-tight text-blue-900 md:text-2xl">
          {project.title}
        </h1>

        {/* Status + project type */}
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <Badge
            className={`rounded-full px-2.5 py-0.5 text-sm ${
              statusStyles[project.status] || "bg-slate-100 text-slate-600"
            }`}
          >
            <span className="mr-1">●</span>
            {project.status}
          </Badge>

          {/* <span className="text-[9px] text-slate-400">
            {project.projectType === "team"
              ? `Team Project • ${project.teamMembers?.length || 0} Members`
              : "Individual Project"}
          </span> */}
        </div>
      </div>

      {/* ACTION BUTTONS */}

      <div className="flex items-center gap-2">
        <Link href={`/student/projects/${project._id}/edit`}>
          <Button className="h-9 bg-orange-500 px-4 text-xs text-white hover:bg-orange-600">
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Update Details
          </Button>
        </Link>

        <Button
          variant="outline"
          onClick={onDelete}
          disabled={deleting}
          className="h-9 border-red-200 px-4 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}
