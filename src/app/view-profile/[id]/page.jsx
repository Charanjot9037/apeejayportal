'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import StudentData from '@/app/components/elements/StudentData';

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-700" />

        <p className="mt-3 text-sm font-medium text-slate-600">
          Loading student profile...
        </p>
      </div>
    </div>
  );
}

export default function StudentProfilePage() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`/api/studentData/${id}`);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch student data');
        }

        setStudent(result.student);
        setProjects(result.projects || []);
      } catch (error) {
        console.error('FETCH_STUDENT_DATA_ERROR:', error);

        setError(error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-5">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">
            Student not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || 'Unable to load this student profile.'}
          </p>
        </div>
      </div>
    );
  }

  return <StudentData student={student} projects={projects} />;
}
