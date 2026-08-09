"use client";

import { useRef, useState } from "react";
import { useFormik } from "formik";
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

const defaultData = {
  resumeUrl: "",
  resumeName: "Alex_Johnson_Resume.pdf",
  lastUpdated: "15 Jan 2025",
};

export default function ResumeDocuments({
  data = defaultData,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      resumeUrl: data.resumeUrl || "https://res.cloudinary.com/your-cloud/image/upload/v123456789/resumes/myresume.pdf",
      resumeName: data.resumeName || "",
      lastUpdated: data.lastUpdated || "",
      resumeFile: null,
    },

    validationSchema: resumeDocumentsSchema,

    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        if (onSave) {
          await onSave(values);
        }

        setIsEditing(false);
      } catch (error) {
        console.error(
          "Failed to save resume:",
          error
        );
      }
    },
  });

  /* ================================================
     EDIT
  ================================================ */

  function handleEdit() {
    setIsEditing(true);
  }

  /* ================================================
     CANCEL
  ================================================ */

  function handleCancel() {
    formik.resetForm();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsEditing(false);
  }

  /* ================================================
     FILE CHANGE
  ================================================ */

  function handleFileChange(event) {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    formik.setFieldValue("resumeFile", file);
    formik.setFieldValue("resumeName", file.name);

    // Current date
    const date = new Date();

    const formattedDate = date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

    formik.setFieldValue(
      "lastUpdated",
      formattedDate
    );

    // Mark field as touched
    formik.setFieldTouched(
      "resumeFile",
      true,
      false
    );
  }

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

        {/* ==========================================
            ACTION BUTTONS
        ========================================== */}

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
              disabled={formik.isSubmitting}
              className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
            >
              <X size={14} />
              Cancel
            </button>

            {/* SAVE */}

            <button
              type="submit"
              form="resume-documents-form"
              disabled={formik.isSubmitting}
              className="flex items-center gap-1.5 rounded-md bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={14} />

              {formik.isSubmitting
                ? "Saving..."
                : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* ============================================
          FORM
      ============================================ */}

      <form
        id="resume-documents-form"
        onSubmit={formik.handleSubmit}
      >
        {/* ==========================================
            RESUME CARD
        ========================================== */}

        <div className="rounded-md border border-gray-300 bg-gray-50 p-2.5">
          <div className="flex items-start gap-2.5">
            {/* FILE ICON */}

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-50 text-orange-500">
              <FileText size={15} />
            </div>

            {/* FILE INFORMATION */}

            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-gray-700">
                {formik.values.resumeName ||
                  "No resume uploaded"}
              </p>

              <p className="mt-0.5 text-[9px] text-gray-400">
                {formik.values.lastUpdated
                  ? `Last updated: ${formik.values.lastUpdated}`
                  : "No resume uploaded"}
              </p>
            </div>
          </div>

          {/* ========================================
              EDIT MODE
          ======================================== */}

          {isEditing ? (
            <div className="mt-3">
              <input
                ref={fileInputRef}
                id="resumeFile"
                name="resumeFile"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-orange-400 bg-white px-3 py-2 text-xs font-medium text-orange-500 transition hover:bg-orange-50"
              >
                <Upload size={14} />
                Choose Resume PDF
              </button>

              {/* ERROR */}

              {formik.errors.resumeFile && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.resumeFile}
                </p>
              )}
            </div>
          ) : null}

          {/* ========================================
              ACTION BUTTONS
          ======================================== */}

          {!isEditing && (
            <div className="mt-2.5 grid grid-cols-2 gap-1.5">
              {/* VIEW */}

              <a
                href={
                  formik.values.resumeUrl || "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-7 items-center justify-center gap-1 rounded-md text-[10px] font-medium text-white transition ${
                  formik.values.resumeUrl
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "pointer-events-none bg-gray-300"
                }`}
              >
                <Eye size={12} />
                View Resume
              </a>

              {/* DOWNLOAD */}

              <a
                href={
                  formik.values.resumeUrl || "#"
                }
                download={formik.values.resumeName}
                className={`flex h-7 items-center justify-center gap-1 rounded-md border text-[10px] font-medium transition ${
                  formik.values.resumeUrl
                    ? "border-gray-400 text-gray-700 hover:bg-gray-100"
                    : "pointer-events-none border-gray-300 text-gray-400"
                }`}
              >
                <Download size={12} />
                Download
              </a>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}