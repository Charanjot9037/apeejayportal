'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { Roster, DashboardHeader } from '@/app/components/elements';

import RosterSkeleton from '@/app/components/skeletons/roasterSkeleton';

import {
  categories,
  generateAcademicYears,
  programOptions,
  specializationOptions,
} from '@/constants/gloabl';

// import { DEFAULT_STUDENT_FILTERS } from '@/constants/mentorStudent';

import {
  MENTOR_STUDENTS_COLUMNS,
  MENTORTO_DASHBOARD_HEADER,
} from '@/constants/mentorData';

import { mapStudentsToRoster } from '@/mappers/mentor';
import { apiRequest } from '@/lib/apiRequest';

const ACADEMIC_BATCH_OPTIONS = generateAcademicYears();

const DEFAULT_STUDENT_FILTERS = {
  department: '',
  program: '',
  specialization: '',
  academicBatch: '',
};

export default function Student() {
  const user = useSelector((state) => state.mentor);

  const mentorDepartment = user?.department || '';

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState(DEFAULT_STUDENT_FILTERS);

  const mentorDepartmentOptions = useMemo(() => {
    if (!mentorDepartment) {
      return [];
    }

    const normalizeDepartment = (value) =>
      String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/_/g, '');

    const matchedCategory = categories.find(
      (category) =>
        normalizeDepartment(category.value) ===
          normalizeDepartment(mentorDepartment) ||
        normalizeDepartment(category.label) ===
          normalizeDepartment(mentorDepartment) ||
        normalizeDepartment(
          category.value === 'it' ? 'INFORMATIONTECHNOLOGY' : category.value,
        ) === normalizeDepartment(mentorDepartment),
    );

    if (!matchedCategory) {
      return [];
    }

    let departmentValue = matchedCategory.value;

    if (departmentValue === 'it') {
      departmentValue = 'INFORMATIONTECHNOLOGY';
    }

    return [
      {
        value: departmentValue,
        label: matchedCategory.label,
      },
    ];
  }, [mentorDepartment]);

  const mentorProgramOptions = useMemo(() => {
    if (!mentorDepartment) {
      return [];
    }

    const normalizeDepartment = (value) =>
      String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/_/g, '');

    let departmentKey = Object.keys(programOptions || {}).find(
      (key) =>
        normalizeDepartment(key) === normalizeDepartment(mentorDepartment),
    );

    if (!departmentKey && normalizeDepartment(mentorDepartment) === 'it') {
      departmentKey = 'INFORMATIONTECHNOLOGY';
    }

    if (!departmentKey) {
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

  const mentorSpecializationOptions = useMemo(() => {
    if (!mentorDepartment) {
      return [];
    }

    const normalizeDepartment = (value) =>
      String(value || '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/_/g, '');

    let departmentKey = Object.keys(specializationOptions || {}).find(
      (key) =>
        normalizeDepartment(key) === normalizeDepartment(mentorDepartment),
    );

    if (
      !departmentKey &&
      normalizeDepartment(mentorDepartment) === 'INFORMATIONTECHNOLOGY'
    ) {
      departmentKey = 'IT';
    }

    if (!departmentKey) {
      return [];
    }

    const specializations = specializationOptions[departmentKey];

    if (!Array.isArray(specializations)) {
      return [];
    }

    return specializations.map((specialization) => ({
      value: specialization.value,
      label: specialization.label,
    }));
  }, [mentorDepartment]);

  const MENTOR_STUDENT_FILTERS = useMemo(
    () => [
      {
        key: 'department',
        label: 'Department',
        placeholder: 'Select Department',
        options: mentorDepartmentOptions,
      },
      {
        key: 'program',
        label: 'Program',
        placeholder: 'Select Program',
        options: mentorProgramOptions,
      },
      {
        key: 'specialization',
        label: 'Specialization',
        placeholder: 'All Specializations',
        options: mentorSpecializationOptions,
      },
      {
        key: 'academicBatch',
        label: 'Academic Batch',
        placeholder: 'All Academic Batches',
        options: ACADEMIC_BATCH_OPTIONS,
      },
    ],
    [
      mentorDepartmentOptions,
      mentorProgramOptions,
      mentorSpecializationOptions,
    ],
  );

  useEffect(() => {
    if (!mentorDepartmentOptions.length) {
      return;
    }

    setFilters((previousFilters) => ({
      ...previousFilters,
      department: mentorDepartmentOptions[0].value,
    }));
  }, [mentorDepartmentOptions]);

  const fetchStudents = async (
    filterValues = DEFAULT_STUDENT_FILTERS,
    isInitialLoad = false,
  ) => {
    try {
      setLoading(true);
      setError('');

      const payload = {
        department:
          filterValues?.department || mentorDepartmentOptions?.[0]?.value || '',

        program: filterValues?.program || '',

        specialization: filterValues?.specialization || '',

        academicBatch: filterValues?.academicBatch || '',
      };

      console.log('POST /api/mentors/my-students');

      console.log('STUDENT FILTER PAYLOAD:', payload);

      const result = await apiRequest('/api/mentors/my-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('STUDENT POST RESULT:', result);

      if (!result?.success) {
        throw new Error(result?.message || 'Failed to load mentor students.');
      }

      const returnedStudents =
        result?.data?.studentDetails || result?.data?.students || [];

      console.log(
        isInitialLoad
          ? 'INITIAL STUDENTS FROM BACKEND:'
          : 'FILTERED STUDENTS FROM BACKEND:',
        returnedStudents,
      );

      setStudents(returnedStudents);
    } catch (err) {
      console.error('MENTOR_STUDENT_ERROR:', err);

      setError(err?.message || 'Something went wrong while fetching students.');

      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mentorDepartmentOptions.length) {
      return;
    }

    fetchStudents(
      {
        department: mentorDepartmentOptions[0].value,
        program: '',
        specialization: '',
        academicBatch: '',
      },
      true,
    );
  }, [mentorDepartmentOptions]);

  const handleApplyFilters = async (selectedFilters) => {
    console.log('ROSTER SELECTED FILTERS:', selectedFilters);

    const appliedFilters = {
      department:
        selectedFilters?.department ||
        filters?.department ||
        mentorDepartmentOptions?.[0]?.value ||
        '',

      program: selectedFilters?.program || '',

      specialization: selectedFilters?.specialization || '',

      academicBatch: selectedFilters?.academicBatch || '',
    };

    console.log('SENDING STUDENT FILTERS TO BACKEND:', appliedFilters);

    setFilters(appliedFilters);

    await fetchStudents(appliedFilters, false);
  };

  const handleRetry = () => {
    if (!mentorDepartmentOptions.length) {
      return;
    }

    fetchStudents(
      {
        department: mentorDepartmentOptions[0].value,
        program: '',
        specialization: '',
        academicBatch: '',
      },
      true,
    );
  };

  const rosterData = useMemo(
    () => students.map(mapStudentsToRoster),
    [students],
  );

  const studentDashboardHeader = {
    ...MENTORTO_DASHBOARD_HEADER,
  };

  return (
    <div className="min-h-full">
      <main className="mx-auto">
        <DashboardHeader {...studentDashboardHeader} />

        {error && (
          <div className="mb-5 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-base font-semibold text-slate-700">
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

        {!error && (
          <div className="relative mt-6">
            {loading ? (
              <RosterSkeleton
                title="My Students"
                columns={MENTOR_STUDENTS_COLUMNS}
                rows={5}
                showDelete={false}
                showExport={true}
                showFilters={true}
              />
            ) : (
              <Roster
                title="My Students"
                data={rosterData}
                columns={MENTOR_STUDENTS_COLUMNS}
                searchPlaceholder="Search students..."
                filterConfig={MENTOR_STUDENT_FILTERS}
                filters={filters}
                setFilters={setFilters}
                showApplyButton={true}
                onApplyFilters={handleApplyFilters}
                onRowClick={(student) => {
                  console.log('Selected student:', student);
                }}
                className="shadow-sm"
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
