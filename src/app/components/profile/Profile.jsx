"use client";
import ProfileHeader from "../profile/ProfileHeader";
import { useState } from "react";
import PersonalInformation from "./ProfileInformation";
import OnlineProfiles from "./OnlineProfile";
import ResumeDocuments from "./ResumeDocuments";
import SkillsAndInterests from "./SkillInterest";
import AcademicInformation from "./AcadamicInformation";
export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const personalInformation = {
    fullName: "Alex Johnson",
    email: "alex.johnson@university.edu",
    phone: "+91 98765 43210",
    dateOfBirth: "15 March 2003",
    gender: "Male",
    address: "42, Sector 12, Chandigarh, India",
  };

  function handlePersonalSave(data) {
    console.log("Updated personal information:", data);
  }
  return (
    <main className="min-h-screen bg-[#F7F5F0] ">
      <div className="mx-auto flex flex-col gap-3 ">
        <div className="">
          <h1 className="text-3xl font-Manrope font-semibold text-blue-900">
            My Profile
          </h1>

          <p className=" text-sm text-gray-500">
            Manage your personal and academic information.
          </p>
        </div>
        <ProfileHeader mode="create" />
        <div className="flex gap-4">
          <div className="w-1/2">
            <PersonalInformation onSave={handlePersonalSave} />
          </div>
          <div className="w-1/2">
            <SkillsAndInterests />
          </div>
        </div>
        <div className="flex gap-4 ">
          <div className="w-1/2">
            <AcademicInformation mode="edit" />
          </div>
          <div className="w-1/2">
            <OnlineProfiles
            //   data={studentData}
            //   onSave={async (values) => {
            //     await axios.put(
            //       "/api/student/online-profiles",
            //       values
            //     );
            //   }}
            />
          </div>
        </div>
        <div className="w-1/3">
          <ResumeDocuments
          //   data={studentData}
          //   onSave={async (values) => {
          //     const formData = new FormData();

          //     if (values.resumeFile) {
          //       formData.append(
          //         "resume",
          //         values.resumeFile
          //       );
          //     }

          //     await axios.put(
          //       "/api/student/resume",
          //       formData,
          //       {
          //         headers: {
          //           "Content-Type": "multipart/form-data",
          //         },
          //       }
          //     );
          //   }}
          />
        </div>
      </div>
    </main>
  );
}
