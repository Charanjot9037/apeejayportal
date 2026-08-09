import * as Yup from "yup";

export const studentProfileSchema = Yup.object({
  // Personal
  fullName: Yup.string()
    .trim()
    .required("Full name is required"),

  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  phone: Yup.string()
    .matches(
      /^[6-9]\d{9}$/,
      "Enter a valid 10-digit phone number"
    )
    .required("Phone number is required"),

  dateOfBirth: Yup.string()
    .required("Date of birth is required"),

  gender: Yup.string()
    .oneOf(
      ["Male", "Female", "Other"],
      "Select a valid gender"
    )
    .required("Gender is required"),

  address: Yup.string()
    .trim()
    .required("Address is required"),

  // Skills
  skills: Yup.string()
    .trim()
    .required("Please enter at least one skill"),

  interests: Yup.string()
    .trim()
    .required("Please enter your interests"),

  // Academic
  university: Yup.string()
    .trim()
    .required("University is required"),

  department: Yup.string()
    .trim()
    .required("Department is required"),

  program: Yup.string()
    .trim()
    .required("Program / degree is required"),

  currentSemester: Yup.string()
    .trim()
    .required("Current semester is required"),

  rollNumber: Yup.string()
    .trim()
    .required("Roll number is required"),

  cumulativeGPA: Yup.number()
    .typeError("CGPA must be a number")
    .min(0, "CGPA cannot be negative")
    .max(10, "CGPA cannot be greater than 10")
    .required("CGPA is required"),

  academicBatch: Yup.string()
    .trim()
    .required("Academic batch is required"),

  // Online profiles
  linkedin: Yup.string()
    .url("Enter a valid LinkedIn URL")
    .nullable(),

  github: Yup.string()
    .url("Enter a valid GitHub URL")
    .nullable(),

  portfolio: Yup.string()
    .url("Enter a valid portfolio URL")
    .nullable(),

  // Files
  profileImage: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "Image must be less than 2MB",
      (file) => {
        if (!file) return true;
        return file.size <= 2 * 1024 * 1024;
      }
    )
    .test(
      "fileType",
      "Only JPG and PNG images are allowed",
      (file) => {
        if (!file) return true;

        return [
          "image/jpeg",
          "image/jpg",
          "image/png",
        ].includes(file.type);
      }
    ),

  resume: Yup.mixed()
    .required("Resume is required")
    .test(
      "fileSize",
      "Resume must be less than 5MB",
      (file) => {
        if (!file) return false;

        return file.size <= 5 * 1024 * 1024;
      }
    )
    .test(
      "fileType",
      "Only PDF, DOC and DOCX files are allowed",
      (file) => {
        if (!file) return false;

        return [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type);
      }
    ),
});


export const personalInformationSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters"),

  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(
      /^[+]?[\d\s()-]{8,20}$/,
      "Enter a valid phone number"
    ),

  dateOfBirth: Yup.string()
    .required("Date of birth is required"),

  gender: Yup.string()
    .required("Gender is required"),

  address: Yup.string()
    .trim()
    .required("Address is required")
    .min(5, "Address is too short"),
});



export const academicInformationSchema = Yup.object({
  university: Yup.string()
    .trim()
    .required("University is required")
    .min(2, "University name must be at least 2 characters")
    .max(100, "University name is too long"),

  department: Yup.string()
    .trim()
    .required("Department is required")
    .min(2, "Department must be at least 2 characters")
    .max(100, "Department name is too long"),

  program: Yup.string()
    .trim()
    .required("Program / Degree is required")
    .min(2, "Program must be at least 2 characters")
    .max(50, "Program name is too long"),

  currentSemester: Yup.string()
    .trim()
    .required("Current semester is required"),

  rollNumber: Yup.string()
    .trim()
    .required("Roll number is required")
    .min(2, "Roll number is too short")
    .max(30, "Roll number is too long"),

  cumulativeGPA: Yup.number()
    .typeError("CGPA must be a number")
    .required("CGPA is required")
    .min(0, "CGPA cannot be less than 0")
    .max(10, "CGPA cannot be greater than 10"),

  academicBatch: Yup.string()
    .trim()
    .required("Academic batch is required")
    .matches(
      /^\d{4}-\d{4}$/,
      "Academic batch must be in YYYY-YYYY format"
    ),
});



export const resumeDocumentsSchema = Yup.object({
  resumeFile: Yup.mixed()
    .nullable()
    .test(
      "fileType",
      "Only PDF files are allowed",
      (file) => {
        if (!file) return true;

        return (
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf")
        );
      }
    )
    .test(
      "fileSize",
      "Resume must be less than 5 MB",
      (file) => {
        if (!file) return true;

        return file.size <= 5 * 1024 * 1024;
      }
    ),

  resumeUrl: Yup.string()
    .nullable()
    .test(
      "valid-url",
      "Invalid resume URL",
      (value) => {
        if (!value) return true;

        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }
    ),

  resumeName: Yup.string()
    .trim()
    .max(
      150,
      "Resume file name is too long"
    ),

  lastUpdated: Yup.string().nullable(),
});

export const onlineProfilesSchema = Yup.object({
  github: Yup.string()
    .trim()
    .url("Please enter a valid GitHub URL")
    .test(
      "github-url",
      "Please enter a valid GitHub profile URL",
      (value) => {
        if (!value) return true;

        return /^https?:\/\/(www\.)?github\.com\/.+/i.test(
          value
        );
      }
    ),

  linkedin: Yup.string()
    .trim()
    .url("Please enter a valid LinkedIn URL")
    .test(
      "linkedin-url",
      "Please enter a valid LinkedIn profile URL",
      (value) => {
        if (!value) return true;

        return /^https?:\/\/(www\.)?linkedin\.com\/.+/i.test(
          value
        );
      }
    ),

  portfolio: Yup.string()
    .trim()
    .url("Please enter a valid portfolio URL"),

  leetcode: Yup.string()
    .trim()
    .url("Please enter a valid LeetCode URL")
    .test(
      "leetcode-url",
      "Please enter a valid LeetCode profile URL",
      (value) => {
        if (!value) return true;

        return /^https?:\/\/(www\.)?leetcode\.com\/.+/i.test(
          value
        );
      }
    ),

  twitter: Yup.string()
    .trim()
    .url("Please enter a valid Twitter/X URL")
    .test(
      "twitter-url",
      "Please enter a valid Twitter/X profile URL",
      (value) => {
        if (!value) return true;

        return /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/i.test(
          value
        );
      }
    ),
});