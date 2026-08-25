"use client";

import { Upload, Eye, FileText, Loader2, Lock } from "lucide-react";

export default function DocumentUpload({
  title,
  description,
  accept,
  file,
  existingFile,
  error,
  loading,
  disabled,
  idSuffix = "",
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

  const currentFileName =
    typeof file === "string" ? title : file?.originalName || file?.name || null;

  const inputId = `file-upload-${title.toLowerCase().replace(/\s+/g, "-")}${
    idSuffix ? `-${idSuffix}` : ""
  }`;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    console.log("SELECTED FILE:", selectedFile);

    if (!selectedFile) return;

    // This MUST call parent's uploadDocument()
    onChange(selectedFile);

    // Allow selecting same file again
    event.target.value = "";
  };

  return (
    <div className={disabled ? "opacity-70" : ""}>
      {/* EXISTING FILE */}
      {existingFile && existingFileUrl && !file && !loading && (
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

                {!disabled && (
                  <button
                    type="button"
                    onClick={onRemoveExisting}
                    className="text-xs font-medium text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD AREA */}
      <label
        htmlFor={disabled ? undefined : inputId}
        className={`flex min-h-[130px] flex-col items-center justify-center rounded-md border border-dashed px-4 py-5 text-center transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100"
            : loading
              ? "cursor-not-allowed border-blue-300 bg-blue-50"
              : error
                ? "cursor-pointer border-red-400 bg-red-50"
                : "cursor-pointer border-slate-300 bg-slate-50 hover:border-orange-400 hover:bg-orange-50"
        }`}
      >
        {disabled ? (
          <>
            <Lock className="mb-2 h-5 w-5 text-slate-400" />

            <span className="max-w-full truncate px-2 text-xs font-medium text-slate-500">
              {currentFileName || existingFileName || title}
            </span>

            <span className="mt-1 text-[10px] text-slate-400">
              Only the owner of this document can edit it
            </span>
          </>
        ) : loading ? (
          <>
            <Loader2 className="mb-2 h-6 w-6 animate-spin text-orange-500" />

            <span className="text-xs font-medium text-blue-700">
              Uploading...
            </span>

            <span className="mt-1 text-[10px] text-slate-400">
              Uploading file to Cloudinary
            </span>
          </>
        ) : (
          <>
            <Upload
              className={`mb-2 h-5 w-5 ${
                error ? "text-red-500" : "text-orange-500"
              }`}
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
          </>
        )}

        <input
          id={inputId}
          type="file"
          accept={accept}
          disabled={loading || disabled}
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* REMOVE NEW FILE */}
      {file && !error && !loading && !disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-1 text-xs text-red-500 hover:text-red-600"
        >
          Remove new file
        </button>
      )}

      {/* ERROR */}
      {error && !loading && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}