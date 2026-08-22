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
========================================================= */

export default function AddProjectForm({ mode = "create", project = null }) {
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
          />

          <FormActions formik={formik} isEdit={isEdit} />
        </form>
      
    </div>
  );
}
