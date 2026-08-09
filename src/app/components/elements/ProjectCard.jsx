
"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Link } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProjectCard = ({ project }) => {
  const router=useRouter();
    const handleClick = () => {
    router.push("/studentSearch");
  };

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
      onClick={handleClick}
    >
      {/* ================= IMAGE ================= */}
      <div className="relative overflow-hidden">
        <div className="relative aspect-video w-full overflow-hidden">
         <Image
  src={project.image}
  alt={project.title}
  fill
  sizes="(max-width: 700px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="
    h-full
    w-full
    object-cover
    transition-transform
    duration-700
    ease-out
    group-hover:scale-105
  "></Image>
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

        {/* Description */}
        <p
          className="
            mt-3
            line-clamp-3
            text-center
            text-xs
            leading-5
           text-black
            transition-colors
            duration-300
            group-hover:text-slate-600
          "
        >
          {project.description}
        </p>

        {/* Student */}
        <div className="mt-auto  hover:cursor-pointer pt-4">
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

          <div className="mt-4 bg-orange-500 py-2 rounded-md hover:bg-orange-500/90  text-white  flex items-center justify-center gap-2.5">
            {/* Initials */}
            <div
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-slate-100
                text-[9px]
                font-semibold
                ring-1
                ring-slate-200
                transition-all
                duration-300
               text-orange-400
              "
            >
              {project.initials}
            </div>

            {/* Student Name */}
            <p
              className="
                text-xs
                font-medium
                transition-colors
                duration-300
              "
            >
              {project.student}
            </p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ProjectCard;