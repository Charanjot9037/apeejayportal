"use client";

import { Upload, Eye, FileText } from "lucide-react";

/* =========================================================
   DOCUMENT UPLOAD
========================================================= */

export default function DocumentUpload({
  title,
  description,
  accept,
  file,
  existingFile,
  error,
  onChange,
  onRemove,
  onRemoveExisting,
}) {
  const existingFileUrl =
    typeof existingFile === "string" ? existingFile : existingFile?.url;

  const existingFileName =
    typeof existingFile === "string"
      ? title
      : existingFile?.originalName || title;

  const currentFileName = file?.name || null;

  return (
    <div>
      {/* EXISTING CLOUDINARY FILE */}
      {existingFile && existingFileUrl && !file && (
        <div className="mb-2 rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-start gap-2">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Existing File
              </p>

              <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
                {existingFileName}
              </p>

              <div className="mt-2 flex items-center gap-3">
                <a
                  href={existingFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                >
                  <Eye className="h-3 w-3" />
                  View
                </a>

                <button
                  type="button"
                  onClick={onRemoveExisting}
                  className="text-xs font-medium text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD / REPLACE */}
      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 py-5 text-center transition ${
          error
            ? "border-red-400 bg-red-50"
            : "border-slate-300 bg-slate-50 hover:border-orange-400 hover:bg-orange-50"
        }`}
      >
        <Upload
          className={`mb-2 h-5 w-5 ${error ? "text-red-500" : "text-orange-500"}`}
        />

        <span className="max-w-full truncate px-2 text-xs font-medium text-slate-700">
          {currentFileName || (existingFile ? "Replace file" : title)}
        </span>

        <span className="mt-1 text-[10px] text-slate-400">
          {currentFileName
            ? "Click to replace"
            : existingFile
              ? "Choose a new file to replace the existing one"
              : description}
        </span>

        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0] || null;

            onChange(selectedFile);

            event.target.value = "";
          }}
        />
      </label>

      {/* NEW FILE REMOVE */}
      {file && !error && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-1 text-xs text-red-500 hover:text-red-600"
        >
          Remove new file
        </button>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}