'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Roster } from '@/app/components/elements';
import { MENTOR_STUDENT_COLUMNS } from '@/constants/mentorData';
import { mapMentorProjectToRoster } from '@/mappers/mentor';

// =====================================================
// FILTER CONFIG
// =====================================================

const MENTOR_PROJECT_FILTERS = [
  {
    key: 'program',
    label: 'Program',
    placeholder: 'All Programs',
    options: [
      { value: 'BTECH', label: 'B.Tech' },
      { value: 'MTECH', label: 'M.Tech' },
      { value: 'MBA', label: 'MBA' },
      { value: 'BBA', label: 'BBA' },
      { value: 'MCA', label: 'MCA' },
      { value: 'BCA', label: 'BCA' },
    ],
  },

  {
    key: 'semester',
    label: 'Semester',
    placeholder: 'All Semesters',
    options: [
      { value: '1', label: 'Semester 1' },
      { value: '2', label: 'Semester 2' },
      { value: '3', label: 'Semester 3' },
      { value: '4', label: 'Semester 4' },
      { value: '5', label: 'Semester 5' },
      { value: '6', label: 'Semester 6' },
      { value: '7', label: 'Semester 7' },
      { value: '8', label: 'Semester 8' },
    ],
  },

  {
    key: 'academicYear',
    label: 'Academic Year',
    placeholder: 'All Academic Years',
    options: [
      { value: '2023', label: '2023' },
      { value: '2024', label: '2024' },
      { value: '2025', label: '2025' },
      { value: '2026', label: '2026' },
    ],
  },
];

// =====================================================
// DEFAULT FILTERS
// =====================================================

const DEFAULT_FILTERS = {
  program: '',
  semester: '',
  academicYear: '',
};

// =====================================================
// FILTER PROJECTS
// =====================================================

const filterProjects = (projects, selectedFilters) => {
  let result = [...projects];

  // =========================================
  // PROGRAM
  // Comes from: project.student.program
  // =========================================

  if (selectedFilters.program) {
    result = result.filter(
      (project) =>
        String(project.student?.program || '')
          .trim()
          .toLowerCase() ===
        String(selectedFilters.program).trim().toLowerCase(),
    );
  }

  // =========================================
  // SEMESTER
  // Comes from: project.semester
  // =========================================

  if (selectedFilters.semester) {
    result = result.filter(
      (project) =>
        String(project.semester || '')
          .trim()
          .toLowerCase() ===
        String(selectedFilters.semester).trim().toLowerCase(),
    );
  }

  // =========================================
  // ACADEMIC YEAR
  // Comes from: project.student.academicBatch
  // =========================================

  if (selectedFilters.academicYear) {
    result = result.filter(
      (project) =>
        String(project.student?.academicBatch || '')
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

export default function AllProject() {
  const router = useRouter();

  const [allProjects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // ===================================================
  // FETCH MENTOR PROJECTS
  // ===================================================

  useEffect(() => {
    const fetchMentorProjects = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/projects/mentor');

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to load projects.');
        }

        const mentorProjects = data.projects || [];

        console.log('Projects assigned to logged-in mentor:', mentorProjects);

        // Keep complete API response
        setAllProjects(mentorProjects);

        // Apply default filters
        const filteredProjects = filterProjects(
          mentorProjects,
          DEFAULT_FILTERS,
        );

        setProjects(filteredProjects);
      } catch (err) {
        console.error('FETCH_MENTOR_PROJECTS_ERROR:', err);

        setError(
          err.message || 'Something went wrong while fetching projects.',
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
    console.log('Applied project filters:', selectedFilters);

    setFilters(selectedFilters);

    const filteredProjects = filterProjects(allProjects, selectedFilters);

    setProjects(filteredProjects);
  };

  // ===================================================
  // RETRY
  // ===================================================

  const handleRetry = () => {
    window.location.reload();
  };

  // ===================================================
  // MAP PROJECTS FOR ROSTER
  // ===================================================

  const rosterData = projects.map(mapMentorProjectToRoster);

  // ===================================================
  // VIEW PROJECT
  // ===================================================

  const handleViewProject = (item) => {
    router.push(`/mentor-dashboard/projects/${item.id}`);
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-3">
      <main className="mx-auto max-w-7xl">
        {/* =========================================
            ERROR
        ========================================= */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
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
            LOADING
        ========================================= */}

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Loading projects...</p>
          </div>
        )}

        {/* =========================================
            ROSTER
        ========================================= */}

        {!loading && !error && (
          <Roster
            title="Project Roster"
            data={rosterData}
            columns={MENTOR_STUDENT_COLUMNS}
            searchPlaceholder="Search projects..."

            onRowClick={handleViewProject}

            filterConfig={MENTOR_PROJECT_FILTERS}
            defaultFilters={filters}
            showApplyButton={true}
            onApplyFilters={handleApplyFilters}

            onViewAll={() => console.log('View all projects')}
            viewAllLabel="View All Projects"

            className="mt-0 shadow-sm"
          />
        )}
      </main>
    </div>
  );
}
