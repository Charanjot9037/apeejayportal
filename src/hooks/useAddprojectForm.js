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

mentor: isEdit
  ? project?.mentor?._id || project?.mentor || ""
  : "",
      projectType: isEdit ? project?.projectType || "individual" : "individual",

      techStack:
        isEdit && Array.isArray(project?.techStack) ? project.techStack : [""],

teamMembers: isEdit
  ? project?.teamMembers?._id || project?.teamMembers || ""
  : "",
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
      projectImages:
        isEdit && Array.isArray(project?.projectImages)
          ? project.projectImages
          : [],

      presentationFile:
        isEdit && project?.presentationFile ? project.presentationFile : null,

      synopsisFile:
        isEdit && project?.synopsisFile ? project.synopsisFile : null,

      reportFile: isEdit && project?.reportFile ? project.reportFile : null,
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

          projectImages: values.projectImages || [],

          presentationFile: values.presentationFile || null,

          synopsisFile: values.synopsisFile || null,

          reportFile: values.reportFile || null,
        };

        console.log("PROJECT DATA:", projectData);

        /* =================================================
           API
        ================================================= */

const projectId = project?._id || project?.id;
if (isEdit && !projectId) {
  toast.error("Project ID is missing.");
  return;
}
const url = isEdit
  ? `/api/projects/${projectId}`
  : "/api/projects";
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



    getFileError,
  };
}
