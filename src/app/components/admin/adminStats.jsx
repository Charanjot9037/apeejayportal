'use client';

import { useEffect, useState } from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

  const data = [
    {
      name: 'Students',
      count: stats.students,
    },
    {
      name: 'Mentors',
      count: stats.mentors,
    },
    {
      name: 'Projects',
      count: stats.projects,
    },
  ];

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Database Overview
          </h2>

          <p className="text-sm text-gray-500">
            Students, mentors and projects
          </p>
        </div>

        <div className="flex h-[320px] items-center justify-center">
          <p className="text-sm text-gray-500">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Database Overview
          </h2>

          <p className="text-sm text-gray-500">
            Students, mentors and projects
          </p>
        </div>

        <div className="flex h-[320px] items-center justify-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Database Overview
        </h2>

        <p className="text-sm text-gray-500">Students, mentors and projects</p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar dataKey="count" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
