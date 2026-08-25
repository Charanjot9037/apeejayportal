"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import AddProjectForm from "@/app/components/addProjectForm"

export default function EditProjectPage() {
  const params = useParams();

  const [project, setProject] = useState(null);
  const [viewerRole, setViewerRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`, {
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch project");
        }

        console.log("PROJECT LOADED FOR EDIT:", result.project);
        console.log("VIEWER ROLE:", result.viewerRole);

        setProject(result.project);
        setViewerRole(result.viewerRole);
      } catch (error) {
        console.error("EDIT_PROJECT_ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  /* ============================================
     LOADING
  ============================================ */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="text-sm text-slate-500">Loading project...</p>
      </div>
    );
  }

  /* ============================================
     PROJECT NOT FOUND
  ============================================ */

  if (!project) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <p className="text-sm text-red-500">Project not found.</p>
      </div>
    );
  }

  /* ============================================
     EDIT FORM
  ============================================ */

  return (
    <AddProjectForm mode="edit" project={project} viewerRole={viewerRole} />
  );
}