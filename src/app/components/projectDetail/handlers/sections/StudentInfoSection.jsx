

"use client";

import {
  Mail,
  GraduationCap,
  Eye,
  Users,
  UserRound,
} from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import SideCard from "../SideCard";
import SmallInfo from "../SmallInfo";

export default function StudentInfoSection({ project }) {
  const router = useRouter();

  const student = project?.studentInfo?._id
    ? project.studentInfo
    : null;
  const teamMember = project?.teamMemberInfo?._id
    ? project.teamMemberInfo
    : null;

  const isTeamProject =
    project?.projectType === "team" && !!teamMember;

  const handleViewProfile = (studentId) => {
    if (!studentId) return;

    router.push(`/view-profile/${studentId}`);
  };

  // ================= INITIALS =================

  const getInitials = (name) => {
    if (!name) return "ST";

    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ================= TEAM MEMBER ROW =================

  const TeamMemberRow = ({
    member,
    image,
    role,
  }) => {
    const memberId = member?._id;

    return (
      <div
        className="
          flex
          items-center
          gap-3
          border-b
          border-slate-100
          py-3
          last:border-b-0
        "
      >
        {/* Avatar */}
        <div
          className="
            relative
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
            border
            border-orange-200
            bg-orange-50
          "
        >
          {image ? (
            <Image
              src={image}
              alt={member?.name || "Student"}
              fill
              sizes="44px"
              className="object-cover"
            />
          ) : (
            <span
              className="
                text-sm
                font-medium
                text-orange-500
              "
            >
              {getInitials(member?.name)}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <p
            className="
              truncate
              text-[15px]
              font-medium
              text-slate-900
            "
          >
            {member?.name || "Unknown Student"}
          </p>

          <p
            className="
              mt-0.5
              truncate
              text-sm
              text-[#8090b5]
            "
          >
            {role}
          </p>
        </div>

        {/* View Profile */}
        <button
          type="button"
          onClick={() => handleViewProfile(memberId)}
          disabled={!memberId}
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-md
            hover:cursor-pointer
            border
            border-orange-200
            bg-white
            text-orange-500
            transition-all
            duration-200
            hover:bg-orange-50
            hover:border-orange-300
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
          title="View Profile"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  };

  // =====================================================
  // TEAM PROJECT
  // =====================================================

  if (isTeamProject) {
    return (
      <SideCard title="TEAM MEMBERS">
        <div className="space-y-3">


          {/* Member 1 */}
          <TeamMemberRow
            member={student}
            image={project?.studentInfo?.profileImage}
            role="Project Owner"
          />

          {/* Member 2 */}
          <TeamMemberRow
            member={teamMember}
            image={teamMember?.profileImage}
            role="Team Member"
          />

          {/* Academic Information */}
          <div className="border-t border-slate-100 pt-3">

            <div className="grid grid-cols-2 gap-2">

              <SmallInfo
                icon={
                  <GraduationCap className="h-3.5 w-3.5" />
                }
                label="Program"
                value={
                  project?.studentInfo?.program ||
                  "Not provided"
                }
              />

              <SmallInfo
                icon={
                  <Users className="h-3.5 w-3.5" />
                }
                label="Type"
                value="Team Project"
              />

            </div>

          </div>
        </div>
      </SideCard>
    );
  }

  // =====================================================
  // INDIVIDUAL PROJECT
  // =====================================================

  return (
    <SideCard title="Student Information">
      <div className="space-y-4">

        {/* Profile */}
        <div className="flex flex-col items-center">

          <div
            className="
              relative
              h-60
              w-full
              overflow-hidden
              rounded-md
              bg-orange-50
            "
          >
            {project?.studentInfo?.profileImage ? (
              <Image
                src={project.studentInfo.profileImage}
                alt={student?.name || "Student"}
                fill
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-7xl font-semibold tracking-wide text-orange-500">
                  {getInitials(student?.name)}
                </span>
              </div>
            )}
          </div>

          {/* Name */}
          <p className="mt-2 text-sm font-semibold text-slate-800">
            {student?.name || "Unknown Student"}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-100" />

        {/* Email */}
        <SmallInfo
          icon={<Mail className="h-3.5 w-3.5" />}
          label="Email"
          value={student?.email || "Not provided"}
        />

        {/* Program */}
        <SmallInfo
          icon={
            <GraduationCap className="h-3.5 w-3.5" />
          }
          label="Program"
          value={
            project?.studentInfo?.program ||
            "Not provided"
          }
        />

        {/* View Profile */}
        <button
          type="button"
          onClick={() =>
            handleViewProfile(student?._id)
          }
          disabled={!student?._id}
          className="
            mt-2
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-md
            bg-orange-500
            px-3
            py-2
            text-sm
            font-medium
            text-white
            shadow-sm
            transition-all
            duration-200
            hover:bg-orange-600
            hover:shadow
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Eye className="h-3.5 w-3.5" />
          View Profile
        </button>

      </div>
    </SideCard>
  );
}