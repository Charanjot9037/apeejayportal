
"use client";

import { useEffect, useState } from "react";
import { Users, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import Roster from "@/app/components/elements/roaster";
import AuthGuardModal from "@/app/components/AuthGuardModal";
import StudentRosterSkeleton from "@/app/components/admin/skeleton/studentRosterSkeleton";

import {
  studentColumns,
  mapStudentToRoster,
} from "@/constants/adminData";

import { DEFAULT_FILTERS } from "@/constants/adminData";

import {
  programOptions,
  specializationOptions,
  semesterOptions,
} from "@/constants/gloabl";


// =====================================================
// HOD STUDENT FILTER CONFIG
// =====================================================

const getHODStudentFilters = (department) => {
  const normalizedDepartment = department?.toUpperCase();

  if (!normalizedDepartment) {
    return [];
  }

  const programs = programOptions[normalizedDepartment] || [];

  const specializations =
    specializationOptions[normalizedDepartment] || [];

  return [
    // =================================================
    // DEPARTMENT
    // =================================================
    {
      key: "department",
      label: "Department",
      placeholder: "Department",
      options: [
        {
          value: normalizedDepartment,
          label: normalizedDepartment,
        },
      ],
      disabled: true,
    },

    // =================================================
    // PROGRAM
    // =================================================
    {
      key: "program",
      label: "Program",
      placeholder: "All Programs",
      options: programs,
    },

    // =================================================
    // SPECIALIZATION
    // Only show if department has specialization
    // =================================================
    ...(specializations.length > 0
      ? [
          {
            key: "specialization",
            label: "Specialization",
            placeholder: "All Specializations",
            options: specializations,
          },
        ]
      : []),

    // =================================================
    // SEMESTER
    // Depends on Program
    // =================================================
    {
      key: "semester",
      label: "Semester",
      placeholder: "All Semesters",
      options: semesterOptions,
      dependsOn: "program",
    },
  ];
};


export default function Page() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [hodDepartment, setHodDepartment] = useState("");

  // =====================================================
  // GET DEPARTMENT FROM REDUX
  // =====================================================

  const department = useSelector(
    (state) => state.mentor?.department
  );

  const hodStudentFilters =
    getHODStudentFilters(department);

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
  });

  const [authModal, setAuthModal] = useState({
    open: false,
    type: "authentication",
    message: "",
  });

  const router = useRouter();

  // =====================================================
  // FETCH FILTERED STUDENTS
  // =====================================================

  const fetchStudents = async (selectedFilters) => {
    try {
      setLoading(true);
      setError("");

      const apiFilters = {
        department: department,

        program: selectedFilters?.program,

        semester: selectedFilters?.semester,

        specialization:
          selectedFilters?.specialization,
      };

      // Remove empty filters
      Object.keys(apiFilters).forEach((key) => {
        if (
          apiFilters[key] === "" ||
          apiFilters[key] === null ||
          apiFilters[key] === undefined ||
          apiFilters[key] === "all"
        ) {
          delete apiFilters[key];
        }
      });

      // =================================================
      // POST FILTERS TO API
      // =================================================

      const response = await fetch(
        "/api/hod/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiFilters),
        }
      );

      const data = await response.json();

      // =================================================
      // AUTHENTICATION
      // =================================================

      if (response.status === 401) {
        setAuthModal({
          open: true,
          type: "authentication",
          message:
            data.message ||
            "Your session has expired. Please log in again.",
        });

        return;
      }

      // =================================================
      // AUTHORIZATION
      // =================================================

      if (response.status === 403) {
        setAuthModal({
          open: true,
          type: "unauthorized",
          message:
            data.message ||
            "You are not authorized to access this page.",
        });

        return;
      }

      // =================================================
      // API ERROR
      // =================================================

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch students"
        );
      }

      // =================================================
      // HOD DEPARTMENT
      // =================================================

      setHodDepartment(
        data.hod?.department || ""
      );

      // =================================================
      // MAP STUDENTS
      // =================================================

      const mappedStudents = (
        data.students || []
      ).map(mapStudentToRoster);

      setStudents(mappedStudents);

    } catch (error) {
      console.error(
        "FETCH_HOD_STUDENTS_ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Failed to fetch students"
      );

      setError(
        error.message ||
          "Something went wrong"
      );

      setStudents([]);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    if (!department) return;

    const initialFilters = {
      ...DEFAULT_FILTERS,

      department:
        department.toUpperCase(),

      program: "",

      specialization: "",

      semester: "",
    };

    setFilters(initialFilters);

    fetchStudents(initialFilters);
  }, [department]);

  // =====================================================
  // APPLY FILTERS
  // =====================================================

  const handleApplyFilters = (
    selectedFilters
  ) => {
    setFilters({
      ...selectedFilters,
    });

    fetchStudents(selectedFilters);
  };

  // =====================================================
  // RETRY
  // =====================================================

  const handleRetry = () => {
    fetchStudents(filters);
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            AUTH MODAL
        ===================================================== */}

        <AuthGuardModal
          open={authModal.open}
          type={authModal.type}
          message={authModal.message}
          onClose={() => {
            if (
              authModal.type ===
              "unauthorized"
            ) {
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

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-6">

          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-500">
              Students
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                  <GraduationCap className="h-5 w-5 text-primary-orange" />
                </div>

                <h1 className="text-2xl font-bold text-[#1c3a5e]">
                  All Students
                </h1>

              </div>

              <p className="mt-2 text-sm text-slate-500">
                View students belonging to your department.

                {hodDepartment && (
                  <span className="ml-1 font-semibold text-[#1c3a5e]">
                    Department: {hodDepartment}
                  </span>
                )}
              </p>

            </div>

            {/* =================================================
                TOTAL STUDENTS
            ================================================= */}

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-4 w-4 text-blue-600" />
              </div>

              <div>

                <p className="text-xs font-medium text-slate-400">
                  Total Students
                </p>

                <p className="text-lg font-bold text-[#1c3a5e]">
                  {students.length}
                </p>

              </div>

            </div>

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

              <p className="mt-1 text-sm text-slate-500">
                {error}
              </p>

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

        <div className="relative rounded-2xl">

          {loading && (
            <StudentRosterSkeleton />
          )}

          <Roster
            title="Student Roster"

            data={students}

            setData={setStudents}

            columns={studentColumns}

            searchPlaceholder="Search students..."

            defaultFilters={{
              ...DEFAULT_FILTERS,
              department:
                department?.toUpperCase() || "",
            }}

            filterConfig={
              hodStudentFilters
            }

            showApplyButton={true}

            onApplyFilters={
              handleApplyFilters
            }

            initialVisibleRows={5}

            className="mt-0 shadow-sm"

            onRowClick={(student) => {
              console.log(
                "Selected student:",
                student
              );
            }}
          />

        </div>

      </div>
    </div>
  );
}