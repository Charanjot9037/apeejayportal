// "use client";

// import { FileText, Eye, Download } from "lucide-react";

// /* =========================================================
//    DOCUMENT ITEM
// ========================================================= */

// export default function DocumentItem({ label, file }) {
//   if (!file) {
//     return null;
//   }

//   const fileUrl = typeof file === "string" ? file : file?.url;

//   const fileName = typeof file === "string" ? label : file?.originalName || label;

//   if (!fileUrl) {
//     return null;
//   }

//   /*
//    * Cloudinary download URL
//    *
//    * Adds fl_attachment so Cloudinary sends
//    * the file with the original filename.
//    */
//   const downloadUrl = fileUrl.includes("/upload/")
//     ? fileUrl.replace(
//         "/upload/",
//         `/upload/fl_attachment:${encodeURIComponent(fileName)}/`
//       )
//     : fileUrl;

//   return (
//     <div className="flex items-center justify-between gap-3 rounded border border-slate-200 bg-white p-3">
//       {/* FILE INFO */}

//       <div className="flex min-w-0 items-center gap-3">
//         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-orange-50">
//           <FileText className="h-4 w-4 text-orange-500" />
//         </div>

//         <div className="min-w-0">
//           <p className="text-sm font-medium text-slate-700">{label}</p>

//           <p className="max-w-[220px] truncate text-sm text-slate-400">
//             {fileName}
//           </p>
//         </div>
//       </div>

//       {/* ACTIONS */}

//       <div className="flex shrink-0 items-center gap-1">
//         {/* VIEW */}

//         <a
//           href={fileUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           title="View"
//           className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
//         >
//           <Eye className="h-3.5 w-3.5" />
//         </a>

//         {/* DOWNLOAD */}

//         <a
//           href={fileUrl}
//           download
//           title={`Download ${fileName}`}
//           className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-orange-600 "
//         >
//           <Download className="h-3.5 w-3.5" />
//         </a>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import {
  FileText,
  Eye,
  Download,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

import PDFViewer from "./sections/PDFviewer";
export default function DocumentItem({ label, file }) {
  const [showModal, setShowModal] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [zoom, setZoom] = useState(1);

  if (!file) return null;

  const fileUrl = typeof file === "string" ? file : file?.url;

  const fileName =
    typeof file === "string" ? label : file?.originalName || label;

  if (!fileUrl) return null;

  /* =========================================================
     FILE TYPE
  ========================================================= */

  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  const isPdf = extension === "pdf";

  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(
    extension,
  );

  const isPpt = ["ppt", "pptx"].includes(extension);

  /* =========================================================
     DOWNLOAD URL
  ========================================================= */

  const downloadUrl = fileUrl;

  /* =========================================================
     OPEN MODAL
  ========================================================= */

  const handleOpen = () => {
    setZoom(1);
    setNumPages(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setZoom(1);
    setNumPages(null);
  };

  return (
    <>
      {/* =====================================================
          DOCUMENT ITEM
      ===================================================== */}

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

          <button
            type="button"
            onClick={handleOpen}
            title="View"
            className="rounded p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-primary-orange"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          {/* DOWNLOAD */}

          <a
            href={downloadUrl}
            download
            title={`Download ${fileName}`}
            className="rounded p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-orange-600"
          >
            <Download className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          onClick={handleClose}
        >
          <div
            className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex shrink-0 items-center justify-between border-b bg-primary px-4 py-3">
              {/* TITLE */}

              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-5 w-5 text-white" />

                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-white">
                    {label}
                  </h2>

                  <p className="max-w-[400px] truncate text-xs text-white/70">
                    {fileName}
                  </p>
                </div>
              </div>

              {/* CONTROLS */}

              <div className="flex items-center gap-1">
                {/* ZOOM OUT */}

                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}
                  disabled={zoom <= 0.5 || isPpt}
                  title="Zoom out"
                  className="rounded-md p-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>

                {/* ZOOM */}

                <span className="min-w-[45px] text-center text-xs font-medium text-white">
                  {Math.round(zoom * 100)}%
                </span>

                {/* ZOOM IN */}

                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(prev + 0.1, 2))}
                  disabled={zoom >= 2 || isPpt}
                  title="Zoom in"
                  className="rounded-md p-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>

                {/* RESET */}

                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  disabled={isPpt}
                  title="Reset zoom"
                  className="rounded-md p-2 text-white transition hover:bg-white/10 disabled:opacity-40"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={handleClose}
                  title="Close"
                  className="ml-2 rounded-md p-2 text-white transition hover:bg-red-500/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* =================================================
                VIEWER
            ================================================= */}

            <div className="min-h-0 flex-1 overflow-auto bg-slate-200 p-4">
              {/* =================================================
                  PDF
              ================================================= */}

              {isPdf && <PDFViewer fileUrl={fileUrl} zoom={zoom} />}

              {/* =================================================
                  IMAGE
              ================================================= */}

              {isImage && (
                <div className="flex min-h-full min-w-full items-start justify-center">
                  <img
                    src={fileUrl}
                    alt={fileName}
                    style={{
                      width: `${zoom * 100}%`,
                      maxWidth: "none",
                    }}
                    className="h-auto rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* =================================================
                  POWERPOINT
              ================================================= */}

              {isPpt && (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                    fileUrl,
                  )}`}
                  title={fileName}
                  className="h-full min-h-[80vh] w-full rounded-lg border-0 bg-white"
                />
              )}

              {/* =================================================
                  UNSUPPORTED
              ================================================= */}

              {!isPdf && !isImage && !isPpt && (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <FileText className="mx-auto mb-3 h-10 w-10 text-slate-400" />

                    <p className="text-sm font-medium text-slate-600">
                      Preview is not available for this file.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
