'use client';
import { StatCards, Roster, DashboardHeader } from '@/app/components/elements';
import AdminStats from './adminStats';

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
        <AdminStats />
      </main>
    </div>
  );
}
