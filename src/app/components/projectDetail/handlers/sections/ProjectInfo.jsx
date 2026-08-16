"use client";

import { Code2, CalendarDays, FileText } from "lucide-react";

import SideCard from "../SideCard";
import SmallInfo from "../SmallInfo";
import { formatDate } from "../../helpers";

/* =========================================================
   PROJECT INFORMATION SECTION
========================================================= */

export default function ProjectInfoSection({ project }) {
  return (
    <SideCard title="Project Information">
      <div className="space-y-3">
        <SmallInfo
          icon={<Code2 className="h-3.5 w-3.5" />}
          label="Project Type"
          value={
            project.projectType === "team" ? "Team Project" : "Individual Project"
          }
        />

        <SmallInfo
          icon={<CalendarDays className="h-3.5 w-3.5" />}
          label="Semester"
          value={project.semester || "Not provided"}
        />

        <SmallInfo
          icon={<FileText className="h-3.5 w-3.5" />}
          label="Status"
          value={project.status || "Not provided"}
        />

        <SmallInfo
          icon={<CalendarDays className="h-3.5 w-3.5" />}
          label="Created"
          value={
            project.createdAt ? formatDate(project.createdAt) : "Not available"
          }
        />
      </div>
    </SideCard>
  );
}