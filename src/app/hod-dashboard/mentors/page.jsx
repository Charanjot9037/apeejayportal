'use client';

import { useEffect, useState } from 'react';
import { Users, UserRound, BriefcaseBusiness } from 'lucide-react';
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
    key: 'department',
    label: 'Department',
    placeholder: 'All Departments',
    options: [
      'Computer Science',
      'Information Technology',
      'Management',
      'Electronics',
      'Mechanical',
    ],
  },
  {
    key: 'designation',
    label: 'Designation',
    placeholder: 'All Designations',
    options: [
      'Professor',
      'Associate Professor',
      'Assistant Professor',
      'Lecturer',
    ],
  },
];

/* =========================================================
   DEFAULT FILTERS
   ========================================================= */

const DEFAULT_FILTERS = {
  department: '',
  designation: '',
};

/* =========================================================
   MENTOR DATA
   ========================================================= */

const MENTORS = [
  {
    id: 1,
    name: 'Dr. Neha Sharma',
    employeeId: 'FAC001',
    email: 'neha.sharma@college.edu',
    contact: '+91 98765 43210',
    department: 'Computer Science',
    designation: 'Professor',
  },
  {
    id: 2,
    name: 'Dr. A. Gupta',
    employeeId: 'FAC002',
    email: 'a.gupta@college.edu',
    contact: '+91 98765 43211',
    department: 'Computer Science',
    designation: 'Associate Professor',
  },
  {
    id: 3,
    name: 'Prof. V. Kumar',
    employeeId: 'FAC003',
    email: 'v.kumar@college.edu',
    contact: '+91 98765 43212',
    department: 'Information Technology',
    designation: 'Assistant Professor',
  },
  {
    id: 4,
    name: 'Dr. S. Reddy',
    employeeId: 'FAC004',
    email: 's.reddy@college.edu',
    contact: '+91 98765 43213',
    department: 'Information Technology',
    designation: 'Professor',
  },
  {
    id: 5,
    name: 'Dr. R. Kapoor',
    employeeId: 'FAC005',
    email: 'r.kapoor@college.edu',
    contact: '+91 98765 43214',
    department: 'Management',
    designation: 'Associate Professor',
  },
  {
    id: 6,
    name: 'Prof. M. Singh',
    employeeId: 'FAC006',
    email: 'm.singh@college.edu',
    contact: '+91 98765 43215',
    department: 'Computer Science',
    designation: 'Assistant Professor',
  },
  {
    id: 7,
    name: 'Dr. P. Sharma',
    employeeId: 'FAC007',
    email: 'p.sharma@college.edu',
    contact: '+91 98765 43216',
    department: 'Electronics',
    designation: 'Professor',
  },
  {
    id: 8,
    name: 'Dr. S. Bhatia',
    employeeId: 'FAC008',
    email: 's.bhatia@college.edu',
    contact: '+91 98765 43217',
    department: 'Computer Science',
    designation: 'Associate Professor',
  },
  {
    id: 9,
    name: 'Prof. R. Arora',
    employeeId: 'FAC009',
    email: 'r.arora@college.edu',
    contact: '+91 98765 43218',
    department: 'Management',
    designation: 'Assistant Professor',
  },
  {
    id: 10,
    name: 'Dr. N. Verma',
    employeeId: 'FAC010',
    email: 'n.verma@college.edu',
    contact: '+91 98765 43219',
    department: 'Information Technology',
    designation: 'Professor',
  },
];

export default function Page() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    fetchMentors(DEFAULT_FILTERS);
  }, []);

  const fetchMentors = async (selectedFilters) => {
    try {
      setLoading(true);
      setError('');

      /*
       * Replace this with your mentor API later.
       *
       * Example:
       * const response = await fetch('/api/mentor');
       */

      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredMentors = [...MENTORS];

      if (selectedFilters.department) {
        filteredMentors = filteredMentors.filter(
          (mentor) =>
            mentor.department === selectedFilters.department,
        );
      }

      if (selectedFilters.designation) {
        filteredMentors = filteredMentors.filter(
          (mentor) =>
            mentor.designation === selectedFilters.designation,
        );
      }

      if (selectedFilters.status) {
        filteredMentors = filteredMentors.filter(
          (mentor) =>
            mentor.status === selectedFilters.status,
        );
      }

      setMentors(filteredMentors);
    } catch (error) {
      console.error('FETCH_MENTORS_ERROR:', error);

      setError(
        error.message || 'Something went wrong while loading mentors',
      );

      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (selectedFilters) => {
    setFilters(selectedFilters);
    fetchMentors(selectedFilters);
  };

  const handleRetry = () => {
    fetchMentors(filters);
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= PAGE HEADER ================= */}

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
                  Mentors
                </h1>

              </div>

              <p className="mt-2 text-sm text-slate-500">
                View and manage mentors, their assigned students,
                projects and academic responsibilities.
              </p>
            </div>

            {/* TOTAL MENTORS */}

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

        {/* ================= ERROR ================= */}

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
                className="
                  mt-5 rounded-lg
                  bg-primary-orange
                  px-4 py-2
                  text-sm font-semibold text-white
                  transition
                  hover:bg-[#df681c]
                  cursor-pointer
                "
              >
                Try Again
              </button>

            </div>
          </div>
        )}

        {/* ================= ROSTER ================= */}

        <div className="relative rounded-2xl">
{loading && (
  <div
    className="
      absolute inset-0 z-20
      flex items-center justify-center
      rounded-2xl
      bg-white/60
      backdrop-blur-[1px]
    "
  >
    <div
      className="
        flex items-center gap-3
        rounded-xl
        border border-slate-200
        bg-white
        px-5 py-3
        shadow-md
      "
    >
      <div
        className="
          h-5 w-5
          animate-spin
          rounded-full
          border-2
          border-slate-200
          border-t-primary-orange
        "
      />

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
            className="mt-0 shadow-sm"
            initialVisibleRows={5}
            onRowClick={(mentor) => {
              console.log('Selected mentor:', mentor);
            }}
          />

        </div>

      </div>
    </div>
  );
}