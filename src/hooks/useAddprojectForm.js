
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { toast } from "sonner";

import { emptyTeamMember } from "@/constants/AddProjectConstant";
import { validationSchema } from "@/validations/AddProjectSchema";

/* =========================================================
   useAddProjectForm

   All files are uploaded to Cloudinary BEFORE project
   submission.

   Formik stores Cloudinary objects:
   {
     url,
     publicId,
     originalName,
     resourceType
   }

   /api/projects only receives JSON and saves it to MongoDB.
========================================================= */

export function useAddProjectForm({ mode = "create", project = null }) {
  const router = useRouter();

  const auth = useSelector((state) => state.auth);

  const isEdit = mode === "edit";

  const formik = useFormik({
    initialValues: {
      projectName: isEdit ? project?.title || "" : "",

      description: isEdit ? project?.description || "" : "",

      githubLink: isEdit ? project?.githubLink || "" : "",

      liveDemoLink: isEdit ? project?.liveLink || "" : "",

      semester: isEdit ? project?.semester || "" : "",

      mentor: isEdit ? project?.mentor || "" : "",

      projectType: isEdit ? project?.projectType || "individual" : "individual",

      techStack:
        isEdit && Array.isArray(project?.techStack) ? project.techStack : [""],

      teamMembers:
        isEdit &&
        Array.isArray(project?.teamMembers) &&
        project.teamMembers.length > 0
          ? project.teamMembers
          : [{ ...emptyTeamMember }],

      /* =====================================================
         CLOUDINARY FILE OBJECTS

         These are NOT File objects anymore.

         Example:

         projectImages: [
           {
             url: "...",
             publicId: "...",
             originalName: "image.png",
             resourceType: "image"
           }
         ]
      ===================================================== */

      projectImages: [],

      presentationFile: null,

      synopsisFile: null,

      reportFile: null,

      /* =====================================================
         EXISTING FILES - EDIT MODE
      ===================================================== */

      existingProjectImages:
        isEdit && Array.isArray(project?.projectImages)
          ? project.projectImages
          : [],

      existingSynopsisFile: isEdit ? project?.synopsisFile?.url || null : null,

      existingReportFile: isEdit ? project?.reportFile?.url || null : null,

      existingPresentationFile: isEdit
        ? project?.presentationFile?.url || null
        : null,
    },

    validationSchema,

    /* =======================================================
       SUBMIT
    ======================================================= */

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const studentId = auth?.user?._id || auth?.user?.id;

        if (!studentId) {
          toast.error("Student information not found.");
          return;
        }

        /* =================================================
           PROJECT DATA

           Everything is already uploaded to Cloudinary.
           Therefore we send JSON directly.
        ================================================= */

        const projectData = {
          projectName: values.projectName,

          description: values.description,

          techStack: values.techStack,

          githubLink: values.githubLink,

          liveDemoLink: values.liveDemoLink,

          projectType: values.projectType,

          teamMembers: values.projectType === "team" ? values.teamMembers : [],

          semester: values.semester,

          mentor: values.mentor || null,

          studentId,

          /* =================================================
             NEW CLOUDINARY FILES
          ================================================= */

          projectImages: values.projectImages || [],

          presentationFile: values.presentationFile || null,

          synopsisFile: values.synopsisFile || null,

          reportFile: values.reportFile || null,

          /* =================================================
             EXISTING FILES

             Important for EDIT mode.
          ================================================= */

          existingProjectImages: values.existingProjectImages || [],

          existingSynopsisFile: values.existingSynopsisFile || null,

          existingReportFile: values.existingReportFile || null,

          existingPresentationFile: values.existingPresentationFile || null,
        };

        console.log("PROJECT DATA:", projectData);

        /* =================================================
           API
        ================================================= */

        const url = isEdit ? `/api/projects/${project._id}` : "/api/projects";

        const method = isEdit ? "PUT" : "POST";

        console.log("PROJECT SAVE:", {
          mode: isEdit ? "UPDATE" : "CREATE",
          method,
          url,
        });

        /* =================================================
           SEND JSON
        ================================================= */

        const response = await fetch(url, {
          method,

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(projectData),
        });

        const result = await response.json();

        /* =================================================
           AUTH ERROR
        ================================================= */

        if (response.status === 401) {
          toast.error("You are not authenticated. Please log in again.");

          router.push("/login");

          return;
        }

        /* =================================================
           API ERROR
        ================================================= */

        if (!response.ok) {
          throw new Error(result.message || "Failed to save project");
        }

        /* =================================================
           SUCCESS
        ================================================= */

        toast.success(
          isEdit
            ? "Project updated successfully."
            : "Project submitted for approval successfully.",
        );

        if (isEdit) {
          router.push(`/student/projects/${project._id}`);
        } else {
          router.push("/student");
        }
      } catch (error) {
        console.error("PROJECT_SAVE_ERROR:", error);

        toast.error(error.message || "Something went wrong.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* =======================================================
     TECH STACK
  ======================================================= */

  const addTechnology = () => {
    const technology = window.prompt("Enter technology");

    if (technology && technology.trim()) {
      const cleanTechnology = technology.trim();

      if (!formik.values.techStack.includes(cleanTechnology)) {
        formik.setFieldValue("techStack", [
          ...formik.values.techStack,
          cleanTechnology,
        ]);
      }
    }
  };

  const removeTechnology = (technology) => {
    formik.setFieldValue(
      "techStack",
      formik.values.techStack.filter((item) => item !== technology),
    );
  };

  /* =======================================================
     TEAM MEMBERS
  ======================================================= */

  const addTeamMember = () => {
    formik.setFieldValue("teamMembers", [
      ...formik.values.teamMembers,
      { ...emptyTeamMember },
    ]);
  };

  const removeTeamMember = (index) => {
    const updatedMembers = formik.values.teamMembers.filter(
      (_, memberIndex) => memberIndex !== index,
    );

    formik.setFieldValue("teamMembers", updatedMembers);
  };

  const getTeamError = (index, field) => {
    const touched = formik.touched.teamMembers?.[index]?.[field];

    const error = formik.errors.teamMembers?.[index]?.[field];

    if (touched && error) {
      return error;
    }

    return null;
  };

  /* =======================================================
     FILE ERRORS
  ======================================================= */

  const getFileError = (field) => {
    return formik.touched[field] ? formik.errors[field] : null;
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    formik,

    isEdit,

    addTechnology,

    removeTechnology,

    addTeamMember,

    removeTeamMember,

    getTeamError,

    getFileError,
  };
}
