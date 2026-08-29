// app/mentor-dashboard/projects/[id]/page.jsx
'use client';

import { useProjectDetail } from '@/hooks/useProjectDetail';

import LoadingState from '@/app/components/projectDetail/handlers/LoadingState';
import NotFoundState from '@/app/components/projectDetail/handlers/NotFoundState';
import OverviewSection from '@/app/components/projectDetail/handlers/sections/OverviewSection';
import TechnologiesSection from '@/app/components/projectDetail/handlers/sections/TechnologiesSection';
import GallerySection from '@/app/components/projectDetail/handlers/sections/GallerySection';
import DocumentsSection from '@/app/components/projectDetail/handlers/sections/DocumentSection';
import TeamMembersSection from '@/app/components/projectDetail/handlers/sections/TeamMemberSection';
import MentorSection from '@/app/components/projectDetail/handlers/sections/MentorSection';
import ProjectInfoSection from '@/app/components/projectDetail/handlers/sections/ProjectInfo';
import ApprovalHistorySection from '@/app/components/projectDetail/handlers/sections/ApprovalHistorySection';
import MentorReviewSection from '@/app/components/projectDetail/handlers/sections/MentorReviewSection';

import ProjectStatusSection from '@/app/components/projectDetail/handlers/sections/ProjectsStatusSection';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MentorProjectDetail() {
  const { project, loading, setProject } = useProjectDetail({
    allowDelete: false,
  });

  if (loading) return <LoadingState />;
  if (!project) return <NotFoundState />;

  const teamMemberName =
    project?.teamMembers?.fullName ||
    project?.teamMembers?.userId?.name ||
    (project?.teamMembers ? 'Team Member' : null);

  const ownerName = project?.student?.name || 'Owner';

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-4">
        <Link
          href="/mentor-dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-xl font-bold text-[#1c3a5e]">{project.title}</h1>

        <p className="text-sm text-slate-500">{project.subtitle}</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
        {/* Left Column */}
        <div className="space-y-4">
          <OverviewSection project={project} />

          <TechnologiesSection project={project} />

          <GallerySection project={project} />

          <DocumentsSection
            project={project}
            ownerName={ownerName}
            teamMemberName={teamMemberName}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <ProjectStatusSection project={project} onUpdated={setProject} />

          <TeamMembersSection project={project} />

          <MentorSection project={project} />

          <ProjectInfoSection project={project} />

          <ApprovalHistorySection project={project} />
        </div>
      </div>

      {/* ONLY Mentor Review moved to bottom */}
      <div className="mt-4">
        <MentorReviewSection project={project} onUpdated={setProject} />
      </div>
    </div>
  );
}
