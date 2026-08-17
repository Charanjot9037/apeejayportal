"use client";

import DocumentUpload from "../../DocumentUpload";

/* =========================================================
   MEDIA & DOCUMENTS SECTION
========================================================= */

export default function MediaDocumentsSection({ formik, getFileError }) {
  return (
    <section className="mt-6">
      <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
        <span className="border-b-2 border-orange-500 pb-2">
          Media & Documents
        </span>
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* PRESENTATION */}
        <DocumentUpload
          title="PPT Presentation"
          description="PPT / PPTX • Max 10MB"
          accept=".ppt,.pptx"
          file={formik.values.presentationFile}
          existingFile={formik.values.existingPresentationFile}
          error={getFileError("presentationFile")}
          onChange={(file) => {
            formik.setFieldValue("presentationFile", file);

            formik.setFieldTouched("presentationFile", true, false);
          }}
          onRemove={() => {
            formik.setFieldValue("presentationFile", null);
          }}
          onRemoveExisting={() => {
            formik.setFieldValue("existingPresentationFile", null);
          }}
        />

        {/* SYNOPSIS */}
        <DocumentUpload
          title="Project Synopsis"
          description="PDF • Max 5MB"
          accept=".pdf"
          file={formik.values.synopsisFile}
          existingFile={formik.values.existingSynopsisFile}
          error={getFileError("synopsisFile")}
          onChange={(file) => {
            formik.setFieldValue("synopsisFile", file);

            formik.setFieldTouched("synopsisFile", true, false);
          }}
          onRemove={() => {
            formik.setFieldValue("synopsisFile", null);
          }}
          onRemoveExisting={() => {
            formik.setFieldValue("existingSynopsisFile", null);
          }}
        />

        {/* REPORT */}
        <DocumentUpload
          title="Final Project Report"
          description="PDF • Max 20MB"
          accept=".pdf"
          file={formik.values.reportFile}
          existingFile={formik.values.existingReportFile}
          error={getFileError("reportFile")}
          onChange={(file) => {
            formik.setFieldValue("reportFile", file);

            formik.setFieldTouched("reportFile", true, false);
          }}
          onRemove={() => {
            formik.setFieldValue("reportFile", null);
          }}
          onRemoveExisting={() => {
            formik.setFieldValue("existingReportFile", null);
          }}
        />
      </div>
    </section>
  );
}