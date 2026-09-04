"use client";

import { FileText } from "lucide-react";
import DetailCard from "../DetailCard";

/* =========================================================
   OVERVIEW SECTION
========================================================= */

export default function RecruiterOverviewSection({ project }) {
  return (
    <DetailCard title="Overview" icon={<FileText />}>
      <div className="space-y-4">
        <p className="text-sm leading-6 text-slate-600 md:text-sm">
          {project.description || "No description provided."}
        </p>
      </div>
    </DetailCard>
  );
}