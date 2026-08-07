'use client';

import { Calendar, Menu } from 'lucide-react';

export default function DashboardHeader({ setSidebarOpen }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="mt-1 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-[#1E3A5F] sm:text-3xl">
            Mentor Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of your assigned students and recent activities.
          </p>
        </div>
      </div>

      <button className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-orange-600 sm:self-auto">
        <Calendar size={16} />
        Schedule Session
      </button>
    </div>
  );
}
