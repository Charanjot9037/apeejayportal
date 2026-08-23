
'use client';

import { StatCards, Roster, DashboardHeader } from '@/app/components/elements';
import { STUDENT_FILTERS } from '@/constants/adminData';

import {
  HOD_DASHBOARD_HEADER,
  STAT_CARDS,
  PROJECT_COLUMNS,
  PROJECTS
} from '@/constants/hodData';


import { useState } from 'react';


export default function HODdashboard() {
  const [filters, setFilters] = useState({});

  const handleApplyFilters = (selectedFilters) => {
    setFilters(selectedFilters);

    console.log('Applied project filters:', selectedFilters);

    // Later:
    // fetchProjects(selectedFilters);
  };

  const handleViewProject = (project) => {
    console.log('View project:', project);

    // Later:
    // router.push(`/hod/projects/${project.id}`);
  };

  return (
    <div className="flex h-full">
      <main className="min-w-0 flex-1 px-8 py-8">

        {/* Header */}
        <DashboardHeader
          {...HOD_DASHBOARD_HEADER}
          onAction={() => console.log('Pending Approvals')}
        />

        {/* Statistics */}
        <StatCards cards={STAT_CARDS} />

        {/* Project Roster */}
        <div className="mt-2 w-full">
          <Roster
            title="Project Roster"
            data={PROJECTS}
            columns={PROJECT_COLUMNS}
            searchPlaceholder="Search projects, students or mentors..."
            defaultFilters={filters}
         filterConfig={STUDENT_FILTERS}
        showApplyButton={true}
            onApplyFilters={handleApplyFilters}
            className="w-full shadow-sm"
            onRowClick={handleViewProject}
             initialVisibleRows={3}
          />
        </div>

      </main>
    </div>
  );
}