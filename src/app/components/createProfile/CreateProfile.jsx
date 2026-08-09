"use client";

import { useRef, useState } from "react";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSelector } from "react-redux";

import { studentProfileSchema } from "@/validations/profileSchema";

import PersonalInformationTab from "./PersonalInformationTab";
import SkillsInterestsTab from "./SkillInterestTab";
import AcademicInformationTab from "./AcadamicTab";
import OnlineProfilesTab from "./OnlineProfileTab";

export default function CreateStudentProfile() {
  const imageInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const user = useSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState("personal");

  // This will come from your create student API later
  const [studentId, setStudentId] = useState(null);

  const formik = useFormik({
    initialValues: {
      // =========================
      // PERSONAL INFORMATION
      // =========================

      profileImage: null,
      fullName: user?.name || "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",

      // =========================
      // SKILLS & INTERESTS
      // =========================

      skills: "",
      interests: "",

      // =========================
      // ACADEMIC INFORMATION
      // =========================

      university: "",
      department: "",
      program: "",
      currentSemester: "",
      rollNumber: "",
      cumulativeGPA: "",
      academicBatch: "",

      // =========================
      // ONLINE PROFILES
      // =========================

      linkedin: "",
      github: "",
      portfolio: "",

      // =========================
      // RESUME
      // =========================

      resume: null,
    },

    validationSchema: studentProfileSchema,

    onSubmit: async () => {
      // We are not using normal form submit.
      // Each tab handles its own step.
    },
  });

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  function handleProfileImage(event) {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    formik.setFieldValue("profileImage", file);
  }

  function removeProfileImage() {
    formik.setFieldValue("profileImage", null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  // =====================================================
  // RESUME
  // =====================================================

  function handleResume(event) {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    formik.setFieldValue("resume", file);
  }

  function removeResume() {
    formik.setFieldValue("resume", null);

    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
  }

  // =====================================================
  // ERROR HELPER
  // =====================================================

  const getError = (field) => {
    return formik.touched[field] && formik.errors[field]
      ? formik.errors[field]
      : "";
  };

  // =====================================================
  // VALIDATE CURRENT STEP
  // =====================================================

  const validateStep = async (fields) => {
    const errors = await formik.validateForm();

    const stepHasErrors = fields.some((field) => {
      return errors[field];
    });

    // Show errors for fields in current tab
    fields.forEach((field) => {
      formik.setFieldTouched(field, true, false);
    });

    return !stepHasErrors;
  };

  // =====================================================
  // STEP 1
  // CREATE STUDENT
  // =====================================================

  const handlePersonalNext = async () => {
    const fields = [
      "fullName",
      "email",
      "phone",
      "dateOfBirth",
      "gender",
      "address",
      "profileImage",
    ];

    const isValid = await validateStep(fields);

    if (!isValid) {
      return;
    }

    /*
      ================================================
      LATER:

      const response = await fetch("/api/students", {
        method: "POST",
        ...
      });

      const data = await response.json();

      setStudentId(data.student._id);

      ================================================
    */

    // Temporary fake ID
    const fakeStudentId = "TEMP_STUDENT_123";

    setStudentId(fakeStudentId);

    console.log("=================================");
    console.log("CREATE STUDENT");
    console.log("=================================");

    console.log({
      fullName: formik.values.fullName,
      email: formik.values.email,
      phone: formik.values.phone,
      dateOfBirth: formik.values.dateOfBirth,
      gender: formik.values.gender,
      address: formik.values.address,
      profileImage: formik.values.profileImage,
    });

    console.log("Student ID:", fakeStudentId);

    setActiveTab("skills");
  };

  // =====================================================
  // STEP 2
  // EDIT STUDENT - SKILLS
  // =====================================================

  const handleSkillsNext = async () => {
    const fields = ["skills", "interests"];

    const isValid = await validateStep(fields);

    if (!isValid) {
      return;
    }

    console.log("=================================");
    console.log("EDIT STUDENT - SKILLS");
    console.log("=================================");

    console.log("Student ID:", studentId);

    console.log({
      skills: formik.values.skills,
      interests: formik.values.interests,
    });

    setActiveTab("academic");
  };

  // =====================================================
  // STEP 3
  // EDIT STUDENT - ACADEMIC
  // =====================================================

  const handleAcademicNext = async () => {
    const fields = [
      "university",
      "department",
      "program",
      "currentSemester",
      "rollNumber",
      "cumulativeGPA",
      "academicBatch",
    ];

    const isValid = await validateStep(fields);

    if (!isValid) {
      return;
    }

    console.log("=================================");
    console.log("EDIT STUDENT - ACADEMIC");
    console.log("=================================");

    console.log("Student ID:", studentId);

    console.log({
      university: formik.values.university,
      department: formik.values.department,
      program: formik.values.program,
      currentSemester: formik.values.currentSemester,
      rollNumber: formik.values.rollNumber,
      cumulativeGPA: formik.values.cumulativeGPA,
      academicBatch: formik.values.academicBatch,
    });

    setActiveTab("profiles");
  };

  // =====================================================
  // STEP 4
  // EDIT STUDENT - PROFILES
  // =====================================================

  const handleFinalSubmit = async () => {
    const fields = [
      "linkedin",
      "github",
      "portfolio",
      "resume",
    ];

    const isValid = await validateStep(fields);

    if (!isValid) {
      return;
    }

    console.log("=================================");
    console.log("EDIT STUDENT - FINAL");
    console.log("=================================");

    console.log("Student ID:", studentId);

    console.log({
      linkedin: formik.values.linkedin,
      github: formik.values.github,
      portfolio: formik.values.portfolio,
      resume: formik.values.resume,
    });

    console.log("=================================");
    console.log("STUDENT PROFILE COMPLETED");
    console.log("=================================");

    console.log("Complete Form Data:", formik.values);
  };

  return (
    <main className="h-screen overflow-y-auto bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-main-blue">
            Create Your Profile
          </h1>

          <p className="mt-1 text-sm text-gray-700">
            Complete your profile with your personal, academic,
            professional and career information.
          </p>

          <div className="mt-2 h-0.5 w-8 bg-orange-500" />
        </div>

        {/* ==========================================
            HIDDEN FILE INPUTS
        ========================================== */}

        <Input
          ref={imageInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleProfileImage}
          className="hidden"
        />

        <Input
          ref={resumeInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResume}
          className="hidden"
        />

        {/* ==========================================
            TABS
        ========================================== */}

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            // Prevent manually going to future tabs
            if (!studentId && value !== "personal") {
              return;
            }

            setActiveTab(value);
          }}
          className="w-full"
        >

          {/* ==========================================
              TAB HEADER
          ========================================== */}

          <TabsList className="mb-6 grid h-auto w-full grid-cols-2 md:grid-cols-4">

            <TabsTrigger
              value="personal"
              className="py-3"
            >
              Personal Information
            </TabsTrigger>

            <TabsTrigger
              value="skills"
              disabled={!studentId}
              className="py-3"
            >
              Skills & Interests
            </TabsTrigger>

            <TabsTrigger
              value="academic"
              disabled={!studentId}
              className="py-3"
            >
              Academic Information
            </TabsTrigger>

            <TabsTrigger
              value="profiles"
              disabled={!studentId}
              className="py-3"
            >
              Profiles & Resume
            </TabsTrigger>

          </TabsList>

          {/* ==========================================
              TAB 1
          ========================================== */}

          <TabsContent value="personal">
            <PersonalInformationTab
              formik={formik}
              getError={getError}
              imageInputRef={imageInputRef}
              handleProfileImage={handleProfileImage}
              removeProfileImage={removeProfileImage}
              onNext={handlePersonalNext}
            />
          </TabsContent>

          {/* ==========================================
              TAB 2
          ========================================== */}

          <TabsContent value="skills">
            <SkillsInterestsTab
              formik={formik}
              getError={getError}
              onBack={() => setActiveTab("personal")}
              onNext={handleSkillsNext}
            />
          </TabsContent>

          {/* ==========================================
              TAB 3
          ========================================== */}

          <TabsContent value="academic">
            <AcademicInformationTab
              formik={formik}
              getError={getError}
              onBack={() => setActiveTab("skills")}
              onNext={handleAcademicNext}
            />
          </TabsContent>

          {/* ==========================================
              TAB 4
          ========================================== */}

          <TabsContent value="profiles">
            <OnlineProfilesTab
              formik={formik}
              getError={getError}
              resumeInputRef={resumeInputRef}
              handleResume={handleResume}
              removeResume={removeResume}
              onBack={() => setActiveTab("academic")}
              onSubmit={handleFinalSubmit}
            />
          </TabsContent>

        </Tabs>
      </div>
    </main>
  );
}



// "use client";

// import { useRef } from "react";
// import { useFormik } from "formik";
// import { Input,Label } from "@/components/ui";
// import InputField from "../elements/InputField";
// import SelectField from "../elements/SelectFiled";
// import { useSelector } from "react-redux";
// import {
//   User,
//   GraduationCap,
//   Code,
//   Link as LinkIcon,
//   FileText,
//   Upload,
//   X,
// } from "lucide-react";
// import TextAreaField from "../elements/TextField";

// import { studentProfileSchema } from "@/validations/profileSchema";



// export default function CreateStudentProfile({ onSubmit }) {
//   const imageInputRef = useRef(null);
//   const resumeInputRef = useRef(null);
// const user = useSelector((state) => state.auth.user);
//   const formik = useFormik({
//     initialValues:{
//   // =========================
//   // PERSONAL INFORMATION
//   // =========================
//   profileImage: null,
//   fullName: user.name||"",
//   email: "",
//   phone: "",
//   dateOfBirth: "",
//   gender: "",
//   address: "",

//   // =========================
//   // SKILLS & INTERESTS
//   // =========================
//   skills: "",
//   interests: "",

//   // =========================
//   // ACADEMIC INFORMATION
//   // =========================
//   university: "",
//   department: "",
//   program: "",
//   currentSemester: "",
//   rollNumber: "",
//   cumulativeGPA: "",
//   academicBatch: "",

//   // =========================
//   // ONLINE PROFILES
//   // =========================
//   linkedin: "",
//   github: "",
//   portfolio: "",

//   // =========================
//   // RESUME
//   // =========================
//   resume: null,
// },

//     validationSchema: studentProfileSchema,

//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         if (onSubmit) {
//           await onSubmit(values);
//         }

//         console.log("Student profile:", values);
//       } catch (error) {
//         console.error("Failed to create profile:", error);
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   // ==========================================
//   // PROFILE IMAGE
//   // ==========================================

//   function handleProfileImage(event) {
//     const file = event.currentTarget.files?.[0];

//     if (!file) return;

//     formik.setFieldValue("profileImage", file);
//   }

//   function removeProfileImage() {
//     formik.setFieldValue("profileImage", null);

//     if (imageInputRef.current) {
//       imageInputRef.current.value = "";
//     }
//   }

//   // ==========================================
//   // RESUME
//   // ==========================================

//   function handleResume(event) {
//     const file = event.currentTarget.files?.[0];

//     if (!file) return;

//     formik.setFieldValue("resume", file);
//   }

//   function removeResume() {
//     formik.setFieldValue("resume", null);

//     if (resumeInputRef.current) {
//       resumeInputRef.current.value = "";
//     }
//   }

//   // ==========================================
//   // FIELD ERROR
//   // ==========================================

//   const getError = (field) => {
//     return formik.touched[field] && formik.errors[field]
//       ? formik.errors[field]
//       : "";
//   };

//   return (
//     <main className="h-screen overflow-y-auto bg-gray-50 px-4 py-8">
//       <div className="mx-auto max-w-6xl">
//         {/* ==========================================
//             PAGE HEADER
//         ========================================== */}

//         <div className="mb-8">
//           <h1 className="text-2xl font-semibold text-main-blue">
//             Create Your Profile
//           </h1>

//           <p className="mt-1 text-sm text-gray-700">
//             Complete your profile with your personal, academic,
//             professional and career information.
//           </p>

//           <div className="mt-2 h-0.5 w-8 bg-orange-500" />
//         </div>

//         <form onSubmit={formik.handleSubmit}>

//           <div className=" mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
//             <SectionHeader
//               icon={<User size={18} />}
//               title="Personal Information"
//             />

//             <div className="mt-6 flex flex-col gap-8 md:flex-row">

//               {/* PROFILE IMAGE */}

//               <div className="flex shrink-0 flex-col items-center">
//                 <div className="relative">

//                   <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-100">
//                     {formik.values.profileImage ? (
//                       <img
//                         src={URL.createObjectURL(
//                           formik.values.profileImage
//                         )}
//                         alt="Profile preview"
//                         className="h-full w-full object-cover"
//                       />
//                     ) : (
//                       <User
//                         size={42}
//                         className="text-gray-400"
//                       />
//                     )}
//                   </div>

//                   {formik.values.profileImage && (
//                     <button
//                       type="button"
//                       onClick={removeProfileImage}
//                       className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
//                     >
//                       <X size={13} />
//                     </button>
//                   )}
//                 </div>

//                 <Input
//                   ref={imageInputRef}
//                   type="file"
//                   accept="image/png,image/jpeg,image/jpg"
//                   onChange={handleProfileImage}
//                   className="hidden"
//                 />

//                 <button
//                   type="button"
//                   onClick={() =>
//                     imageInputRef.current?.click()
//                   }
//                   className="mt-3 rounded-md border border-orange-500 px-3 py-1.5 text-xs font-medium text-orange-500 transition hover:bg-orange-50"
//                 >
//                   Upload Photo
//                 </button>

//                 <p className="mt-1 text-[10px] text-gray-400">
//                   JPG or PNG · Max 2MB
//                 </p>

//                 {getError("profileImage") && (
//                   <p className="mt-1 text-xs text-red-500">
//                     {getError("profileImage")}
//                   </p>
//                 )}
//               </div>

//               {/* PERSONAL FIELDS */}

//               <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">

//                 <InputField
//                   label="FULL NAME"
//                   name="fullName"
//                   required
//                   placeholder="Enter your full name"
//                   formik={formik}
//                   error={getError("fullName")}
//                 />

//                 <InputField
//                   label="EMAIL"
//                   name="email"
//                   type="email"
//                   required
//                   placeholder="Enter your email"
//                   formik={formik}
//                   error={getError("email")}
//                 />

//                 <InputField
//                   label="PHONE"
//                   name="phone"
//                   required
//                   placeholder="+91 98765 43210"
//                   formik={formik}
//                   error={getError("phone")}
//                 />

//                 <InputField
//                   label="DATE OF BIRTH"
//                   name="dateOfBirth"
//                   required
//                   type="date"
//                   formik={formik}
//                   error={getError("dateOfBirth")}
//                 />

//                 <SelectField
//                   label="GENDER"
//                   required
//                   name="gender"
//                   value={formik.values.gender}
//                   onChange={(value) =>
//                     formik.setFieldValue("gender", value)
//                   }
//                   onBlur={() =>
//                     formik.setFieldTouched("gender", true)
//                   }
//                   error={getError("gender")}
//                   options={[
//                     { value: "Male", label: "Male" },
//                     { value: "Female", label: "Female" },
//                     { value: "Other", label: "Other" },
//                   ]}
//                 />

//                 <InputField
//                   label="ADDRESS"
//                   required
//                   name="address"
//                   placeholder="Enter your address"
//                   formik={formik}
//                   error={getError("address")}
//                 />
//               </div>
//             </div>
//           </div>

       

//           <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
//             <SectionHeader
//               icon={<Code size={18} />}
//               title="Skills & Interests"
//             />

//             <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">

//               <TextAreaField
//               required
//                 label="SKILLS"
//                 name="skills"
//                 placeholder="React, Next.js, MongoDB, Node.js..."
//                 formik={formik}
//                 error={getError("skills")}
//               />

//               <TextAreaField
//                 label="INTERESTS"
//                 name="interests"
//                 required
//                 placeholder="Web Development, AI, Cloud Computing..."
//                 formik={formik}
//                 error={getError("interests")}
//               />
//             </div>
//           </div> 

//           {/* =====================================================
//               ACADEMIC INFORMATION
//           ===================================================== */}

//           <section className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
//             <SectionHeader
//               icon={<GraduationCap size={18} />}
//               title="Academic Information"
//             />

//             <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">

//               <InputField
//                 label="UNIVERSITY"
//                 name="university"
//                 required
//                 placeholder="Enter university"
//                 formik={formik}
//                 error={getError("university")}
//               />

//               <InputField
//                 label="DEPARTMENT"
//                 name="department"
                
//                 required
//                 placeholder="Computer Science & Engineering"
//                 formik={formik}
//                 error={getError("department")}
//               />

//               <InputField
//                 label="PROGRAM / DEGREE"
//                 name="program"
//                 placeholder="B.Tech"
//                 formik={formik}
//                 required
//                 error={getError("program")}
//               />

//               <InputField
//                 label="CURRENT SEMESTER"
//                 name="currentSemester"
//                 placeholder="6th Semester"
//                 required
//                 formik={formik}
//                 error={getError("currentSemester")}
//               />

//               <InputField
//                 label="ROLL NUMBER"
//                 name="rollNumber"
//                 required
//                 placeholder="Enter roll number"
//                 formik={formik}
//                 error={getError("rollNumber")}
//               />

//               <InputField
//                 label="CUMULATIVE GPA (CGPA)"
//                 name="cumulativeGPA"
//                 required
//                 placeholder="8.42"
//                 formik={formik}
//                 error={getError("cumulativeGPA")}
//               />

//               <InputField
//                 label="ACADEMIC BATCH"
//                 name="academicBatch"
//                 required
//                 placeholder="2023-2027"
//                 formik={formik}
//                 error={getError("academicBatch")}
//               />
//             </div>
//           </section>

//           {/* =====================================================
//               ONLINE PROFILES
//           ===================================================== */}

//            <section className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
//             <SectionHeader
//               icon={<LinkIcon size={18} />}
//               title="Online Profiles"
//             />

//             <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">

//               <InputField
//                 label="LINKEDIN"
//                 name="linkedin"
//                 placeholder="https://linkedin.com/in/username"
//                 formik={formik}
//                 error={getError("linkedin")}
//               />

//               <InputField
//                 label="GITHUB"
//                 name="github"
//                 placeholder="https://github.com/username"
//                 formik={formik}
//                 error={getError("github")}
//               />

//               <InputField
//                 label="PORTFOLIO"
//                 name="portfolio"
//                 placeholder="https://yourportfolio.com"
//                 formik={formik}
//                 error={getError("portfolio")}
//               />
//             </div>
//           </section> 
//           {/* =====================================================
//               RESUME
//           ===================================================== */}

//           <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
//             <SectionHeader
//               icon={<FileText size={18} />}
//               title="Resume"
//             />

//             <div className="mt-6">

//               <Input
//                 ref={resumeInputRef}
//                 type="file"
//             required
//                 accept=".pdf,.doc,.docx"
//                 onChange={handleResume}
//                 className="hidden"
//               />

//               {!formik.values.resume ? (
//                 <button
//                   type="button"
//                   onClick={() =>
//                     resumeInputRef.current?.click()
//                   }
//                   className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition hover:border-orange-400 hover:bg-orange-50/30"
//                 >
//                   <Upload
//                     size={28}
//                     className="text-gray-400"
//                   />

//                   <p className="mt-2 text-sm font-medium text-gray-600">
//                     Upload your resume
//                   </p>

//                   <p className="mt-1 text-xs text-gray-400">
//                     PDF, DOC or DOCX · Max 5MB
//                   </p>
//                 </button>
//               ) : (
//                 <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-4 py-3">

//                   <div className="flex items-center gap-3">
//                     <FileText
//                       size={22}
//                       className="text-main-blue"
//                     />

//                     <div>
//                       <p className="text-sm font-medium text-gray-700">
//                         {formik.values.resume.name}
//                       </p>

//                       <p className="text-xs text-gray-400">
//                         {(
//                           formik.values.resume.size /
//                           1024 /
//                           1024
//                         ).toFixed(2)}{" "}
//                         MB
//                       </p>
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={removeResume}
//                     className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-red-50 hover:text-red-500"
//                   >
//                     <X size={15} />
//                   </button>
//                 </div>
//               )}

//               {getError("resume") && (
//                 <p className="mt-1 text-xs text-red-500">
//                   {getError("resume")}
//                 </p>
//               )}
//             </div>
//           </section> 

//           {/* =====================================================
//               SUBMIT
//           ===================================================== */}

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               disabled={formik.isSubmitting}
//               className="rounded-md bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {formik.isSubmitting
//                 ? "Creating Profile..."
//                 : "Create Profile"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// }

// /* ============================================================
//    SECTION HEADER
// ============================================================ */

// function SectionHeader({ icon, title }) {
//   return (
//     <div>
//       <div className="flex items-center gap-2 text-main-blue">
//         {icon}

//         <h2 className="text-xl font-semibold text-main-blue">
//           {title}
//         </h2>
//       </div>

//       <div className="mt-1 h-0.5 w-6 bg-orange-500" />
//     </div>
//   );
// }

// /* ============================================================
//    INPUT FIELD
// ============================================================ */

// function FormField({
//   label,
//   name,
//   type = "text",
//   placeholder,
//   formik,
//   error,
// }) {
//   return (
//     <div>
//       <Label
//         htmlFor={name}
//         className="mb-1.5 block text-xs font-medium text-gray-500"
//       >
//         {label}
//       </Label>

//       <Input
//         id={name}
//         name={name}
//         type={type}
//         placeholder={placeholder}
//         value={formik.values[name]}
//         onChange={formik.handleChange}
//         onBlur={formik.handleBlur}
//         className={`h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-700 outline-none transition focus:ring-1 ${
//           error
//             ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
//             : "border-gray-300 focus:border-main-blue focus:ring-main-blue/20"
//         }`}
//       />

//       {error && (
//         <p className="mt-1 text-xs text-red-500">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// }


