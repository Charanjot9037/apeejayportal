"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import AddProjectForm from "@/app/components/AddProjectForm";

export default function EditProjectPage() {
  const params = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch project");
        }

        console.log("PROJECT LOADED FOR EDIT:", result.project);

        console.log("PROJECT FROM API:", result.project);

        console.log("PROJECT IMAGES:", result.project?.projectImages);

        console.log("SYNOPSIS:", result.project?.synopsisFile);

        console.log("REPORT:", result.project?.reportFile);

        console.log("PRESENTATION:", result.project?.presentationFile);

        setProject(result.project);
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

  return <AddProjectForm mode="edit" project={project} />;
}
