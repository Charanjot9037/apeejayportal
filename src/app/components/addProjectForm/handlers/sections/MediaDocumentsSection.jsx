"use client";

import { useState } from "react";
import DocumentUpload from "../../DocumentUpload";
import { toast } from "sonner";

export default function MediaDocumentsSection({
  formik,
  getFileError,
  isEdit,
  viewerRole, // "owner" | "teamMember" | "viewer"
  teamMemberName, // pass project's team member's display name
}) {
  const [uploading, setUploading] = useState({
    presentationFile: false,
    synopsisFile: false,
    reportFile: false,
    presentationFile2: false,
    synopsisFile2: false,
    reportFile2: false,
     certificateFile: false,
    certificateFile2: false,
  });

  const uploadDocument = async (file, fieldName) => {
    if (!file) return;

    try {
      setUploading((prev) => ({ ...prev, [fieldName]: true }));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "project-document");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "File upload failed");
      }

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
    } finally {
      setUploading((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const removeFile = (fieldName) => {
    formik.setFieldValue(fieldName, null);
  };

  const isOwnerFieldsDisabled = viewerRole === "teamMember";
  const isTeamMemberFieldsDisabled = viewerRole === "owner";

  return (
    <section className="mt-6">
      <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
        <span className="border-b-2 border-orange-500 pb-2">
          Media & Documents
        </span>
      </h2>

      {/* OWNER'S DOCUMENTS */}
      <h3 className="mt-4 text-sm font-semibold text-slate-700">
        Your Documents
      </h3>
      <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
        <DocumentUpload
          title="PPT Presentation"
          description="PPT / PPTX • Max 10MB"
          accept=".ppt,.pptx"
          file={formik.values.presentationFile}
          idSuffix="owner"
          error={getFileError("presentationFile")}
          loading={uploading.presentationFile}
          disabled={isOwnerFieldsDisabled}
          onChange={(file) => uploadDocument(file, "presentationFile")}
          onRemove={() => removeFile("presentationFile")}
        />

        <DocumentUpload
          title="Project Synopsis"
          description="PDF • Max 5MB"
          accept=".pdf"
          file={formik.values.synopsisFile}
          idSuffix="owner"
          error={getFileError("synopsisFile")}
          loading={uploading.synopsisFile}
          disabled={isOwnerFieldsDisabled}
          onChange={(file) => uploadDocument(file, "synopsisFile")}
          onRemove={() => removeFile("synopsisFile")}
        />

        <DocumentUpload
          title="Final Project Report"
          description="PDF • Max 20MB"
          accept=".pdf"
          file={formik.values.reportFile}
          idSuffix="owner"
          error={getFileError("reportFile")}
          loading={uploading.reportFile}
          disabled={isOwnerFieldsDisabled}
          onChange={(file) => uploadDocument(file, "reportFile")}
          onRemove={() => removeFile("reportFile")}
        />
             <DocumentUpload
          title="Certificate"
          description="PDF • Max 5MB"
          accept=".pdf"
          file={formik.values.certificateFile}
          idSuffix="owner"
          error={getFileError("certificateFile")}
          loading={uploading.certificateFile}
          disabled={isOwnerFieldsDisabled}
          onChange={(file) => uploadDocument(file, "certificateFile")}
          onRemove={() => removeFile("certificateFile")}
        />
      </div>

      {/* TEAM MEMBER'S DOCUMENTS */}
      {teamMemberName && (
        <>
          <h3 className="mt-6 text-sm font-semibold text-slate-700">
            {teamMemberName}&apos;s Documents
          </h3>
          <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
            <DocumentUpload
              title="PPT Presentation"
              description="PPT / PPTX • Max 10MB"
              accept=".ppt,.pptx"
              file={formik.values.presentationFile2}
               idSuffix="member"
              error={getFileError("presentationFile2")}
              loading={uploading.presentationFile2}
              disabled={isTeamMemberFieldsDisabled}
              onChange={(file) => uploadDocument(file, "presentationFile2")}
              onRemove={() => removeFile("presentationFile2")}
            />

            <DocumentUpload
              title="Project Synopsis"
              description="PDF • Max 5MB"
              accept=".pdf"
              file={formik.values.synopsisFile2}
               idSuffix="member"
              error={getFileError("synopsisFile2")}
              loading={uploading.synopsisFile2}
              disabled={isTeamMemberFieldsDisabled}
              onChange={(file) => uploadDocument(file, "synopsisFile2")}
              onRemove={() => removeFile("synopsisFile2")}
            />

            <DocumentUpload
              title="Final Project Report"
              description="PDF • Max 20MB"
              accept=".pdf"
              file={formik.values.reportFile2}
               idSuffix="member"
              error={getFileError("reportFile2")}
              loading={uploading.reportFile2}
              disabled={isTeamMemberFieldsDisabled}
              onChange={(file) => uploadDocument(file, "reportFile2")}
              onRemove={() => removeFile("reportFile2")}
            />
                        <DocumentUpload
              title="Certificate"
              
              description="PDF • Max 5MB"
              accept=".pdf"
              file={formik.values.certificateFile2}
              idSuffix="member"
              error={getFileError("certificateFile2")}
              loading={uploading.certificateFile2}
              disabled={isTeamMemberFieldsDisabled}
              onChange={(file) => uploadDocument(file, "certificateFile2")}
              onRemove={() => removeFile("certificateFile2")}
            />
          </div>
        </>
      )}
    </section>
  );
}