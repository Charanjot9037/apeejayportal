"use client";

import { useRef, useState } from "react";
import { useFormik } from "formik";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
import {
  Pencil,
  Check,
  X,
  FileText,
  Upload,
  Eye,
  Download,
} from "lucide-react";

import { resumeDocumentsSchema } from "@/validations/profileSchema";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
export default function ResumeDocuments({ data, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const fileInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      resumeUrl: data.resume || "",
      resumeName: data.resumeName || "",
      resumeFile: null,
    },

    validationSchema: resumeDocumentsSchema,

    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        if (!values.resumeUrl) {
          throw new Error("Please upload a resume first");
        }

        if (onSave) {
          await onSave({
            resume: values.resumeUrl,
            resumeName: values.resumeName,
          });
        }

        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save resume:", error);
      }
    },
  });

  // ================================================
  // EDIT
  // ================================================

  function handleEdit() {
    setIsEditing(true);
  }

  // ================================================
  // CANCEL
  // ================================================

  function handleCancel() {
    formik.resetForm();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsEditing(false);
  }

  // ================================================
  // FILE CHANGE + UPLOAD
  // ================================================

  const handleFileChange = async (event) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    // // Optional frontend validation
    // if (file.type !== "application/pdf") {
    //   formik.setFieldError("resumeFile", "Only PDF files are allowed");
    //   return;
    // }

    // Set selected file
    formik.setFieldValue("resumeFile", file);
    formik.setFieldValue("resumeName", file.name);

    // Mark as touched
    formik.setFieldTouched("resumeFile", true, false);

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Resume upload failed");
      }

      console.log("Resume uploaded:", result.url);

      // IMPORTANT:
      // Save Cloudinary URL in Formik
      formik.setFieldValue("resumeUrl", result.url);

      console.log("Resume URL:", result.url);
    } catch (error) {
      console.error("Resume upload failed:", error);

      formik.setFieldError(
        "resumeFile",
        error.message || "Resume upload failed",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      {/* ============================================
          HEADER
      ============================================ */}

      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-main-blue">
            Resume & Documents
          </h2>

          <div className="mt-1 h-0.5 w-6 bg-orange-500" />
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={handleEdit}
            className="flex items-center gap-1.5 rounded-md border border-orange-500 px-3 py-1.5 text-sm font-medium text-orange-500 transition hover:bg-orange-50"
          >
            <Pencil size={14} />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {/* CANCEL */}

            <button
              type="button"
              onClick={handleCancel}
              disabled={formik.isSubmitting || uploading}
              className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
            >
              <X size={14} />
              Cancel
            </button>

            {/* SAVE */}

            <button
              type="submit"
              form="resume-documents-form"
              disabled={formik.isSubmitting || uploading}
              className="flex items-center gap-1.5 rounded-md bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={14} />

              {uploading
                ? "Uploading..."
                : formik.isSubmitting
                  ? "Saving..."
                  : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* ============================================
          FORM
      ============================================ */}

      <form id="resume-documents-form" onSubmit={formik.handleSubmit}>
        <div className="rounded-md border border-gray-300 bg-gray-50 p-2.5">
          <div className="flex items-start gap-2.5">
            {/* FILE ICON */}

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-50 text-orange-500">
              <FileText size={15} />
            </div>

            {/* FILE INFORMATION */}

            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-gray-700">
                {formik.values.resumeName || "No resume uploaded"}
              </p>

              <p className="mt-0.5 text-[9px] text-gray-400">
                {formik.values.resumeUrl
                  ? "Resume uploaded"
                  : "No resume uploaded"}
              </p>
            </div>
          </div>

          {/* ========================================
              EDIT MODE
          ======================================== */}

          {isEditing && (
            <div className="mt-3">
              <input
                ref={fileInputRef}
                id="resumeFile"
                name="resumeFile"
                type="file"

                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-orange-400 bg-white px-3 py-2 text-xs font-medium text-orange-500 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Upload size={14} />

                {uploading ? "Uploading..." : "Choose Resume PDF"}
              </button>

              {/* ERROR */}

              {formik.errors.resumeFile && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.resumeFile}
                </p>
              )}
            </div>
          )}

          {/* ========================================
              VIEW / DOWNLOAD
          ======================================== */}

          {!isEditing &&
            formik.values.resumeUrl &&
            formik.values.resumeName && (
              <div className="mt-2.5 border grid grid-cols-2 gap-1.5">
                <div>
                  <a
                    href={formik.values.resumeUrl}
                    download
                    className="flex h-7 items-center justify-center gap-1 rounded-md border border-gray-400 text-[10px] font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    <Download size={12} />
                    Download
                  </a>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setShowResumeModal(true)}
                    className="flex h-7 w-full items-center justify-center gap-1 rounded-md bg-orange-500 text-[10px] font-medium text-white transition hover:bg-orange-600"
                  >
                    <Eye size={12} />
                    View Resume
                  </button>
                </div>
              </div>
            )}
        </div>
      </form>
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="font-semibold text-gray-800">Resume</h2>

              <button
                type="button"
                onClick={() => setShowResumeModal(false)}
                className="text-xl text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* PDF */}
            <div className="flex-1 overflow-auto bg-gray-200 p-4">
              <Document
                file={formik.values.resumeUrl}
                loading={
                  <p className="text-center text-gray-500">Loading resume...</p>
                }
                error={
                  <p className="text-center text-red-500">
                    Failed to load resume
                  </p>
                }
              >
                <Page pageNumber={1} width={700} />
              </Document>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
