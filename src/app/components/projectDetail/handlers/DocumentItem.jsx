"use client";

import { FileText, Eye, Download } from "lucide-react";

/* =========================================================
   DOCUMENT ITEM
========================================================= */

export default function DocumentItem({ label, file }) {
  if (!file) {
    return null;
  }

  const fileUrl = typeof file === "string" ? file : file?.url;

  const fileName = typeof file === "string" ? label : file?.originalName || label;

  if (!fileUrl) {
    return null;
  }

  /*
   * Cloudinary download URL
   *
   * Adds fl_attachment so Cloudinary sends
   * the file with the original filename.
   */
  const downloadUrl = fileUrl.includes("/upload/")
    ? fileUrl.replace(
        "/upload/",
        `/upload/fl_attachment:${encodeURIComponent(fileName)}/`
      )
    : fileUrl;

  return (
    <div className="flex items-center justify-between gap-3 rounded border border-slate-200 bg-white p-3">
      {/* FILE INFO */}

      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-orange-50">
          <FileText className="h-4 w-4 text-orange-500" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700">{label}</p>

          <p className="max-w-[220px] truncate text-sm text-slate-400">
            {fileName}
          </p>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="flex shrink-0 items-center gap-1">
        {/* VIEW */}

        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View"
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
        >
          <Eye className="h-3.5 w-3.5" />
        </a>

        {/* DOWNLOAD */}

        <a
          href={fileUrl}
          download
          title={`Download ${fileName}`}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-orange-600 "
        >
          <Download className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}