'use client';

import { useEffect, useState } from 'react';
import { Users, GraduationCap } from 'lucide-react';
import Roster from '@/app/components/elements/roaster';

import {
  MENTOR_ROSTER_COLUMNS,
  MENTOR_DEFAULT_FILTERS,
  MENTOR_FILTER_CONFIG,
  mapMentorToRoster,
} from '@/constants/adminData';

export default function Page() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(MENTOR_DEFAULT_FILTERS);

  const fetchMentors = async (selectedFilters) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/mentors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedFilters),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch mentors');
      }

      const mappedMentors = (data.mentors || []).map(mapMentorToRoster);

      setMentors(mappedMentors);
    } catch (error) {
      console.error('FETCH_MENTORS_ERROR:', error);

      setError(error.message || 'Something went wrong');

      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors(MENTOR_DEFAULT_FILTERS);
  }, []);

  const handleApplyFilters = (selectedFilters) => {
    setFilters(selectedFilters);
    fetchMentors(selectedFilters);
  };

  const handleRetry = () => {
    fetchMentors(filters);
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-500">Mentors</span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                  <GraduationCap className="h-5 w-5 text-primary-orange" />
                </div>

                <h1 className="text-2xl font-bold text-[#1c3a5e]">
                  Mentor Management
                </h1>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                View and manage mentors according to their department.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-4 w-4 text-blue-600" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Total Mentors
                </p>

                <p className="text-lg font-bold text-[#1c3a5e]">
                  {mentors.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <Users className="h-5 w-5 text-red-500" />
              </div>

              <h2 className="mt-4 text-base font-semibold text-slate-700">
                Unable to load mentors
              </h2>

              <p className="mt-1 text-sm text-slate-500">{error}</p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-5 rounded-lg bg-primary-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#df681c]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Roster */}

        <div className="relative rounded-2xl">
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-md">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary-orange" />

                <span className="text-sm font-medium text-slate-600">
                  Loading mentors...
                </span>
              </div>
            </div>
          )}

          <Roster
            title="Mentor Roster"
            data={mentors}
            columns={MENTOR_ROSTER_COLUMNS}
            searchPlaceholder="Search mentors..."
            defaultFilters={filters}
            filterConfig={MENTOR_FILTER_CONFIG}
            showApplyButton={true}
            onApplyFilters={handleApplyFilters}
            className="mt-0 shadow-sm"
            onRowClick={(mentor) => {
              console.log('Selected mentor:', mentor);
            }}
          />
        </div>
      </div>
    </div>
  );
}
