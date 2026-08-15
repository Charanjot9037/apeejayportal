'use client';

import { useState } from 'react';
import { Sidebar } from '../components/elements';
import { studentSidebarData } from '@/constants/studentslidebar';
export default function MentorLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full bg-slate-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarData={studentSidebarData}
      />
      <main className="flex-1  overflow-y-auto p-5">{children}</main>
    </div>
  );
}
