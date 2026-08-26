"use client";

import { useAddProjectForm } from "@/hooks/useAddprojectForm";

import FormHeader from "./handlers/sections/FormHearder";
import BasicInfoSection from "./handlers/sections/BasicInfoSection";
import TechnicalDetailsSection from "./handlers/sections/TechnicalDetailsSction";
import CollaborationSection from "./handlers/sections/CollaborationSection";
import ProjectImagesSection from "./handlers/sections/ProjectImageSection";
import MediaDocumentsSection from "./handlers/sections/MediaDocumentsSection";
import FormActions from "./handlers/sections/FormAction";

/* =========================================================
   MAIN COMPONENT

   All form state and handlers live in useAddProjectForm.
   This component is just layout + composition of sections.

   viewerRole / teamMemberName come from the parent page,
   which fetches the project via GET /api/projects/[id]
   (that route now returns { project, viewerRole }).
========================================================= */

export default function AddProjectForm({
  mode = "create",
  project = null,
  viewerRole = "owner",
}) {
  const {
    formik,
    isEdit,
    addTechnology,
    removeTechnology,
    addTeamMember,
    removeTeamMember,
    getTeamError,
    getFileError,
  } = useAddProjectForm({ mode, project });

  console.log("errors", formik.errors);

  const teamMemberName =
    project?.teamMembers?.fullName ||
    project?.teamMembers?.userId?.name ||
    (project?.teamMembers ? "Team Member" : null);

  return (
    <div className="min-h-full">
      <FormHeader isEdit={isEdit} />

      <form
        onSubmit={formik.handleSubmit}
        noValidate
        className="rounded-md border border-slate-300 bg-white p-5 shadow-sm"
      >
        <BasicInfoSection formik={formik} />

        <TechnicalDetailsSection
          formik={formik}
          addTechnology={addTechnology}
          removeTechnology={removeTechnology}
        />

        <CollaborationSection
          formik={formik}
          addTeamMember={addTeamMember}
          removeTeamMember={removeTeamMember}
          getTeamError={getTeamError}
        />

        <ProjectImagesSection formik={formik} isEdit={isEdit} />

        <MediaDocumentsSection
          formik={formik}
          isEdit={isEdit}
          getFileError={getFileError}
          viewerRole={viewerRole}
          teamMemberName={teamMemberName}
        />

        <FormActions formik={formik} isEdit={isEdit} />
      </form>
    </div>
  );
}