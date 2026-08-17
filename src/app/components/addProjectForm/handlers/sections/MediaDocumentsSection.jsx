"use client";

import { useState } from "react";
import DocumentUpload from "../../DocumentUpload";
import { toast } from "sonner";

/* =========================================================
   MEDIA & DOCUMENTS SECTION
========================================================= */

export default function MediaDocumentsSection({ formik, getFileError }) {
  const [uploading, setUploading] = useState({
    presentationFile: false,
    synopsisFile: false,
    reportFile: false,
  });

  /* =========================================================
     UPLOAD DOCUMENT TO CLOUDINARY
  ========================================================= */

  const uploadDocument = async (file, fieldName) => {
    if (!file) return;

    try {
      setUploading((prev) => ({
        ...prev,
        [fieldName]: true,
      }));

      const formData = new FormData();

      formData.append("file", file);

      // Tell API this is a project document
      formData.append("type", "project-document");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
alert("uploaded");
      if (!response.ok || !data.success) {
        throw new Error(data.message || "File upload failed");
      }

      /* ================================================
         Store Cloudinary response in Formik
      ================================================ */

      formik.setFieldValue(fieldName, {
        url: data.url,
        publicId: data.publicId,
        originalName: data.originalName,
        resourceType: data.resourceType,
      });

      formik.setFieldTouched(fieldName, true, false);

      toast.success(`${file.name} uploaded successfully`);
    } catch (error) {
      console.error(`${fieldName} upload error:`, error);

      toast.error(error.message || "File upload failed");

      formik.setFieldValue(fieldName, null);
    } finally {
      setUploading((prev) => ({
        ...prev,
        [fieldName]: false,
      }));
    }
  };

  /* =========================================================
     REMOVE NEW FILE
  ========================================================= */

  const removeFile = (fieldName) => {
    formik.setFieldValue(fieldName, null);
  };

  return (
    <section className="mt-6">
      <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
        <span className="border-b-2 border-orange-500 pb-2">
          Media & Documents
        </span>
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* =================================================
            PRESENTATION
        ================================================= */}

        <DocumentUpload
          title="PPT Presentation"
          description="PPT / PPTX • Max 10MB"
          accept=".ppt,.pptx"
          file={formik.values.presentationFile}
          existingFile={formik.values.existingPresentationFile}
          error={getFileError("presentationFile")}
          loading={uploading.presentationFile}
          onChange={(file) => uploadDocument(file, "presentationFile")}
          onRemove={() => removeFile("presentationFile")}
          onRemoveExisting={() => {
            formik.setFieldValue("existingPresentationFile", null);
          }}
        />

        {/* =================================================
            SYNOPSIS
        ================================================= */}

        <DocumentUpload
          title="Project Synopsis"
          description="PDF • Max 5MB"
          accept=".pdf"
          file={formik.values.synopsisFile}
          existingFile={formik.values.existingSynopsisFile}
          error={getFileError("synopsisFile")}
          loading={uploading.synopsisFile}
          onChange={(file) => uploadDocument(file, "synopsisFile")}
          onRemove={() => removeFile("synopsisFile")}
          onRemoveExisting={() => {
            formik.setFieldValue("existingSynopsisFile", null);
          }}
        />

        {/* =================================================
            FINAL REPORT
        ================================================= */}

        <DocumentUpload
          title="Final Project Report"
          description="PDF • Max 20MB"
          accept=".pdf"
          file={formik.values.reportFile}
          existingFile={formik.values.existingReportFile}
          error={getFileError("reportFile")}
          loading={uploading.reportFile}
          onChange={(file) => uploadDocument(file, "reportFile")}
          onRemove={() => removeFile("reportFile")}
          onRemoveExisting={() => {
            formik.setFieldValue("existingReportFile", null);
          }}
        />
      </div>
    </section>
  );
}
