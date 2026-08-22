'use client';

import { useEffect, useState } from 'react';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminStats() {
  const [stats, setStats] = useState({
    students: 0,
    mentors: 0,
    projects: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/admin/stats');

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch statistics');
        }

        setStats(result.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setError('Unable to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Database Overview
        </h2>

        <p className="text-sm text-gray-500">Students, mentors and projects</p>

        <div className="flex h-[320px] items-center justify-center">
          <p className="text-sm text-gray-500">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Database Overview
        </h2>

        <div className="flex h-[320px] items-center justify-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const charts = [
    {
      title: 'Students',
      value: stats.students,
    },
    {
      title: 'Mentors',
      value: stats.mentors,
    },
    {
      title: 'Projects',
      value: stats.projects,
    },
  ];

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Database Overview
        </h2>

        <p className="text-sm text-gray-500">Students, mentors and projects</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {charts.map((chart) => {
          const chartData = [
            {
              name: chart.title,
              value: chart.value,
            },
          ];

          return (
            <div
              key={chart.title}
              className="rounded-xl border border-gray-100 p-4"
            >
              <h3 className="text-center text-sm font-medium text-gray-700">
                {chart.title}
              </h3>

              <div className="relative h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      <Cell fill="var(--color-primary-orange)" />
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {chart.value}
                  </span>
                </div>
              </div>

              <p className="text-center text-xs text-gray-500">
                Total {chart.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
