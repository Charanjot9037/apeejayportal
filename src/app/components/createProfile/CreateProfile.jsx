"use client";

import { useRef, useState } from "react";
import { useFormik } from "formik";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { studentProfileSchema } from "@/validations/profileSchema";

import PersonalInformationTab from "./PersonalInformationTab";
import SkillsInterestsTab from "./SkillInterestTab";
import AcademicInformationTab from "./AcadamicTab";
import OnlineProfilesTab from "./OnlineProfileTab";
import { DashboardHeader } from "../elements";

export default function CreateStudentProfile() {
  const imageInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState("personal");
  // This will come from your create student API later
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  // This will come from your create student API later
  const [studentId, setStudentId] = useState(null);

  const formik = useFormik({
    initialValues: {
      profileImage: null,
      profileImageUrl: "",
      fullName: user?.name || "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      skills: "",
      interests: "",
      department: "",
      program: "",
      currentSemester: "",
      rollNumber: "",
      academicBatch: "",
      lastYear: "",
      linkedin: "",
      github: "",
      portfolio: "",
      specialization: "",
      resume: "",
      resumeName: "",
      resumeFile: null,
    },

    validationSchema: studentProfileSchema,
  });

  const handleProfileImage = async (event) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;
    setIsUploadingImage(true);
    formik.setFieldValue("profileImageFile", file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      formik.setFieldValue("profileImage", file);
      formik.setFieldValue("profileImageUrl", data.url);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleResume = async (event) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    // Store actual file for displaying filename
    formik.setFieldValue("resumeFile", file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Resume upload failed");
      }

      console.log("Resume Cloudinary URL:", data.url);

      formik.setFieldValue("resume", data.url);
    } catch (error) {
      console.error("Resume upload failed:", error);

      formik.setFieldValue("resumeFile", null);
      formik.setFieldValue("resume", "");
    }
  };
  function removeProfileImage() {
    formik.setFieldValue("profileImage", null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }
  function removeResume() {
    formik.setFieldValue("resume", null);

    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
  }

  const getError = (field) => {
    return formik.touched[field] && formik.errors[field]
      ? formik.errors[field]
      : "";
  };

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

  const handlePersonalNext = async () => {
    try {
      const response = await fetch("/api/createstudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          fullName: formik.values.fullName,
          phone: formik.values.phone,

          gender: formik.values.gender,
          address: formik.values.address,
          profileImage: formik.values.profileImageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }



      // Store Student's own _id
      setStudentId(data.studentId);

      setActiveTab("academic");
    } catch (error) {
      console.error("Create student error:", error);
    }
  };

  const handleSkillsNext = async () => {
    const fields = ["skills", "interests"];

    const isValid = await validateStep(fields);

    if (!isValid) {
      return;
    }

    try {
      const response = await fetch("/api/createstudent", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          section: "skills",
          data: {
            skills: formik.values.skills,
            interests: formik.values.interests,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Skills update failed:", result.message);
        return;
      }

      console.log("Skills updated successfully:", result);

      alert("Successful");

      setActiveTab("profiles");
    } catch (error) {
      console.error("Skills API error:", error);
    }
  };

  const handleAcademicNext = async () => {
    const fields = [
      "university",
      "department",
      "program",
      "currentSemester",
      "rollNumber",
      "lastYear",
      "cumulativeGPA",
      "academicBatch",
      "specialization",
    ];

    const isValid = await validateStep(fields);

    if (!isValid) {
      return;
    }

    try {
      const response = await fetch("/api/createstudent", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          section: "academic",
          data: {
            university: formik.values.university,
            department: formik.values.department,
            program: formik.values.program,
            currentSemester: formik.values.currentSemester,
            rollNumber: formik.values.rollNumber,
            cumulativeGPA: formik.values.cumulativeGPA,
            academicBatch: formik.values.academicBatch,
            specialization: formik.values.specialization,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Academic update failed:", result.message);
        return;
      }

      alert("Academic information updated:", result);

      setActiveTab("skills");
    } catch (error) {
      console.error("Academic API error:", error);
    }
  };

  const handleFinalSubmit = async () => {
    const fields = ["linkedin", "github", "portfolio", "resume"];

    const isValid = await validateStep(fields);

    if (!isValid) {
      return;
    }

    try {
      const response = await fetch("/api/createstudent", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          section: "onlineProfiles",
          data: {
            linkedin: formik.values.linkedin,
            github: formik.values.github,
            portfolio: formik.values.portfolio,
            resume: formik.values.resume,
            resumeName: formik.values.resumeFile.name,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Profile update failed:", result.message);
        return;
      }

      alert("Student profile completed successfully!");
      router.push("/student");
    } catch (error) {
      console.error("Final profile update error:", error);
    }
  };

  return (
    <main className="h-screen overflow-y-auto bg-gray-50 px-4 ">
      <div className="mx-auto max-w-6xl">
        <div className="py-3">
          <DashboardHeader
            title="Create Your Profile"
            description=" Complete your profile with your personal, academic, professional and
            career information"
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            // Prevent manually going to future tabs
            // if (!studentId && value !== "personal") {
            //   return;
            // }

            setActiveTab(value);
          }}
          className="w-full flex flex-col gap-4"
        >
          <TabsList className=" w-full h-10 flex overflow-x-auto no-scrollbar justify-start gap-1   sm:justify-center bg-white border  text-sm text-black">
            <TabsTrigger
              value="personal"
              className="py-3 data-active:bg-primary-orange data-active:text-white"
            >
              Personal Information
            </TabsTrigger>
            <TabsTrigger
              value="academic"
              disabled={!studentId}
              className="py-3 data-active:bg-primary-orange data-active:text-white"
            >
              Academic Information
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              disabled={!studentId}
              className="py-3 data-active:bg-primary-orange data-active:text-white"
            >
              Skills & Interests
            </TabsTrigger>

            <TabsTrigger
              value="profiles"
              disabled={!studentId}
              className="py-3 data-active:bg-primary-orange data-active:text-white"
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
              isUploadingImage={isUploadingImage}
              imageInputRef={imageInputRef}
              handleProfileImage={handleProfileImage}
              removeProfileImage={removeProfileImage}
              onNext={handlePersonalNext}
            />
          </TabsContent>

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
