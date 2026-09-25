"use client";

import { useEffect, useState } from "react";
import {
  FolderKanban,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import Roster from "@/app/components/elements/roaster";
import AuthGuardModal from "@/app/components/AuthGuardModal";

// ---------------------------------------------------------
// PROJECT COLUMNS
// ---------------------------------------------------------

const projectColumns = [
  {
    key: "projectTitle",
    label: "Project",
  },
  {
    key: "projectType",
    label: "Type",
  },
  {
    key: "teamMembers",
    label: "Students",
  },
  {
    key: "mentorName",
    label: "Mentor",
  },
  {
    key: "status",
    label: "Status",
  },
];

// ---------------------------------------------------------
// MAP PROJECT
// ---------------------------------------------------------

const mapProjectToRoster = (project) => {
  const members = Array.isArray(project.teamMembers)
    ? project.teamMembers
    : [];

  return {
    ...project,

    _id: project._id,

    projectTitle:
      project.projectTitle ||
      project.title ||
      "Untitled Project",

    projectType:
      project.projectType === "team"
        ? "Team"
        : "Individual",

    teamMembers:
      members.length > 0
        ? members
            .map(
              (member) =>
                member.fullName ||
                member.name ||
                member.userId ||
                "Unknown"
            )
            .join(", ")
        : "No students",

    mentorName:
      project.mentor?.fullName ||
      project.mentor?.name ||
      project.mentorName ||
      "Not assigned",

    status:
      project.status ||
      "Pending Approval",
  };
};

// ---------------------------------------------------------
// STATISTICS
// ---------------------------------------------------------

const getProjectStats = (projects = []) => {
  const total = projects.length;

  const approved = projects.filter(
    (project) =>
      project.status === "Approved"
  ).length;

  const pending = projects.filter(
    (project) =>
      project.status === "Pending Approval"
  ).length;

  const rejected = projects.filter(
    (project) =>
      project.status === "Rejected"
  ).length;

  return [
    {
      title: "Total",
      value: total,
      icon: "blue",
      Icon: FolderKanban,
    },
    {
      title: "Approved",
      value: approved,
      icon: "blue",
      Icon: CheckCircle,
    },
    {
      title: "Pending",
      value: pending,
      icon: "orange",
      Icon: Clock,
    },
    {
      title: "Rejected",
      value: rejected,
      icon: "orange",
      Icon: XCircle,
    },
  ];
};

// =========================================================
// PAGE
// =========================================================

export default function Page() {
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [projectStats, setProjectStats] = useState([]);

  // -------------------------------------------------------
  // AUTH MODAL
  // -------------------------------------------------------

  const [authModal, setAuthModal] = useState({
    open: false,
    type: "authentication",
    message: "",
  });

  // -------------------------------------------------------
  // FETCH ALL PROJECTS
  // -------------------------------------------------------

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/getprojects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      // ---------------------------------------------------
      // AUTHENTICATION
      // ---------------------------------------------------

      if (response.status === 401) {
        setAuthModal({
          open: true,
          type: "authentication",
          message:
            data.message ||
            "Your session has expired. Please log in again.",
        });

        return;
      }

      // ---------------------------------------------------
      // AUTHORIZATION
      // ---------------------------------------------------

      if (response.status === 403) {
        setAuthModal({
          open: true,
          type: "unauthorized",
          message:
            data.message ||
            "You are not authorized to access projects.",
        });

        return;
      }

      // ---------------------------------------------------
      // OTHER ERRORS
      // ---------------------------------------------------

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch projects"
        );
      }

      // ---------------------------------------------------
      // MAP PROJECTS
      // ---------------------------------------------------

      const mappedProjects =
        (data.projects || []).map(
          mapProjectToRoster
        );

      setProjects(mappedProjects);

      // ---------------------------------------------------
      // STATS
      // ---------------------------------------------------

      setProjectStats(
        getProjectStats(mappedProjects)
      );
    } catch (error) {
      console.error(
        "FETCH_PROJECTS_ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Failed to fetch projects"
      );

      setError(
        error.message ||
          "Something went wrong"
      );

      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------
  // INITIAL LOAD
  // -------------------------------------------------------

  useEffect(() => {
    fetchProjects();
  }, []);

  // -------------------------------------------------------
  // RETRY
  // -------------------------------------------------------

  const handleRetry = () => {
    fetchProjects();
  };

  // -------------------------------------------------------
  // VIEW PROJECT
  // -------------------------------------------------------

  const handleViewProject = (project) => {
    router.push(
      `/admin-dashboard/projects/${project._id}`
    );
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-3">

      {/* AUTH MODAL */}

      <AuthGuardModal
        open={authModal.open}
        type={authModal.type}
        message={authModal.message}
        onClose={() => {
          if (
            authModal.type ===
            "unauthorized"
          ) {
            router.back();
          } else {
            setAuthModal((prev) => ({
              ...prev,
              open: false,
            }));
          }
        }}
        onLogin={() => {
          router.push("/login");
        }}
      />

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between lg:items-start">

            {/* TITLE */}

            <div>
              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                  <FolderKanban className="h-5 w-5 text-primary-orange" />
                </div>

                <h1 className="text-2xl font-bold text-[#1c3a5e]">
                  Project Management
                </h1>

              </div>
            </div>

            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="flex flex-wrap gap-3">

              {projectStats.map(
                (stat) => {
                  const Icon = stat.Icon;

                  return (
                    <div
                      key={stat.title}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                    >

                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          stat.icon === "orange"
                            ? "bg-orange-50"
                            : "bg-blue-50"
                        }`}
                      >

                        <Icon
                          className={`h-4 w-4 ${
                            stat.icon === "orange"
                              ? "text-orange-600"
                              : "text-blue-600"
                          }`}
                        />

                      </div>

                      <div>

                        <p className="text-xs font-medium text-slate-400">
                          {stat.title}
                        </p>

                        <p className="text-lg font-bold text-[#1c3a5e]">
                          {stat.value}
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

            <div className="flex flex-col items-center justify-center text-center">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <FolderKanban className="h-5 w-5 text-red-500" />
              </div>

              <h2 className="mt-4 text-base font-semibold text-slate-700">
                Unable to load projects
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-5 rounded-lg bg-primary-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#df681c]"
              >
                Try Again
              </button>

            </div>

          </div>
        )}

        {/* =================================================
            PROJECT ROSTER
        ================================================= */}

        <div className="rounded-2xl">

          {loading && projects.length === 0 ? (

            <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white">

              <div className="flex items-center gap-3 text-slate-500">

                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary-orange" />

                <span className="text-sm font-medium">
                  Loading projects...
                </span>

              </div>

            </div>

          ) : (

            <div className="relative">

              <Roster
                title="All Projects"
                data={projects}
                setData={setProjects}
              
                columns={projectColumns}
                showDelete={true}
                searchPlaceholder="Search projects..."
                className="mt-0 shadow-sm"
            
                   onRowClick={(project) => {
              const projectId = project?.id || project?._id;

              if (!projectId) {
                toast.error("Project ID not found");
                return;
              }

              router.push(`/admin-dashboard/view-projects/${projectId}`);
            }}
              />

              {/* LOADING OVERLAY */}

              {loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">

                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">

                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary-orange" />

                    <span className="text-sm font-medium text-slate-600">
                      Loading projects...
                    </span>

                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}