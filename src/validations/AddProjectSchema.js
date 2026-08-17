import * as Yup from "yup";

import {
  MAX_IMAGE_SIZE,
  MAX_PRESENTATION_SIZE,
  MAX_SYNOPSIS_SIZE,
  MAX_REPORT_SIZE,
  MAX_PROJECT_IMAGES,
} from "@/constants/AddProjectConstant";
import { isEmptyFile } from "@/app/components/addProjectForm/helper";

/* =========================================================
   YUP SCHEMA
========================================================= */

export const validationSchema = Yup.object({
  projectName: Yup.string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must not exceed 100 characters")
    .required("Project name is required"),

  description: Yup.string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .required("Description is required"),

  githubLink: Yup.string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .url("Enter a valid GitHub URL"),

  liveDemoLink: Yup.string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .url("Enter a valid URL"),

  semester: Yup.string().required("Please select a semester"),

  mentor: Yup.string().nullable(),

  projectType: Yup.string()
    .oneOf(["individual", "team"], "Invalid project type")
    .required("Project type is required"),

  techStack: Yup.array()
    .of(Yup.string().trim())
    .min(1, "Add at least one technology")
    .required("Tech stack is required"),

  teamMembers: Yup.array().when("projectType", {
    is: "team",

    then: (schema) =>
      schema.min(1, "Add at least one team member").of(
        Yup.object({
          name: Yup.string().trim().required("Member name is required"),

          enrollment: Yup.string()
            .trim()
            .required("Enrollment / Student ID is required"),

          email: Yup.string()
            .transform((value) => (value === "" ? null : value))
            .nullable()
            .email("Enter a valid email"),

          role: Yup.string().trim().nullable(),
        }),
      ),

    otherwise: (schema) => schema,
  }),

  projectImages: Yup.array(),
  // .test(
  //   "max-images",
  //   `Maximum ${MAX_PROJECT_IMAGES} images are allowed`,
  //   (files) => {
  //     if (!files) return true;

  //     return files.length <= MAX_PROJECT_IMAGES;
  //   }
  // )
  // .test(
  //   "image-types",
  //   "Only JPG, JPEG, PNG and WEBP images are allowed",
  //   (files) => {
  //     if (!files || files.length === 0) {
  //       return true;
  //     }

  //     const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  //     return files.every((file) => {
  //       if (!file?.type) return false;

  //       return allowedTypes.includes(file.type);
  //     });
  //   }
  // )
  // .test(
  //   "image-size",
  //   "Each project image must be smaller than 5MB",
  //   (files) => {
  //     if (!files || files.length === 0) {
  //       return true;
  //     }

  //     return files.every((file) => file.size <= MAX_IMAGE_SIZE);
  //   }
  // ),
  presentationFile: Yup.mixed()
    // .nullable()
    // .test(
    //   "presentation-type",
    //   "Only PPT and PPTX files are allowed",
    //   (file) => {
    //     if (isEmptyFile(file)) {
    //       return true;
    //     }

    //     const fileName = file.name?.toLowerCase() || "";

    //     return (
    //       file.type === "application/vnd.ms-powerpoint" ||
    //       file.type ===
    //         "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    //       fileName.endsWith(".ppt") ||
    //       fileName.endsWith(".pptx")
    //     );
    //   },
    // )
   ,

  synopsisFile: Yup.mixed()
    // .nullable()
    // .test("synopsis-type", "Only PDF files are allowed", (file) => {
    //   if (isEmptyFile(file)) {
    //     return true;
    //   }

    //   return (
    //     file.type === "application/pdf" ||
    //     file.name?.toLowerCase().endsWith(".pdf")
    //   );
    // })
    // .test("synopsis-size", "Synopsis must be smaller than 5MB", (file) => {
    //   if (isEmptyFile(file)) {
    //     return true;
    //   }

    //   return file.size <= MAX_SYNOPSIS_SIZE;
    // })
    ,

  reportFile: Yup.mixed()
    // .nullable()
    // .test("report-type", "Only PDF files are allowed", (file) => {
    //   if (isEmptyFile(file)) {
    //     return true;
    //   }

    //   return (
    //     file.type === "application/pdf" ||
    //     file.name?.toLowerCase().endsWith(".pdf")
    //   );
    // })
    // .test("report-size", "Final report must be smaller than 20MB", (file) => {
    //   if (isEmptyFile(file)) {
    //     return true;
    //   }

    //   return file.size <= MAX_REPORT_SIZE;
    // })
    ,
});
