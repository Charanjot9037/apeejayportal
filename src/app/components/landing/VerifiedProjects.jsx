"use client";

import { useMemo, useState } from "react";

import ProjectHeader from "@/app/components/elements/ProjectHeader";
import ProjectFilters from "@/app/components/elements/ProjectFilters";
import ProjectCard from "@/app/components/elements/ProjectCard";
import { projects} from "@/constants/projectData"

import { Button } from "@/components/ui/button";

const VerifiedProjects = () => {
  const [department, setDepartment] = useState("all");
  const [skill, setSkill] = useState("all");
  const [visibleProjects, setVisibleProjects] = useState(3);

  const filteredProjects = useMemo(() => {
    return projects.filter((projects) => {
      const departmentMatch =
        department === "all" || projects.department === department;

      const skillMatch =
        skill === "all" || projects.skills.includes(skill);

      return departmentMatch && skillMatch && projects.verified;
    });
  }, [department, skill]);

  const displayedProjects = filteredProjects.slice(0, visibleProjects);

  const loadMore = () => {
    setVisibleProjects((previous) => previous + 3);
  };

  const handleFilter = () => {
    console.log("More filters clicked");
  };

  return (
    <div  id="projects" className=" flex w-full flex-col bg-[#fafafa] gap-2 px-5 py-12 md:px-10">
      {/* Header */}
      <ProjectHeader title="Verified Projects" />

      {/* Filters */}
      <div className="mt-5">
        <ProjectFilters
          department={department}
          setDepartment={setDepartment}
          skill={skill}
          setSkill={setSkill}
          onFilter={handleFilter}
        />
      </div>

      {/* Projects */}
      <div
        className="
          mx-auto
          mt-7
          grid
          w-5/6
          grid-cols-1
          gap-7
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {displayedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>

      {/* Empty State */}
      {displayedProjects.length === 0 && (
        <div className="flex justify-center py-12">
          <p className="text-sm text-slate-500">
            No verified projects found.
          </p>
        </div>
      )}


      {/* Load More */}
      {visibleProjects < filteredProjects.length && (
        <div className="mt-7 flex justify-center">
          <Button
            onClick={loadMore}
            className="
              h-8
              bg-secondary
              px-6
              py-5
              cursor-pointer
              transition-all 
              hover:scale-102
              delay-100
              rounded-md
              text-sm
              font-medium
              text-white
              hover:bg-secondary/90
            "
          >
            Load More 
          </Button>
        </div>
      )}
    </div>
  );
};

export default VerifiedProjects;

//use this code to take real time data from database  -- correct code just comment out it don't delete 
// "use client";

// import { useEffect, useMemo, useState } from "react";

// import ProjectHeader from "@/app/components/elements/ProjectHeader";
// import ProjectFilters from "@/app/components/elements/ProjectFilters";
// import ProjectCard from "@/app/components/elements/ProjectCard";

// import { Button } from "@/components/ui/button";

// const VerifiedProjects = () => {
//   const [projects, setProjects] = useState([]);

//   const [department, setDepartment] = useState("all");
//   const [skill, setSkill] = useState("all");

//   const [visibleProjects, setVisibleProjects] = useState(3);

//   const [loadingProjects, setLoadingProjects] = useState(true);

//   // ================= FETCH VERIFIED PROJECTS =================

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         setLoadingProjects(true);

//         const response = await fetch("/api/projects/verified");

//         const result = await response.json();

//         if (!response.ok) {
//           throw new Error(
//             result.message || "Failed to fetch projects"
//           );
//         }

//         // Convert MongoDB projects into the format
//         // expected by ProjectCard
//         const mappedProjects = result.projects.map((project) => ({
//           ...project,

//           // MongoDB _id -> UI id
//           id: project._id,

//           // Project title
//           title: project.title,

//           // Existing subtitle
//           subtitle: project.subtitle,

//           // Existing description
//           description: project.description,

//           // MongoDB techStack -> ProjectCard skills
//           skills: project.techStack || [],

//           // Approved projects are verified
//           verified: project.status === "Approved",

//           // Keep department if your model has it
//           department: project.department || "all",
//         }));

//         setProjects(mappedProjects);
//       } catch (error) {
//         console.error(
//           "FETCH_VERIFIED_PROJECTS_ERROR:",
//           error
//         );

//         setProjects([]);
//       } finally {
//         setLoadingProjects(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   // ================= FILTER PROJECTS =================

//   const filteredProjects = useMemo(() => {
//     return projects.filter((project) => {
//       const departmentMatch =
//         department === "all" ||
//         project.department === department;

//       const skillMatch =
//         skill === "all" ||
//         project.skills?.some(
//           (item) =>
//             item.toLowerCase() === skill.toLowerCase()
//         );

//       return (
//         departmentMatch &&
//         skillMatch &&
//         project.verified
//       );
//     });
//   }, [projects, department, skill]);

//   // ================= DISPLAY PROJECTS =================

//   const displayedProjects = filteredProjects.slice(
//     0,
//     visibleProjects
//   );

//   // ================= LOAD MORE =================

//   const loadMore = () => {
//     setVisibleProjects((previous) => previous + 3);
//   };

//   // ================= FILTER HANDLER =================

//   const handleFilter = () => {
//     console.log("More filters clicked");
//   };

//   // ================= RETURN =================

//   return (
//     <div
//       id="projects"
//       className="flex w-full flex-col bg-[#fafafa] gap-2 px-5 py-12 md:px-10"
//     >
//       {/* Header */}

//       <ProjectHeader title="Verified Projects" />

//       {/* Filters */}

//       <div className="mt-5">
//         <ProjectFilters
//           department={department}
//           setDepartment={setDepartment}
//           skill={skill}
//           setSkill={setSkill}
//           onFilter={handleFilter}
//         />
//       </div>

//       {/* Projects */}

//       <div
//         className="
//           mx-auto
//           mt-7
//           grid
//           w-5/6
//           grid-cols-1
//           gap-7
//           sm:grid-cols-2
//           lg:grid-cols-3
//         "
//       >
//         {loadingProjects ? (
//           <div className="col-span-full flex justify-center py-12">
//             <p className="text-sm text-slate-500">
//               Loading verified projects...
//             </p>
//           </div>
//         ) : (
//           displayedProjects.map((project) => (
//             <ProjectCard
//               key={project.id}
//               project={project}
//             />
//           ))
//         )}
//       </div>

//       {/* Empty State */}

//       {!loadingProjects &&
//         displayedProjects.length === 0 && (
//           <div className="flex justify-center py-12">
//             <p className="text-sm text-slate-500">
//               No verified projects found.
//             </p>
//           </div>
//         )}

//       {/* Load More */}

//       {!loadingProjects &&
//         visibleProjects < filteredProjects.length && (
//           <div className="mt-7 flex justify-center">
//             <Button
//               onClick={loadMore}
//               className="
//                 h-8
//                 bg-primary
//                 px-6
//                 py-5
//                 cursor-pointer
//                 transition-all
//                 hover:scale-102
//                 delay-100
//                 rounded-md
//                 text-sm
//                 font-medium
//                 text-white
//                 hover:bg-blue-600
//               "
//             >
//               Load More
//             </Button>
//           </div>
//         )}
//     </div>
//   );
// };

// export default VerifiedProjects;

