'use client';

import { Search, ChevronRight } from 'lucide-react';

import Avatar from './avatar';
import { STUDENTS, STUDENT_STATUS_STYLES } from '@/constants/adminData';

export default function StudentRoster() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="px-5 pt-5">
        <div>
          <h2 className="text-lg font-bold text-[#1c3a5e]">Student Roster</h2>

          <div className="mt-1 h-0.5 w-8 bg-[#f2792a]" />
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search students by name or ID..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-600 placeholder:text-slate-400 focus:border-[#f2792a] focus:outline-none focus:ring-1 focus:ring-[#f2792a]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="mt-4 w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-y border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-5 py-2 font-medium">Name</th>

              <th className="px-2 py-2 font-medium">Department</th>

              <th className="px-2 py-2 font-medium">Status</th>

              <th className="px-5 py-2 text-right font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {STUDENTS.map((student) => (
              <tr
                key={student.id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={student.name} />

                    <div>
                      <p className="font-semibold text-slate-700">
                        {student.name}
                      </p>

                      <p className="text-xs text-slate-400">{student.id}</p>
                    </div>
                  </div>
                </td>

                <td className="px-2 py-3 text-slate-600">
                  {student.department}
                </td>

                <td className="px-2 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      STUDENT_STATUS_STYLES[student.status]
                    }`}
                  >
                    {student.status}
                  </span>
                </td>

                <td className="px-5 py-3 text-right">
                  <button className="text-slate-300 hover:text-slate-500">
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="mt-auto rounded-b-xl border-t border-slate-100 py-3 text-center text-sm font-semibold text-[#1c3a5e] hover:bg-slate-50">
        View All Students
      </button>
    </div>
  );
}
