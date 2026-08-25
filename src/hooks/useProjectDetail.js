import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

/* =========================================================
   useProjectDetail

   Owns fetching the project, loading/deleting state, and
   the delete handler used by ProjectDetail and DetailHeader.
========================================================= */

export function useProjectDetail() {
  const params = useParams();
  const router = useRouter();

  const [project, setProject] = useState(null);

  const [viewerRole, setViewerRole] = useState(null);

  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(false);

  /* =======================================================
     FETCH PROJECT
  ======================================================= */

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

        setProject(result.project);
        setViewerRole(result.viewerRole);
      } catch (error) {
        console.error("PROJECT_FETCH_ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  /* =======================================================
     DELETE PROJECT
  ======================================================= */

  const handleDelete = async () => {
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
      router.push("/student");
    } catch (error) {
      console.error("DELETE ERROR:", error);

      toast.error(error.message || "Failed to delete project.");
    } finally {
      setDeleting(false);
    }
  };

  return {
    project,
    viewerRole,
    loading,
    deleting,
    handleDelete,
    setProject,
  };
}