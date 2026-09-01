"use client";

import { useEffect, useState } from "react";
import { Users, GraduationCap } from "lucide-react";
import { useSelector } from "react-redux";

import Roster from "@/app/components/elements/roaster";
import StudentRosterSkeleton from "@/app/components/admin/skeleton/studentRosterSkeleton";

import {
  studentColumns,
  DEFAULT_FILTERS,
  STUDENT_FILTERS,
  mapStudentToRoster,
} from "@/constants/adminData";

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

  const specializations = specializationOptions[normalizedDepartment] || [];

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
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // =====================================================
  // GET HOD DEPARTMENT FROM REDUX
  // =====================================================

  const department = useSelector((state) => state.mentor?.department);

  // =====================================================
  // CREATE FILTERS BASED ON HOD DEPARTMENT
  // =====================================================

  const hodStudentFilters = getHODStudentFilters(department);

  const fetchStudents = async (selectedFilters = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/hod/my-students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(selectedFilters),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch HOD students");
      }

      const mappedStudents = (data.students || []).map(mapStudentToRoster);

      setStudents(mappedStudents);
    } catch (error) {
      console.error("FETCH_HOD_STUDENTS_ERROR:", error);

      setError(error.message || "Something went wrong");

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
      department: department.toUpperCase(),
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

  const handleApplyFilters = (selectedFilters) => {
    setFilters(selectedFilters);

    fetchStudents(selectedFilters);
  };

  // =====================================================
  // RETRY
  // =====================================================

  const handleRetry = () => {
    fetchStudents(filters);
  };

  return (
    <div className="min-h-full ">
      <div className="mx-auto">
        {/* HEADER */}

        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                  <GraduationCap className="h-5 w-5 text-primary-orange" />
                </div>

                <h1 className="text-2xl font-bold text-[#1c3a5e]">
                  My Students
                </h1>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                View students assigned to you based on your department and
                mentor assignments.
              </p>
            </div>

            {/* TOTAL STUDENTS */}

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-4 w-4 text-blue-600" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  My Students
                </p>

                <p className="text-lg font-bold text-[#1c3a5e]">
                  {students.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ERROR */}

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

        {/* ROSTER */}

        <div className="relative rounded-2xl">
          {loading && <StudentRosterSkeleton />}

          <Roster
            title="Student Roster"

            data={students}

            columns={studentColumns}

            searchPlaceholder="Search students..."

            defaultFilters={filters}

            filterConfig={hodStudentFilters}

            showApplyButton={true}

            onApplyFilters={handleApplyFilters}

            className="mt-0 shadow-sm"

            onRowClick={(student) => {
              console.log("Selected student:", student);
            }}
          />
        </div>
      </div>
    </div>
  );
}
