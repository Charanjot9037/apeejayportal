'use client';

import { useEffect, useState } from 'react';
import Roster from '@/app/components/elements/roaster';

const studentColumns = [
  {
    key: 'name',
    label: 'Student Name',
  },
  {
    key: 'mobile',
    label: 'Mobile',
  },
  {
    key: 'program',
    label: 'Program',
  },
  {
    key: 'department',
    label: 'Department',
  },
  {
    key: 'semester',
    label: 'Semester',
  },
  {
    key: 'academicBatch',
    label: 'Batch',
  },
];

const mapStudentToRoster = (student) => ({
  id: student._id,

  name: student.fullName || '-',

  mobile: student.phone || '-',

  program: student.program || '-',

  department: student.department || '-',

  semester: student.currentSemester || '-',

  academicBatch: student.academicBatch || '-',
});

const Page = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');

        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch students');
        }

        const mappedStudents = data.students.map(mapStudentToRoster);

        setStudents(mappedStudents);
      } catch (error) {
        console.error('FETCH_STUDENTS_ERROR:', error);

        setError(error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500">Loading students...</div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <Roster
        title="Student Roster"
        data={students}
        columns={studentColumns}
        searchPlaceholder="Search students..."
        onRowClick={(student) => {
          console.log('Selected student:', student);
        }}
        onViewAll={() => {
          console.log('View all students');
        }}
      />
    </div>
  );
};

export default Page;
