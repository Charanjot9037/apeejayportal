'use client';
import { StatCards, Roster, DashboardHeader } from '@/app/components/elements';
import {
  MENTOR_STAT_CARDS,
  MENTOR_STUDENTS,
  MENTOR_STUDENT_COLUMNS,
} from '@/constants/mentorData';
import { ClipboardCheck } from 'lucide-react';
import BulkImport from './BulkImport';

export default function MentorDashboard() {
  return (
    <BulkImport />
    // <div className="flex h-full">
    //   <main className="flex-1  px-8 py-8">
    //     <DashboardHeader
    //       title="Mentor Dashboard"
    //       description="Overview of institutional metrics and student management."
    //       actionLabel="12 Pending Approvals"
    //       actionIcon={ClipboardCheck}
    //       onAction={() => console.log('Pending Approvals')}
    //     />
    //     <StatCards cards={MENTOR_STAT_CARDS} />

    //     <Roster
    //       title="Student Roster"
    //       data={MENTOR_STUDENTS}
    //       columns={MENTOR_STUDENT_COLUMNS}
    //       searchPlaceholder="Search students..."
    //       onRowClick={(student) => {
    //         console.log('Student:', student);
    //       }}
    //       onViewAll={() => {
    //         console.log('View all students');
    //       }}
    //       viewAllLabel="View All Students"
    //     />
    //   </main>
    // </div>
  );
}
