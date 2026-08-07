'use client';

import { HelpCircle, LogOut } from 'lucide-react';

import SidebarItem from './sidebarItem';
import SidebarOverlay from './sidebarOverlay';
import { navItems } from '../../constants/mentorData';
export default function MentorSidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      <SidebarOverlay
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 transform flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 border-b px-6 py-5">
          <span className="text-lg font-bold text-orange-500">
            Mentor Portal
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <SidebarItem key={item.label} {...item} />
          ))}
        </nav>

        <div className="border-t px-3 py-4">
          <p className="mb-4 text-sm">
            Placement Readiness
            <span className="ml-2 font-bold text-orange-500">85%</span>
          </p>

          <SidebarItem
            href="/mentor/help"
            icon={HelpCircle}
            label="Help Center"
          />

          <SidebarItem href="/logout" icon={LogOut} label="Logout" />
        </div>
      </aside>
    </>
  );
}
