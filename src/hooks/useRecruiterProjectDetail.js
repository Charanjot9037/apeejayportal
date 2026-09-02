

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export function useRecruiterProjectDetail() {
  const params = useParams();

  const [project, setProject] = useState(null);
  const [viewerRole, setViewerRole] = useState("recruiter");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params?.id) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/recruiter/projects/${params.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const contentType =
          response.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          throw new Error(
            `Invalid API response. Status: ${response.status}`
          );
        }

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch project"
          );
        }

        const recruiterProject = result.project;

        if (!recruiterProject) {
          throw new Error("Project not found");
        }

        // API already returns mentor as an object
        setProject(recruiterProject);

        setViewerRole(
          result.viewerRole || "recruiter"
        );

      } catch (error) {
        console.error(
          "RECRUITER_PROJECT_FETCH_ERROR:",
          error
        );

        setError(error.message);
        setProject(null);

      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params?.id]);

  return {
    project,
    viewerRole,
    loading,
    error,
  };
}