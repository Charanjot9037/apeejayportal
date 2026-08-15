'use client';

import { ClipboardCheck } from 'lucide-react';

import { StatCards, Roster, DashboardHeader } from '@/app/components/elements';

import {
  STAT_CARDS,
  STUDENTS,
  MENTORS,
  MENTOR_COLUMNS,
  STUDENT_COLUMNS,
} from '@/constants/adminData';

export default function AdminDashboardPage() {
  return (
    <div className="flex h-full">
      <main className="flex-1 px-8 py-8">
        <DashboardHeader
          title="Admin Dashboard"
          description="Overview of institutional metrics and student management."
          actionLabel="12 Pending Approvals"
          actionIcon={ClipboardCheck}
          onAction={() => console.log('Pending Approvals')}
        />
        <StatCards cards={STAT_CARDS} />
        <div className="grid grid-cols-1  gap-6 xl:grid-cols-2">
          <Roster
            title="Student Roster"
            data={STUDENTS}
            columns={STUDENT_COLUMNS}
            searchPlaceholder="Search students by name or ID..."
            onRowClick={(student) => {
              console.log('Student:', student);
            }}
            onViewAll={() => {
              console.log('View all students');
            }}
            viewAllLabel="View All Students"
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
