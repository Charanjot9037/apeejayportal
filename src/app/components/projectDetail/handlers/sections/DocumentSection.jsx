"use client";

import { FileText } from "lucide-react";

import DetailCard from "../DetailCard";
import DocumentItem from "../DocumentItem";

/* =========================================================
   DOCUMENTS SECTION
========================================================= */

export default function DocumentsSection({ project, teamMemberName }) {
  const hasNoOwnerDocuments =
    !project.synopsisFile && !project.reportFile && !project.presentationFile;

  const hasNoTeamMemberDocuments =
    !project.synopsisFile2 &&
    !project.reportFile2 &&
    !project.presentationFile2;

  const isTeamProject = project.projectType === "team" && teamMemberName;

  return (
    <DetailCard title="Documents & Deliverables" icon={<FileText />}>
      <div className="space-y-4">
        {/* OWNER'S DOCUMENTS */}
        <div className="space-y-2">
          {isTeamProject && (
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Owner&apos;s Documents
            </p>
          )}

          <DocumentItem
            label="Project Synopsis"
            file={project.synopsisFile}
          />

          <DocumentItem label="Project Report" file={project.reportFile} />

          <DocumentItem
            label="Final Presentation"
            file={project.presentationFile}
          />

          {hasNoOwnerDocuments && (
            <div className="rounded border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <FileText className="mx-auto mb-2 h-6 w-6 text-slate-300" />

              <p className="text-xs text-slate-400">No documents uploaded.</p>
            </div>
          )}
        </div>

        {/* TEAM MEMBER'S DOCUMENTS */}
        {isTeamProject && (
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {teamMemberName}&apos;s Documents
            </p>

            <DocumentItem
              label="Project Synopsis"
              file={project.synopsisFile2}
            />

            <DocumentItem
              label="Project Report"
              file={project.reportFile2}
            />

            <DocumentItem
              label="Final Presentation"
              file={project.presentationFile2}
            />

            {hasNoTeamMemberDocuments && (
              <div className="rounded border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <FileText className="mx-auto mb-2 h-6 w-6 text-slate-300" />

                <p className="text-xs text-slate-400">
                  No documents uploaded yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DetailCard>
  );
}