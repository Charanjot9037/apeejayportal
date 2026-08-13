'use client';
import Sidebar from '@/app/components/elements/sidebar';
import { NAV_ITEMS } from '@/constants/adminData';
import { useState } from 'react';
export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar
        sidebarData={NAV_ITEMS}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="min-w-0 overflow-y-auto flex-1">{children}</main>
    </div>
  );
}
