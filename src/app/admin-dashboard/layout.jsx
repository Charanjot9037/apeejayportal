'use client';
import Sidebar from '@/app/components/elements/sidebar';
import { adminDashboardData } from '@/constants/adminData';
import { useState } from 'react';
export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <Sidebar
        sidebarData={adminDashboardData}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="min-h-screen lg:ml-64">{children}</main>
    </div>
  );
}
