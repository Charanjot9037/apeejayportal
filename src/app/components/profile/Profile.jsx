"use client";

import { useEffect, useState } from "react";

import ProfileHeader from "../profile/ProfileHeader";
import PersonalInformation from "./ProfileInformation";
import OnlineProfiles from "./OnlineProfile";
import ResumeDocuments from "./ResumeDocuments";
import SkillsAndInterests from "./SkillInterest";
import AcademicInformation from "./AcadamicInformation";

import { mapStudentToProfile } from "@/lib/mapper";

export default function Profile() {
  const [imageLoading, setImageLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStudentProfile = async () => {
      try {
        const response = await fetch("/api/student/profile", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch student profile");
        }

        const mappedData = mapStudentToProfile(data.data);

        console.log("Student profile:", mappedData);

        setStudentData(mappedData);
      } catch (error) {
        console.error("Failed to load student profile:", error);
      } finally {
        setLoading(false);
      }
    };

    getStudentProfile();
  }, []);

  const handlePersonalSave = async (data) => {
    try {
      alert("going to update");
      const response = await fetch("/api/editprofile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          section: "personal",
          data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update personal information",
        );
      }
      alert("updated");
      console.log("Personal updated:", result.profile);

      setStudentData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          ...data,
        },
        profile: {
          ...prev.profile,
          fullName: data.fullName,
          profileImage: data.profileImage,
        },
      }));

      return result;
    } catch (error) {
      console.error("Personal update error:", error);
      throw error;
    }
  };

  const handleSkillsSave = async (data) => {
    try {
      const response = await fetch("/api/editprofile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "skills",
          data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update skills");
      }

      console.log("Skills updated:", result.profile);

      setStudentData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          ...data,
        },
      }));

      return result;
    } catch (error) {
      console.error("Skills update error:", error);
      throw error;
    }
  };

  // =========================
  // ACADEMIC SAVE
  // =========================

  const handleAcademicSave = async (data) => {
    try {
      const response = await fetch("/api/editprofile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "academic",
          data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update academic information",
        );
      }

      const updatedProfile = mapStudentToProfile(result.profile);

      setStudentData(updatedProfile);

      return result;
    } catch (error) {
      console.error("Academic update error:", error);
      throw error;
    }
  };

  // =========================
  // ONLINE PROFILE SAVE
  // =========================

  const handleOnlineProfilesSave = async (data) => {
    try {
      const response = await fetch("/api/editprofile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          section: "onlineProfiles",
          data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update online profiles");
      }

      console.log("Online profiles updated:", result.profile);

      setStudentData((prev) => ({
        ...prev,
        profiles: {
          ...prev.profiles,
          ...data,
        },
      }));

      return result;
    } catch (error) {
      console.error("Online profiles update error:", error);

      throw error;
    }
  };

  // =========================
  // RESUME SAVE
  // =========================

  const handleResumeSave = async (data) => {
    try {
      const response = await fetch("/api/editprofile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          section: "resume",
          data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update resume");
      }

      console.log("Resume updated:", result.profile);

      setStudentData((prev) => ({
        ...prev,
        document: {
          ...prev.document,
          ...data,
        },
      }));

      return result;
    } catch (error) {
      console.error("Resume update error:", error);
      throw error;
    }
  };


const handleProfileImageSave = async (file) => {
  try {
    setImageLoading(true);
    const formData = new FormData();

    formData.append("file", file);

    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      throw new Error(uploadData.message || "Image upload failed");
    }

    console.log("Uploaded image:", uploadData.url);
    const response = await fetch("/api/editprofile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        section: "profile",
        data: {
          profileImage: uploadData.url,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update profile image");
    }

    setStudentData((prev) => ({
      ...prev,

      profile: {
        ...prev.profile,
        profileImage: uploadData.url,
      },
    }));

    console.log("Profile image saved:", result.profile);
  } catch (error) {
    console.error("Profile image update failed:", error);
  } finally {
    setImageLoading(false);
  }
};
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto  flex flex-col gap-3">
        <div>
          <h1 className="text-3xl font-Manrope font-semibold text-blue-900">
            My Profile
          </h1>

          <p className="text-sm text-gray-500">
            Manage your personal and academic information.
          </p>
        </div>

        <ProfileHeader
          mode="edit"
          name={studentData?.profile?.fullName}
          image={studentData?.profile?.profileImage}
          subtitle={`${studentData?.profile?.department} | ${studentData?.profile?.academicBatch}- ${studentData?.profile?.lastYear}`}
          onImageChange={handleProfileImageSave}
          imageLoading={imageLoading}
        />

        {/* ================= PERSONAL + SKILLS ================= */}

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <PersonalInformation
              data={studentData?.personal}
              onSave={handlePersonalSave}
            />
          </div>

          <div className="w-full md:w-1/2">
            <SkillsAndInterests
              data={studentData?.skills}
              onSave={handleSkillsSave}
            />
          </div>
        </div>

        {/* ================= ACADEMIC + ONLINE ================= */}

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <AcademicInformation
              mode="edit"
              data={studentData?.academic}
              onSave={handleAcademicSave}
            />
          </div>

          <div className=" w-full md:w-1/2">
            <OnlineProfiles
              data={studentData?.profiles}
              onSave={handleOnlineProfilesSave}
            />
          </div>
        </div>

        {/* ================= RESUME ================= */}

        <div className="w-full md:w-1/3">
          <ResumeDocuments
            data={studentData?.document}
            onSave={handleResumeSave}
          />
        </div>
      </div>
    </main>
  );
}
