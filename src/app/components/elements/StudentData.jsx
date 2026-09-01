// 'use client';

// /* =========================================================
//    SECTION CARD
// ========================================================= */

// function SectionCard({ children, className = '' }) {
//   return (
//     <div
//       className={`rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)] ${className}`}
//     >
//       {children}
//     </div>
//   );
// }

// /* =========================================================
//    SECTION TITLE
// ========================================================= */

// function SectionTitle({ symbol, children }) {
//   return (
//     <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
//       <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-sm font-bold text-orange-500">
//         {symbol}
//       </span>

//       <h2 className="text-[17px] font-semibold text-slate-800">{children}</h2>
//     </div>
//   );
// }

// /* =========================================================
//    SKILL GROUP
// ========================================================= */

// function SkillGroup({ title, skills }) {
//   if (!skills || skills.length === 0) {
//     return null;
//   }

//   return (
//     <div>
//       <p className="mb-2 text-[10px] font-semibold uppercase tracking-[1px] text-slate-400">
//         {title}
//       </p>

//       <div className="flex flex-wrap gap-2">
//         {skills.map((skill) => (
//           <span
//             key={skill}
//             className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-1.5 text-[11px] font-medium text-orange-700"
//           >
//             {skill}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    SOCIAL LINK
// ========================================================= */

// function SocialLink({ symbol, name, href }) {
//   if (!href) {
//     return null;
//   }

//   const formattedHref =
//     href.startsWith('http://') || href.startsWith('https://')
//       ? href
//       : `https://${href}`;

//   return (
//     <a
//       href={formattedHref}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="group flex items-center rounded-xl border border-slate-200 bg-white px-3 py-3 transition hover:border-blue-200 hover:bg-slate-50"
//     >
//       <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600">
//         {symbol}
//       </div>

//       <span className="ml-3 flex-1 text-[12px] font-medium text-slate-600">
//         {name}
//       </span>

//       <span className="text-sm text-slate-300 transition group-hover:text-blue-700">
//         ↗
//       </span>
//     </a>
//   );
// }

// /* =========================================================
//    PROJECT CARD
// ========================================================= */

// function ProjectCard({ project }) {
//   const image =
//     project.projectImages?.length > 0 ? project.projectImages[0]?.url : null;

//   return (
//     <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(15,23,42,0.08)]">
//       {/* Image */}

//       <div className="relative h-[175px] overflow-hidden bg-slate-100">
//         {image ? (
//           <img
//             src={image}
//             alt={project.title || 'Project'}
//             className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
//           />
//         ) : (
//           <div className="flex h-full items-center justify-center">
//             <span className="text-xs font-medium text-slate-400">
//               No project image
//             </span>
//           </div>
//         )}

//         {project.status === 'Approved' && (
//           <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-[9px] font-semibold text-white shadow-sm">
//             ✓ Approved
//           </span>
//         )}
//       </div>

//       {/* Content */}

//       <div className="p-5">
//         <h3 className="text-[17px] font-semibold text-slate-800">
//           {project.title}
//         </h3>

//         {project.subtitle && (
//           <p className="mt-1 text-[11px] font-medium text-orange-500">
//             {project.subtitle}
//           </p>
//         )}

//         <p className="mt-2 line-clamp-3 min-h-[54px] text-[12px] leading-[1.6] text-slate-500">
//           {project.description}
//         </p>

//         <div className="mt-4 flex items-center border-t border-slate-100 pt-4">
//           <div className="flex flex-wrap gap-1.5">
//             {(project.techStack || []).map((tech) => (
//               <span
//                 key={tech}
//                 className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-medium text-slate-500"
//               >
//                 {tech}
//               </span>
//             ))}
//           </div>

//           {project.githubLink && (
//             <a
//               href={project.githubLink}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-blue-700 transition hover:text-orange-500"
//             >
//               View Project
//               <span className="text-sm">→</span>
//             </a>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    MAIN REUSABLE COMPONENT
// ========================================================= */

// export default function StudentData({ student, projects = [] }) {
//   if (!student) {
//     return null;
//   }

//   const skills = student.skills || [];
//   const interests = student.interests || [];

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-800">
//       {/* =====================================================
//           PROFILE HEADER
//       ====================================================== */}

//       <section className="relative overflow-hidden border-b border-slate-200 bg-white">
//         {/* Decorative Background */}

//         <div className="pointer-events-none absolute right-0 top-0 h-full w-[40%] bg-gradient-to-l from-blue-50/60 to-transparent" />

//         <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
//           <div className="relative">
//             {/* Profile Label */}

//             <div className="mb-6 flex items-center gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

//               <span className="text-[10px] font-semibold uppercase tracking-[1.5px] text-slate-400">
//                 Student Profile
//               </span>
//             </div>

//             {/* Profile */}

//             <div className="flex flex-col gap-7 lg:flex-row lg:items-center">
//               {/* =================================================
//                   PROFILE IMAGE
//               ================================================= */}

//               <div className="relative shrink-0">
//                 <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-[0_5px_20px_rgba(15,23,42,0.12)]">
//                   {student.profileImage ? (
//                     <img
//                       src={student.profileImage}
//                       alt={student.fullName}
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-50 text-4xl font-bold text-blue-800">
//                       {student.fullName?.charAt(0)?.toUpperCase()}
//                     </div>
//                   )}
//                 </div>

//                 {/* Active Indicator */}

//                 <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-emerald-500">
//                   <span className="h-2 w-2 rounded-full bg-white" />
//                 </span>
//               </div>

//               {/* =================================================
//                   STUDENT INFORMATION
//               ================================================= */}

//               <div className="min-w-0 flex-1">
//                 <div className="flex flex-wrap items-center gap-3">
//                   <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
//                     {student.fullName}
//                   </h1>

//                   <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-700">
//                     Active Student
//                   </span>
//                 </div>

//                 {student.program && (
//                   <p className="mt-2 text-sm font-medium text-slate-600">
//                     {student.program}
//                   </p>
//                 )}

//                 <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-slate-400">
//                   {student.department && (
//                     <span className="font-medium text-slate-500">
//                       {student.department}
//                     </span>
//                   )}

//                   {student.lastYear && (
//                     <>
//                       <span className="text-slate-300">•</span>

//                       <span>{student.lastYear}</span>
//                     </>
//                   )}

//                   {student.academicBatch && (
//                     <>
//                       <span className="text-slate-300">•</span>

//                       <span>{student.academicBatch}</span>
//                     </>
//                   )}

//                   {student.rollNumber && (
//                     <>
//                       <span className="text-slate-300">•</span>

//                       <span>Roll No. {student.rollNumber}</span>
//                     </>
//                   )}
//                 </div>

//                 {/* Buttons */}

//                 <div className="mt-5 flex flex-wrap gap-2.5">
//                   {student.phone && (
//                     <a
//                       href={`tel:${student.phone}`}
//                       className="inline-flex h-9 items-center gap-2 rounded-lg bg-orange-500 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600"
//                     >
//                       <span>✆</span>
//                       Contact Student
//                     </a>
//                   )}

//                   {student.resume && (
//                     <a
//                       href={student.resume}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
//                     >
//                       <span>↓</span>
//                       View Resume
//                     </a>
//                   )}
//                 </div>
//               </div>

//               {/* =================================================
//                   QUICK STATS
//               ================================================= */}

//               <div className="grid w-full shrink-0 grid-cols-2 gap-3 sm:w-[230px]">
//                 <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center">
//                   <p className="text-2xl font-bold text-blue-800">
//                     {projects.length}
//                   </p>

//                   <p className="mt-1 text-[9px] font-semibold uppercase tracking-[1px] text-slate-400">
//                     Projects
//                   </p>
//                 </div>

//                 <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center">
//                   <p className="text-2xl font-bold text-blue-800">
//                     {skills.length}
//                   </p>

//                   <p className="mt-1 text-[9px] font-semibold uppercase tracking-[1px] text-slate-400">
//                     Skills
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* =====================================================
//           MAIN CONTENT
//       ====================================================== */}

//       <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-7 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:px-8">
//         {/* LEFT COLUMN */}

//         <aside className="space-y-5">
//           {/* ABOUT */}

//           <SectionCard className="p-5">
//             <SectionTitle symbol="i">About</SectionTitle>

//             <p className="mt-4 text-[12px] leading-[1.7] text-slate-500">
//               {interests.length > 0
//                 ? `Interested in ${interests.join(', ')}.`
//                 : 'No additional information has been provided by the student.'}
//             </p>
//           </SectionCard>

//           {/* SKILLS */}

//           <SectionCard className="p-5">
//             <SectionTitle symbol="&lt;&gt;">
//               Skills &amp; Expertise
//             </SectionTitle>

//             <div className="mt-5 space-y-5">
//               <SkillGroup title="Skills" skills={skills} />

//               {interests.length > 0 && (
//                 <SkillGroup title="Interests" skills={interests} />
//               )}

//               {skills.length === 0 && interests.length === 0 && (
//                 <p className="text-xs text-slate-400">No skills added yet.</p>
//               )}
//             </div>
//           </SectionCard>

//           {/* ACADEMIC INFORMATION */}

//           <SectionCard className="p-5">
//             <SectionTitle symbol="A">Academic Information</SectionTitle>

//             <div className="mt-4 space-y-3">
//               {[
//                 ['Program', student.program],
//                 ['Department', student.department],
//                 ['Roll Number', student.rollNumber],
//                 ['Batch', student.academicBatch],
//                 ['Year', student.lastYear],
//                 ['Specialization', student.specialization],
//               ].map(([label, value]) =>
//                 value ? (
//                   <div
//                     key={label}
//                     className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2.5 last:border-0 last:pb-0"
//                   >
//                     <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
//                       {label}
//                     </span>

//                     <span className="text-right text-[11px] font-medium text-slate-700">
//                       {value}
//                     </span>
//                   </div>
//                 ) : null,
//               )}
//             </div>
//           </SectionCard>

//           {/* ONLINE PRESENCE */}

//           <SectionCard className="p-5">
//             <SectionTitle symbol="↗">Online Presence</SectionTitle>

//             <div className="mt-4 space-y-2.5">
//               <SocialLink symbol="GH" name="GitHub" href={student.github} />

//               <SocialLink symbol="in" name="LinkedIn" href={student.linkedin} />

//               <SocialLink
//                 symbol="WWW"
//                 name="Personal Portfolio"
//                 href={student.portfolio}
//               />

//               {!student.github && !student.linkedin && !student.portfolio && (
//                 <p className="text-xs text-slate-400">
//                   No online profiles added.
//                 </p>
//               )}
//             </div>
//           </SectionCard>
//         </aside>

//         {/* RIGHT COLUMN */}

//         <section className="min-w-0">
//           {/* CURRENT STANDING */}

//           <div className="relative mb-6 overflow-hidden rounded-2xl bg-[#07518a] px-6 py-5 text-white shadow-sm">
//             <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full border border-white/10" />

//             <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-[9px] font-semibold uppercase tracking-[1.5px] text-blue-200">
//                   Current Standing
//                 </p>

//                 <h2 className="mt-1 text-lg font-semibold">
//                   {student.department || 'Department not specified'}
//                 </h2>

//                 <p className="mt-1 text-[11px] text-blue-100">
//                   {student.program || 'Program not specified'}
//                 </p>
//               </div>

//               <div className="flex gap-8 sm:pr-4">
//                 <div>
//                   <p className="text-2xl font-bold text-orange-400">
//                     {student.lastYear || '-'}
//                   </p>

//                   <p className="mt-1 text-[9px] uppercase tracking-wide text-blue-200">
//                     YEAR
//                   </p>
//                 </div>

//                 <div className="border-l border-white/10 pl-8">
//                   <p className="text-2xl font-bold">
//                     {student.academicBatch || '-'}
//                   </p>

//                   <p className="mt-1 text-[9px] uppercase tracking-wide text-blue-200">
//                     BATCH
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* PROJECT PORTFOLIO */}

//           <div className="mb-7">
//             <div className="mb-4 flex items-center justify-between">
//               <div>
//                 <p className="text-[10px] font-semibold uppercase tracking-[1px] text-orange-500">
//                   Student Work
//                 </p>

//                 <h2 className="mt-1 text-xl font-bold text-slate-800">
//                   Project Portfolio
//                 </h2>
//               </div>

//               <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-500">
//                 {projects.length}{' '}
//                 {projects.length === 1 ? 'Project' : 'Projects'}
//               </span>
//             </div>

//             {projects.length > 0 ? (
//               <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
//                 {projects.map((project) => (
//                   <ProjectCard key={project._id} project={project} />
//                 ))}
//               </div>
//             ) : (
//               <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
//                 <p className="text-sm font-medium text-slate-600">
//                   No projects available
//                 </p>

//                 <p className="mt-1 text-xs text-slate-400">
//                   This student has not added any projects yet.
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* PROJECT OVERVIEW */}

//           {projects.length > 0 && (
//             <SectionCard className="p-5">
//               <SectionTitle symbol="✓">Project Overview</SectionTitle>

//               <div className="mt-5 space-y-3">
//                 {projects.map((project) => (
//                   <div
//                     key={project._id}
//                     className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3"
//                   >
//                     <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//                       <div>
//                         <p className="text-[12px] font-semibold text-slate-700">
//                           {project.title}
//                         </p>

//                         <p className="mt-1 text-[10px] text-slate-400">
//                           {project.projectType || 'Individual'}

//                           {project.semester
//                             ? ` • Semester ${project.semester}`
//                             : ''}
//                         </p>
//                       </div>

//                       <span
//                         className={`w-fit rounded-full px-2.5 py-1 text-[9px] font-semibold ${
//                           project.status === 'Approved'
//                             ? 'bg-emerald-50 text-emerald-700'
//                             : project.status === 'Rejected'
//                               ? 'bg-red-50 text-red-600'
//                               : 'bg-orange-50 text-orange-600'
//                         }`}
//                       >
//                         {project.status || 'Pending Approval'}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </SectionCard>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }
"use client";

/* =========================================================
   SECTION CARD
========================================================= */

function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)] ${className}`}
    >
      {children}
    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({ symbol, children }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-[#07518a]">
        {symbol}
      </div>

      <h2 className="text-[15px] font-bold tracking-tight text-slate-800">
        {children}
      </h2>
    </div>
  );
}

/* =========================================================
   SKILL GROUP
========================================================= */

function SkillGroup({ title, skills }) {
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-[#07518a] transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   SOCIAL LINK
========================================================= */

function SocialLink({ symbol, name, href }) {
  if (!href) {
    return null;
  }

  const formattedHref =
    href.startsWith("http://") || href.startsWith("https://")
      ? href
      : `https://${href}`;

  return (
    <a
      href={formattedHref}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-[#07518a] shadow-sm">
        {symbol}
      </div>

      <span className="ml-3 flex-1 text-[12px] font-semibold text-slate-600">
        {name}
      </span>

      <span className="text-sm text-slate-300 transition group-hover:text-[#07518a]">
        ↗
      </span>
    </a>
  );
}

/* =========================================================
   PROJECT CARD
========================================================= */

function ProjectCard({ project }) {
  const image =
    project.projectImages?.length > 0 ? project.projectImages[0]?.url : null;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_12px_30px_rgba(7,81,138,0.12)]">
      {/* IMAGE */}
      <div className="relative h-[190px] overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={project.title || "Project"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl text-[#07518a] shadow-sm">
              &lt;/&gt;
            </div>

            <span className="text-xs font-medium text-slate-400">
              No project image
            </span>
          </div>
        )}

        {/* IMAGE OVERLAY */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* STATUS */}
        {project.status === "Approved" && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-3 py-1.5 text-[9px] font-bold text-white shadow-lg">
            ✓ Approved
          </span>
        )}

        {project.status === "Rejected" && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1.5 text-[9px] font-bold text-white shadow-lg">
            Rejected
          </span>
        )}

        {!["Approved", "Rejected"].includes(project.status) && (
          <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1.5 text-[9px] font-bold text-white shadow-lg">
            Pending
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[17px] font-bold text-slate-800 transition group-hover:text-[#07518a]">
              {project.title}
            </h3>

            {project.subtitle && (
              <p className="mt-1 text-[11px] font-semibold text-orange-500">
                {project.subtitle}
              </p>
            )}
          </div>

          {project.semester && (
            <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-500">
              Sem {project.semester}
            </span>
          )}
        </div>

        <p className="mt-3 line-clamp-3 min-h-[54px] text-[12px] leading-[1.7] text-slate-500">
          {project.description || "No project description available."}
        </p>

        {/* TECH STACK */}
        {project.techStack?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-blue-50 px-2.5 py-1 text-[9px] font-semibold text-[#07518a]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-5 flex items-center border-t border-slate-100 pt-4">
          <div className="text-[10px] font-medium text-slate-400">
            {project.projectType || "Individual"} Project
          </div>

          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[#07518a] px-3 py-2 text-[10px] font-bold text-white transition hover:bg-[#063f6b]"
            >
              View Project
              <span>→</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function StudentData({ student, projects = [] }) {
  if (!student) {
    return null;
  }

  const skills = student.skills || [];
  const interests = student.interests || [];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* =====================================================
          PROFILE HEADER
      ====================================================== */}

      <section className="relative overflow-hidden bg-primary-orange text-white">
        {/* BACKGROUND DECORATION */}

        <div className="pointer-events-none absolute right-[25%] top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-3">
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
            {/* =================================================
                PROFILE IMAGE
            ================================================= */}

            <div className="relative shrink-0">
              <div className="absolute -inset-2 rounded-full bg-orange-500/30 blur-sm" />

              <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white/90 bg-blue-900 shadow-2xl sm:h-36 sm:w-36">
                {student.profileImage ? (
                  <img
                    src={student.profileImage}
                    alt={student.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-900 text-3xl font-bold text-white">
                    {student.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* ACTIVE */}
              <span className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#07518a] bg-emerald-500">
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
              </span>
            </div>

            {/* =================================================
                STUDENT INFO
            ================================================= */}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {student.fullName}
                </h1>

                <span className="rounded-full border bg-primary px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                  Active Student
                </span>
              </div>

              {student.program && (
                <p className="mt-2 text-sm font-medium text-blue-100">
                  {student.program}
                </p>
              )}

              {/* META */}
              <div className=" flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-white">
                {student.department && (
                  <span className="font-semibold text-white">
                    {student.department}
                  </span>
                )}

                {student.lastYear && (
                  <>
                    <span className="text-white/30">•</span>
                    <span>{student.lastYear}</span>
                  </>
                )}

                {student.academicBatch && (
                  <>
                    <span className="text-white/30">•</span>
                    <span>{student.academicBatch}</span>
                  </>
                )}

                {student.rollNumber && (
                  <>
                    <span className="text-white/30">•</span>
                    <span>Roll No. {student.rollNumber}</span>
                  </>
                )}
              </div>

              {/* BUTTONS */}
              <div className="mt-6 flex flex-wrap gap-3">
                {student.phone && (
                  <a
                    href={`tel:${student.phone}`}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-5 text-xs font-bold text-white shadow-lg shadow-orange-900/20 transition hover:bg-orange-600 hover:shadow-xl"
                  >
                    <span className="text-sm">✆</span>
                    Contact Student
                  </a>
                )}

                {student.resume && (
                  <a
                    href={student.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#07518a]"
                  >
                    <span>↓</span>
                    View Resume
                  </a>
                )}
              </div>
            </div>

            {/* =================================================
                STATS
            ================================================= */}

            <div className="grid w-full shrink-0 grid-cols-2 gap-3 sm:w-[260px]">
              {/* PROJECTS */}
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur-md">
                <p className="text-3xl font-bold text-white">
                  {projects.length}
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-[1.5px] text-blue-100">
                  Projects
                </p>
              </div>

              {/* SKILLS */}
              <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-5 text-center backdrop-blur-md">
                <p className="text-3xl font-bold text-orange-300">
                  {skills.length}
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-[1.5px] text-orange-100">
                  Skills
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-7 sm:px-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-8">
        {/* =====================================================
            LEFT COLUMN
        ====================================================== */}

        <aside className="space-y-5">
          {/* ABOUT */}
          <SectionCard className="p-5">
            <SectionTitle symbol="i">About</SectionTitle>

            <p className="mt-5 text-[12px] leading-[1.8] text-slate-500">
              {interests.length > 0
                ? `Interested in ${interests.join(", ")}.`
                : "No additional information has been provided by the student."}
            </p>
          </SectionCard>

          {/* SKILLS */}
          <SectionCard className="p-5">
            <SectionTitle symbol="<>">Skills &amp; Expertise</SectionTitle>

            <div className="mt-5 space-y-6">
              <SkillGroup title="Technical Skills" skills={skills} />

              {interests.length > 0 && (
                <SkillGroup title="Interests" skills={interests} />
              )}

              {skills.length === 0 && interests.length === 0 && (
                <p className="text-xs text-slate-400">No skills added yet.</p>
              )}
            </div>
          </SectionCard>

          {/* ACADEMIC INFORMATION */}
          <SectionCard className="p-5">
            <SectionTitle symbol="A">Academic Information</SectionTitle>

            <div className="mt-5 space-y-3">
              {[
                ["Program", student.program],
                ["Department", student.department],
                ["Roll Number", student.rollNumber],
                ["Batch", student.academicBatch],
                ["Year", student.lastYear],
                ["Specialization", student.specialization],
              ].map(([label, value]) =>
                value ? (
                  <div
                    key={label}
                    className="rounded-xl bg-slate-50 px-3.5 py-3"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[1px] text-slate-400">
                      {label}
                    </p>

                    <p className="mt-1 text-[11px] font-semibold text-slate-700">
                      {value}
                    </p>
                  </div>
                ) : null,
              )}
            </div>
          </SectionCard>

          {/* ONLINE PRESENCE */}
          <SectionCard className="p-5">
            <SectionTitle symbol="↗">Online Presence</SectionTitle>

            <div className="mt-5 space-y-2.5">
              <SocialLink symbol="GH" name="GitHub" href={student.github} />

              <SocialLink symbol="in" name="LinkedIn" href={student.linkedin} />

              <SocialLink
                symbol="WWW"
                name="Personal Portfolio"
                href={student.portfolio}
              />

              {!student.github && !student.linkedin && !student.portfolio && (
                <div className="rounded-xl bg-slate-50 px-4 py-5 text-center">
                  <p className="text-xs text-slate-400">
                    No online profiles added.
                  </p>
                </div>
              )}
            </div>
          </SectionCard>
        </aside>

        {/* =====================================================
            RIGHT COLUMN
        ====================================================== */}

        <section className="min-w-0">
          {/* =================================================
              CURRENT STANDING
          ================================================= */}

          {/* <div className="relative mb-7 overflow-hidden rounded-2xl bg-primary px-6 py-6 text-white ">
            <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />

                  <p className="text-[9px] font-bold uppercase tracking-[1.8px] text-blue-200">
                    Current Standing
                  </p>
                </div>

                <h2 className="mt-2 text-xl font-bold">
                  {student.department || "Department not specified"}
                </h2>

                <p className="mt-1 text-[11px] text-blue-100">
                  {student.program || "Program not specified"}
                </p>
              </div>

              <div className="flex gap-7">
                <div>
                  <p className="text-3xl font-bold text-orange-400">
                    {student.lastYear || "-"}
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[1.2px] text-blue-200">
                    Year
                  </p>
                </div>

                <div className="border-l border-white/15 pl-7">
                  <p className="text-3xl font-bold text-white">
                    {student.academicBatch || "-"}
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[1.2px] text-blue-200">
                    Batch
                  </p>
                </div>
              </div>
            </div>
          </div> */}

          {/* =================================================
              PROJECT PORTFOLIO
          ================================================= */}

          {/* =================================================
              PROJECT OVERVIEW
          ================================================= */}

          {projects.length > 0 && (
            <SectionCard className="p-5">
              <SectionTitle symbol="✓">Project Overview</SectionTitle>

              <div className="mt-5 space-y-3">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-100 hover:bg-blue-50/40"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-bold text-slate-700 transition group-hover:text-[#07518a]">
                          {project.title}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {project.projectType || "Individual"}

                          {project.semester
                            ? ` • Semester ${project.semester}`
                            : ""}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1.5 text-[9px] font-bold ${
                          project.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : project.status === "Rejected"
                              ? "bg-red-50 text-red-600"
                              : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {project.status || "Pending Approval"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          <div className="mb-7">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-orange-500">
                    Student Work
                  </p>
                </div>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-800">
                  Project Portfolio
                </h2>
              </div>

              <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-500 shadow-sm">
                {projects.length}{" "}
                {projects.length === 1 ? "Project" : "Projects"}
              </span>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-[#07518a]">
                  &lt;/&gt;
                </div>

                <p className="mt-4 text-sm font-bold text-slate-700">
                  No projects available
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  This student has not added any projects yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
