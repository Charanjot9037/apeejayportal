'use client';

import { useState } from 'react';
import Sidebar from '@/app/components/elements/sidebar';
import { mentorDashboardData } from '@/constants/mentorData';
export default function MentorLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarData={mentorDashboardData}
      />

  <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>    </div>
  );
}
