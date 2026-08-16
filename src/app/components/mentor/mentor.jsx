'use client';
import { StatCards, Roster, DashboardHeader } from '@/app/components/elements';
import {
  MENTOR_STAT_CARDS,
  MENTOR_STUDENTS,
  MENTOR_STUDENT_COLUMNS,
  MENTOR_DASHBOARD_HEADER,
} from '@/constants/mentorData';

export default function Mentor() {
  return (
    <div className="flex h-full">
      <main className="flex-1  px-8 py-8">
        <DashboardHeader
          {...MENTOR_DASHBOARD_HEADER}
          onAction={() => console.log('Pending Reviews')}
        />
        <StatCards cards={MENTOR_STAT_CARDS} />

        <Roster
          title="Student Roster"
          data={MENTOR_STUDENTS}
          columns={MENTOR_STUDENT_COLUMNS}
          searchPlaceholder="Search students..."
          onRowClick={(student) => {
            console.log('Student:', student);
          }}
          onViewAll={() => {
            console.log('View all students');
          }}
          viewAllLabel="View All Students"
        />
      </main>
    </div>
  );
}
