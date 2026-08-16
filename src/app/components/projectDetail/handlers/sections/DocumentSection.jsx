"use client";

import { FileText } from "lucide-react";

import DetailCard from "../DetailCard";
import DocumentItem from "../DocumentItem";

/* =========================================================
   DOCUMENTS SECTION
========================================================= */

export default function DocumentsSection({ project }) {
  const hasNoDocuments =
    !project.synopsisFile &&
    !project.reportFile &&
    !project.presentationFile;

  return (
    <DetailCard title="Documents & Deliverables" icon={<FileText />}>
      <div className="space-y-2">
        <DocumentItem label="Project Synopsis" file={project.synopsisFile} />

        <DocumentItem label="Project Report" file={project.reportFile} />

        <DocumentItem
          label="Final Presentation"
          file={project.presentationFile}
        />

        {hasNoDocuments && (
          <div className="rounded border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <FileText className="mx-auto mb-2 h-6 w-6 text-slate-300" />

            <p className="text-xs text-slate-400">No documents uploaded.</p>
          </div>
        )}
      </div>
    </DetailCard>
  );
}