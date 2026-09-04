
"use client";

import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProjectCard = ({ project }) => {


  const router = useRouter();

  const handleClick = () => {
  router.push(`/project/${project._id}`);
  };

  const student = project.studentInfo || {};

  const projectImage = project.projectImages?.[0]?.url;

  return (
    <div
      className="
        group
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-md
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-500
        ease-out
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-xl
      "
    >
      {/* ================= IMAGE ================= */}
      <div
        className="relative cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          {projectImage ? (
            <Image
              src={projectImage}
              alt={project.title || "Project image"}
              width={500}
              height={300}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-105
              "
            />
          ) : (
             <Image
              src='/landing-page/fallback.png'
              alt={project.title || "Project image"}
              width={500}
              height={300}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-105
              "
            />
          )}
        </div>

        {/* Image Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-primary/70
            via-primary/20
            to-transparent
            opacity-80
            transition-opacity
            duration-500
            group-hover:opacity-90
          "
        />

        {/* Project Title */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            p-4
            transition-transform
            duration-500
            ease-out
            group-hover:-translate-y-1
          "
        >
          <h3
            className="
              text-center
              font-bold
              leading-6
              text-white
              drop-shadow-md
              sm:text-lg
            "
          >
            {project.title}
          </h3>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div
        className="
          flex
          flex-1
          flex-col
          px-4
          py-4
          sm:px-5
        "
      >
        {/* Verified Badge */}
        {project.verified && (
          <div className="flex justify-center">
            <Badge
              className="
                rounded-full
                border
                border-orange-200
                bg-orange-50
                px-2.5
                py-1
                text-[9px]
                font-medium
                tracking-wide
                text-orange-500
                transition-all
                duration-300
                hover:bg-orange-50
                group-hover:border-orange-300
              "
            >
              <CheckCircle2 className="mr-1 h-3 w-3" />
              MENTOR VERIFIED
            </Badge>
          </div>
        )}

        {/* Project Type / Team Information */}
        {project.subtitle && (
          <p
            className="
              mt-2
              text-center
              text-[12px]
              font-medium
              text-slate-500
            "
          >
            {project.subtitle}
          </p>
        )}

        {/* Academic Information */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {/* Program */}
          <div
            className="
              flex
              items-center
              bg-primary
              gap-1.5
              rounded-md
              bg-slate-50
              px-2.5
              py-2
            "
          >
            <GraduationCap className="h-3.5 w-3.5 text-orange-500" />

            <div className="min-w-0">

              <p className="truncate text-[12px] font-medium text-slate-700">
                {student.program || project.program || "-"}
              </p>
            </div>
          </div>

          {/* Semester */}
          <div
            className="
              flex
              items-center
              gap-1.5
              rounded-md
              bg-slate-50
              px-2.5
              py-2
            "
          >
            <BookOpen className="h-3.5 w-3.5 text-orange-500" />

            <div className="min-w-0">
              <p className="truncate text-[12px] font-medium text-slate-700">
                {project.semester
                  ? `Semester ${project.semester}`
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* ================= STUDENT ================= */}
        <div className="mt-auto pt-4">
          <div
            className="
              h-px
              w-full
              bg-slate-200
              transition-all
              duration-500
              group-hover:bg-orange-200
            "
          />

          <div
            className="
              mt-4
              flex
              cursor-pointer
              items-center
              justify-center
              gap-2.5
              rounded-md
              bg-orange-500
              py-2
              text-white
              transition-colors
              hover:bg-orange-500/90
            "
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            {/* Profile Image */}
            <div
              className="
                relative
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-full
                bg-slate-100
                text-[9px]
                font-semibold
                text-orange-400
                ring-1
                ring-slate-200
              "
            >
              {student.profileImage ? (
                <Image
                  src={student.profileImage}
                  alt={student.name || "Student"}
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              ) : (
                <span>
                  {student.name
                    ? student.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "ST"}
                </span>
              )}
            </div>

            {/* Student Name */}
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">
                {student.name || "Unknown Student"}
              </p>

              {student.rollNumber && student.rollNumber !== "-" && (
                <p className="text-[8px] text-orange-100">
                  {student.rollNumber}
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectCard;