import * as Yup from "yup";

import {
  MAX_IMAGE_SIZE,
  MAX_PRESENTATION_SIZE,
  MAX_SYNOPSIS_SIZE,
  MAX_REPORT_SIZE,
  MAX_PROJECT_IMAGES,
  MAX_CERTIFICATE_SIZE, // add this to AddProjectConstant (see note below)
} from "@/constants/AddProjectConstant";
import { isEmptyFile } from "@/app/components/addProjectForm/helper";

/* =========================================================
   FILE TYPE CONSTANTS
========================================================= */

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PDF_TYPE = "application/pdf";
const PPT_TYPES = [
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

/* =========================================================
   IS ALREADY-UPLOADED CLOUDINARY FILE
   Once a file has been uploaded, its Formik value becomes
   a Cloudinary object ({ publicId, url, resourceType, ... })
   instead of a raw browser File. It has no reliable .type or
   .size to validate against, and it was already validated at
   upload time — so we let these pass through untouched.
========================================================= */

const isCloudinaryFile = (file) =>
  !!file && typeof file === "object" && ("publicId" in file || "url" in file);

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
    .default([]),

  teamMembers: Yup.string()
    .nullable()
    .when("projectType", {
      is: "team",
      then: (schema) => schema.required("Please select a team member"),
      otherwise: (schema) => schema.notRequired(),
    }),

  /* =======================================================
     PROJECT IMAGES
  ======================================================= */

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
        if (!files || files.length === 0) return true;

        return files.every((file) => {
          if (isCloudinaryFile(file)) return true;
          if (!file?.type) return false;
          return IMAGE_TYPES.includes(file.type);
        });
      }
    )
    .test(
      "image-size",
      "Each project image must be smaller than 5MB",
      (files) => {
        if (!files || files.length === 0) return true;

        return files.every((file) => {
          if (isCloudinaryFile(file)) return true;
          return file.size <= MAX_IMAGE_SIZE;
        });
      }
    ),

  /* =======================================================
     PRESENTATION FILE (optional)
  ======================================================= */

  presentationFile: Yup.mixed()
    .nullable()
    .test(
      "presentation-type",
      "Only PPT and PPTX files are allowed",
      (file) => {
        if (isEmptyFile(file)) return true;
        if (isCloudinaryFile(file)) return true;

        const fileName = file.name?.toLowerCase() || "";

        return (
          PPT_TYPES.includes(file.type) ||
          fileName.endsWith(".ppt") ||
          fileName.endsWith(".pptx")
        );
      }
    )
    .test(
      "presentation-size",
      "Presentation must be smaller than the allowed limit",
      (file) => {
        if (isEmptyFile(file)) return true;
        if (isCloudinaryFile(file)) return true;

        return file.size <= MAX_PRESENTATION_SIZE;
      }
    ),

  /* =======================================================
     SYNOPSIS FILE (required)
  ======================================================= */

  synopsisFile: Yup.mixed()
    .required("Synopsis is required")
    .test("synopsis-type", "Only PDF files are allowed", (file) => {
      if (isEmptyFile(file)) return true;
      if (isCloudinaryFile(file)) return true;

      return (
        file.type === PDF_TYPE || file.name?.toLowerCase().endsWith(".pdf")
      );
    })
    .test("synopsis-size", "Synopsis must be smaller than 5MB", (file) => {
      if (isEmptyFile(file)) return true;
      if (isCloudinaryFile(file)) return true;

      return file.size <= MAX_SYNOPSIS_SIZE;
    }),

  /* =======================================================
     REPORT FILE (optional)
  ======================================================= */

  reportFile: Yup.mixed()
    .nullable()
    .test("report-type", "Only PDF files are allowed", (file) => {
      if (isEmptyFile(file)) return true;
      if (isCloudinaryFile(file)) return true;

      return (
        file.type === PDF_TYPE || file.name?.toLowerCase().endsWith(".pdf")
      );
    })
    .test("report-size", "Final report must be smaller than 20MB", (file) => {
      if (isEmptyFile(file)) return true;
      if (isCloudinaryFile(file)) return true;

      return file.size <= MAX_REPORT_SIZE;
    }),

  /* =======================================================
     CERTIFICATE FILE (optional)
  ======================================================= */

  certificateFile: Yup.mixed()
    .nullable()
    .test("certificate-type", "Only PDF files are allowed", (file) => {
      if (isEmptyFile(file)) return true;
      if (isCloudinaryFile(file)) return true;

      return (
        file.type === PDF_TYPE || file.name?.toLowerCase().endsWith(".pdf")
      );
    })
    .test(
      "certificate-size",
      "Certificate must be smaller than the allowed limit",
      (file) => {
        if (isEmptyFile(file)) return true;
        if (isCloudinaryFile(file)) return true;

        return file.size <= MAX_CERTIFICATE_SIZE;
      }
    ),
});