'use client';

import React, { useState } from 'react';
import { UserPlus, Upload } from 'lucide-react';

import BulkImport from '@/app/components/admin/bulkImport';
import AddMentor from '../../components/admin/addMentorCard';

const ToolsCard = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [mentorOption, setMentorOption] = useState('bulk');

  return (
    <div className="p-3">
      {/* ================================================= */}
      {/* MAIN TABS */}
      {/* ================================================= */}

      <div className="flex gap-2 border-b">
        {/* STUDENT TAB */}
        <button
          type="button"
          onClick={() => setActiveTab('student')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'student'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Student
        </button>

        {/* MENTOR TAB */}
        <button
          type="button"
          onClick={() => setActiveTab('mentor')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'mentor'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Mentor
        </button>
      </div>

      {/* ================================================= */}
      {/* STUDENT TAB */}
      {/* ================================================= */}

      {activeTab === 'student' && (
        <div className="mt-4">
          <BulkImport role="student" />
        </div>
      )}

      {/* ================================================= */}
      {/* MENTOR TAB */}
      {/* ================================================= */}

      {activeTab === 'mentor' && (
        <div className="mt-4">
          {/* ================================================= */}
          {/* MENTOR OPTIONS */}
          {/* ================================================= */}

          <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {/* ================================================= */}
            {/* ADD SINGLE MENTOR */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={() => setMentorOption('single')}
              className={`rounded-lg border bg-white p-3 text-left transition-all ${
                mentorOption === 'single'
                  ? 'border-orange-500 shadow-sm'
                  : 'border-slate-200 hover:border-orange-400 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    mentorOption === 'single' ? 'bg-orange-100' : 'bg-slate-100'
                  }`}
                >
                  <UserPlus
                    className={`h-5 w-5 ${
                      mentorOption === 'single'
                        ? 'text-orange-500'
                        : 'text-slate-600'
                    }`}
                  />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-800">
                    Add Mentor
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Add a single mentor manually.
                  </p>

                  <p className="mt-1 text-xs font-medium text-orange-500">
                    Add mentor →
                  </p>
                </div>
              </div>
            </button>

            {/* ================================================= */}
            {/* BULK IMPORT MENTORS */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={() => setMentorOption('bulk')}
              className={`rounded-lg border bg-white p-3 text-left transition-all ${
                mentorOption === 'bulk'
                  ? 'border-orange-500 shadow-sm'
                  : 'border-slate-200 hover:border-orange-400 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    mentorOption === 'bulk' ? 'bg-orange-100' : 'bg-slate-100'
                  }`}
                >
                  <Upload
                    className={`h-5 w-5 ${
                      mentorOption === 'bulk'
                        ? 'text-orange-500'
                        : 'text-slate-600'
                    }`}
                  />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-800">
                    Bulk Import Mentors
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Import multiple mentors using CSV or Excel.
                  </p>

                  <p className="mt-1 text-xs font-medium text-orange-500">
                    Import mentors →
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* ================================================= */}
          {/* ADD MENTOR */}
          {/* ================================================= */}

          {mentorOption === 'single' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center justify-between"></div>

              <AddMentor />
            </div>
          )}

          {/* ================================================= */}
          {/* BULK IMPORT MENTORS */}
          {/* ================================================= */}

          {mentorOption === 'bulk' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <BulkImport role="mentor" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolsCard;
