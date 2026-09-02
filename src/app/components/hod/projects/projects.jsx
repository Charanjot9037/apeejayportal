// // "use client";

// // import { useEffect, useState, useMemo } from "react";
// // import { useRouter } from "next/navigation";

// // import { StatCards, Roster, DashboardHeader } from "@/app/components/elements";

// // import {
// //   MENTOR_STAT_CARDS,
// //   MENTOR_STUDENT_COLUMNS,
// //   MENTOR_DASHBOARD_HEADER,
// // } from "@/constants/mentorData";

// // import { useSelector } from "react-redux";

// // import {
// //   programOptions,
// //   semesterOptions,
// //   generateAcademicYears,
// // } from "@/constants/gloabl";
// // import { mapMentorProjectToRoster } from "@/mappers/mentor";
// // import { apiRequest } from "@/lib/apiRequest";
// // import AuthGuardModal from "../../AuthGuardModal";
// // import { HOD_DASHBOARD_HEADER } from "@/constants/hodData";

// // export default function Hod() {
// //   const router = useRouter();

// //   const [projects, setProjects] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const [authModal, setAuthModal] = useState({
// //     open: false,
// //     type: null,
// //     message: "",
// //   });

// //   useEffect(() => {
// //     const fetchHodProjects = async () => {
// //       try {
// //         const result = await apiRequest("/api/projects/mentor", {
// //           method: "GET",
// //         });

// //         console.log("HOD PROJECT RESULT:", result);

// //         // =========================
// //         // NOT AUTHENTICATED
// //         // =========================

// //         if (result.status === 401) {
// //           setAuthModal({
// //             open: true,
// //             type: "authentication",
// //             message:
// //               result.message || "Your session has expired. Please login again.",
// //           });

// //           return;
// //         }

// //         // =========================
// //         // NOT AUTHORIZED
// //         // =========================

// //         if (result.status === 403) {
// //           setAuthModal({
// //             open: true,
// //             type: "unauthorized",
// //             message:
// //               result.message ||
// //               "You are not authorized to access the HOD dashboard.",
// //           });

// //           return;
// //         }

// //         // =========================
// //         // SUCCESS
// //         // =========================

// //         const hodProjects = result?.data?.projects || [];

// //         setProjects(hodProjects);
// //       } catch (err) {
// //         console.error("HOD_PROJECT_ERROR:", err);

// //         setError(
// //           err.message || "Something went wrong while fetching projects.",
// //         );
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchHodProjects();
// //   }, []);

// //   // =========================
// //   // ROSTER DATA
// //   // =========================

// //   const rosterData = projects.map(mapMentorProjectToRoster);

// //   // =========================
// //   const user = useSelector((state) => state.mentor);
// //   const hodDepartment = user?.department || "";

// //   // PROJECT COUNTS
// //   // =========================
// //   const hodProgramOptions = useMemo(() => {
// //     if (!hodDepartment) {
// //       return [];
// //     }

// //     const normalizeDepartment = (value) =>
// //       String(value || "")
// //         .trim()
// //         .toLowerCase()
// //         .replace(/\s+/g, "");

// //     const departmentKey = Object.keys(programOptions).find(
// //       (key) => normalizeDepartment(key) === normalizeDepartment(hodDepartment),
// //     );

// //     if (!departmentKey) {
// //       console.warn("No program options found for department:", hodDepartment);

// //       return [];
// //     }

// //     return programOptions[departmentKey].map((program) => ({
// //       value: program.value,
// //       label: program.label,
// //     }));
// //   }, [hodDepartment]);
// //   const totalProjects = projects.length;

// //   const pendingProjects = projects.filter(
// //     (project) => project.status === "Pending Approval",
// //   ).length;

// //   const approvedProjects = projects.filter(
// //     (project) => project.status === "Approved",
// //   ).length;

// //   const inReviewProjects = projects.filter(
// //     (project) => project.status === "In Review",
// //   ).length;

// //   // =========================
// //   // VIEW PROJECT
// //   // =========================

// //   const handleViewProject = (item) => {
// //     router.push(`/hod-dashboard/projects/${item.id}`);
// //   };

// //   // =========================
// //   // STAT CARDS
// //   // =========================

// //   const hodStatCards = MENTOR_STAT_CARDS.map((card) => {
// //     const values = {
// //       approved: approvedProjects,
// //       projects: totalProjects,
// //       pending: pendingProjects,
// //       inReview: inReviewProjects,
// //     };

// //     return {
// //       ...card,
// //       value: values[card.id] ?? 0,
// //     };
// //   });

// //   // =========================
// //   // DASHBOARD HEADER
// //   // =========================

// //   const hodDashboardHeader = {
// //     ...HOD_DASHBOARD_HEADER,
// //     actionLabel: `${pendingProjects} Pending Reviews`,
// //   };

// //   return (
// //     <div className="flex h-full">
// //       <main className="flex-1">
// //         <DashboardHeader {...hodDashboardHeader} />

// //         <StatCards cards={hodStatCards} />

// //         {loading && <p>Loading projects...</p>}

// //         {error && <p className="text-red-500">{error}</p>}

// //         {!loading && !error && (
// //           <Roster
// //             title="Project Roster"
// //             data={rosterData}
// //             columns={MENTOR_STUDENT_COLUMNS}
// //             searchPlaceholder="Search students..."
// //             onRowClick={handleViewProject}
// //             onViewAll={() => console.log("View all projects")}
// //             viewAllLabel="View All Projects"
// //           />
// //         )}
// //       </main>

// //       <AuthGuardModal
// //         open={authModal.open}
// //         type={authModal.type}
// //         message={authModal.message}
// //         onClose={() =>
// //           setAuthModal({
// //             open: false,
// //             type: null,
// //             message: "",
// //           })
// //         }
// //         onLogin={() => router.push("/login")}
// //         onBack={() => router.back()}
// //       />
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";

// import { StatCards, Roster, DashboardHeader } from "@/app/components/elements";

// import {
//   programOptions,
//   semesterOptions,
//   generateAcademicYears,
// } from "@/constants/gloabl";

// import {
//   MENTOR_STAT_CARDS,
//   MENTOR_STUDENT_COLUMNS,
// } from "@/constants/mentorData";

// import { HOD_DASHBOARD_HEADER } from "@/constants/hodData";

// import { mapMentorProjectToRoster } from "@/mappers/mentor";
// import { apiRequest } from "@/lib/apiRequest";
// import AuthGuardModal from "../../AuthGuardModal";

// // =====================================================
// // CONSTANTS
// // =====================================================

// const ACADEMIC_YEAR_OPTIONS = generateAcademicYears();

// const DEFAULT_FILTERS = {
//   program: "",
//   semester: "",
//   academicYear: "",
// };

// // =====================================================
// // FILTER CONFIG
// // =====================================================

// const normalizeValue = (value) =>
//   String(value || "")
//     .trim()
//     .toLowerCase();

// const normalizeDepartment = (value) =>
//   String(value || "")
//     .trim()
//     .toLowerCase()
//     .replace(/\s+/g, "");

// // =====================================================
// // FILTER PROJECTS
// // =====================================================

// const filterProjects = (projects, selectedFilters) => {
//   let result = [...projects];

//   // ---------------------------------------------------
//   // PROGRAM
//   // project.student.program
//   // ---------------------------------------------------

//   if (selectedFilters?.program) {
//     result = result.filter(
//       (project) =>
//         normalizeValue(project.student?.program) ===
//         normalizeValue(selectedFilters.program),
//     );
//   }

//   // ---------------------------------------------------
//   // SEMESTER
//   // project.semester
//   // ---------------------------------------------------

//   if (selectedFilters?.semester) {
//     result = result.filter(
//       (project) =>
//         normalizeValue(project.semester) ===
//         normalizeValue(selectedFilters.semester),
//     );
//   }

//   // ---------------------------------------------------
//   // ACADEMIC YEAR
//   // project.student.academicBatch
//   // ---------------------------------------------------

//   if (selectedFilters?.academicYear) {
//     result = result.filter(
//       (project) =>
//         normalizeValue(project.student?.academicBatch) ===
//         normalizeValue(selectedFilters.academicYear),
//     );
//   }

//   return result;
// };

// // =====================================================
// // SKELETON
// // =====================================================

// function ProjectRosterSkeleton() {
//   return (
//     <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//       {/* Header */}
//       <div className="border-b border-slate-200 p-5">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="space-y-2">
//             <div className="h-5 w-36 animate-pulse rounded-md bg-slate-200" />
//             <div className="h-3 w-52 animate-pulse rounded-md bg-slate-100" />
//           </div>

//           <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-200" />
//         </div>

//         {/* Filters */}
//         <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
//           <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
//           <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
//           <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
//           <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
//         </div>
//       </div>

//       {/* Search */}
//       <div className="border-b border-slate-200 p-5">
//         <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
//       </div>

//       {/* Table */}
//       <div className="p-5">
//         <div className="space-y-3">
//           {[1, 2, 3, 4, 5].map((row) => (
//             <div
//               key={row}
//               className="flex items-center gap-4 rounded-lg border border-slate-100 p-4"
//             >
//               <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-200" />

//               <div className="flex-1 space-y-2">
//                 <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
//                 <div className="h-3 w-1/4 animate-pulse rounded bg-slate-100" />
//               </div>

//               <div className="hidden h-4 w-24 animate-pulse rounded bg-slate-100 sm:block" />
//               <div className="hidden h-4 w-20 animate-pulse rounded bg-slate-100 md:block" />
//               <div className="h-4 w-12 animate-pulse rounded bg-slate-100" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // =====================================================
// // STAT CARD SKELETON
// // =====================================================

// function StatCardsSkeleton() {
//   return (
//     <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//       {[1, 2, 3, 4].map((item) => (
//         <div
//           key={item}
//           className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
//         >
//           <div className="flex items-center justify-between">
//             <div className="space-y-3">
//               <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
//               <div className="h-8 w-14 animate-pulse rounded bg-slate-200" />
//             </div>

//             <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // =====================================================
// // PAGE
// // =====================================================

// export default function Hod() {
//   const router = useRouter();

//   // ===================================================
//   // REDUX
//   // ===================================================

//   const user = useSelector((state) => state.mentor);

//   const hodDepartment = user?.department || "";

//   // ===================================================
//   // PROJECT STATE
//   // ===================================================

//   const [allProjects, setAllProjects] = useState([]);
//   const [projects, setProjects] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ===================================================
//   // FILTER STATE
//   // ===================================================

//   const [filters, setFilters] = useState(DEFAULT_FILTERS);

//   // ===================================================
//   // AUTH MODAL
//   // ===================================================

//   const [authModal, setAuthModal] = useState({
//     open: false,
//     type: null,
//     message: "",
//   });

//   // ===================================================
//   // PROGRAM OPTIONS BASED ON DEPARTMENT
//   // ===================================================

//   const hodProgramOptions = useMemo(() => {
//     if (!hodDepartment) {
//       return [];
//     }

//     const departmentKey = Object.keys(programOptions).find(
//       (key) => normalizeDepartment(key) === normalizeDepartment(hodDepartment),
//     );

//     if (!departmentKey) {
//       console.warn("No program options found for department:", hodDepartment);

//       return [];
//     }

//     const programs = programOptions[departmentKey];

//     if (!Array.isArray(programs)) {
//       return [];
//     }

//     return programs.map((program) => ({
//       value: program.value,
//       label: program.label,
//     }));
//   }, [hodDepartment]);

//   // ===================================================
//   // SEMESTER OPTIONS BASED ON SELECTED PROGRAM
//   // ===================================================

//   const hodSemesterOptions = useMemo(() => {
//     const selectedProgram = filters?.program;

//     if (!selectedProgram) {
//       return [];
//     }

//     return semesterOptions[selectedProgram] || [];
//   }, [filters?.program]);

//   // ===================================================
//   // FILTER CONFIG
//   // ===================================================

//   const HOD_PROJECT_FILTERS = useMemo(
//     () => [
//       {
//         key: "program",
//         label: "Program",
//         placeholder: "All Programs",
//         options: hodProgramOptions,
//       },

//       {
//         key: "semester",
//         label: "Semester",
//         placeholder: "All Semesters",
//         options: hodSemesterOptions,
//       },

//       {
//         key: "academicYear",
//         label: "Academic Year",
//         placeholder: "All Academic Years",
//         options: ACADEMIC_YEAR_OPTIONS,
//       },
//     ],
//     [hodProgramOptions, hodSemesterOptions],
//   );

//   // ===================================================
//   // FETCH PROJECTS
//   // ===================================================

//   useEffect(() => {
//     const fetchHodProjects = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const result = await apiRequest("/api/projects/mentor", {
//           method: "GET",
//         });

//         console.log("HOD PROJECT RESULT:", result);

//         // -----------------------------------------------
//         // NOT AUTHENTICATED
//         // -----------------------------------------------

//         if (result.status === 401) {
//           setAuthModal({
//             open: true,
//             type: "authentication",
//             message:
//               result.message || "Your session has expired. Please login again.",
//           });

//           return;
//         }

//         // -----------------------------------------------
//         // NOT AUTHORIZED
//         // -----------------------------------------------

//         if (result.status === 403) {
//           setAuthModal({
//             open: true,
//             type: "unauthorized",
//             message:
//               result.message ||
//               "You are not authorized to access the HOD dashboard.",
//           });

//           return;
//         }

//         // -----------------------------------------------
//         // API ERROR
//         // -----------------------------------------------

//         if (!result?.success && result?.status !== 200) {
//           throw new Error(result?.message || "Failed to load HOD projects.");
//         }

//         // -----------------------------------------------
//         // SUCCESS
//         // -----------------------------------------------

//         const hodProjects = result?.data?.projects || [];

//         console.log("Projects assigned to HOD:", hodProjects);

//         setAllProjects(hodProjects);

//         // Initially show all projects
//         setProjects(hodProjects);
//       } catch (err) {
//         console.error("HOD_PROJECT_ERROR:", err);

//         setError(
//           err.message || "Something went wrong while fetching projects.",
//         );

//         setAllProjects([]);
//         setProjects([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHodProjects();
//   }, []);

//   // ===================================================
//   // APPLY FILTERS
//   // ===================================================

//   const handleApplyFilters = (selectedFilters) => {
//     console.log("HOD SELECTED FILTERS:", selectedFilters);

//     const appliedFilters = {
//       ...DEFAULT_FILTERS,
//       ...selectedFilters,
//     };

//     // -----------------------------------------------
//     // Safety:
//     // If program changed and selected semester is
//     // not available for that program, remove semester.
//     // -----------------------------------------------

//     const availableSemesters = semesterOptions[appliedFilters.program] || [];

//     const semesterStillValid =
//       !appliedFilters.semester ||
//       availableSemesters.some(
//         (semester) =>
//           String(semester.value) === String(appliedFilters.semester),
//       );

//     if (!semesterStillValid) {
//       appliedFilters.semester = "";
//     }

//     console.log("HOD APPLIED FILTERS:", appliedFilters);

//     setFilters(appliedFilters);

//     const filteredProjects = filterProjects(allProjects, appliedFilters);

//     setProjects(filteredProjects);
//   };

//   // ===================================================
//   // ROSTER DATA
//   // ===================================================

//   const rosterData = projects.map(mapMentorProjectToRoster);

//   // ===================================================
//   // PROJECT COUNTS
//   // ===================================================

//   const totalProjects = allProjects.length;

//   const pendingProjects = allProjects.filter(
//     (project) => project.status === "Pending Approval",
//   ).length;

//   const approvedProjects = allProjects.filter(
//     (project) => project.status === "Approved",
//   ).length;

//   const inReviewProjects = allProjects.filter(
//     (project) => project.status === "In Review",
//   ).length;

//   // ===================================================
//   // STAT CARDS
//   // ===================================================

//   const hodStatCards = MENTOR_STAT_CARDS.map((card) => {
//     const values = {
//       approved: approvedProjects,
//       projects: totalProjects,
//       pending: pendingProjects,
//       inReview: inReviewProjects,
//     };

//     return {
//       ...card,
//       value: values[card.id] ?? 0,
//     };
//   });

//   // ===================================================
//   // DASHBOARD HEADER
//   // ===================================================

//   const hodDashboardHeader = {
//     ...HOD_DASHBOARD_HEADER,
//     actionLabel: `${pendingProjects} Pending Reviews`,
//   };

//   // ===================================================
//   // VIEW PROJECT
//   // ===================================================

//   const handleViewProject = (item) => {
//     router.push(`/hod-dashboard/projects/${item.id}`);
//   };

//   // ===================================================
//   // RETRY
//   // ===================================================

//   const handleRetry = () => {
//     window.location.reload();
//   };

//   // ===================================================
//   // UI
//   // ===================================================

//   return (
//     <div className="min-h-full bg-slate-50">
//       <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-4">
//         {/* =================================================
//             DASHBOARD HEADER
//         ================================================= */}

//         <DashboardHeader {...hodDashboardHeader} />

//         {/* =================================================
//             STATS
//         ================================================= */}

//         {loading && <StatCardsSkeleton />}

//         {/* =================================================
//             ERROR
//         ================================================= */}

//         {error && (
//           <div className="mt-6 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
//             <div className="flex flex-col items-center justify-center text-center">
//               <h2 className="text-base font-semibold text-slate-700">
//                 Unable to load projects
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">{error}</p>

//               <button
//                 type="button"
//                 onClick={handleRetry}
//                 className="mt-5 rounded-lg bg-primary-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#df681c]"
//               >
//                 Try Again
//               </button>
//             </div>
//           </div>
//         )}

//         {/* =================================================
//             PROJECT ROSTER
//         ================================================= */}

//         {!error && (
//           <div className="relative mt-6">
//             {loading ? (
//               <ProjectRosterSkeleton />
//             ) : (
//               <Roster
//                 title="Project Roster"
//                 data={rosterData}
//                 columns={MENTOR_STUDENT_COLUMNS}
//                 searchPlaceholder="Search projects..."

//                 onRowClick={handleViewProject}

//                 filterConfig={HOD_PROJECT_FILTERS}

//                 filters={filters}
//                 setFilters={setFilters}

//                 showApplyButton={true}

//                 onApplyFilters={handleApplyFilters}

//                 onViewAll={() => router.push("/hod-dashboard/projects")}

//                 viewAllLabel="View All Projects"

//                 className="shadow-sm"
//               />
//             )}
//           </div>
//         )}
//       </main>

//       {/* =================================================
//           AUTH GUARD MODAL
//       ================================================= */}

//       <AuthGuardModal
//         open={authModal.open}
//         type={authModal.type}
//         message={authModal.message}

//         onClose={() =>
//           setAuthModal({
//             open: false,
//             type: null,
//             message: "",
//           })
//         }

//         onLogin={() => router.push("/login")}

//         onBack={() => router.back()}
//       />
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { StatCards, Roster, DashboardHeader } from "@/app/components/elements";

import {
  programOptions,
  semesterOptions,
  generateAcademicYears,
} from "@/constants/gloabl";

import {
  MENTOR_STAT_CARDS,
  MENTOR_STUDENT_COLUMNS,
} from "@/constants/mentorData";

import { HOD_DASHBOARD_HEADER } from "@/constants/hodData";

import { mapMentorProjectToRoster } from "@/mappers/mentor";
import { apiRequest } from "@/lib/apiRequest";
import AuthGuardModal from "../../AuthGuardModal";

// =====================================================
// CONSTANTS
// =====================================================

const ACADEMIC_YEAR_OPTIONS = generateAcademicYears();

const DEFAULT_FILTERS = {
  program: "",
  semester: "",
  academicYear: "",
};

// =====================================================
// HELPERS
// =====================================================

const normalizeDepartment = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

// =====================================================
// STAT CARDS SKELETON
// =====================================================

function StatCardsSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-8 w-14 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

// =====================================================
// ROSTER SKELETON
// =====================================================

function ProjectRosterSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-5 w-36 animate-pulse rounded-md bg-slate-200" />
            <div className="h-3 w-52 animate-pulse rounded-md bg-slate-100" />
          </div>

          <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-200" />
        </div>

        {/* Filters */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-slate-200 p-5">
        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
      </div>

      {/* Table */}
      <div className="p-5">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="flex items-center gap-4 rounded-lg border border-slate-100 p-4"
            >
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-200" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-slate-100" />
              </div>

              <div className="hidden h-4 w-24 animate-pulse rounded bg-slate-100 sm:block" />

              <div className="hidden h-4 w-20 animate-pulse rounded bg-slate-100 md:block" />

              <div className="h-4 w-12 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// PAGE
// =====================================================

export default function Hod() {
  const router = useRouter();

  // ===================================================
  // REDUX
  // ===================================================

  const user = useSelector((state) => state.mentor);

  const hodDepartment = user?.department || "";

  // ===================================================
  // PROJECT STATE
  // ===================================================

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [filterLoading, setFilterLoading] = useState(false);

  const [error, setError] = useState(null);

  // ===================================================
  // FILTER STATE
  // ===================================================

  const [filters, setFilters] = useState({
    program: "",
    semester: "",
    academicYear: "",
  });

  // ===================================================
  // AUTH MODAL
  // ===================================================

  const [authModal, setAuthModal] = useState({
    open: false,
    type: null,
    message: "",
  });

  // ===================================================
  // PROGRAM OPTIONS BASED ON HOD DEPARTMENT
  // ===================================================

  const hodProgramOptions = useMemo(() => {
    if (!hodDepartment) {
      return [];
    }

    const departmentKey = Object.keys(programOptions).find(
      (key) => normalizeDepartment(key) === normalizeDepartment(hodDepartment),
    );

    if (!departmentKey) {
      console.warn("No program options found for department:", hodDepartment);

      return [];
    }

    const programs = programOptions[departmentKey];

    if (!Array.isArray(programs)) {
      return [];
    }

    return programs.map((program) => ({
      value: program.value,
      label: program.label,
    }));
  }, [hodDepartment]);

  // ===================================================
  // SEMESTER OPTIONS BASED ON SELECTED PROGRAM
  // ===================================================

  const hodSemesterOptions = useMemo(() => {
    const selectedProgram = filters?.program;

    if (!selectedProgram) {
      return [];
    }

    return semesterOptions[selectedProgram] || [];
  }, [filters?.program]);

  // ===================================================
  // FILTER CONFIG
  // ===================================================

  const HOD_PROJECT_FILTERS = useMemo(
    () => [
      {
        key: "program",
        label: "Program",
        placeholder: "All Programs",
        options: hodProgramOptions,
      },

      {
        key: "semester",
        label: "Semester",
        placeholder: "All Semesters",
        options: hodSemesterOptions,
      },

      {
        key: "academicYear",
        label: "Academic Year",
        placeholder: "All Academic Years",
        options: ACADEMIC_YEAR_OPTIONS,
      },
    ],
    [hodProgramOptions, hodSemesterOptions],
  );

  // ===================================================
  // FETCH PROJECTS
  // ===================================================

  const fetchHodProjects = async (selectedFilters = DEFAULT_FILTERS) => {
    try {
      setError(null);

      // First load
      if (projects.length === 0) {
        setLoading(true);
      } else {
        // Filtering request
        setFilterLoading(true);
      }

      // =================================================
      // POST FILTER REQUEST
      // =================================================

      const result = await apiRequest("/api/projects/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department: hodDepartment,
          program: selectedFilters?.program || "",
          semester: selectedFilters?.semester || "",
          academicYear: selectedFilters?.academicYear || "",
        }),
      });

      console.log("HOD PROJECT FILTER RESULT:", result);

      // =================================================
      // AUTHENTICATION
      // =================================================

      if (result.status === 401) {
        setAuthModal({
          open: true,
          type: "authentication",
          message:
            result.message || "Your session has expired. Please login again.",
        });

        return;
      }

      // =================================================
      // AUTHORIZATION
      // =================================================

      if (result.status === 403) {
        setAuthModal({
          open: true,
          type: "unauthorized",
          message:
            result.message ||
            "You are not authorized to access the HOD dashboard.",
        });

        return;
      }

      // =================================================
      // API ERROR
      // =================================================

      if (!result?.success && result?.status !== 200) {
        throw new Error(result?.message || "Failed to load HOD projects.");
      }

      // =================================================
      // SUCCESS
      // =================================================

      const hodProjects = result?.data?.projects || [];

      console.log("Projects returned by server:", hodProjects);

      setProjects(hodProjects);
    } catch (err) {
      console.error("HOD_PROJECT_ERROR:", err);

      setError(err.message || "Something went wrong while fetching projects.");

      setProjects([]);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  // ===================================================
  // INITIAL FETCH
  // ===================================================

  useEffect(() => {
    if (!hodDepartment || hodProgramOptions.length === 0) return;

    const firstProgram = hodProgramOptions[0]?.value || "";

    const firstSemester = semesterOptions[firstProgram]?.[0]?.value || "";

    const firstAcademicYear = ACADEMIC_YEAR_OPTIONS[0]?.value || "";

    const initialFilters = {
      program: firstProgram,
      semester: firstSemester,
      academicYear: firstAcademicYear,
    };

    setFilters(initialFilters);
    fetchHodProjects(initialFilters);
  }, [hodDepartment, hodProgramOptions]);

  // ===================================================
  // APPLY FILTERS
  // ===================================================

  const handleApplyFilters = async (selectedFilters) => {
    console.log("HOD SELECTED FILTERS:", selectedFilters);

    const appliedFilters = {
      ...DEFAULT_FILTERS,
      ...selectedFilters,
    };

    // =================================================
    // VALIDATE SEMESTER AGAINST PROGRAM
    // =================================================

    const availableSemesters = semesterOptions[appliedFilters.program] || [];

    const semesterStillValid =
      !appliedFilters.semester ||
      availableSemesters.some(
        (semester) =>
          String(semester.value) === String(appliedFilters.semester),
      );

    if (!semesterStillValid) {
      appliedFilters.semester = "";
    }

    console.log("HOD APPLIED FILTERS:", appliedFilters);

    // Update Roster filter state
    setFilters(appliedFilters);

    // =================================================
    // SERVER-SIDE FILTERING
    // =================================================

    await fetchHodProjects(appliedFilters);
  };

  // ===================================================
  // ROSTER DATA
  // ===================================================

  const rosterData = projects.map(mapMentorProjectToRoster);

  // ===================================================
  // PROJECT COUNTS
  // ===================================================

  const totalProjects = projects.length;

  const pendingProjects = projects.filter(
    (project) => project.status === "Pending Approval",
  ).length;

  const approvedProjects = projects.filter(
    (project) => project.status === "Approved",
  ).length;

  const inReviewProjects = projects.filter(
    (project) => project.status === "In Review",
  ).length;

  // ===================================================
  // STAT CARDS
  // ===================================================

  const hodStatCards = MENTOR_STAT_CARDS.map((card) => {
    const values = {
      approved: approvedProjects,
      projects: totalProjects,
      pending: pendingProjects,
      inReview: inReviewProjects,
    };

    return {
      ...card,
      value: values[card.id] ?? 0,
    };
  });

  // ===================================================
  // DASHBOARD HEADER
  // ===================================================

  const hodDashboardHeader = {
    ...HOD_DASHBOARD_HEADER,
    actionLabel: `${pendingProjects} Pending Reviews`,
  };

  // ===================================================
  // VIEW PROJECT
  // ===================================================

  const handleViewProject = (item) => {
    router.push(`/hod-dashboard/projects/${item.id}`);
  };

  // ===================================================
  // RETRY
  // ===================================================

  const handleRetry = () => {
    fetchHodProjects(filters);
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-full ">
      <main className="">
        <DashboardHeader {...hodDashboardHeader} />

        {/* =================================================
            STAT CARDS
        ================================================= */}

        {loading ? <StatCardsSkeleton /> : <StatCards cards={hodStatCards} />}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-base font-semibold text-slate-700">
                Unable to load projects
              </h2>

              <p className="mt-1 text-sm text-slate-500">{error}</p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-5 rounded-lg bg-primary-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#df681c]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            PROJECT ROSTER
        ================================================= */}

        {!error && (
          <div className="relative mt-6">
            {loading ? (
              <ProjectRosterSkeleton />
            ) : (
              <>
                <Roster
                  title="Project Roster"
                  data={rosterData}
                  columns={MENTOR_STUDENT_COLUMNS}
                  searchPlaceholder="Search projects..."

                  onRowClick={handleViewProject}

                  filterConfig={HOD_PROJECT_FILTERS}

                  filters={filters}
                  setFilters={setFilters}

                  showApplyButton={true}

                  onApplyFilters={handleApplyFilters}

                  onViewAll={() => router.push("/hod-dashboard/projects")}

                  viewAllLabel="View All Projects"

                  className="shadow-sm"
                />

                {/* =================================================
                    FILTER LOADING OVERLAY
                ================================================= */}

                {filterLoading && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm">
                    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-primary-orange" />

                      <span className="text-sm font-medium text-slate-600">
                        Applying filters...
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* =================================================
          AUTH GUARD MODAL
      ================================================= */}

      <AuthGuardModal
        open={authModal.open}
        type={authModal.type}
        message={authModal.message}
        onClose={() =>
          setAuthModal({
            open: false,
            type: null,
            message: "",
          })
        }
        onLogin={() => router.push("/login")}
        onBack={() => router.back()}
      />
    </div>
  );
}
