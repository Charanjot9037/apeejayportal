"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import { useAddProjectForm } from "@/hooks/useAddprojectForm";

import FormHeader from "./handlers/sections/FormHearder";
import BasicInfoSection from "./handlers/sections/BasicInfoSection";
import TechnicalDetailsSection from "./handlers/sections/TechnicalDetailsSction";
import CollaborationSection from "./handlers/sections/CollaborationSection";
import ProjectImagesSection from "./handlers/sections/ProjectImageSection";
import MediaDocumentsSection from "./handlers/sections/MediaDocumentsSection";
import FormActions from "./handlers/sections/FormAction";

export default function AddProjectForm({
  mode = "create",
  project = null,
  viewerRole = "owner",
}) {
  const router = useRouter();

  const { department, program } = useSelector((state) => state.student);

  const isEdit = mode === "edit";

  /* =========================================================
     PROFILE COMPLETION GUARD
     Only relevant for creating a NEW project. If editing an
     existing one, the profile was already complete when it
     was created, so we skip this check.
  ========================================================= */

  const isProfileIncomplete = !isEdit && (!department || !program);

  useEffect(() => {
    if (isProfileIncomplete) {
      toast.error(
        "Please complete your department and program in your profile before creating a project."
      );
      router.push("/profile"); // adjust to your actual profile route
    }
  }, [isProfileIncomplete, router]);

  const {
    formik,
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

  /* Don't render the form while redirecting */
  if (isProfileIncomplete) {
    return null;
  }

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