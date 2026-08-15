import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { toast } from "sonner";

import { emptyTeamMember } from "@/constants/AddProjectConstant";
import { validationSchema } from "@/validations/AddProjectSchema";

/* =========================================================
   useAddProjectForm

   Owns all formik state, the submit handler, and every
   field-level handler used by AddProjectForm and its
   section components.
========================================================= */

export function useAddProjectForm({ mode = "create", project = null }) {
  const router = useRouter();

  const auth = useSelector((state) => state.auth);

  const isEdit = mode === "edit";

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      projectName: isEdit ? project?.title || "" : "",

      description: isEdit ? project?.description || "" : "",

      githubLink: isEdit ? project?.githubLink || "" : "",

      liveDemoLink: isEdit ? project?.liveLink || "" : "",

      semester: isEdit ? project?.semester || "" : "",

      mentor: isEdit ? project?.mentor || "" : "",

      projectType: isEdit ? project?.projectType || "individual" : "individual",

      techStack:
        isEdit && Array.isArray(project?.techStack)
          ? project.techStack
          : ["React", "Node.js", "MongoDB"],

      teamMembers:
        isEdit &&
        Array.isArray(project?.teamMembers) &&
        project.teamMembers.length > 0
          ? project.teamMembers
          : [{ ...emptyTeamMember }],

      /*
       * NEW FILES
       *
       * Existing Cloudinary files are NOT placed
       * inside these arrays.
       *
       * They remain inside project.projectImages,
       * project.presentationFile, etc.
       */

      projectImages: [],

      presentationFile: null,

      synopsisFile: null,

      reportFile: null,

      existingProjectImages:
        isEdit && Array.isArray(project?.projectImages)
          ? project.projectImages
          : [],

      existingSynopsisFile: isEdit ? project?.synopsisFile || null : null,

      existingReportFile: isEdit ? project?.reportFile || null : null,

      existingPresentationFile: isEdit ? project?.presentationFile || null : null,
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const studentId = auth?.user?._id || auth?.user?.id;

        if (!studentId) {
          toast.error("Student information not found.");
          return;
        }

        const formData = new FormData();

        formData.append(
          "projectData",
          JSON.stringify({
            projectName: values.projectName,
            description: values.description,
            techStack: values.techStack,
            githubLink: values.githubLink,
            liveDemoLink: values.liveDemoLink,
            projectType: values.projectType,
            teamMembers:
              values.projectType === "team" ? values.teamMembers : [],
            semester: values.semester,
            mentor: values.mentor,
            studentId,
            existingProjectImages: values.existingProjectImages || [],
            existingSynopsisFile: values.existingSynopsisFile || null,
            existingReportFile: values.existingReportFile || null,
            existingPresentationFile: values.existingPresentationFile || null,
          })
        );

        if (values.projectImages && values.projectImages.length > 0) {
          values.projectImages.forEach((file) => {
            formData.append("projectImages", file);
          });
        }

        if (values.presentationFile) {
          formData.append("presentationFile", values.presentationFile);
        }

        if (values.synopsisFile) {
          formData.append("synopsisFile", values.synopsisFile);
        }

        if (values.reportFile) {
          formData.append("reportFile", values.reportFile);
        }

        const url = isEdit ? `/api/projects/${project._id}` : "/api/projects";

        const method = isEdit ? "PUT" : "POST";

        console.log("PROJECT SAVE:", {
          mode: isEdit ? "UPDATE" : "CREATE",
          method,
          url,
        });

        const response = await fetch(url, {
          method,
          body: formData,
        });

        const result = await response.json();

        if (response.status === 401) {
          toast.error("You are not authenticated. Please log in again.");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(result.message || "Failed to save project");
        }

        toast.success(
          isEdit
            ? "Project updated successfully."
            : "Project submitted for approval successfully."
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
      formik.values.techStack.filter((item) => item !== technology)
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
      (_, memberIndex) => memberIndex !== index
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
     FILES
  ======================================================= */

  const getFileError = (field) => {
    return formik.touched[field] ? formik.errors[field] : null;
  };

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