
'use client';

import { useEffect, useState } from 'react';
import { Users, UserRound } from 'lucide-react';
import Roster from '@/app/components/elements/roaster';
import StudentRosterSkeleton from '@/app/components/admin/skeleton/studentRosterSkeleton';

const MENTOR_COLUMNS = [
  {
    key: 'name',
    label: 'Mentor',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'contact',
    label: 'Contact',
  },
  {
    key: 'designation',
    label: 'Designation',
  },
  {
    key: 'department',
    label: 'Department',
  },
];

/* =========================================================
   MENTOR FILTERS
   ========================================================= */

const MENTOR_FILTERS = [
  {
    key: 'designation',
    label: 'Designation',
    placeholder: 'All Designations',

    options: [
      {
        value: 'HOD',
        label: 'HOD',
      },
      {
        value: 'Professor',
        label: 'Professor',
      },
      {
        value: 'Associate Professor',
        label: 'Associate Professor',
      },
      {
        value: 'Assistant-Professor',
        label: 'Assistant Professor',
      },
      {
        value: 'Lecturer',
        label: 'Lecturer',
      },
    ],
  },
];

const DEFAULT_FILTERS = {
  designation: '',
};

export default function Page() {
  const [mentors, setMentors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [hodDepartment, setHodDepartment] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  /* =========================================================
     FETCH MENTORS FROM API
     ========================================================= */

  const fetchMentors = async (
    selectedFilters = DEFAULT_FILTERS
  ) => {
    try {
      setLoading(true);
      setError('');

      // -------------------------------------------------------
      // SEND FILTERS TO BACKEND
      // -------------------------------------------------------

      const response = await fetch('/api/hod/mentors', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        credentials: 'include',

        body: JSON.stringify(
          selectedFilters || {}
        ),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            'Failed to fetch mentors'
        );
      }

      // -------------------------------------------------------
      // HOD INFORMATION
      // -------------------------------------------------------

      setHodDepartment(
        data.hod?.department || ''
      );

      // -------------------------------------------------------
      // API ALREADY RETURNS FILTERED MENTORS
      // -------------------------------------------------------

      const departmentMentors =
        Array.isArray(data.mentors)
          ? data.mentors
          : [];

      // -------------------------------------------------------
      // MAP DATABASE DATA FOR ROSTER
      // -------------------------------------------------------

      const mappedMentors =
        departmentMentors.map((mentor) => ({
          id: mentor._id
            ? String(mentor._id)
            : mentor.userId?._id
              ? String(mentor.userId._id)
              : '',

          _id: mentor._id
            ? String(mentor._id)
            : '',

          name:
            mentor.userId?.name ||
            mentor.name ||
            'Unknown Mentor',

          email:
            mentor.userId?.email ||
            mentor.email ||
            '-',

          contact:
            mentor.mobileNumber ||
            mentor.contact ||
            '-',

          designation:
            mentor.designation ||
            '-',

          department:
            mentor.department ||
            data.hod?.department ||
            '-',
        }));

      setMentors(mappedMentors);

    } catch (error) {
      console.error(
        'FETCH_HOD_MENTORS_ERROR:',
        error
      );

      setError(
        error.message ||
          'Something went wrong while loading mentors'
      );

      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
     ========================================================= */

  useEffect(() => {
    fetchMentors(DEFAULT_FILTERS);
  }, []);

  /* =========================================================
     APPLY FILTER
     ========================================================= */

  const handleApplyFilters = (
    selectedFilters
  ) => {
    setFilters(selectedFilters);

    // -------------------------------------------------------
    // FILTERING IS NOW DONE BY API
    // -------------------------------------------------------

    fetchMentors(selectedFilters);
  };

  /* =========================================================
     RETRY
     ========================================================= */

  const handleRetry = () => {
    fetchMentors(filters);
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="mb-6">

          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">

            <span>
              Dashboard
            </span>

            <span>
              /
            </span>

            <span className="text-slate-500">
              Mentors
            </span>

          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">

                  <UserRound className="h-5 w-5 text-primary-orange" />

                </div>

                <h1 className="text-2xl font-bold text-[#1c3a5e]">
                  My Department Mentors
                </h1>

              </div>

              <p className="mt-2 text-sm text-slate-500">

                View all mentors belonging to your department.

                {hodDepartment && (
                  <span className="ml-1 font-semibold text-[#1c3a5e]">
                    Department: {hodDepartment}
                  </span>
                )}

              </p>

            </div>

            {/* =================================================
                TOTAL MENTORS
            ================================================= */}

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">

                <Users className="h-4 w-4 text-blue-600" />

              </div>

              <div>

                <p className="text-xs font-medium text-slate-400">
                  Total Mentors
                </p>

                <p className="text-lg font-bold text-[#1c3a5e]">
                  {mentors.length}
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
                Unable to load mentors
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
            <StudentRosterSkeleton/>
          )}

          <Roster
            title="Mentor Roster"

            data={mentors}

            columns={MENTOR_COLUMNS}

            searchPlaceholder="Search mentors..."

            defaultFilters={filters}

            filterConfig={MENTOR_FILTERS}

            showApplyButton={true}

            onApplyFilters={
              handleApplyFilters
            }

            initialVisibleRows={5}

            className="mt-0 shadow-sm"

            onRowClick={(mentor) => {
              console.log(
                'Selected mentor:',
                mentor
              );
            }}
          />

        </div>

      </div>
    </div>
  );
}
