// "use client";

// import React from "react";

// import ProjectHeader from "@/app/components/projectDetails/ProjectHeader"
// import ProjectGallery from "@/app/components/projectDetails/ProjectGallery";
// import ProjectInfo from "@/app/components/projectDetails/ProjectInfo";
// import ProjectSidebar from "@/app/components/projectDetails/ProjectSidebar";

// const project = {
//   title: "AI-Powered Campus Navigation App",

//   department: "Computer Science Dept.",

//   shortDescription:
//     "A comprehensive mobile solution designed to help new students and visitors navigate the complex university campus using augmented reality and real-time mapping.",

//   images: [
//     "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
//     "https://images.unsplash.com/photo-1551650975-87deedd944c3",
//     "https://images.unsplash.com/photo-1558655146-9f40138edfeb",
//     "https://images.unsplash.com/photo-1559028012-481c04fa702d",
//   ],

//   overview: [
//     "The Campus Navigator solves the common issue of freshers getting lost during their first few weeks. By utilizing ARKit/ARCore, the application overlays directional arrows directly onto the camera feed, guiding students to their precise lecture halls.",

//     "Built over a semester, this project integrated real-time table data with physical geolocation nodes across the university grounds. The backend architecture relies on Node.js microservices setup, ensuring high availability during even peak class transition times.",
//   ],

//   techStack: [
//     "Node.js",
//     "ARKit",
//     "Real-time APIs",
//     "Microservices",
//   ],

//   collaborationScore: 92,

//   liveUrl: "#",

//   githubUrl: "#",

//   documents: [
//     {
//       name: "Project Report",
//       type: "PDF",
//       size: "4.2 MB",
//       url: "#",
//     },
//     {
//       name: "Synopsis",
//       type: "DOCX",
//       size: "1.1 MB",
//       url: "#",
//     },
//     {
//       name: "Presentation",
//       type: "PPTX",
//       size: "8.5 MB",
//       url: "#",
//     },
//   ],

//   team: [
//     {
//       name: "Alex Mercer",
//       role: "Lead Developer",
//       image:
//         "https://i.pravatar.cc/100?img=12",
//     },
//     {
//       name: "Sarah Jenkins",
//       role: "UI/UX Designer",
//       image:
//         "https://i.pravatar.cc/100?img=47",
//     },
//   ],
// };

// const ProjectDetailsPage = () => {
//   return (
//     <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">
//         {/* Header */}
//         <ProjectHeader project={project} />

//         {/* Main Layout */}
//         <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
//           {/* Left */}
//           <div className="space-y-4">
//             <ProjectGallery images={project.images} />

//             <ProjectInfo project={project} />
//           </div>

//           {/* Right */}
//           <ProjectSidebar project={project} />
//         </div>
//       </div>
//     </main>
//   );
// };

// export default ProjectDetailsPage;
// // import ProjectDetail from "@/app/components/ProjectDetail";

// // const Page = async ({ params }) => {
// //   const { id } = await params;

// //   return <ProjectDetail projectId={id} viewer="recruiter" />;
// // };

// // export default Page;