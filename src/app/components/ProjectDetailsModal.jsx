"use client";
import { FileText,  ExternalLink, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { statusStyles } from "@/constants/studentdashboard";

// Turns a comma-separated tech stack string into chip badges.
function TechChips({ techStack }) {
  if (!techStack) return <span className="text-sm text-slate-400">Not specified</span>;
  const items = techStack
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((tech) => (
        <span
          key={tech}
          className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

// A file can be a File object (client-only, pre-upload) or a URL string
// (once the real API is wired up), so this handles both.
function FileRow({ label, file }) {
  if (!file) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-200 px-3 py-2.5">
        <span className="text-sm text-slate-400">{label}: not uploaded</span>
      </div>
    );
  }

  const isFileObject = typeof File !== "undefined" && file instanceof File;
  const fileName = isFileObject ? file.name : label;
  const href = isFileObject ? URL.createObjectURL(file) : file;

  return (
    <a
      href={href}
      download={isFileObject ? fileName : undefined}
      target={isFileObject ? undefined : "_blank"}
      rel="noreferrer"
      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 transition hover:border-orange-300 hover:bg-orange-50"
    >
      <div className="flex min-w-0 items-center gap-2">
        <FileText className="h-4 w-4 shrink-0 text-orange-500" />
        <div className="flex min-w-0 flex-col">
          <span className="text-xs text-slate-400">{label}</span>
          <span className="truncate text-sm font-medium text-slate-700">{fileName}</span>
        </div>
      </div>
      <Download className="h-4 w-4 shrink-0 text-slate-400" />
    </a>
  );
}

export default function ProjectDetailsModal({ open, onOpenChange, project }) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-6">
            <DialogTitle className="text-lg font-semibold text-blue-900">
              {project.title}
            </DialogTitle>
            {project.status && (
              <Badge className={statusStyles[project.status]}>{project.status}</Badge>
            )}
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-5 pt-2">
          {project.subtitle && (
            <p className="text-sm text-slate-500">{project.subtitle}</p>
          )}

          <div className="flex flex-col gap-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Description
            </h3>
            <p className="text-sm text-slate-700">
              {project.description || "No description provided."}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Tech Stack
            </h3>
            <TechChips techStack={project.techStack} />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Links
            </h3>
            <div className="flex flex-col gap-2">
              {project.githubLink ? (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-blue-900 hover:text-orange-500"
                >
                  <span className="text-sm">GitHub:</span>
                  {project.githubLink}
                </a>
              ) : (
                <p className="text-sm text-slate-400">No GitHub link provided.</p>
              )}

              {project.liveLink ? (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-blue-900 hover:text-orange-500"
                >
              <span className="text-sm">Live Demo:</span>
                  {project.liveLink}
                </a>
              ) : (
                <p className="text-sm text-slate-400">No live demo link provided.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Documents
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <FileRow label="Synopsis" file={project.synopsisFile} />
              <FileRow label="Report" file={project.reportFile} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}