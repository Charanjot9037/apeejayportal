'use client';

import { GraduationCap, HelpCircle, LogOut } from 'lucide-react';

import { NAV_ITEMS } from '@/constants/adminData';

export default function AdminSidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6">
      <div className="flex flex-col items-center gap-2 pb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#1c3a5e]/20">
          <GraduationCap className="h-7 w-7 text-[#f2792a]" />
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-[#1c3a5e]">Admin Portal</p>

          <p className="text-xs text-slate-400">Academic Year 2024-25</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-[#f2792a] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={2} />

            {label}
          </button>
        ))}
      </nav>

      <div className="mb-4 rounded-lg bg-orange-50 px-3 py-2 text-center text-xs font-semibold text-[#f2792a]">
        Placement Readiness: 85%
      </div>

      <div className="flex flex-col gap-1 border-t border-slate-100 pt-4">
        <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <HelpCircle className="h-4 w-4" />
          Help Center
        </button>

        <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
