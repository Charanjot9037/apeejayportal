'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatCards, Roster, DashboardHeader } from '@/app/components/elements';
import {
  MENTOR_STAT_CARDS,
  MENTOR_STUDENT_COLUMNS,
  MENTOR_DASHBOARD_HEADER,
} from '@/constants/mentorData';

export default function Mentor() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorProjects = async () => {
      try {
        const res = await fetch('/api/projects/mentor');
        const data = await res.json();

        if (!data.success) {
          setError(data.message || 'Failed to load projects.');
          return;
        }

        setProjects(data.projects);
      } catch (err) {
        console.error(err);
        setError('Something went wrong while fetching projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorProjects();
  }, []);

  const rosterData = projects.map((p) => ({
    id: p._id,
    name: p.student?.name || 'Unknown',
    major: p.student?.department || '—',
    projectName: p.title,
    projectTitle: p.title,
    status: p.status,
  }));

  const handleViewProject = (item) => {
    router.push(`/mentor-dashboard/projects/${item.id}`);
  };

  return (
    <div className="flex h-full">
      <main className="flex-1 px-8 py-8">
        <DashboardHeader
          {...MENTOR_DASHBOARD_HEADER}
          onAction={() => console.log('Pending Reviews')}
        />
        <StatCards cards={MENTOR_STAT_CARDS} />

        {loading && <p>Loading students...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <Roster
            title="Student Roster"
            data={rosterData}
            columns={MENTOR_STUDENT_COLUMNS}
            searchPlaceholder="Search students..."
            onRowClick={handleViewProject}
            onViewAll={() => console.log('View all students')}
            viewAllLabel="View All Students"
          />
        )}
      </main>
    </div>
  );
}