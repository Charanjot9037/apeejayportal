

"use client";

import Link from "next/link";
import { getSkillList } from "@/utils/skillHandler";

import {
  BriefcaseBusiness,
  CheckCircle2,
} from "lucide-react";

const StudentCard = ({ student, onSave }) => {
  const {
    _id,
    fullName,
    profileImage,
    program,
    currentSemester,
    skills = [],
  } = student;
  const skillList = getSkillList(skills);

  return (
    <div
      className="
        group
        w-full
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-sm

        transition-all
        duration-300
        ease-out

        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-lg
      "
    >
    <div
  className="
    relative
    aspect-[6/4]
    w-full
    overflow-hidden
    bg-slate-100
  "
>
  {profileImage ? (
    <img
      src={profileImage}
      alt={fullName || "Student"}
      sizes="(max-width: 768px) 100vw, 33vw"
      className="
        object-contain
        object-top
        transition-transform
        duration-500
        ease-out
        group-hover:scale-[1.03]
      "
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-slate-400">
      No profile image
    </div>
  )}

  <div
    className="
      pointer-events-none
      absolute
      inset-0
      bg-gradient-to-t
      from-black/10
      via-transparent
      to-transparent
    "
  />
</div>

      {/* ================= Content ================= */}

      <div className="p-4">
        {/* Name */}

        <div className="flex items-center gap-1.5">
          <p
            className="
              truncate
              text-lg
              font-semibold
              text-[#064a82]

              transition-colors
              duration-200

              group-hover:text-[#053b68]
            "
          >
            {fullName}
          </p>

          <CheckCircle2
            className="
              h-3.5
              w-3.5
              shrink-0
              fill-[#064a82]
              text-white
            "
          />
        </div>

        {/* Course */}

        <p
          className="
            mt-1
            truncate
            text-sm
            text-slate-500
          "
        >
          {program} • Semester {currentSemester}
        </p>

        {/* ================= Skills ================= */}
{/* ================= Skills ================= */}

<div className="mt-3 flex flex-wrap gap-1.5">
  {skillList.slice(0, 4).map((skill, index) => (
    <span
      key={`${skill}-${index}`}
      className="
        rounded-full
        border
        border-slate-200
        bg-slate-50
        px-2.5
        py-1
        text-xs
        font-medium
        text-slate-600
      "
    >
      {skill}
    </span>
  ))}

  {skillList.length > 4 && (
    <span
      className="
        rounded-full
        border
        border-[#064a82]/10
        bg-[#064a82]/5
        px-2.5
        py-1
        text-xs
        font-medium
        text-[#064a82]
      "
    >
      +{skillList.length - 4}
    </span>
  )}
</div>
        {/* ================= Actions ================= */}

        <div className="pt-3">
          <Link
            href={`/students/${_id}`}
            className="
              flex
              h-10
              w-full
              items-center
              justify-center
              rounded-md
              bg-[#064a82]
              px-3
              text-sm
              font-semibold
              text-white

              transition-all
              duration-300
              ease-out

              hover:bg-[#053b68]
              hover:shadow-md

              active:scale-[0.98]

              focus:outline-none
              focus:ring-2
              focus:ring-[#064a82]/20
            "
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;