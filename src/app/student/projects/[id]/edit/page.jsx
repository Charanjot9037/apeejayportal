"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import AddProjectForm from '@/app/components/AddProjectForm'

export default function EditProjectPage() {
  const params = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `/api/projects/${params.id}`
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch project"
          );
        }

        setProject(result.project);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading project...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-center text-sm text-red-500">
        Project not found.
      </div>
    );
  }

  return (
    <AddProjectForm
      mode="edit"
      project={project}
    />
  );
}