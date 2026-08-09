"use client";

import Link from "next/link";

import {
  CalendarDays,
  BriefcaseBusiness,
  CheckCircle2,
  Bookmark,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const StudentCard = ({ student, onSave }) => {
  const {
    id,
    student: name,
    image,
    course,
    year,
    status,
    match,
    skills,
    projects,
    intake,
    verified,
  } = student;

  const isInterviewing = status === "Interviewing";

  return (
    <div
      className="
        group
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
      {/* ================= Image ================= */}

      <div className="relative h-1/2 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="
            h-full
            w-full
            object-cover

            transition-transform
            duration-500
            ease-out

            group-hover:scale-[1.03]
          "
        />

        {/* Image Overlay */}

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

      <div className="p-3">
        {/* Name */}

        <div className="flex items-center   gap-1.5">
          <p
            className="
              truncate
              font-semibold
              text-[#064a82]
              text-md

              transition-colors
              duration-200

              group-hover:text-[#053b68]
            "
          >
            {name}
          </p>

          {verified && (
            <CheckCircle2
              className="
                h-3.5
                w-3.5
                shrink-0
                fill-[#064a82]
                text-white
              "
            />
          )}
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
          {course} • {year}
        </p>

        {/* ================= Skills ================= */}

        <div className="mt-3  text-xs flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="
                rounded-full
                border
                border-slate-200
                bg-slate-50
                px-2
                py-1
                font-medium
                text-slate-600

                transition-all
                duration-200

                hover:border-[#064a82]/20
                hover:bg-[#064a82]/5
                hover:text-[#064a82]
              "
            >
              {skill}
            </span>
          ))}
        </div>

        {/* ================= Meta ================= */}

        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            border-t
            border-slate-100
            pt-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-1.5
              text-xs
              text-slate-500
            "
          >
            <BriefcaseBusiness className="h-3 w-3" />

            <p>{projects} projects</p>
          </div>


        {/* ================= Actions ================= */}


   

         
        </div>
        <div className="pt-3">
               <Link
  href={`/students/${id}`}
  className="
    flex
    h-8
    items-center
    justify-center
    rounded-md
    bg-[#064a82]
    px-3
    text-sm
    font-medium
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