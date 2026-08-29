
'use client';

import { useEffect, useState } from 'react';
import { Users, UserRound } from 'lucide-react';
import Roster from '@/app/components/elements/roaster';

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

/* =========================================================
   NORMALIZE VALUE
   =========================================================
   Converts:
   "Assistant Professor"
   "ASSISTANT-PROFESSOR"
   "assistant professor"
   " assistant-professor "

   into the same comparable value.
   ========================================================= */

const normalizeValue = (value) => {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ');
};

export default function Page() {
  const [mentors, setMentors] = useState([]);
  const [allMentors, setAllMentors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [hodDepartment, setHodDepartment] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  /* =========================================================
     FETCH HOD DATA
     ========================================================= */

  const fetchMentors = async (selectedFilters = DEFAULT_FILTERS) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/hod/mentors', {
        method: 'GET',
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to fetch mentors'
        );
      }

      /* =======================================================
         GET HOD DEPARTMENT
         ======================================================= */

      const department = data.hod?.department || '';

      setHodDepartment(department);

      /* =======================================================
         GET MENTORS FROM /api/hod

         API should already return mentors belonging to
         the logged-in HOD's department.
         ======================================================= */

      const departmentMentors = Array.isArray(data.mentors)
        ? data.mentors
        : [];

      /* =======================================================
         MAP DATABASE MENTORS
         ======================================================= */

      const mappedMentors = departmentMentors.map((mentor) => ({
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
          department,
      }));

      /* =======================================================
         SAVE ALL DEPARTMENT MENTORS
         ======================================================= */

      setAllMentors(mappedMentors);

      /* =======================================================
         APPLY DESIGNATION FILTER
         ======================================================= */

      const selectedDesignation =
        normalizeValue(selectedFilters?.designation);

      let filteredMentors = mappedMentors;

      if (selectedDesignation) {
        filteredMentors = mappedMentors.filter((mentor) => {
          const mentorDesignation = normalizeValue(
            mentor.designation
          );

          return mentorDesignation === selectedDesignation;
        });
      }

      setMentors(filteredMentors);
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
      setAllMentors([]);
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

  const handleApplyFilters = (selectedFilters) => {
    setFilters(selectedFilters);

    const selectedDesignation = normalizeValue(
      selectedFilters?.designation
    );

    /* ---------------------------------------------------------
       No designation selected
       → Show ALL mentors from HOD department
       --------------------------------------------------------- */

    if (!selectedDesignation) {
      setMentors(allMentors);
      return;
    }

    /* ---------------------------------------------------------
       Designation selected
       → Compare both sides after lowercase normalization
       --------------------------------------------------------- */

    const filtered = allMentors.filter((mentor) => {
      const mentorDesignation = normalizeValue(
        mentor.designation
      );

      return mentorDesignation === selectedDesignation;
    });

    setMentors(filtered);
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

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-6">

          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Dashboard</span>
            <span>/</span>
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
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-md">

                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary-orange" />

                <span className="text-sm font-medium text-slate-600">
                  Loading mentors...
                </span>

              </div>

            </div>
          )}

          <Roster
            title="Mentor Roster"
            data={mentors}
            columns={MENTOR_COLUMNS}
            searchPlaceholder="Search mentors..."
            defaultFilters={filters}
            filterConfig={MENTOR_FILTERS}
            showApplyButton={true}
            onApplyFilters={handleApplyFilters}
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