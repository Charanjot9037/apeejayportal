'use client';
import { StatCards, Roster, DashboardHeader } from '@/app/components/elements';

import {
  STAT_CARDS,
  STUDENTS,
  MENTORS,
  MENTOR_COLUMNS,
  ADMIN_DASHBOARD_HEADER,
  STUDENT_COLUMNS,
} from '@/constants/adminData';

export default function Admin() {
  return (
    <div className="flex h-full">
      <main className="flex-1 px-8 py-8">
        <DashboardHeader
          {...ADMIN_DASHBOARD_HEADER}
          onAction={() => console.log('Pending Approvals')}
        />
        <StatCards cards={STAT_CARDS} />
        <div className="grid grid-cols-1  gap-6 xl:grid-cols-2">
          <Roster
            title="Student Roaster"
            data={STUDENTS}
            columns={STUDENT_COLUMNS}
            searchPlaceholder="Search Student..."
            onViewAll={() => {
              console.log('View all students');
            }}
            onRowClick={(student) => {
              console.log('Student:', student);
            }}
          />
          <Roster
            title="Mentor Roster"
            data={MENTORS}
            columns={MENTOR_COLUMNS}
            searchPlaceholder="Search mentors..."
            onRowClick={(mentor) => {
              console.log('Mentor:', mentor);
            }}
            onViewAll={() => {
              console.log('View all mentors');
            }}
            viewAllLabel="View All Mentors"
          />
        </div>
      </main>
    </div>
  );
}
