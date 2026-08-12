'use client';

import { useState } from 'react';
import { Sidebar } from '../components/elements';
import { studentSidebarData } from '@/constants/studentslidebar';
export default function MentorLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
<<<<<<< HEAD
    <div className="flex  h-screen overflow-hidden bg-[#f7f6f4]">
=======
    <div className="flex h-full bg-slate-100">
>>>>>>> 70eaf316b73f2da9b2b3fb58855934c835ab95cc
      {/* <StudentProfileCard strength={dashboardStats.profileStrength} /> */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarData={studentSidebarData}
      />
<<<<<<< HEAD
      <main className="flex-1 overflow-y-auto overflow-y-auto p-5">{children}</main>
=======
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
>>>>>>> 70eaf316b73f2da9b2b3fb58855934c835ab95cc
    </div>
  );
}
