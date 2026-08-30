
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

        /*
         * Prevent:
         * Unexpected token '<', "<!DOCTYPE..."
         *
         * This happens when the API returns HTML instead of JSON,
         * for example when the route does not exist.
         */
        const contentType = response.headers.get("content-type");

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

        /*
         * =====================================================
         * NORMALIZE MENTORS
         * =====================================================
         *
         * MentorSection expects:
         *
         * project.mentor
         * project.mentor2
         *
         * and uses:
         *
         * key={mentor._id}
         *
         * Therefore we make sure every mentor has a unique _id.
         */

        const normalizeMentor = (mentor, fallbackId) => {
          if (!mentor) return null;

          /*
           * If MongoDB ObjectId
           */
          const existingId =
            mentor?._id?.toString?.() ||
            mentor?.id?.toString?.() ||
            mentor?.userId?.toString?.();

          return {
            ...mentor,
            _id: existingId || fallbackId,
          };
        };

        const mentor = normalizeMentor(
          recruiterProject.mentor,
          "recruiter-mentor-1"
        );

        let mentor2 = normalizeMentor(
          recruiterProject.mentor2,
          "recruiter-mentor-2"
        );

        /*
         * =====================================================
         * PREVENT DUPLICATE MENTOR KEYS
         * =====================================================
         *
         * If mentor and mentor2 somehow contain the same
         * MongoDB _id, remove mentor2.
         */

        if (
          mentor &&
          mentor2 &&
          mentor._id.toString() === mentor2._id.toString()
        ) {
          mentor2 = null;
        }

        /*
         * =====================================================
         * FINAL PROJECT
         * =====================================================
         */

        const normalizedProject = {
          ...recruiterProject,
          mentor,
          mentor2,
        };

        setProject(normalizedProject);

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

