"use client";

import { FileText, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import DetailCard from "../DetailCard";

/* =========================================================
   OVERVIEW SECTION
========================================================= */

export default function OverviewSection({ project }) {
  return (
    <DetailCard title="Overview" icon={<FileText />}>
      <div className="space-y-4">
        <p className="text-sm leading-6 text-slate-600 md:text-sm">
          {project.description || "No description provided."}
        </p>

        {/* Project links */}
        {(project.githubLink || project.liveLink) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="h-8 text-xs">
                  GitHub
                </Button>
              </a>
            )}

            {project.liveLink && (
              <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="h-8 text-xs">
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                  Live Demo
                </Button>
              </a>
            )}
          </div>
        )}
      </div>
    </DetailCard>
  );
}