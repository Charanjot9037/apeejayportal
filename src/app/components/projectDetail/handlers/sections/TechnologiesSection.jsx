"use client";

import { Code2, Code2Icon } from "lucide-react";

import DetailCard from "../DetailCard";

/* =========================================================
   TECHNOLOGIES SECTION
========================================================= */
export default function TechnologiesSection({ project }) {
  const technologies =
    project.techStack?.filter((tech) => tech?.trim()) || [];

  return (
    <DetailCard
      title="Technologies Used"
      icon={<Code2Icon />}
    >
      {technologies.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-700"
            >
              {tech}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400">
          No technologies added.
        </p>
      )}
    </DetailCard>
  );
}