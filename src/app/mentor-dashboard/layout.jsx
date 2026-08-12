'use client';

import { useState } from 'react';
import Sidebar from '@/app/components/elements/sidebar';
import { MENTOR_SIDEBAR_DATA } from '@/constants/sidepannel';
export default function MentorLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarData={MENTOR_SIDEBAR_DATA}
      />

      <main className="min-w-0 overflow-y-auto flex-1">{children}</main>
    </div>
  );
}
