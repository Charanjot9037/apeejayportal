// "use client";

// import { useEffect, useState } from "react";
// import { Users, GraduationCap } from "lucide-react";
// import Roster from "@/app/components/elements/roaster";
// import StudentRosterSkeleton from "@/app/components/admin/skeleton/studentRosterSkeleton";

// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import AuthGuardModal from "@/app/components/AuthGuardModal";
// import {
//   studentColumns,
//   DEFAULT_FILTERS,
//   STUDENT_FILTERS,
//   mapStudentToRoster,
// } from "@/constants/adminData";

// export default function Page() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [filters, setFilters] = useState({
//     ...DEFAULT_FILTERS,
//   });
//   const router = useRouter();

//   const [authModal, setAuthModal] = useState({
//     open: false,
//     type: "authentication",
//     message: "",
//   });
//   const fetchStudents = async (selectedFilters) => {
//     try {
//       setLoading(true);
//       setError("");

//       const apiFilters = {
//         department: selectedFilters.department,
//         program: selectedFilters.program,
//         academicBatch: selectedFilters.academicBatch,
//       };

//       if (selectedFilters.specialization) {
//         apiFilters.specialization = selectedFilters.specialization;
//       }

//       const response = await fetch("/api/admin/getstudents", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(apiFilters),
//       });
//       const data = await response.json();
//       if (response.status === 401) {
//         setAuthModal({
//           open: true,
//           type: "authentication",
//           message:
//             data.message || "Your session has expired. Please log in again.",
//         });

//         return;
//       }

//       // Authorization error
//       if (response.status === 403) {
//         setAuthModal({
//           open: true,
//           type: "unauthorized",
//           message:
//             data.message || "You are not authorized to delete this student.",
//         });

//         return;
//       }

//       if (!response.ok || !data.success) {
//         throw new Error(data.message || "Failed to fetch students");
//       }

//       const mappedStudents = (data.students || []).map(mapStudentToRoster);

//       setStudents(mappedStudents);
//     } catch (error) {
//       console.error("FETCH_STUDENTS_ERROR:", error);
//       toast.error("Dtech errror", error);
//       setError(error.message || "Something went wrong");
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudents(DEFAULT_FILTERS);
//   }, []);
// const handleApplyFilters = (selectedFilters) => {
//   setFilters(selectedFilters);
//   fetchStudents(selectedFilters);
// };
//     fetchStudents(selectedFilters);
//   };

//   const handleRetry = () => {
//     fetchStudents(filters);
//   };

//   return (
//     <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-3">
//       <AuthGuardModal
//         open={authModal.open}
//         type={authModal.type}
//         message={authModal.message}
//         onClose={() => {
//           if (authModal.type === "unauthorized") {
//             router.back();
//           } else {
//             setAuthModal((prev) => ({
//               ...prev,
//               open: false,
//             }));
//           }
//         }}
//         onLogin={() => {
//           router.push("/login");
//         }}
//       />
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-6">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <div className="flex items-center gap-2">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
//                   <GraduationCap className="h-5 w-5 text-primary-orange" />
//                 </div>

//                 <h1 className="text-2xl font-bold text-[#1c3a5e]">
//                   Student Management
//                 </h1>
//               </div>

//               <p className="mt-2 text-sm text-slate-500">
//                 View and manage students according to their department, course
//                 and academic batch.
//               </p>
//             </div>

//             <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
//               <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
//                 <Users className="h-4 w-4 text-blue-600" />
//               </div>

//               <div>
//                 <p className="text-xs font-medium text-slate-400">
//                   Total Students
//                 </p>

//                 <p className="text-lg font-bold text-[#1c3a5e]">
//                   {students.length}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-5 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
//             <div className="flex flex-col items-center justify-center text-center">
//               <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
//                 <Users className="h-5 w-5 text-red-500" />
//               </div>

//               <h2 className="mt-4 text-base font-semibold text-slate-700">
//                 Unable to load students
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

//         <div className="rounded-2xl">
//           {loading ? (
//             <StudentRosterSkeleton />
//           ) : (
//             <Roster
//               title="Student Roster"
//               data={students}
//               setData={setStudents}
//               showEdit={true}
//               columns={studentColumns}
//               filters={filters}
//               setFilters={setFilters}
//               showDelete={true}
//               searchPlaceholder="Search students..."
//               defaultFilters={DEFAULT_FILTERS}
//               filterConfig={STUDENT_FILTERS}
//               showApplyButton={true}
//               onApplyFilters={handleApplyFilters}
//               className="mt-0 shadow-sm"
//               showView={true}
//               viewClick={(student) => {
//                 router.push(`/view-profile/${student._id}`);
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Users, GraduationCap } from "lucide-react";
import Roster from "@/app/components/elements/roaster";
import StudentRosterSkeleton from "@/app/components/admin/skeleton/studentRosterSkeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AuthGuardModal from "@/app/components/AuthGuardModal";

import {
  studentColumns,
  DEFAULT_FILTERS,
  STUDENT_FILTERS,
  mapStudentToRoster,
} from "@/constants/adminData";

export default function Page() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
  });

  const router = useRouter();
  const [departmentStats, setdepartmentStats] = useState();

  // =====================================================
  // AUTH MODAL
  // =====================================================

  const [authModal, setAuthModal] = useState({
    open: false,
    type: "authentication",
    message: "",
  });

  // =====================================================
  // FETCH STUDENTS
  // =====================================================
  const mapDepartmentStats = (departmentCounts = []) => {
    const engineering =
      departmentCounts.find((item) => item._id === "ENGINEERING")?.count || 0;

    const management =
      departmentCounts.find((item) => item._id === "MANAGEMENT")?.count || 0;

    const it =
      departmentCounts.find((item) => item._id === "INFORMATION TECHNOLOGY")
        ?.count || 0;

    return [
      {
        title: "Engineering",
        value: engineering,
        icon: "orange",
      },
      {
        title: "IT",
        value: it,
        icon: "blue",
      },
      {
        title: "Management",
        value: management,
        icon: "orange",
      },
      {
        title: "Total",
        value: engineering + it + management,
        icon: "blue",
      },
    ];
  };

  const fetchStudents = async (selectedFilters = DEFAULT_FILTERS) => {
    try {
      setLoading(true);
      setError("");

      const apiFilters = {
        department: selectedFilters?.department || "",
        program: selectedFilters?.program || "",
        academicBatch: selectedFilters?.academicBatch || "",
      };

      if (selectedFilters?.specialization) {
        apiFilters.specialization = selectedFilters.specialization;
      }

      console.log("FETCH STUDENTS WITH:", apiFilters);

      const response = await fetch("/api/admin/getstudents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiFilters),
      });

      const data = await response.json();

      // AUTHENTICATION ERROR
      // =====================================================

      if (response.status === 401) {
        setAuthModal({
          open: true,
          type: "authentication",
          message:
            data.message || "Your session has expired. Please log in again.",
        });

        return;
      }

      // =====================================================
      // AUTHORIZATION ERROR
      // =====================================================

      if (response.status === 403) {
        setAuthModal({
          open: true,
          type: "unauthorized",
          message: data.message || "You are not authorized to access students.",
        });

        return;
      }

      // =====================================================
      // OTHER ERRORS
      // =====================================================

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch students");
      }

      // =====================================================
      // MAP DATA
      // =====================================================

      const mappedStudents = (data.students || []).map(mapStudentToRoster);

      const departments = mapDepartmentStats(data.departmentCounts);

      setdepartmentStats(departments);
      setStudents(mappedStudents);
    } catch (error) {
      console.error("FETCH_STUDENTS_ERROR:", error);

      toast.error(error.message || "Failed to fetch students");

      setError(error.message || "Something went wrong");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchStudents(DEFAULT_FILTERS);
  }, []);

  // =====================================================
  // APPLY FILTERS
  // =====================================================

  const handleApplyFilters = (selectedFilters) => {
    console.log("ROSTER SELECTED FILTERS:", selectedFilters);

    // Same flow as Mentor Management
    const appliedFilters = {
      ...DEFAULT_FILTERS,
      ...selectedFilters,
    };

    console.log("APPLIED STUDENT FILTERS:", appliedFilters);

    // Save selected filters in parent
    setFilters(appliedFilters);

    // Fetch using selected filters
    fetchStudents(appliedFilters);
  };

  // =====================================================
  // RETRY
  // =====================================================

  const handleRetry = () => {
    fetchStudents(filters);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-3">
      <AuthGuardModal
        open={authModal.open}
        type={authModal.type}
        message={authModal.message}
        onClose={() => {
          if (authModal.type === "unauthorized") {
            router.back();
          } else {
            setAuthModal((prev) => ({
              ...prev,
              open: false,
            }));
          }
        }}
        onLogin={() => {
          router.push("/login");
        }}
      />

      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row  sm:justify-between  lg:items-start">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                  <GraduationCap className="h-5 w-5 text-primary-orange" />
                </div>

                <h1 className="text-2xl font-bold text-[#1c3a5e]">
                  Student Management
                </h1>
              </div>
            </div>
            <div className="flex gap-5">
              {departmentStats?.map((stat) => (
                <div
                  key={stat.title}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      stat.icon === "orange" ? "bg-orange-50" : "bg-blue-50"
                    }`}
                  >
                    <Users
                      className={`h-4 w-4 ${
                        stat.icon === "orange"
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      {stat.title}
                    </p>

                    <p className="text-lg font-bold text-[#1c3a5e]">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL STUDENTS */}
          </div>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <Users className="h-5 w-5 text-red-500" />
              </div>

              <h2 className="mt-4 text-base font-semibold text-slate-700">
                Unable to load students
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

        {/* =====================================================
            ROSTER
        ===================================================== */}

        <div className="rounded-2xl">
          {loading && students.length === 0 ? (
            <StudentRosterSkeleton />
          ) : (
            <div className="relative">
              <Roster
                title="Student Roster"
                data={students}
                setData={setStudents}
                showEdit={true}
                columns={studentColumns}
                filters={filters}
                setFilters={setFilters}
                showDelete={true}
                searchPlaceholder="Search students..."
                defaultFilters={DEFAULT_FILTERS}
                filterConfig={STUDENT_FILTERS}
                showApplyButton={true}
                onApplyFilters={handleApplyFilters}
                className="mt-0 shadow-sm"
                showView={true}
                viewClick={(student) => {
                  router.push(`/view-profile/${student._id}`);
                }}
              />

              {loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">
                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary-orange" />

                    <span className="text-sm font-medium text-slate-600">
                      Applying filters...
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
