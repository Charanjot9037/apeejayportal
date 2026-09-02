"use client";

import { useEffect, useState } from "react";
import { updateStudentProfile } from "@/redux/studentSlice";
import ProfileHeader from "../profile/ProfileHeader";
import PersonalInformation from "./ProfileInformation";
import OnlineProfiles from "./OnlineProfile";
import ResumeDocuments from "./ResumeDocuments";
import SkillsAndInterests from "./SkillInterest";
import AcademicInformation from "./AcadamicInformation";
import { apiRequest } from "@/lib/apiRequest";
import AuthGuardModal from "../AuthGuardModal";
import { useDispatch } from "react-redux";
import { loginSuccess, updateUser } from "@/redux/authSlice";

import { useRouter } from "next/navigation";
import { mapStudentToProfile, updatemapStudentToProfile } from "@/lib/mapper";
import { toast } from "sonner";
export default function Profile() {
  const [imageLoading, setImageLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [authModal, setAuthModal] = useState({
    open: false,
    type: null,
    message: "",
  });
  const handleAuthError = (result) => {
    if (result?.status === 401) {
      setAuthModal({
        open: true,
        type: "authentication",
        message:
          result.message || "Your session has expired. Please login again.",
      });

      return true;
    }

    if (result?.status === 403) {
      setAuthModal({
        open: true,
        type: "unauthorized",
        message:
          result.message || "You are not authorized to perform this action.",
      });

      return true;
    }

    return false;
  };
  const dispatch = useDispatch();
  useEffect(() => {
    const getStudentProfile = async () => {
      try {
        const result = await apiRequest("/api/student/profile", {
          method: "GET",
        });
        if (handleAuthError(result)) {
          return;
        }

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch student profile");
        }

        const mappedData = mapStudentToProfile(result.data.data);

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
      toast.success("Personal Information Updated");
      dispatch(
        updateUser({
          email: result?.profile?.userId?.email,
          name: result?.profile?.fullName,
        }),
      );

      setStudentData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          ...data,
        },
        profile: {
          ...prev.profile,
          fullName: data.fullName,
          profileImage: data.profileImage ?? prev.profile.profileImage,
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
      const updatedProfile = updatemapStudentToProfile(result.profile);

      setStudentData(updatedProfile);
      dispatch(
        updateStudentProfile({
          department: result?.profile?.department,
          program: result?.profile?.program,
          academicBatch: result?.profile?.academicBatch,
        }),
      );
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
      dispatch(
        updateStudentProfile({
          profileImage: uploadData.url,
        }),
      );
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
    <>
      <AuthGuardModal
        open={authModal.open}
        type={authModal.type}
        message={authModal.message}
        onClose={() =>
          setAuthModal({
            open: false,
            type: null,
            message: "",
          })
        }
        onLogin={() => router.push("/login")}
        onBack={() => router.back()}
      />
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
            completion={studentData?.profile?.completion}
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
    </>
  );
}
