
'use client';

import { useEffect, useState } from 'react';
import { Users, GraduationCap } from 'lucide-react';
import Roster from '@/app/components/elements/roaster';

import {
  studentColumns,
  DEFAULT_FILTERS,
  STUDENT_FILTERS,
  mapStudentToRoster,
} from '@/constants/adminData';

export default function Page() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // =========================================================
  // FETCH HOD STUDENTS
  // =========================================================

  const fetchStudents = async (selectedFilters = {}) => {
    try {
      setLoading(true);
      setError('');

      // -------------------------------------------------------
      // HOD API
      // -------------------------------------------------------

      const response = await fetch('/api/hod', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to fetch HOD students'
        );
      }

      // -------------------------------------------------------
      // HOD INFORMATION
      // -------------------------------------------------------

      const hodName = data.hod?.name?.trim().toLowerCase();

      if (!hodName) {
        throw new Error('HOD name not found');
      }

      // -------------------------------------------------------
      // ALL DEPARTMENT STUDENTS
      // -------------------------------------------------------

      const departmentStudents = data.students || [];

      // -------------------------------------------------------
      // ALL DEPARTMENT PROJECTS
      // -------------------------------------------------------

      const projects = data.projects || [];

      // =======================================================
      // FILTER ONLY STUDENTS ASSIGNED TO LOGGED-IN HOD
      // =======================================================

      const assignedStudents = departmentStudents.filter(
        (student) => {
          return projects.some((project) => {
            // -------------------------------------------------
            // Check whether this project belongs to student
            // -------------------------------------------------

            const sameStudent =
              String(project.studentUserId) ===
              String(student.userId);

            if (!sameStudent) {
              return false;
            }

            // -------------------------------------------------
            // Check HOD assignment
            // -------------------------------------------------

            const mentorName =
              project.mentor?.trim().toLowerCase();

            const mentor2Name =
              project.mentor2?.trim().toLowerCase();

            const assignedToHod =
              mentorName === hodName ||
              mentor2Name === hodName;

            return assignedToHod;
          });
        }
      );

      console.log('=================================');
      console.log('HOD:', data.hod?.name);
      console.log('DEPARTMENT:', data.hod?.department);
      console.log(
        'TOTAL DEPARTMENT STUDENTS:',
        departmentStudents.length
      );
      console.log(
        'ASSIGNED HOD STUDENTS:',
        assignedStudents.length
      );
      console.log(
        'ASSIGNED STUDENTS:',
        assignedStudents
      );
      console.log('=================================');

      // =======================================================
      // APPLY FRONTEND FILTERS
      // =======================================================

      let filteredStudents = assignedStudents;

      if (selectedFilters?.program) {
        filteredStudents = filteredStudents.filter(
          (student) =>
            student.program?.toLowerCase() ===
            selectedFilters.program.toLowerCase()
        );
      }

      if (selectedFilters?.specialization) {
        filteredStudents = filteredStudents.filter(
          (student) =>
            student.specialization?.toLowerCase() ===
            selectedFilters.specialization.toLowerCase()
        );
      }

      if (selectedFilters?.academicBatch) {
        filteredStudents = filteredStudents.filter(
          (student) =>
            String(student.academicBatch) ===
            String(selectedFilters.academicBatch)
        );
      }

      // -------------------------------------------------------
      // MAP FOR ROSTER
      // -------------------------------------------------------

      const mappedStudents =
        filteredStudents.map(mapStudentToRoster);

      setStudents(mappedStudents);
    } catch (error) {
      console.error('FETCH_HOD_STUDENTS_ERROR:', error);

      setError(
        error.message || 'Something went wrong'
      );

      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchStudents(DEFAULT_FILTERS);
  }, []);

  // =========================================================
  // APPLY FILTERS
  // =========================================================

  const handleApplyFilters = (selectedFilters) => {
    setFilters(selectedFilters);

    fetchStudents(selectedFilters);
  };

  // =========================================================
  // RETRY
  // =========================================================

  const handleRetry = () => {
    fetchStudents(filters);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ===================================================
            HEADER
        =================================================== */}

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
                  My Students
                </h1>

              </div>

              <p className="mt-2 text-sm text-slate-500">
                View students assigned to you based on your
                department and mentor assignments.
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
                  My Students
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
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-md">

                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary-orange" />

                <span className="text-sm font-medium text-slate-600">
                  Loading students...
                </span>

              </div>

            </div>
          )}

          <Roster
            title="Student Roster"
            data={students}
            columns={studentColumns}
            searchPlaceholder="Search students..."
            defaultFilters={filters}
            filterConfig={STUDENT_FILTERS}
            showApplyButton={true}
            onApplyFilters={handleApplyFilters}
            className="mt-0 shadow-sm"
            onRowClick={(student) => {
              console.log(
                'Selected student:',
                student
              );
            }}
          />

        </div>

      </div>
    </div>
  );
}

