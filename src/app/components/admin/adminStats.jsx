'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ClipboardList, BarChart3 } from 'lucide-react';

export default function AdminStats() {
  const projectData = [
    { name: 'RES', value: 80 },
    { name: 'INT', value: 60 },
    { name: 'COM', value: 45 },
    { name: 'TEC', value: 75 },
  ];

  const departmentData = [
    { name: 'Engineering', value: 94 },
    { name: 'Science', value: 88 },
    { name: 'Business', value: 82 },
    { name: 'Arts', value: 76 },
  ];

  return (
    <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Database Overview
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Current distribution of resources across the platform.
        </p>
      </div>

      {/* Two Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Project Enrollment */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-3 flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Project Enrollment
            </h3>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
              <ClipboardList className="h-4 w-4 text-orange-500" />
            </div>
          </div>

          <p className="mb-3 text-xs text-gray-500">
            Enrollment levels across project categories.
          </p>

          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectData}
                margin={{
                  top: 5,
                  right: 5,
                  left: -25,
                  bottom: 0,
                }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis hide />

                <Tooltip />

                <Bar
                  dataKey="value"
                  radius={[3, 3, 0, 0]}
                  fill="var(--color-primary-orange)"
                  barSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <span className="text-xs font-medium text-gray-700">
              Total Enrolled
            </span>

            <span className="text-lg font-semibold text-orange-500">1,240</span>
          </div>
        </div>

        {/* Department Performance */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-3 flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Dept. Performance
            </h3>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
              <BarChart3 className="h-4 w-4 text-orange-500" />
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {departmentData.map((department) => (
              <div key={department.name}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">
                    {department.name}
                  </span>

                  <span className="text-xs font-medium text-orange-500">
                    {department.value}%
                  </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all"
                    style={{
                      width: `${department.value}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
