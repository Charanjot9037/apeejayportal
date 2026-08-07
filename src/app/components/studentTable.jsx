'use client';

import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { students } from './../../constants/mentorData';

export default function StudentTable() {
  const [query, setQuery] = useState('');

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[#1E3A5F]">Student Roster</h2>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search students..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-orange-500 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="py-3">Student</th>
              <th>Project</th>
              <th>Major</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.email} className="border-b last:border-none">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E3A5F] text-xs font-semibold text-white">
                      {student.initials}
                    </div>

                    <div>
                      <p className="font-medium">{student.name}</p>

                      <p className="text-xs text-gray-400">{student.email}</p>
                    </div>
                  </div>
                </td>

                <td>{student.project}</td>

                <td>{student.major}</td>

                <td>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      student.status === 'Approved'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    {student.status}
                  </span>
                </td>

                <td>
                  {student.status === 'Approved' ? (
                    <button className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                      <Eye size={14} />
                      View
                    </button>
                  ) : (
                    <button className="rounded-md border border-orange-500 px-3 py-1.5 text-xs font-medium text-orange-500 hover:bg-orange-50">
                      {student.action}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 text-center">
        <button className="text-sm font-medium text-orange-500 hover:underline">
          View All Students
        </button>
      </div>
    </div>
  );
}
