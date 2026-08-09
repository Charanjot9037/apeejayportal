'use client';

import { ClipboardCheck } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-extrabold text-[#1c3a5e]">
          Admin Dashboard
        </h1>

        <div className="mt-1 h-1 w-10 bg-[#f2792a]" />

        <p className="mt-3 text-sm text-slate-500">
          Overview of institutional metrics and student management.
        </p>
      </div>

      <button className="flex items-center gap-2 rounded-lg bg-[#f2792a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#e8641a]">
        <ClipboardCheck className="h-4 w-4" />
        12 Pending Approvals
      </button>
    </div>
  );
}
