'use client';

import { useState } from 'react';
import MentorSidebar from '../components/mentorSidebar';

export default function MentorLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f7f6f4]">
      <MentorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
