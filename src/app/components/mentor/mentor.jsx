// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import { StatCards, Roster, DashboardHeader } from "@/app/components/elements";
// import { programOptions } from "@/constants/gloabl";
// import {
//   MENTOR_STAT_CARDS,
//   MENTOR_STUDENT_COLUMNS,
//   MENTOR_DASHBOARD_HEADER,
// } from "@/constants/mentorData";

// import { mapMentorProjectToRoster } from "@/mappers/mentor";
// import { apiRequest } from "@/lib/apiRequest";
// import AuthGuardModal from "../AuthGuardModal";

// // =====================================================
// // FILTER CONFIG
// // =====================================================

// const MENTOR_PROJECT_FILTERS = [
//   {
//     key: "program",
//     label: "Program",
//     placeholder: "All Programs",
//     options: [
//       { value: "BTECH", label: "B.Tech" },
//       { value: "MTECH", label: "M.Tech" },
//       { value: "MBA", label: "MBA" },
//       { value: "BBA", label: "BBA" },
//       { value: "MCA", label: "MCA" },
//       { value: "BCA", label: "BCA" },
//     ],
//   },

//   {
//     key: "semester",
//     label: "Semester",
//     placeholder: "All Semesters",
//     options: [
//       { value: "1", label: "Semester 1" },
//       { value: "2", label: "Semester 2" },
//       { value: "3", label: "Semester 3" },
//       { value: "4", label: "Semester 4" },
//       { value: "5", label: "Semester 5" },
//       { value: "6", label: "Semester 6" },
//       { value: "7", label: "Semester 7" },
//       { value: "8", label: "Semester 8" },
//     ],
//   },

//   {
//     key: "academicYear",
//     label: "Academic Year",
//     placeholder: "All Academic Years",
//     options: [
//       { value: "2023", label: "2023" },
//       { value: "2024", label: "2024" },
//       { value: "2025", label: "2025" },
//       { value: "2026", label: "2026" },
//     ],
//   },
// ];

// // =====================================================
// // DEFAULT FILTERS
// // =====================================================

// const DEFAULT_FILTERS = {
//   program: "",
//   semester: "",
//   academicYear: "",
// };

// // =====================================================
// // FILTER PROJECTS
// // =====================================================

// const filterProjects = (projects, selectedFilters) => {
//   let result = [...projects];

//   // =========================================
//   // PROGRAM
//   // project.student.program
//   // =========================================

//   if (selectedFilters.program) {
//     result = result.filter(
//       (project) =>
//         String(project.student?.program || "")
//           .trim()
//           .toLowerCase() ===
//         String(selectedFilters.program).trim().toLowerCase(),
//     );
//   }

//   // =========================================
//   // SEMESTER
//   // project.semester
//   // =========================================

//   if (selectedFilters.semester) {
//     result = result.filter(
//       (project) =>
//         String(project.semester || "")
//           .trim()
//           .toLowerCase() ===
//         String(selectedFilters.semester).trim().toLowerCase(),
//     );
//   }

//   // =========================================
//   // ACADEMIC YEAR
//   // project.student.academicBatch
//   // =========================================

//   if (selectedFilters.academicYear) {
//     result = result.filter(
//       (project) =>
//         String(project.student?.academicBatch || "")
//           .trim()
//           .toLowerCase() ===
//         String(selectedFilters.academicYear).trim().toLowerCase(),
//     );
//   }

//   return result;
// };

// // =====================================================
// // PAGE
// // =====================================================

// export default function Mentor() {
//   const router = useRouter();

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
//   // FETCH MENTOR PROJECTS
//   // ===================================================

//   useEffect(() => {
//     const fetchMentorProjects = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const result = await apiRequest("/api/projects/mentor", {
//           method: "GET",
//         });

//         console.log("MENTOR PROJECT RESULT:", result);

//         // ============================================
//         // NOT AUTHENTICATED
//         // ============================================

//         if (result.status === 401) {
//           setAuthModal({
//             open: true,
//             type: "authentication",
//             message:
//               result.message || "Your session has expired. Please login again.",
//           });

//           return;
//         }

//         // ============================================
//         // NOT AUTHORIZED
//         // ============================================

//         if (result.status === 403) {
//           setAuthModal({
//             open: true,
//             type: "unauthorized",
//             message:
//               result.message ||
//               "You are not authorized to access the mentor dashboard.",
//           });

//           return;
//         }

//         // ============================================
//         // OTHER API ERROR
//         // ============================================

//         if (!result?.success && result?.status !== 200) {
//           throw new Error(result?.message || "Failed to load mentor projects.");
//         }

//         // ============================================
//         // SUCCESS
//         // ============================================

//         const mentorProjects = result?.data?.projects || [];

//         console.log("Projects assigned to logged-in mentor:", mentorProjects);

//         // Keep original API data
//         setAllProjects(mentorProjects);

//         // Initially show all projects
//         setProjects(filterProjects(mentorProjects, DEFAULT_FILTERS));
//       } catch (err) {
//         console.error("MENTOR_PROJECT_ERROR:", err);

//         setError(
//           err.message || "Something went wrong while fetching projects.",
//         );

//         setAllProjects([]);
//         setProjects([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMentorProjects();
//   }, []);

//   // ===================================================
//   // APPLY FILTERS
//   // ===================================================

//   const handleApplyFilters = (selectedFilters) => {
//     console.log("Applied project filters:", selectedFilters);

//     setFilters(selectedFilters);

//     const filteredProjects = filterProjects(allProjects, selectedFilters);

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

//   const mentorStatCards = MENTOR_STAT_CARDS.map((card) => {
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

//   const mentorDashboardHeader = {
//     ...MENTOR_DASHBOARD_HEADER,
//     actionLabel: `${pendingProjects} Pending Reviews`,
//   };

//   // ===================================================
//   // VIEW PROJECT
//   // ===================================================

//   const handleViewProject = (item) => {
//     router.push(`/mentor-dashboard/projects/${item.id}`);
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
//         {/* =========================================
//             DASHBOARD HEADER
//         ========================================= */}

//         <DashboardHeader {...mentorDashboardHeader} />

//         {/* =========================================
//             STAT CARDS
//         ========================================= */}

//         <StatCards cards={mentorStatCards} />

//         {/* =========================================
//             ERROR
//         ========================================= */}

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

//         {/* =========================================
//             LOADING
//         ========================================= */}

//         {loading && (
//           <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
//             <p className="text-sm text-slate-500">Loading projects...</p>
//           </div>
//         )}

//         {/* =========================================
//             PROJECT ROSTER
//         ========================================= */}

//         {!loading && !error && (
//           <div className="mt-6">
//             <Roster
//               title="Project Roster"
//               data={rosterData}
//               columns={MENTOR_STUDENT_COLUMNS}
//               searchPlaceholder="Search projects..."

//               onRowClick={handleViewProject}

//               filterConfig={MENTOR_PROJECT_FILTERS}
//               defaultFilters={filters}
//               showApplyButton={true}
//               onApplyFilters={handleApplyFilters}

//               onViewAll={() => router.push("/mentor-dashboard/projects")}

//               viewAllLabel="View All Projects"

//               className="shadow-sm"
//             />
//           </div>
//         )}
//       </main>

//       {/* =========================================
//           AUTH GUARD MODAL
//       ========================================= */}

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

import { generateAcademicYears, programOptions } from "@/constants/gloabl";

import {
  MENTOR_STAT_CARDS,
  MENTOR_STUDENT_COLUMNS,
  MENTOR_DASHBOARD_HEADER,
} from "@/constants/mentorData";
import { semesterOptions } from "@/constants/gloabl";
import { mapMentorProjectToRoster } from "@/mappers/mentor";
import { apiRequest } from "@/lib/apiRequest";
import AuthGuardModal from "../AuthGuardModal";

const ACADEMIC_YEAR_OPTIONS = generateAcademicYears();

const DEFAULT_FILTERS = {
  program: "",
  semester: "2",
  academicYear: String(new Date().getFullYear()),
};

// =====================================================
// FILTER PROJECTS
// =====================================================

const filterProjects = (projects, selectedFilters) => {
  let result = [...projects];

  // PROGRAM
  if (selectedFilters?.program) {
    result = result.filter(
      (project) =>
        String(project.student?.program || "")
          .trim()
          .toLowerCase() ===
        String(selectedFilters.program).trim().toLowerCase(),
    );
  }

  // SEMESTER
  if (selectedFilters?.semester) {
    result = result.filter(
      (project) =>
        String(project.semester || "")
          .trim()
          .toLowerCase() ===
        String(selectedFilters.semester).trim().toLowerCase(),
    );
  }

  // ACADEMIC YEAR
  if (selectedFilters?.academicYear) {
    result = result.filter(
      (project) =>
        String(project.student?.academicBatch || "")
          .trim()
          .toLowerCase() ===
        String(selectedFilters.academicYear).trim().toLowerCase(),
    );
  }

  return result;
};

// =====================================================
// PAGE
// =====================================================

export default function Mentor() {
  const router = useRouter();

  // ===================================================
  // GET LOGGED-IN MENTOR FROM REDUX
  // ===================================================

  const user = useSelector((state) => state.mentor);

  // ===================================================
  // MENTOR DEPARTMENT
  // ===================================================

  const mentorDepartment = user?.department || "";

  // ===================================================
  // PROJECT STATE
  // ===================================================

  const [allProjects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===================================================
  // FILTER STATE
  // ===================================================

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  // ===================================================
  // AUTH MODAL
  // ===================================================

  const [authModal, setAuthModal] = useState({
    open: false,
    type: null,
    message: "",
  });

  // ===================================================
  // PROGRAM OPTIONS BASED ON MENTOR DEPARTMENT
  // ===================================================
  const mentorProgramOptions = useMemo(() => {
    if (!mentorDepartment) {
      return [];
    }

    const normalizeDepartment = (value) =>
      String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");

    const departmentKey = Object.keys(programOptions).find(
      (key) =>
        normalizeDepartment(key) === normalizeDepartment(mentorDepartment),
    );

    if (!departmentKey) {
      console.warn(
        "No program options found for department:",
        mentorDepartment,
      );

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
  }, [mentorDepartment]);
  const mentorSemesterOptions = useMemo(() => {
    const selectedProgram = filters?.program;

    console.log("Selected Program:", selectedProgram);

    if (!selectedProgram) {
      return [];
    }
    console.log("set", semesterOptions[selectedProgram]);

    return semesterOptions[selectedProgram] || [];
  }, [filters?.program]);
  // MENTOR PROJECT FILTER CONFIG
  // ===================================================

  const MENTOR_PROJECT_FILTERS = useMemo(
    () => [
      {
        key: "program",
        label: "Program",
        placeholder: "All Programs",
        options: mentorProgramOptions,
      },

      {
        key: "semester",
        label: "Semester",
        placeholder: "All Semesters",
        options: mentorSemesterOptions,
      },

      {
        key: "academicYear",
        label: "Academic Year",
        placeholder: "All Academic Years",
        options: ACADEMIC_YEAR_OPTIONS,
      },
    ],
    [mentorProgramOptions, mentorSemesterOptions],
  );

  useEffect(() => {
    const fetchMentorProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiRequest("/api/projects/mentor", {
          method: "GET",
        });

        console.log("MENTOR PROJECT RESULT:", result);

        // ============================================
        // NOT AUTHENTICATED
        // ============================================

        if (result.status === 401) {
          setAuthModal({
            open: true,
            type: "authentication",
            message:
              result.message || "Your session has expired. Please login again.",
          });

          return;
        }

        // ============================================
        // NOT AUTHORIZED
        // ============================================

        if (result.status === 403) {
          setAuthModal({
            open: true,
            type: "unauthorized",
            message:
              result.message ||
              "You are not authorized to access the mentor dashboard.",
          });

          return;
        }

        // ============================================
        // API ERROR
        // ============================================

        if (!result?.success && result?.status !== 200) {
          throw new Error(result?.message || "Failed to load mentor projects.");
        }

        // ============================================
        // SUCCESS
        // ============================================

        const mentorProjects = result?.data?.projects || [];

        console.log("Projects assigned to logged-in mentor:", mentorProjects);

        setAllProjects(mentorProjects);

        // Initially show all projects
        setProjects(filterProjects(mentorProjects, DEFAULT_FILTERS));
      } catch (err) {
        console.error("MENTOR_PROJECT_ERROR:", err);

        setError(
          err.message || "Something went wrong while fetching projects.",
        );

        setAllProjects([]);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorProjects();
  }, []);

  // ===================================================
  // APPLY FILTERS
  // ===================================================

  const handleApplyFilters = (selectedFilters) => {
    console.log("ROSTER SELECTED MENTOR PROJECT FILTERS:", selectedFilters);

    const appliedFilters = {
      ...DEFAULT_FILTERS,
      ...selectedFilters,
    };

    console.log("APPLIED MENTOR PROJECT FILTERS:", appliedFilters);

    // IMPORTANT:
    // Update parent's controlled filter state
    setFilters(appliedFilters);

    // Filter the original API data
    const filteredProjects = filterProjects(allProjects, appliedFilters);

    setProjects(filteredProjects);
  };

  // ===================================================
  // ROSTER DATA
  // ===================================================

  const rosterData = projects.map(mapMentorProjectToRoster);

  // ===================================================
  // PROJECT COUNTS
  // ===================================================

  const totalProjects = allProjects.length;

  const pendingProjects = allProjects.filter(
    (project) => project.status === "Pending Approval",
  ).length;

  const approvedProjects = allProjects.filter(
    (project) => project.status === "Approved",
  ).length;

  const inReviewProjects = allProjects.filter(
    (project) => project.status === "In Review",
  ).length;

  // ===================================================
  // STAT CARDS
  // ===================================================

  const mentorStatCards = MENTOR_STAT_CARDS.map((card) => {
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

  const mentorDashboardHeader = {
    ...MENTOR_DASHBOARD_HEADER,
    actionLabel: `${pendingProjects} Pending Reviews`,
  };

  // ===================================================
  // VIEW PROJECT
  // ===================================================

  const handleViewProject = (item) => {
    router.push(`/mentor-dashboard/projects/${item.id}`);
  };

  // ===================================================
  // RETRY
  // ===================================================

  const handleRetry = () => {
    window.location.reload();
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-full ">
      <main className="">
        {/* =========================================
            DASHBOARD HEADER
        ========================================= */}

        <DashboardHeader {...mentorDashboardHeader} />

        {/* =========================================
            STAT CARDS
        ========================================= */}

        <StatCards cards={mentorStatCards} />

        {/* =========================================
            ERROR
        ========================================= */}

        {error && (
          <div className="mt-6 rounded-2xl ">
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

        {/* =========================================
            PROJECT ROSTER
            KEEP ROSTER MOUNTED
        ========================================= */}

        {!error && (
          <div className="relative mt-6">
            <Roster
              title="Project Roster"
              data={rosterData}
              columns={MENTOR_STUDENT_COLUMNS}
              searchPlaceholder="Search projects..."

              onRowClick={handleViewProject}

              filterConfig={MENTOR_PROJECT_FILTERS}

              filters={filters}
              setFilters={setFilters}

              showApplyButton={true}
              onApplyFilters={handleApplyFilters}

              onViewAll={() => router.push("/mentor-dashboard/projects")}

              viewAllLabel="View All Projects"

              className="shadow-sm"
            />

            {/* =====================================
                LOADING OVERLAY

                Roster remains mounted so filters
                DO NOT reset.
            ===================================== */}

            {loading && (
              <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm">
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-primary-orange" />

                  <span className="text-sm font-medium text-slate-600">
                    Loading projects...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* =========================================
          AUTH GUARD MODAL
      ========================================= */}

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
