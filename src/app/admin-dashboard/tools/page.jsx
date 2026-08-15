'use client';

import React, { useState } from 'react';
import BulkImport from '@/app/components/admin/bulkImport';
import AddMentor from '../../components/admin/addMentorCard';

const AddStudent = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showAddMentor, setShowAddMentor] = useState(false);

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b">
        <button
          onClick={() => {
            setActiveTab('student');
            setShowBulkImport(false);
          }}
          className={`px-6 py-3 font-medium ${
            activeTab === 'student'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-500'
          }`}
        >
          Student
        </button>

        <button
          onClick={() => {
            setActiveTab('teacher');
            setShowBulkImport(false);
          }}
          className={`px-6 py-3 font-medium ${
            activeTab === 'teacher'
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-500'
          }`}
        >
          Teacher
        </button>
      </div>

      {/* Student Tab */}
      {activeTab === 'student' && (
        <div>
          {!showBulkImport ? (
            <button
              onClick={() => setShowBulkImport(true)}
              className="rounded-md bg-orange-500 px-6 py-3 text-white hover:bg-orange-600"
            >
              Add Student
            </button>
          ) : (
            <BulkImport />
          )}
        </div>
      )}

      {/* Teacher Tab */}
      {activeTab === 'teacher' && (
        <div>
          {!showAddMentor ? (
            <button
              onClick={() => setShowAddMentor(true)}
              className="rounded-md bg-orange-500 px-6 py-3 text-white hover:bg-orange-600"
            >
              Add Mentor
            </button>
          ) : (
            <AddMentor />
          )}
        </div>
      )}
    </div>
  );
};

export default AddStudent;
