"use client";

import { Code2 } from "lucide-react";

import DetailCard from "../DetailCard";

/* =========================================================
   TECHNOLOGIES SECTION
========================================================= */

export default function TechnologiesSection({ project }) {
  return (
    <DetailCard title="Technologies Used" icon={<Code2 />}>
      {project.techStack?.length ? (
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech, index) => (
            <span
              key={index}
              className="rounded bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-700"
            >
              {tech}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400">No technologies added.</p>
      )}
    </DetailCard>
  );
}