'use client';
import { StatCards, DashboardHeader } from '@/app/components/elements';
import AdminStats from './adminStats';

import { STAT_CARDS, ADMIN_DASHBOARD_HEADER } from '@/constants/adminData';

export default function Admin() {
  return (
    <div className="flex h-full">
      <main className="flex-1 px-8 py-8">
        <DashboardHeader
          {...ADMIN_DASHBOARD_HEADER}
          onAction={() => console.log('Pending Approvals')}
        />
        <StatCards cards={STAT_CARDS} />
        <div className="mt-4">
          <AdminStats />
        </div>
      </main>
    </div>
  );
}
