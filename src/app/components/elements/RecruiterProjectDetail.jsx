// "use client";

// import { useProjectDetail } from "@/hooks/useProjectDetail";
// import { Badge } from "@/components/ui/badge";
// import { ArrowLeft,CheckCircle2,FolderKanban,GitBranch,ExternalLink,GraduationCap } from "lucide-react";
// import { useRouter } from "next/navigation";

// import LoadingState from "../projectDetail/handlers/LoadingState";
// import NotFoundState from "../projectDetail/handlers/NotFoundState";

// import OverviewSection from "../projectDetail/handlers/sections/OverviewSection";
// import TechnologiesSection from "../projectDetail/handlers/sections/TechnologiesSection";
// import GallerySection from "../projectDetail/handlers/sections/GallerySection";
// import DocumentsSection from "../projectDetail/handlers/sections/DocumentSection";
// import TeamMembersSection from "../projectDetail/handlers/sections/TeamMemberSection";
// import MentorSection from "../projectDetail/handlers/sections/MentorSection";
// import ProjectInfoSection from "../projectDetail/handlers/sections/ProjectInfo";
// import ApprovalHistorySection from "../projectDetail/handlers/sections/ApprovalHistorySection";
// import MentorFeedbackSection from "../projectDetail/handlers/sections/MentorFeedbackSection";

// export default function RecruiterProjectDetail({
//   backHref = "/",
//   backLabel = "Back to Home",
// }) {
//   const router = useRouter();

//   /*
//     Only fetch project information.

//     DELETE / UPDATE logic intentionally removed
//     because this page is for recruiters.
//   */
//   const { project, viewerRole, loading } = useProjectDetail();

//   if (loading) {
//     return <LoadingState />;
//   }

//   if (!project) {
//     return <NotFoundState />;
//   }

//   const teamMemberName =
//     project?.teamMembers?.fullName ||
//     project?.teamMembers?.userId?.name ||
//     (project?.teamMembers ? "Team Member" : null);

//   const ownerName = project?.student?.name || "Project Owner";

//   const projectImage = project?.projectImages?.[0];

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* =====================================================
//           TOP NAV / BACK
//       ===================================================== */}
//       <div className="border-b border-slate-200 bg-white">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
//           <button
//             onClick={() => router.push(backHref)}
//             className="
//               group
//               flex
//               items-center
//               gap-2
//               text-sm
//               font-medium
//               text-slate-500
//               transition-colors
//               hover:text-orange-500
//             "
//           >
//             <ArrowLeft
//               className="
//                 h-4
//                 w-4
//                 transition-transform
//                 duration-300
//                 group-hover:-translate-x-1
//               "
//             />

//             {backLabel}
//           </button>

//           <div className="flex items-center gap-2">
//             <Badge
//               className="
//                 rounded-full
//                 border
//                 border-orange-200
//                 bg-orange-50
//                 px-3
//                 py-1
//                 text-[10px]
//                 font-medium
//                 text-orange-500
//                 hover:bg-orange-50
//               "
//             >
//               <CheckCircle2 className="mr-1 h-3 w-3" />
//               MENTOR VERIFIED
//             </Badge>

//             <Badge
//               className="
//                 hidden
//                 rounded-full
//                 border
//                 border-slate-200
//                 bg-slate-50
//                 px-3
//                 py-1
//                 text-[10px]
//                 font-medium
//                 text-slate-500
//                 hover:bg-slate-50
//                 sm:flex
//               "
//             >
//               RECRUITER VIEW
//             </Badge>
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           MAIN CONTENT
//       ===================================================== */}
//       <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
//         {/* ===================================================
//             PROJECT HERO
//         =================================================== */}
//         <section
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-slate-200
//             bg-white
//             shadow-sm
//           "
//         >
//           <div className="grid lg:grid-cols-[minmax(0,1fr)_310px]">
//             {/* -----------------------------------------------
//                 PROJECT IMAGE
//             ------------------------------------------------ */}
//             <div className="relative min-h-[260px] overflow-hidden bg-slate-100 lg:min-h-[340px]">
//               {projectImage ? (
//                 <img
//                   src={projectImage}
//                   alt={project.title || "Project image"}
//                   className="
//                     h-full
//                     min-h-[260px]
//                     w-full
//                     object-cover
//                     lg:min-h-[340px]
//                   "
//                 />
//               ) : (
//                 <div
//                   className="
//                     flex
//                     min-h-[260px]
//                     h-full
//                     items-center
//                     justify-center
//                     bg-gradient-to-br
//                     from-slate-100
//                     to-slate-200
//                     lg:min-h-[340px]
//                   "
//                 >
//                   <div className="text-center">
//                     <FolderKanban className="mx-auto h-12 w-12 text-slate-300" />

//                     <p className="mt-2 text-sm font-medium text-slate-400">
//                       No project image
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Image overlay */}
//               <div
//                 className="
//                   absolute
//                   inset-0
//                   bg-gradient-to-t
//                   from-black/65
//                   via-black/10
//                   to-transparent
//                 "
//               />

//               {/* Image bottom information */}
//               <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
//                 <div className="mb-2 flex flex-wrap items-center gap-2">
//                   {project.verified && (
//                     <Badge
//                       className="
//                         border-orange-300
//                         bg-orange-500
//                         text-[9px]
//                         text-white
//                         hover:bg-orange-500
//                       "
//                     >
//                       <CheckCircle2 className="mr-1 h-3 w-3" />
//                       Mentor Verified
//                     </Badge>
//                   )}

//                   {project.projectType && (
//                     <Badge
//                       className="
//                         border-white/30
//                         bg-black/30
//                         text-[9px]
//                         text-white
//                         backdrop-blur-sm
//                         hover:bg-black/30
//                       "
//                     >
//                       {project.projectType === "team"
//                         ? "Team Project"
//                         : "Individual Project"}
//                     </Badge>
//                   )}
//                 </div>

//                 <h1
//                   className="
//                     max-w-3xl
//                     text-2xl
//                     font-bold
//                     tracking-tight
//                     text-white
//                     sm:text-3xl
//                     lg:text-4xl
//                   "
//                 >
//                   {project.title || "Untitled Project"}
//                 </h1>

//                 {project.subtitle && (
//                   <p className="mt-2 max-w-2xl text-xs leading-5 text-white/80 sm:text-sm">
//                     {project.subtitle}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* -----------------------------------------------
//                 PROJECT ACCESS / QUICK INFO
//             ------------------------------------------------ */}
//             <div className="flex flex-col justify-between border-t border-slate-200 p-5 lg:border-l lg:border-t-0 lg:p-6">
//               <div>
//                 <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
//                   Project Overview
//                 </p>

//                 <div className="mt-4 space-y-3">
//                   <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
//                     <div className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-50">
//                       <GraduationCap className="h-4 w-4 text-orange-500" />
//                     </div>

//                     <div className="min-w-0">
//                       <p className="text-[10px] text-slate-400">
//                         Program
//                       </p>

//                       <p className="truncate text-xs font-semibold text-slate-700">
//                         {project?.studentInfo?.program ||
//                           project?.program ||
//                           "-"}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
//                     <div className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-50">
//                       <FolderKanban className="h-4 w-4 text-orange-500" />
//                     </div>

//                     <div>
//                       <p className="text-[10px] text-slate-400">
//                         Semester
//                       </p>

//                       <p className="text-xs font-semibold text-slate-700">
//                         {project?.semester
//                           ? `Semester ${project.semester}`
//                           : "-"}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
//                     <div className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-50">
//                       <CheckCircle2 className="h-4 w-4 text-orange-500" />
//                     </div>

//                     <div>
//                       <p className="text-[10px] text-slate-400">
//                         Status
//                       </p>

//                       <p className="text-xs font-semibold text-emerald-600">
//                         {project.status || "Approved"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Project Links */}
//               {(project.githubLink || project.liveLink) && (
//                 <div className="mt-5 space-y-2">
//                   {project.liveLink && (
//                     <a
//                       href={project.liveLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="
//                         flex
//                         w-full
//                         items-center
//                         justify-center
//                         gap-2
//                         rounded-md
//                         bg-orange-500
//                         px-4
//                         py-2.5
//                         text-xs
//                         font-semibold
//                         text-white
//                         transition-all
//                         hover:bg-orange-600
//                         hover:shadow-md
//                       "
//                     >
//                       <ExternalLink className="h-3.5 w-3.5" />
//                       View Live Project
//                     </a>
//                   )}

//                   {project.githubLink && (
//                     <a
//                       href={project.githubLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="
//                         flex
//                         w-full
//                         items-center
//                         justify-center
//                         gap-2
//                         rounded-md
//                         border
//                         border-slate-200
//                         bg-white
//                         px-4
//                         py-2.5
//                         text-xs
//                         font-semibold
//                         text-slate-600
//                         transition-all
//                         hover:border-slate-300
//                         hover:bg-slate-50
//                         hover:text-slate-900
//                       "
//                     >
//                       <GitBranch className="h-3.5 w-3.5" />
//                       View GitHub Repository
//                     </a>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </section>

//         {/* ===================================================
//             PROJECT CONTENT
//         =================================================== */}
//         <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
//           {/* =================================================
//               LEFT COLUMN
//           ================================================= */}
//           <div className="min-w-0 space-y-5">
//             <OverviewSection project={project} />

//             <TechnologiesSection project={project} />

//             <GallerySection project={project} />

//             <DocumentsSection
//               project={project}
//               ownerName={ownerName}
//               teamMemberName={teamMemberName}
//             />

//             <MentorFeedbackSection project={project} />
//           </div>

//           {/* =================================================
//               RIGHT COLUMN
//           ================================================= */}
//           <aside className="space-y-5">
//             <TeamMembersSection project={project} />

//             <MentorSection project={project} />

//             <ProjectInfoSection project={project} />

//             <ApprovalHistorySection project={project} />
//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useRecruiterProjectDetail } from "@/hooks/useRecruiterProjectDetail";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  FolderKanban,
  GitBranch,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";

import LoadingState from "../projectDetail/handlers/LoadingState";
import NotFoundState from "../projectDetail/handlers/NotFoundState";

import OverviewSection from "../projectDetail/handlers/sections/OverviewSection";
import TechnologiesSection from "../projectDetail/handlers/sections/TechnologiesSection";
import GallerySection from "../projectDetail/handlers/sections/GallerySection";
import DocumentsSection from "../projectDetail/handlers/sections/DocumentSection";
import TeamMembersSection from "../projectDetail/handlers/sections/TeamMemberSection";
import MentorSection from "../projectDetail/handlers/sections/MentorSection";
import ProjectInfoSection from "../projectDetail/handlers/sections/ProjectInfo";
import ApprovalHistorySection from "../projectDetail/handlers/sections/ApprovalHistorySection";
import MentorFeedbackSection from "../projectDetail/handlers/sections/MentorFeedbackSection";

export default function RecruiterProjectDetail({
  backHref = "/",
  backLabel = "Back to Home",
}) {
  const router = useRouter();

  /*
   * Recruiter-specific project API.
   *
   * GET:
   * /api/recruiter/projects/[id]
   *
   * This does NOT use the student project-detail hook.
   */
  const {
    project,
    viewerRole,
    loading,
    error,
  } = useRecruiterProjectDetail();

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return <LoadingState />;
  }

  /* =====================================================
     ERROR / NOT FOUND
  ===================================================== */

  if (error || !project) {
    return <NotFoundState />;
  }

  /* =====================================================
     PROJECT DATA
  ===================================================== */

  const teamMemberName =
    project?.teamMembers?.fullName ||
    project?.teamMembers?.userId?.name ||
    (project?.teamMembers ? "Team Member" : null);

  const ownerName =
    project?.student?.name || "Project Owner";

  const projectImage =
    project?.projectImages?.[0];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          TOP NAV / BACK
      ===================================================== */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

          <button
            onClick={() => router.push(backHref)}
            className="
              group
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
              transition-colors
              hover:text-orange-500
            "
          >
            <ArrowLeft
              className="
                h-4
                w-4
                transition-transform
                duration-300
                group-hover:-translate-x-1
              "
            />

            {backLabel}
          </button>

          <div className="flex items-center gap-2">

            <Badge
              className="
                rounded-full
                border
                border-orange-200
                bg-orange-50
                px-3
                py-1
                text-[10px]
                font-medium
                text-orange-500
                hover:bg-orange-50
              "
            >
              <CheckCircle2 className="mr-1 h-3 w-3" />
              MENTOR VERIFIED
            </Badge>

            <Badge
              className="
                hidden
                rounded-full
                border
                border-slate-200
                bg-slate-50
                px-3
                py-1
                text-[10px]
                font-medium
                text-slate-500
                hover:bg-slate-50
                sm:flex
              "
            >
              RECRUITER VIEW
            </Badge>

          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-7">

        {/* ===================================================
            PROJECT HERO
        =================================================== */}

        <section
          className="
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <div className="grid lg:grid-cols-[minmax(0,1fr)_310px]">

            {/* =================================================
                PROJECT IMAGE
            ================================================= */}

            <div className="relative min-h-[260px] overflow-hidden bg-slate-100 lg:min-h-[340px]">

              {projectImage ? (
                <img
                  src={projectImage}
                  alt={project.title || "Project image"}
                  className="
                    h-full
                    min-h-[260px]
                    w-full
                    object-cover
                    lg:min-h-[340px]
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    min-h-[260px]
                    items-center
                    justify-center
                    bg-gradient-to-br
                    from-slate-100
                    to-slate-200
                    lg:min-h-[340px]
                  "
                >
                  <div className="text-center">

                    <FolderKanban
                      className="mx-auto h-12 w-12 text-slate-300"
                    />

                    <p className="mt-2 text-sm font-medium text-slate-400">
                      No project image
                    </p>

                  </div>
                </div>
              )}

              {/* Image overlay */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/65
                  via-black/10
                  to-transparent
                "
              />

              {/* Image bottom information */}

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">

                <div className="mb-2 flex flex-wrap items-center gap-2">

                  {project.verified && (
                    <Badge
                      className="
                        border-orange-300
                        bg-orange-500
                        text-[9px]
                        text-white
                        hover:bg-orange-500
                      "
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Mentor Verified
                    </Badge>
                  )}

                </div>

                <h1
                  className="
                    max-w-3xl
                    text-2xl
                    font-bold
                    tracking-tight
                    text-white
                    sm:text-3xl
                    lg:text-4xl
                  "
                >
                  {project.title || "Untitled Project"}
                </h1>

                {project.subtitle && (
                  <p
                    className="
                      mt-2
                      max-w-2xl
                      text-xs
                      leading-5
                      text-white/80
                      sm:text-sm
                    "
                  >
                    {project.subtitle}
                  </p>
                )}

              </div>
            </div>

            {/* =================================================
                PROJECT ACCESS / QUICK INFO
            ================================================= */}

            <div
              className="
                flex
                flex-col
                justify-between
                border-t
                border-slate-200
                p-5
                lg:border-l
                lg:border-t-0
                lg:p-6
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-slate-400
                  "
                >
                  Project Overview
                </p>

                <div className="mt-4 space-y-3">

                  {/* Program */}

                  <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-50">
                      <GraduationCap className="h-4 w-4 text-orange-500" />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[10px] text-slate-400">
                        Program
                      </p>

                      <p className="truncate text-xs font-semibold text-slate-700">
                        {project?.studentInfo?.program ||
                          project?.program ||
                          "-"}
                      </p>

                    </div>
                  </div>

                  {/* Semester */}

                  <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-50">
                      <FolderKanban className="h-4 w-4 text-orange-500" />
                    </div>

                    <div>

                      <p className="text-[10px] text-slate-400">
                        Semester
                      </p>

                      <p className="text-xs font-semibold text-slate-700">
                        {project?.semester
                          ? `Semester ${project.semester}`
                          : project?.studentInfo?.semester
                            ? `Semester ${project.studentInfo.semester}`
                            : "-"}
                      </p>

                    </div>
                  </div>

                  {/* Status */}

                  <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-50">
                      <CheckCircle2 className="h-4 w-4 text-orange-500" />
                    </div>

                    <div>

                      <p className="text-[10px] text-slate-400">
                        Status
                      </p>

                      <p className="text-xs font-semibold text-emerald-600">
                        {project.status || "Approved"}
                      </p>

                    </div>
                  </div>

                </div>
              </div>

              {/* =================================================
                  PROJECT LINKS
              ================================================= */}

              {(project.githubLink || project.liveLink) && (
                <div className="mt-5 space-y-2">

                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-md
                        bg-orange-500
                        px-4
                        py-2.5
                        text-xs
                        font-semibold
                        text-white
                        transition-all
                        hover:bg-orange-600
                        hover:shadow-md
                      "
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Live Project
                    </a>
                  )}

                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-md
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-2.5
                        text-xs
                        font-semibold
                        text-slate-600
                        transition-all
                        hover:border-slate-300
                        hover:bg-slate-50
                        hover:text-slate-900
                      "
                    >
                      <GitBranch className="h-3.5 w-3.5" />
                      View GitHub Repository
                    </a>
                  )}

                </div>
              )}

            </div>
          </div>
        </section>

        {/* ===================================================
            PROJECT CONTENT
        =================================================== */}

        <div
          className="
            mt-5
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-[minmax(0,1fr)_280px]
          "
        >

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="min-w-0 space-y-5">

            <OverviewSection
              project={project}
            />

            <TechnologiesSection
              project={project}
            />

            <GallerySection
              project={project}
            />

            <DocumentsSection
              project={project}
              ownerName={ownerName}
              teamMemberName={teamMemberName}
            />

            <MentorFeedbackSection
              project={project}
            />

          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <aside className="space-y-5">

            <TeamMembersSection
              project={project}
            />

            <MentorSection
              project={project}
            />

            <ProjectInfoSection
              project={project}
            />

            <ApprovalHistorySection
              project={project}
            />

          </aside>
        </div>
      </main>
    </div>
  );
}

