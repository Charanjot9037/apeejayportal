// // "use client";

// // import React from "react";
// // import {
// //   Rocket,
// //   ShieldCheck,
// //   ExternalLink,
// //   Github,
// //   FileText,
// //   Download,
// //   Users,
// // } from "lucide-react";

// // const ProjectSidebar = ({ project }) => {
// //   return (
// //     <aside className="space-y-4">
// //       {/* Verification */}
// //       <div className="rounded-xl bg-blue-900 p-3 text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
// //         <div className="flex items-start gap-2">
// //           <ShieldCheck size={16} className="mt-0.5 text-orange-400" />

// //           <div>
// //             <p className="text-[10px] font-semibold">
// //               Verified by UniPort
// //             </p>

// //             <p className="mt-0.5 text-[8px] uppercase tracking-wide text-blue-200">
// //               Academic Integrity Guaranteed
// //             </p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Project Access */}
// //       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
// //         <div className="flex flex-col items-center text-center">
// //           <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-orange-400 text-orange-500">
// //             <Rocket size={21} />
// //           </div>

// //           <h2 className="text-sm font-semibold text-blue-900">
// //             Project Access
// //           </h2>

// //           <p className="mt-1 text-[9px] text-orange-500">
// //             Current Build v1.2.4
// //           </p>

// //           <p className="text-[9px] text-gray-400">
// //             (Stable)
// //           </p>

// //           <div className="mt-4 w-full space-y-2">
// //             <a
// //               href={project.liveUrl}
// //               target="_blank"
// //               rel="noreferrer"
// //               className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-orange-600 hover:shadow-md"
// //             >
// //               <ExternalLink size={13} />
// //               VIEW LIVE PROJECT
// //             </a>

// //             <a
// //               href={project.githubUrl}
// //               target="_blank"
// //               rel="noreferrer"
// //               className="flex w-full items-center justify-center gap-2 rounded-md border border-orange-400 px-3 py-2.5 text-xs font-semibold text-orange-500 transition hover:bg-orange-50"
// //             >
// //               <Github size={13} />
// //               GITHUB REPOSITORY
// //             </a>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Documents */}
// //       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
// //         <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
// //           <FileText size={14} className="text-orange-500" />

// //           <h2 className="text-sm font-semibold text-blue-900">
// //             Documents
// //           </h2>
// //         </div>

// //         <div className="space-y-2">
// //           {project.documents.map((document) => (
// //             <a
// //               key={document.name}
// //               href={document.url}
// //               className="group flex items-center justify-between rounded-lg border border-gray-100 p-2.5 transition hover:border-orange-200 hover:bg-orange-50"
// //             >
// //               <div className="flex min-w-0 items-center gap-2">
// //                 <div className="rounded bg-orange-50 p-1.5 text-orange-500">
// //                   <FileText size={13} />
// //                 </div>

// //                 <div className="min-w-0">
// //                   <p className="truncate text-[10px] font-medium text-gray-700">
// //                     {document.name}
// //                   </p>

// //                   <p className="text-[8px] uppercase text-gray-400">
// //                     {document.type} • {document.size}
// //                   </p>
// //                 </div>
// //               </div>

// //               <Download
// //                 size={13}
// //                 className="text-gray-400 transition group-hover:text-orange-500"
// //               />
// //             </a>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Team */}
// //       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
// //         <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
// //           <Users size={14} className="text-orange-500" />

// //           <h2 className="text-sm font-semibold text-blue-900">
// //             Project Team
// //           </h2>
// //         </div>

// //         <div className="space-y-3">
// //           {project.team.map((member) => (
// //             <div
// //               key={member.name}
// //               className="flex items-center gap-2"
// //             >
// //               <img
// //                 src={member.image}
// //                 alt={member.name}
// //                 className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100"
// //               />

// //               <div>
// //                 <p className="text-xs font-semibold text-gray-700">
// //                   {member.name}
// //                 </p>

// //                 <p className="text-[9px] text-orange-500">
// //                   {member.role}
// //                 </p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </aside>
// //   );
// // };

// // export default ProjectSidebar;

// "use client";

// import React from "react";
// import {
//   Rocket,
//   ShieldCheck,
//   ExternalLink,
//   GitBranch,
//   FileText,
//   Download,
//   Users,
// } from "lucide-react";

// const ProjectSidebar = ({ project }) => {
//   return (
//     <aside className="space-y-4">

//       {/* Verification */}
//       <div className="rounded-xl bg-blue-900 p-3 text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
//         <div className="flex items-start gap-2">

//           <ShieldCheck
//             size={16}
//             className="mt-0.5 text-orange-400"
//           />

//           <div>
//             <p className="text-[10px] font-semibold">
//               Verified by UniPort
//             </p>

//             <p className="mt-0.5 text-[8px] uppercase tracking-wide text-blue-200">
//               Academic Integrity Guaranteed
//             </p>
//           </div>

//         </div>
//       </div>

//       {/* Project Access */}
//       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">

//         <div className="flex flex-col items-center text-center">

//           <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-orange-400 text-orange-500">
//             <Rocket size={21} />
//           </div>

//           <h2 className="text-sm font-semibold text-blue-900">
//             Project Access
//           </h2>

//           <p className="mt-1 text-[9px] text-orange-500">
//             Current Build v1.2.4
//           </p>

//           <p className="text-[9px] text-gray-400">
//             (Stable)
//           </p>

//           <div className="mt-4 w-full space-y-2">

//             {/* Live Project */}
//             <a
//               href={project?.liveUrl || "#"}
//               target="_blank"
//               rel="noreferrer"
//               className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-orange-600 hover:shadow-md"
//             >
//               <ExternalLink size={13} />
//               VIEW LIVE PROJECT
//             </a>

//             {/* GitHub */}
//             <a
//               href={project?.githubUrl || "#"}
//               target="_blank"
//               rel="noreferrer"
//               className="flex w-full items-center justify-center gap-2 rounded-md border border-orange-400 px-3 py-2.5 text-xs font-semibold text-orange-500 transition hover:bg-orange-50"
//             >
//               <GitBranch size={13} />
//               GITHUB REPOSITORY
//             </a>

//           </div>
//         </div>
//       </div>

//       {/* Documents */}
//       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

//         <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">

//           <FileText
//             size={14}
//             className="text-orange-500"
//           />

//           <h2 className="text-sm font-semibold text-blue-900">
//             Documents
//           </h2>

//         </div>

//         <div className="space-y-2">

//           {project?.documents?.map((document) => (
//             <a
//               key={document.name}
//               href={document.url}
//               target="_blank"
//               rel="noreferrer"
//               className="group flex items-center justify-between rounded-lg border border-gray-100 p-2.5 transition hover:border-orange-200 hover:bg-orange-50"
//             >

//               <div className="flex min-w-0 items-center gap-2">

//                 <div className="rounded bg-orange-50 p-1.5 text-orange-500">
//                   <FileText size={13} />
//                 </div>

//                 <div className="min-w-0">

//                   <p className="truncate text-[10px] font-medium text-gray-700">
//                     {document.name}
//                   </p>

//                   <p className="text-[8px] uppercase text-gray-400">
//                     {document.type} • {document.size}
//                   </p>

//                 </div>

//               </div>

//               <Download
//                 size={13}
//                 className="text-gray-400 transition group-hover:text-orange-500"
//               />

//             </a>
//           ))}

//         </div>
//       </div>

//       {/* Team */}
//       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

//         <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">

//           <Users
//             size={14}
//             className="text-orange-500"
//           />

//           <h2 className="text-sm font-semibold text-blue-900">
//             Project Team
//           </h2>

//         </div>

//         <div className="space-y-3">

//           {project?.team?.map((member) => (
//             <div
//               key={member.name}
//               className="flex items-center gap-2"
//             >

//               <img
//                 src={member.image}
//                 alt={member.name}
//                 className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100"
//               />

//               <div>
//                 <p className="text-xs font-semibold text-gray-700">
//                   {member.name}
//                 </p>

//                 <p className="text-[9px] text-orange-500">
//                   {member.role}
//                 </p>
//               </div>

//             </div>
//           ))}

//         </div>
//       </div>

//     </aside>
//   );
// };

// export default ProjectSidebar;