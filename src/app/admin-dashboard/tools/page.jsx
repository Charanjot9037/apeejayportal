'use client';

import React, { useState } from 'react';
import BulkImport from '@/app/components/bulkImport';

const AddStudent = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [showBulkImport, setShowBulkImport] = useState(false);

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6">
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
              className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Bulk Import
            </button>
          ) : (
            <BulkImport />
          )}
        </div>
      )}

      {/* Teacher Tab */}
      {activeTab === 'teacher' && (
        <div>{/* Teacher content will be added later */}</div>
      )}
    </div>
  );
};

export default AddStudent;
