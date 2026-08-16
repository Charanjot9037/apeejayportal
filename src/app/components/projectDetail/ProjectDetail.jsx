"use client";

import { useProjectDetail } from "@/hooks/useProjectDetail";

import LoadingState from "../projectDetail/handlers/LoadingState";
import NotFoundState from "../projectDetail/handlers/NotFoundState";

import DetailHeader from "../projectDetail/handlers/sections/DetailHeader";
import OverviewSection from "../projectDetail/handlers/sections/OverviewSection";
import TechnologiesSection from "../projectDetail/handlers/sections/TechnologiesSection";
import GallerySection from "../projectDetail/handlers/sections/GallerySection";
import DocumentsSection from "../projectDetail/handlers/sections/DocumentSection";
import TeamMembersSection from "../projectDetail/handlers/sections/TeamMemberSection";
import MentorSection from "../projectDetail/handlers/sections/MentorSection";
import ProjectInfoSection from "../projectDetail/handlers/sections/ProjectInfo";
import ApprovalHistorySection from "../projectDetail/handlers/sections/ApprovalHistorySection";

/* =========================================================
   PROJECT DETAIL

   All fetch/delete state lives in useProjectDetail. This
   component is just layout + composition of sections.
========================================================= */

export default function ProjectDetail() {
  const { project, loading, deleting, handleDelete } = useProjectDetail();

  if (loading) {
    return <LoadingState />;
  }

  if (!project) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-full bg-[#f8f7f4] px-4 py-5 md:px-6 lg:px-8">
      <DetailHeader
        project={project}
        deleting={deleting}
        onDelete={handleDelete}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          <OverviewSection project={project} />
          <TechnologiesSection project={project} />
          <GallerySection project={project} />
          <DocumentsSection project={project} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          <TeamMembersSection project={project} />
          <MentorSection project={project} />
          <ProjectInfoSection project={project} />
          <ApprovalHistorySection project={project} />
        </div>
      </div>
    </div>
  );
}