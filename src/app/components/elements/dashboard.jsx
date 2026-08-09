'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GraduationCap, HelpCircle, LogOut } from 'lucide-react';

export default function Dashboard({
  title,
  subtitle,
  profileUrl,
  navItems = [],
  placementReadiness,
  onHelp,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState(navItems[0]?.label || '');

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-100 bg-white p-5">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-2 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
          {profileUrl ? (
            <Image
              src={profileUrl}
              alt={title}
              width={44}
              height={44}
              className="h-full w-full object-contain"
            />
          ) : (
            <GraduationCap className="h-5 w-5 text-[#f2792a]" />
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-[#1c3a5e]">{title}</p>

          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = activeTab === label;

          return (
            <a
              key={label}
              href={href}
              onClick={() => setActiveTab(label)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#f2792a] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />

              <span>{label}</span>
            </a>
          );
        })}
      </nav>

      {placementReadiness !== undefined && (
        <div className="mb-4 rounded-lg bg-orange-50 px-3 py-2 text-center text-xs font-semibold text-[#f2792a]">
          Placement Readiness: {placementReadiness}%
        </div>
      )}

      <div className="flex flex-col gap-1 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onHelp}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Help Center</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
