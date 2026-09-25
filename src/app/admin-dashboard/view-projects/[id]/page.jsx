// app/mentor-dashboard/projects/[id]/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import LoadingState from "@/app/components/projectDetail/handlers/LoadingState";
import NotFoundState from "@/app/components/projectDetail/handlers/NotFoundState";
import OverviewSection from "@/app/components/projectDetail/handlers/sections/OverviewSection";
import TechnologiesSection from "@/app/components/projectDetail/handlers/sections/TechnologiesSection";
import GallerySection from "@/app/components/projectDetail/handlers/sections/GallerySection";
import DocumentsSection from "@/app/components/projectDetail/handlers/sections/DocumentSection";
import TeamMembersSection from "@/app/components/projectDetail/handlers/sections/TeamMemberSection";
import MentorSection from "@/app/components/projectDetail/handlers/sections/MentorSection";
import ProjectInfoSection from "@/app/components/projectDetail/handlers/sections/ProjectInfo";
import ApprovalHistorySection from "@/app/components/projectDetail/handlers/sections/ApprovalHistorySection";
import MentorReviewSection from "@/app/components/projectDetail/handlers/sections/MentorReviewSection";

import ProjectStatusSection from "@/app/components/projectDetail/handlers/sections/ProjectsStatusSection";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MentorProjectDetail() {
  const { project, loading, setProject } = useProjectDetail({
    allowDelete: false,
  });


  const router=useRouter();
const [deleting,setDeleting]=useState(false);
  if (loading) return <LoadingState />;
  if (!project) return <NotFoundState />;

  const teamMemberName =
    project?.teamMembers?.fullName ||
    project?.teamMembers?.userId?.name ||
    (project?.teamMembers ? "Team Member" : null);

  const ownerName = project?.student?.name || "Owner";
    const onDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(`/api/projects/${project._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete project");
      }

      toast.success("Project deleted successfully.");
      router.push("/admin-dashboard/all-projects");
    } catch (error) {
      console.error("DELETE ERROR:", error);

      toast.error(error.message || "Failed to delete project.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-full p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex justify-between">
<div>
  <Link
          href="/admin-dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
</div>

          <div>
                <Button
              variant="outline"
              onClick={onDelete}
              disabled={deleting}
              className="h-9 border-red-200 px-4 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />

              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      

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
          <MentorReviewSection project={project} onUpdated={setProject} />
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
    </div>
  );
}
