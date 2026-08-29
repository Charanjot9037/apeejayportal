

'use client';

import { useEffect, useState } from 'react';
import { Users, GraduationCap } from 'lucide-react';
import Roster from '@/app/components/elements/roaster';
// import { STUDENT_FILTERS } from '@/constants/hodData';

import {
  studentColumns,
  mapStudentToRoster,
  STUDENT_FILTERS
} from '@/constants/adminData';

export default function Page() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // HOD department
  const [hodDepartment, setHodDepartment] = useState('');

  /*
   * ----------------------------------------------------------
   * FETCH ALL HOD DEPARTMENT STUDENTS
   * ----------------------------------------------------------
   *
   * /api/hod already:
   *
   * 1. Authenticates HOD
   * 2. Gets HOD department
   * 3. Finds students from that department
   * 4. Matches Student.userId with Projects.student
   *
   * We only need the students here.
   */
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/hod/students');

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to fetch students'
        );
      }

      /*
       * Save HOD department
       */
      setHodDepartment(
        data.hod?.department || ''
      );

      /*
       * /api/hod already returns only students
       * belonging to the HOD department.
       */
      const mappedStudents = (
        data.students || []
      ).map(mapStudentToRoster);
    

      setStudents(mappedStudents);

    } catch (error) {
      console.error(
        'FETCH_HOD_STUDENTS_ERROR:',
        error
      );

      setError(
        error.message ||
        'Something went wrong'
      );

      setStudents([]);

    } finally {
      setLoading(false);
    }
  };

  /*
   * Fetch once when page loads.
   *
   * This useEffect is in the PAGE,
   * NOT inside Roster.
   */
  useEffect(() => {
    fetchStudents();
  }, []);

  const handleRetry = () => {
    fetchStudents();
  };

  /*
   * ----------------------------------------------------------
   * HOD DEPARTMENT FILTER
   * ----------------------------------------------------------
   *
   * Only show the HOD's department in the department dropdown.
   */
  // const hodStudentFilters = STUDENT_FILTERS.map(
  //   (filter) => {
  //     if (filter.key !== 'department') {
  //       return filter;
  //     }

  //     return {
  //       ...filter,
  //       options: hodDepartment
  //         ? [hodDepartment]
  //         : [],
  //     };
  //   }
  // );
  const hodStudentFilters = STUDENT_FILTERS.map((filter) => {
  // Department
  if (filter.key === 'department') {
    return {
      ...filter,
      options: hodDepartment
        ? [
            {
              value: hodDepartment.toUpperCase(),
              label: hodDepartment,
            },
          ]
        : [],
    };
  }

  return filter;
});

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

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
                View all students belonging to your department.
                {hodDepartment && (
                  <span className="ml-1 font-semibold text-[#1c3a5e]">
                    Department: {hodDepartment}
                  </span>
                )}
              </p>

            </div>

            {/* TOTAL STUDENTS */}

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

            /*
             * IMPORTANT:
             *
             * We don't need API filtering anymore.
             * Roster filters the already-loaded department
             * students locally.
             */
            filterConfig={STUDENT_FILTERS}

            /*
             * Pass HOD department to Roster.
             * This can also be used by dependent filters.
             */
            filterContext={{
              department: hodDepartment,
            }}

            showApplyButton={false}

            initialVisibleRows={5}

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
