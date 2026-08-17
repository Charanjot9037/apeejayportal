// "use client";

// import React from "react";
// import {
//   FileText,
//   TrendingUp,
//   Code2,
//   BarChart3,
// } from "lucide-react";

// const ProjectInfo = ({ project }) => {
//   return (
//     <div className="space-y-4">
//       {/* Overview */}
//       <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:shadow-md sm:p-5">
//         <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
//           <FileText size={16} className="text-orange-500" />

//           <h2 className="text-sm font-semibold text-blue-900 sm:text-base">
//             Project Overview
//           </h2>
//         </div>

//         <div className="space-y-3 text-xs leading-6 text-gray-600 sm:text-sm">
//           <p>{project.overview[0]}</p>
//           <p>{project.overview[1]}</p>
//         </div>
//       </section>

//       {/* Recruiter Insights */}
//       <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:shadow-md sm:p-5">
//         <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
//           <TrendingUp size={16} className="text-orange-500" />

//           <h2 className="text-sm font-semibold text-blue-900 sm:text-base">
//             Recruiter Insights
//           </h2>
//         </div>

//         <div className="grid gap-5 sm:grid-cols-2">
//           {/* Tech Stack */}
//           <div>
//             <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-700">
//               <Code2 size={14} className="text-gray-500" />
//               Tech Stack Mastery
//             </div>

//             <div className="flex flex-wrap gap-2">
//               {project.techStack.map((tech) => (
//                 <span
//                   key={tech}
//                   className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-medium text-blue-700 transition hover:bg-blue-100"
//                 >
//                   {tech}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Collaboration */}
//           <div>
//             <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-700">
//               <BarChart3 size={14} className="text-gray-500" />
//               Collaboration Metrics
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
//                 <div
//                   className="h-full rounded-full bg-orange-500 transition-all duration-700"
//                   style={{
//                     width: `${project.collaborationScore}%`,
//                   }}
//                 />
//               </div>

//               <span className="whitespace-nowrap text-[10px] font-semibold text-orange-500">
//                 {project.collaborationScore}% Peer Rating
//               </span>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default ProjectInfo;