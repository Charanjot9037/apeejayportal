"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  ArrowLeft,
  Link as LinkIcon,
  Code2,
  Upload,
  X,
  ImagePlus,
  Eye,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PRESENTATION_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_SYNOPSIS_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_REPORT_SIZE = 20 * 1024 * 1024; // 20MB

const MAX_PROJECT_IMAGES = 6;

const emptyTeamMember = {
  name: "",
  enrollment: "",
  email: "",
  role: "",
};

/* =========================================================
   HELPERS
========================================================= */

const isEmptyFile = (file) => {
  return !file || typeof file !== "object";
};

/* =========================================================
   YUP SCHEMA
========================================================= */

const validationSchema = Yup.object({
  projectName: Yup.string()
    .trim()
    .min(
      3,
      "Project name must be at least 3 characters"
    )
    .max(
      100,
      "Project name must not exceed 100 characters"
    )
    .required("Project name is required"),

  description: Yup.string()
    .trim()
    .min(
      20,
      "Description must be at least 20 characters"
    )
    .max(
      2000,
      "Description must not exceed 2000 characters"
    )
    .required("Description is required"),

  githubLink: Yup.string()
    .transform((value) =>
      value === "" ? null : value
    )
    .nullable()
    .url("Enter a valid GitHub URL"),

  liveDemoLink: Yup.string()
    .transform((value) =>
      value === "" ? null : value
    )
    .nullable()
    .url("Enter a valid URL"),

  semester: Yup.string()
    .required("Please select a semester"),

  mentor: Yup.string()
    .nullable(),

  projectType: Yup.string()
    .oneOf(
      ["individual", "team"],
      "Invalid project type"
    )
    .required("Project type is required"),

  techStack: Yup.array()
    .of(Yup.string().trim())
    .min(
      1,
      "Add at least one technology"
    )
    .required("Tech stack is required"),

  teamMembers: Yup.array().when(
    "projectType",
    {
      is: "team",

      then: (schema) =>
        schema
          .min(
            1,
            "Add at least one team member"
          )
          .of(
            Yup.object({
              name: Yup.string()
                .trim()
                .required(
                  "Member name is required"
                ),

              enrollment: Yup.string()
                .trim()
                .required(
                  "Enrollment / Student ID is required"
                ),

              email: Yup.string()
                .transform((value) =>
                  value === "" ? null : value
                )
                .nullable()
                .email(
                  "Enter a valid email"
                ),

              role: Yup.string()
                .trim()
                .nullable(),
            })
          ),

      otherwise: (schema) =>
        schema,
    }
  ),

  projectImages: Yup.array()
    .test(
      "max-images",
      `Maximum ${MAX_PROJECT_IMAGES} images are allowed`,
      (files) => {
        if (!files) return true;

        return files.length <= MAX_PROJECT_IMAGES;
      }
    )
    .test(
      "image-types",
      "Only JPG, JPEG, PNG and WEBP images are allowed",
      (files) => {
        if (!files || files.length === 0) {
          return true;
        }

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
        ];

        return files.every((file) => {
          if (!file?.type) return false;

          return allowedTypes.includes(
            file.type
          );
        });
      }
    )
    .test(
      "image-size",
      "Each project image must be smaller than 5MB",
      (files) => {
        if (!files || files.length === 0) {
          return true;
        }

        return files.every(
          (file) =>
            file.size <= MAX_IMAGE_SIZE
        );
      }
    ),

  presentationFile: Yup.mixed()
    .nullable()
    .test(
      "presentation-type",
      "Only PPT and PPTX files are allowed",
      (file) => {
        if (isEmptyFile(file)) {
          return true;
        }

        const fileName =
          file.name?.toLowerCase() || "";

        return (
          file.type ===
            "application/vnd.ms-powerpoint" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
          fileName.endsWith(".ppt") ||
          fileName.endsWith(".pptx")
        );
      }
    )
    .test(
      "presentation-size",
      "Presentation must be smaller than 10MB",
      (file) => {
        if (isEmptyFile(file)) {
          return true;
        }

        return (
          file.size <=
          MAX_PRESENTATION_SIZE
        );
      }
    ),

  synopsisFile: Yup.mixed()
    .nullable()
    .test(
      "synopsis-type",
      "Only PDF files are allowed",
      (file) => {
        if (isEmptyFile(file)) {
          return true;
        }

        return (
          file.type ===
            "application/pdf" ||
          file.name
            ?.toLowerCase()
            .endsWith(".pdf")
        );
      }
    )
    .test(
      "synopsis-size",
      "Synopsis must be smaller than 5MB",
      (file) => {
        if (isEmptyFile(file)) {
          return true;
        }

        return (
          file.size <=
          MAX_SYNOPSIS_SIZE
        );
      }
    ),

  reportFile: Yup.mixed()
    .nullable()
    .test(
      "report-type",
      "Only PDF files are allowed",
      (file) => {
        if (isEmptyFile(file)) {
          return true;
        }

        return (
          file.type ===
            "application/pdf" ||
          file.name
            ?.toLowerCase()
            .endsWith(".pdf")
        );
      }
    )
    .test(
      "report-size",
      "Final report must be smaller than 20MB",
      (file) => {
        if (isEmptyFile(file)) {
          return true;
        }

        return (
          file.size <=
          MAX_REPORT_SIZE
        );
      }
    ),
});

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AddProjectForm({
  mode = "create",
  project = null,
}) {
  const router = useRouter();

  const auth = useSelector(
    (state) => state.auth
  );

  const isEdit = mode === "edit";

  /* =======================================================
     FORMIK
  ======================================================= */

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      projectName:
        isEdit
          ? project?.title || ""
          : "",

      description:
        isEdit
          ? project?.description || ""
          : "",

      githubLink:
        isEdit
          ? project?.githubLink || ""
          : "",

      liveDemoLink:
        isEdit
          ? project?.liveLink || ""
          : "",

      semester:
        isEdit
          ? project?.semester || ""
          : "",

      mentor:
        isEdit
          ? project?.mentor || ""
          : "",

      projectType:
        isEdit
          ? project?.projectType ||
            "individual"
          : "individual",

      techStack:
        isEdit &&
        Array.isArray(
          project?.techStack
        )
          ? project.techStack
          : [
              "React",
              "Node.js",
              "MongoDB",
            ],

      teamMembers:
        isEdit &&
        Array.isArray(
          project?.teamMembers
        ) &&
        project.teamMembers.length > 0
          ? project.teamMembers
          : [
              {
                ...emptyTeamMember,
              },
            ],

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
  isEdit &&
  Array.isArray(project?.projectImages)
    ? project.projectImages
    : [],

existingSynopsisFile:
  isEdit
    ? project?.synopsisFile || null
    : null,

existingReportFile:
  isEdit
    ? project?.reportFile || null
    : null,

existingPresentationFile:
  isEdit
    ? project?.presentationFile || null
    : null,
    },

    validationSchema,

    /* =====================================================
       SUBMIT
    ===================================================== */

    onSubmit: async (
      values,
      { setSubmitting }
    ) => {
      try {
        const studentId =
          auth?.user?._id ||
          auth?.user?.id;

        if (!studentId) {
          alert(
            "Student information not found."
          );

          return;
        }

        /* ================================================
           CREATE FORMDATA
        ================================================ */

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
      values.projectType === "team"
        ? values.teamMembers
        : [],
    semester: values.semester,
    mentor: values.mentor,
    studentId,
    existingProjectImages:
        values.existingProjectImages || [],
    existingSynopsisFile:
        values.existingSynopsisFile || null,
    existingReportFile:
        values.existingReportFile || null,
    existingPresentationFile:
        values.existingPresentationFile || null,
  })
);

    if (
      values.projectImages &&
      values.projectImages.length > 0
    ) {
      values.projectImages.forEach(
        (file) => {
          formData.append(
            "projectImages",
            file
          );
        }
      );
    }
 if (values.presentationFile) {
      formData.append(
        "presentationFile",
        values.presentationFile
      );
    }

if (values.synopsisFile) {
  formData.append(
    "synopsisFile",
    values.synopsisFile
  );
}

   if (values.reportFile) {
      formData.append(
        "reportFile",
        values.reportFile
      );
    }
     /* ================================================
       CREATE OR UPDATE
    ================================================ */

        const url = isEdit
      ? `/api/projects/${project._id}`
      : "/api/projects";

    const method = isEdit
      ? "PUT"
      : "POST";

    console.log(
      "PROJECT SAVE:",
      {
        mode: isEdit
          ? "UPDATE"
          : "CREATE",
        method,
        url,
      }
    );


    const response = await fetch(
      url,
      {
        method,
        body: formData,
      }
    );

        const result =
          await response.json();

        if (response.status === 401) {//need to be 
        alert("no authenticated");
      router.push("/login");
        return;
      }
      if (!response.ok) {
        throw new Error(result.message || "Failed to save project");
      }


        /* ================================================
           SUCCESS
        ================================================ */

        alert(
          isEdit
            ? "Project updated successfully."
            : "Project submitted for approval successfully."
        );

        if (isEdit) {
          router.push(
            `/student/projects/${project._id}`
          );
        } else {
          router.push(
            "/student"
          );
        }
      } catch (error) {
        console.error(
          "PROJECT_SAVE_ERROR:",
          error
        );

        alert(
          error.message ||
            "Something went wrong."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* =======================================================
     PROJECT IMAGES
  ======================================================= */

  const handleProjectImages = (
    event
  ) => {
    const files = Array.from(
      event.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    const currentImages =
      formik.values.projectImages ||
      [];

    const combinedImages = [
      ...currentImages,
      ...files,
    ];

    /*
     * Remove duplicate files.
     */

    const uniqueImages =
      combinedImages.filter(
        (file, index, array) => {
          return (
            index ===
            array.findIndex(
              (item) =>
                item.name ===
                  file.name &&
                item.size ===
                  file.size &&
                item.lastModified ===
                  file.lastModified
            )
          );
        }
      );

    /*
     * Limit images.
     */

    const limitedImages =
      uniqueImages.slice(
        0,
        MAX_PROJECT_IMAGES
      );

    formik.setFieldValue(
      "projectImages",
      limitedImages
    );

    formik.setFieldTouched(
      "projectImages",
      true,
      false
    );

    /*
     * Clear input so same image can
     * be selected again later.
     */

    event.target.value = "";
  };

  /* =======================================================
     REMOVE PROJECT IMAGE
  ======================================================= */

  const removeProjectImage = (
    index
  ) => {
    const updatedImages =
      formik.values.projectImages.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );

    formik.setFieldValue(
      "projectImages",
      updatedImages
    );
  };

  /* =======================================================
     ADD TECHNOLOGY
  ======================================================= */

  const addTechnology = () => {
    const technology =
      window.prompt(
        "Enter technology"
      );

    if (
      technology &&
      technology.trim()
    ) {
      const cleanTechnology =
        technology.trim();

      if (
        !formik.values.techStack.includes(
          cleanTechnology
        )
      ) {
        formik.setFieldValue(
          "techStack",
          [
            ...formik.values
              .techStack,
            cleanTechnology,
          ]
        );
      }
    }
  };

  /* =======================================================
     REMOVE TECHNOLOGY
  ======================================================= */

  const removeTechnology = (
    technology
  ) => {
    formik.setFieldValue(
      "techStack",
      formik.values.techStack.filter(
        (item) =>
          item !== technology
      )
    );
  };

  /* =======================================================
     TEAM MEMBER
  ======================================================= */

  const addTeamMember = () => {
    formik.setFieldValue(
      "teamMembers",
      [
        ...formik.values
          .teamMembers,

        {
          ...emptyTeamMember,
        },
      ]
    );
  };

  const removeTeamMember = (
    index
  ) => {
    const updatedMembers =
      formik.values.teamMembers.filter(
        (_, memberIndex) =>
          memberIndex !== index
      );

    formik.setFieldValue(
      "teamMembers",
      updatedMembers
    );
  };

  /* =======================================================
     TEAM MEMBER ERROR
  ======================================================= */

  const getTeamError = (
    index,
    field
  ) => {
    const touched =
      formik.touched.teamMembers?.[
        index
      ]?.[field];

    const error =
      formik.errors.teamMembers?.[
        index
      ]?.[field];

    if (touched && error) {
      return error;
    }

    return null;
  };

  /* =======================================================
     FILE ERROR
  ======================================================= */

  const getFileError = (
    field
  ) => {
    return formik.touched[field]
      ? formik.errors[field]
      : null;
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#faf9f8] px-4 py-8">
      <div className="mx-auto max-w-5xl">

        {/* =================================================
            BACK
        ================================================= */}

        <Link
          href="/student"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-900"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Dashboard
        </Link>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-blue-900">
            {isEdit
              ? "Update Project"
              : "Add Project"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {isEdit
              ? "Update your project details and submit the changes for review."
              : "Submit your project details for academic review or portfolio showcase."}
          </p>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={
            formik.handleSubmit
          }
          noValidate
          className="rounded-md border border-slate-300 bg-white p-5 shadow-sm"
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section>
            <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
              <span className="border-b-2 border-orange-500 pb-2">
                Basic Information
              </span>
            </h2>

            <div className="mt-4 space-y-4">

              {/* PROJECT NAME */}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Project Name{" "}
                  <span className="text-orange-500">
                    *
                  </span>
                </label>

                <Input
                  name="projectName"
                  value={
                    formik.values
                      .projectName
                  }
                  onChange={
                    formik.handleChange
                  }
                  onBlur={
                    formik.handleBlur
                  }
                  placeholder="Enter project title"
                  className={`h-10 bg-slate-50 text-sm ${
                    formik.touched
                      .projectName &&
                    formik.errors
                      .projectName
                      ? "border-red-500"
                      : ""
                  }`}
                />

                {formik.touched
                  .projectName &&
                  formik.errors
                    .projectName && (
                    <p className="mt-1 text-xs text-red-500">
                      {
                        formik.errors
                          .projectName
                      }
                    </p>
                  )}
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Description{" "}
                  <span className="text-orange-500">
                    *
                  </span>
                </label>

                <Textarea
                  name="description"
                  value={
                    formik.values
                      .description
                  }
                  onChange={
                    formik.handleChange
                  }
                  onBlur={
                    formik.handleBlur
                  }
                  placeholder="Provide a detailed overview of your project, its objectives, and outcomes."
                  className={`min-h-[100px] resize-none bg-slate-50 text-sm ${
                    formik.touched
                      .description &&
                    formik.errors
                      .description
                      ? "border-red-500"
                      : ""
                  }`}
                />

                {formik.touched
                  .description &&
                  formik.errors
                    .description && (
                    <p className="mt-1 text-xs text-red-500">
                      {
                        formik.errors
                          .description
                      }
                    </p>
                  )}
              </div>
            </div>
          </section>

          {/* =================================================
              TECHNICAL DETAILS
          ================================================= */}

          <section className="mt-6">
            <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
              <span className="border-b-2 border-orange-500 pb-2">
                Technical Details
              </span>
            </h2>

            {/* TECH STACK */}

            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium text-slate-700">
                Tech Stack{" "}
                <span className="text-orange-500">
                  *
                </span>
              </label>

              <div className="flex flex-wrap items-center gap-2">

                {formik.values.techStack.map(
                  (tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-orange-50 px-3 py-1 text-xs text-slate-600"
                    >
                      {tech}

                      <button
                        type="button"
                        onClick={() =>
                          removeTechnology(
                            tech
                          )
                        }
                        className="ml-1 text-slate-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  )
                )}

                <button
                  type="button"
                  onClick={
                    addTechnology
                  }
                  className="text-xs text-slate-400 hover:text-orange-500"
                >
                  + Add tech...
                </button>
              </div>

              {formik.touched
                .techStack &&
                formik.errors
                  .techStack && (
                  <p className="mt-1 text-xs text-red-500">
                    {
                      formik.errors
                        .techStack
                    }
                  </p>
                )}
            </div>

            {/* LINKS */}

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* GITHUB */}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  GitHub Link
                </label>

                <div className="relative">
                  <Code2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    name="githubLink"
                    value={
                      formik.values
                        .githubLink
                    }
                    onChange={
                      formik.handleChange
                    }
                    onBlur={
                      formik.handleBlur
                    }
                    placeholder="https://github.com/..."
                    className="h-10 bg-slate-50 pl-9 text-sm"
                  />
                </div>

                {formik.touched
                  .githubLink &&
                  formik.errors
                    .githubLink && (
                    <p className="mt-1 text-xs text-red-500">
                      {
                        formik.errors
                          .githubLink
                      }
                    </p>
                  )}
              </div>

              {/* LIVE DEMO */}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Live Demo Link
                </label>

                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    name="liveDemoLink"
                    value={
                      formik.values
                        .liveDemoLink
                    }
                    onChange={
                      formik.handleChange
                    }
                    onBlur={
                      formik.handleBlur
                    }
                    placeholder="https://..."
                    className="h-10 bg-slate-50 pl-9 text-sm"
                  />
                </div>

                {formik.touched
                  .liveDemoLink &&
                  formik.errors
                    .liveDemoLink && (
                    <p className="mt-1 text-xs text-red-500">
                      {
                        formik.errors
                          .liveDemoLink
                      }
                    </p>
                  )}
              </div>
            </div>
          </section>

          {/* =================================================
              COLLABORATION
          ================================================= */}

          <section className="mt-6">
            <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
              <span className="border-b-2 border-orange-500 pb-2">
                Collaboration
              </span>
            </h2>

            {/* PROJECT TYPE */}

            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium text-slate-700">
                Project Type
              </label>

              <div className="flex gap-5">

                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input
                    type="radio"
                    name="projectType"
                    value="individual"
                    checked={
                      formik.values
                        .projectType ===
                      "individual"
                    }
                    onChange={
                      formik.handleChange
                    }
                    className="accent-orange-500"
                  />

                  Individual
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input
                    type="radio"
                    name="projectType"
                    value="team"
                    checked={
                      formik.values
                        .projectType ===
                      "team"
                    }
                    onChange={
                      formik.handleChange
                    }
                    className="accent-orange-500"
                  />

                  Team
                </label>
              </div>
            </div>

            {/* =================================================
                TEAM MEMBERS
            ================================================= */}

            {formik.values
              .projectType ===
              "team" && (
              <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">

                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900">
                      Team Members
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Add the students who are working on this project.
                    </p>
                  </div>

                  <span className="text-xs text-slate-400">
                    {
                      formik.values
                        .teamMembers
                        .length
                    }{" "}
                    {formik.values
                      .teamMembers
                      .length === 1
                      ? "Member"
                      : "Members"}
                  </span>
                </div>

                <div className="space-y-4">

                  {formik.values.teamMembers.map(
                    (
                      member,
                      index
                    ) => (
                      <div
                        key={index}
                        className="rounded-md border border-slate-200 bg-white p-4"
                      >

                        <div className="mb-4 flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-slate-700">
                            Team Member{" "}
                            {index + 1}
                          </h4>

                          {formik
                            .values
                            .teamMembers
                            .length >
                            1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeTeamMember(
                                  index
                                )
                              }
                              className="text-xs text-red-500 hover:text-red-600"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                          {/* NAME */}

                          <TeamInput
                            label="Member Name"
                            required
                            value={
                              member.name
                            }
                            placeholder="Enter member name"
                            error={getTeamError(
                              index,
                              "name"
                            )}
                            onChange={(
                              value
                            ) =>
                              formik.setFieldValue(
                                `teamMembers[${index}].name`,
                                value
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched(
                                `teamMembers[${index}].name`,
                                true
                              )
                            }
                          />

                          {/* ENROLLMENT */}

                          <TeamInput
                            label="Enrollment / Student ID"
                            required
                            value={
                              member.enrollment
                            }
                            placeholder="Enter enrollment number"
                            error={getTeamError(
                              index,
                              "enrollment"
                            )}
                            onChange={(
                              value
                            ) =>
                              formik.setFieldValue(
                                `teamMembers[${index}].enrollment`,
                                value
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched(
                                `teamMembers[${index}].enrollment`,
                                true
                              )
                            }
                          />

                          {/* EMAIL */}

                          <TeamInput
                            label="Email"
                            type="email"
                            value={
                              member.email
                            }
                            placeholder="member@example.com"
                            error={getTeamError(
                              index,
                              "email"
                            )}
                            onChange={(
                              value
                            ) =>
                              formik.setFieldValue(
                                `teamMembers[${index}].email`,
                                value
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched(
                                `teamMembers[${index}].email`,
                                true
                              )
                            }
                          />

                          {/* ROLE */}

                          <TeamInput
                            label="Role / Contribution"
                            value={
                              member.role
                            }
                            placeholder="e.g. Frontend Developer"
                            onChange={(
                              value
                            ) =>
                              formik.setFieldValue(
                                `teamMembers[${index}].role`,
                                value
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched(
                                `teamMembers[${index}].role`,
                                true
                              )
                            }
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={
                    addTeamMember
                  }
                  className="mt-4 flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
                >
                  <span className="text-lg leading-none">
                    +
                  </span>

                  Add Team Member
                </button>
              </div>
            )}

            {/* SEMESTER / MENTOR */}

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* SEMESTER */}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Semester{" "}
                  <span className="text-orange-500">
                    *
                  </span>
                </label>

                <Select
                  value={
                    formik.values
                      .semester
                  }
                  onValueChange={(
                    value
                  ) => {
                    formik.setFieldValue(
                      "semester",
                      value
                    );

                    formik.setFieldTouched(
                      "semester",
                      true,
                      false
                    );
                  }}
                >
                  <SelectTrigger className="h-10 bg-slate-50 text-sm">
                    <SelectValue placeholder="Select semester..." />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="1">
                      Semester 1
                    </SelectItem>

                    <SelectItem value="2">
                      Semester 2
                    </SelectItem>

                    <SelectItem value="3">
                      Semester 3
                    </SelectItem>

                    <SelectItem value="4">
                      Semester 4
                    </SelectItem>

                    <SelectItem value="5">
                      Semester 5
                    </SelectItem>

                    <SelectItem value="6">
                      Semester 6
                    </SelectItem>

                    <SelectItem value="7">
                      Semester 7
                    </SelectItem>

                    <SelectItem value="8">
                      Semester 8
                    </SelectItem>
                  </SelectContent>
                </Select>

                {formik.touched
                  .semester &&
                  formik.errors
                    .semester && (
                    <p className="mt-1 text-xs text-red-500">
                      {
                        formik.errors
                          .semester
                      }
                    </p>
                  )}
              </div>

              {/* MENTOR */}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Assigned Mentor{" "}
                  <span className="text-slate-400">
                    (Optional)
                  </span>
                </label>

                <Select
                  value={
                    formik.values
                      .mentor
                  }
                  onValueChange={(
                    value
                  ) => {
                    formik.setFieldValue(
                      "mentor",
                      value
                    );
                  }}
                >
                  <SelectTrigger className="h-10 bg-slate-50 text-sm">
                    <SelectValue placeholder="Select a faculty mentor..." />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="mentor1">
                      Dr. Faculty Mentor 1
                    </SelectItem>

                    <SelectItem value="mentor2">
                      Dr. Faculty Mentor 2
                    </SelectItem>

                    <SelectItem value="mentor3">
                      Prof. Faculty Mentor 3
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* =================================================
              PROJECT IMAGES
          ================================================= */}

          <section className="mt-6">
            <h2 className="border-b border-slate-300 pb-2 text-base font-medium text-blue-900">
              <span className="border-b-2 border-orange-500 pb-2">
                Project Images
              </span>
            </h2>

            <div className="mt-4">
              <p className="mb-3 text-xs text-slate-500">
                Upload screenshots or images of your project.
                You can keep existing images, remove them, or add new ones.
                Maximum {MAX_PROJECT_IMAGES} images in total.
              </p>

              {/* EXISTING CLOUDINARY IMAGES */}
              {isEdit &&
                formik.values.existingProjectImages?.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium text-slate-700">
                      Existing Project Images
                    </p>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {formik.values.existingProjectImages.map(
                        (image, index) => {
                          const imageUrl =
                            typeof image === "string"
                              ? image
                              : image?.url;

                          const imageName =
                            typeof image === "string"
                              ? `Project image ${index + 1}`
                              : image?.originalName ||
                                `Project image ${index + 1}`;

                          if (!imageUrl) return null;

                          return (
                            <div
                              key={
                                image?.publicId ||
                                imageUrl ||
                                index
                              }
                              className="group relative overflow-hidden rounded-md border border-slate-200 bg-slate-100"
                            >
                              <img
                                src={imageUrl}
                                alt={imageName}
                                className="h-32 w-full object-cover"
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  const updatedImages =
                                    formik.values.existingProjectImages.filter(
                                      (_, i) => i !== index
                                    );

                                  formik.setFieldValue(
                                    "existingProjectImages",
                                    updatedImages
                                  );
                                }}
                                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                                title="Remove existing image"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>

                              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 bg-black/60 px-2 py-1">
                                <span className="truncate text-[10px] text-white">
                                  {imageName}
                                </span>

                                <a
                                  href={imageUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="shrink-0 text-white hover:text-orange-300"
                                  title="View image"
                                >
                                  <Eye className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

              {/* NEW IMAGE UPLOAD */}
              <label className="flex min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 hover:border-orange-400 hover:bg-orange-50">
                <ImagePlus className="mb-2 h-6 w-6 text-orange-500" />

                <span className="text-xs font-medium text-slate-700">
                  Add Project Images
                </span>

                <span className="mt-1 text-[10px] text-slate-400">
                  JPG, PNG, WEBP • Max 5MB each
                </span>

                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    const files = Array.from(
                      event.target.files || []
                    );

                    const existingCount =
                      formik.values.existingProjectImages?.length || 0;

                    const currentNewImages =
                      formik.values.projectImages || [];

                    const remainingSlots = Math.max(
                      0,
                      MAX_PROJECT_IMAGES - existingCount
                    );

                    const combinedImages = [
                      ...currentNewImages,
                      ...files,
                    ];

                    const uniqueImages = combinedImages.filter(
                      (file, index, array) =>
                        index ===
                        array.findIndex(
                          (item) =>
                            item.name === file.name &&
                            item.size === file.size &&
                            item.lastModified === file.lastModified
                        )
                    );

                    formik.setFieldValue(
                      "projectImages",
                      uniqueImages.slice(0, remainingSlots)
                    );

                    formik.setFieldTouched(
                      "projectImages",
                      true,
                      false
                    );

                    event.target.value = "";
                  }}
                />
              </label>

              {/* NEW IMAGE PREVIEWS */}
              {formik.values.projectImages.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-slate-700">
                    New Images
                  </p>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {formik.values.projectImages.map(
                      (file, index) => (
                        <ProjectImagePreview
                          key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                          file={file}
                          onRemove={() => {
                            const updated =
                              formik.values.projectImages.filter(
                                (_, i) => i !== index
                              );

                            formik.setFieldValue(
                              "projectImages",
                              updated
                            );
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {formik.touched.projectImages &&
                formik.errors.projectImages && (
                  <p className="mt-2 text-xs text-red-500">
                    {formik.errors.projectImages}
                  </p>
                )}
            </div>
          </section>

          {/* =================================================
              MEDIA & DOCUMENTS
          ================================================= */}

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
                existingFile={
                  formik.values.existingPresentationFile
                }
                error={getFileError("presentationFile")}
                onChange={(file) => {
                  formik.setFieldValue(
                    "presentationFile",
                    file
                  );

                  formik.setFieldTouched(
                    "presentationFile",
                    true,
                    false
                  );
                }}
                onRemove={() => {
                  formik.setFieldValue(
                    "presentationFile",
                    null
                  );
                }}
                onRemoveExisting={() => {
                  formik.setFieldValue(
                    "existingPresentationFile",
                    null
                  );
                }}
              />

              {/* SYNOPSIS */}
              <DocumentUpload
                title="Project Synopsis"
                description="PDF • Max 5MB"
                accept=".pdf"
                file={formik.values.synopsisFile}
                existingFile={
                  formik.values.existingSynopsisFile
                }
                error={getFileError("synopsisFile")}
                onChange={(file) => {
                  formik.setFieldValue(
                    "synopsisFile",
                    file
                  );

                  formik.setFieldTouched(
                    "synopsisFile",
                    true,
                    false
                  );
                }}
                onRemove={() => {
                  formik.setFieldValue(
                    "synopsisFile",
                    null
                  );
                }}
                onRemoveExisting={() => {
                  formik.setFieldValue(
                    "existingSynopsisFile",
                    null
                  );
                }}
              />

              {/* REPORT */}
              <DocumentUpload
                title="Final Project Report"
                description="PDF • Max 20MB"
                accept=".pdf"
                file={formik.values.reportFile}
                existingFile={
                  formik.values.existingReportFile
                }
                error={getFileError("reportFile")}
                onChange={(file) => {
                  formik.setFieldValue(
                    "reportFile",
                    file
                  );

                  formik.setFieldTouched(
                    "reportFile",
                    true,
                    false
                  );
                }}
                onRemove={() => {
                  formik.setFieldValue(
                    "reportFile",
                    null
                  );
                }}
                onRemoveExisting={() => {
                  formik.setFieldValue(
                    "existingReportFile",
                    null
                  );
                }}
              />
            </div>
          </section>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="mt-7 flex justify-end gap-3 border-t border-slate-200 pt-4">

            <Link href="/student">
              <Button
                type="button"
                variant="outline"
                className="border-slate-400"
              >
                Cancel
              </Button>
            </Link>

            <Button
              type="button"
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
              onClick={() => {
                console.log(
                  "Save draft",
                  formik.values
                );
              }}
            >
              Save Draft
            </Button>

            <Button
              type="submit"
              disabled={
                formik.isSubmitting
              }
              className="bg-orange-500 text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting
                ? "Uploading..."
                : isEdit
                  ? "Save Changes"
                  : "Send for Approval"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   TEAM INPUT
========================================================= */

function TeamInput({
  label,
  required = false,
  type = "text",
  value,
  placeholder,
  error,
  onChange,
  onBlur,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}

        {required && (
          <span className="text-orange-500">
            {" "}
            *
          </span>
        )}
      </label>

      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        onBlur={onBlur}
        className={`h-10 bg-white text-sm ${
          error
            ? "border-red-500"
            : ""
        }`}
      />

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   PROJECT IMAGE PREVIEW
========================================================= */

function ProjectImagePreview({
  file,
  onRemove,
}) {
  const imageUrl =
    URL.createObjectURL(file);

  return (
    <div className="group relative min-h-[130px] overflow-hidden rounded-md border border-slate-200 bg-slate-100">

      <img
        src={imageUrl}
        alt={file.name}
        className="h-[130px] w-full object-cover"
        onLoad={() =>
          URL.revokeObjectURL(
            imageUrl
          )
        }
      />

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-2 py-1 text-[10px] text-white">
        {file.name}
      </div>
    </div>
  );
}

/* =========================================================
   DOCUMENT UPLOAD
========================================================= */

function DocumentUpload({
  title,
  description,
  accept,
  file,
  existingFile,
  error,
  onChange,
  onRemove,
  onRemoveExisting,
}) {
  const existingFileUrl =
    typeof existingFile === "string"
      ? existingFile
      : existingFile?.url;

  const existingFileName =
    typeof existingFile === "string"
      ? title
      : existingFile?.originalName || title;

  const currentFileName = file?.name || null;

  return (
    <div>
      {/* EXISTING CLOUDINARY FILE */}
      {existingFile && existingFileUrl && !file && (
        <div className="mb-2 rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-start gap-2">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Existing File
              </p>

              <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
                {existingFileName}
              </p>

              <div className="mt-2 flex items-center gap-3">
                <a
                  href={existingFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                >
                  <Eye className="h-3 w-3" />
                  View
                </a>

                <button
                  type="button"
                  onClick={onRemoveExisting}
                  className="text-xs font-medium text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD / REPLACE */}
      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 py-5 text-center transition ${
          error
            ? "border-red-400 bg-red-50"
            : "border-slate-300 bg-slate-50 hover:border-orange-400 hover:bg-orange-50"
        }`}
      >
        <Upload
          className={`mb-2 h-5 w-5 ${
            error
              ? "text-red-500"
              : "text-orange-500"
          }`}
        />

        <span className="max-w-full truncate px-2 text-xs font-medium text-slate-700">
          {currentFileName ||
            (existingFile
              ? "Replace file"
              : title)}
        </span>

        <span className="mt-1 text-[10px] text-slate-400">
          {currentFileName
            ? "Click to replace"
            : existingFile
              ? "Choose a new file to replace the existing one"
              : description}
        </span>

        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const selectedFile =
              event.target.files?.[0] || null;

            onChange(selectedFile);

            event.target.value = "";
          }}
        />
      </label>

      {/* NEW FILE REMOVE */}
      {file && !error && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-1 text-xs text-red-500 hover:text-red-600"
        >
          Remove new file
        </button>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}