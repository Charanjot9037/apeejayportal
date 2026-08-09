'use client';

import {
  GraduationCap,
  UserRound,
  CalendarClock,
  ArrowUpRight,
  Plus,
} from 'lucide-react';

export default function StatCards() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-slate-500">Total Students</p>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1c3a5e]">
            <GraduationCap className="h-4 w-4 text-white" strokeWidth={2.25} />
          </div>
        </div>

        <p className="mt-2 text-3xl font-bold text-[#1c3a5e]">4,250</p>

        <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
          <ArrowUpRight className="h-3.5 w-3.5" />
          +12% this year
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-slate-500">Total Mentors</p>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100">
            <UserRound className="h-4 w-4 text-[#f2792a]" strokeWidth={2.25} />
          </div>
        </div>

        <p className="mt-2 text-3xl font-bold text-[#1c3a5e]">185</p>

        <p className="mt-2 text-xs font-medium text-slate-400">
          Across 15 departments
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-slate-500">
            Active Recruiters
          </p>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200">
            <CalendarClock
              className="h-4 w-4 text-slate-600"
              strokeWidth={2.25}
            />
          </div>
        </div>

        <p className="mt-2 text-3xl font-bold text-[#1c3a5e]">342</p>

        <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
          <Plus className="h-3.5 w-3.5 rounded-full bg-emerald-100 p-0.5" />
          45 new this month
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">Placement Rate</p>

          <span className="text-2xl font-bold text-[#f2792a]">88%</span>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#f2792a]"
            style={{ width: '88%' }}
          />
        </div>

        <p className="mt-2 text-right text-xs text-slate-400">Target: 95%</p>
      </div>
    </div>
  );
}
