"use client";

import {
  StatCards,
  Roster,
  DashboardHeader,
} from "@/app/components/elements";

import { useRouter } from "next/navigation";
import { HOD_PROJECT_FILTERS } from "@/constants/hodData";

import {
  HOD_DASHBOARD_HEADER,
  PROJECT_COLUMNS,
} from "@/constants/hodData";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StudentRosterSkeleton from "@/app/components/admin/skeleton/studentRosterSkeleton";

export default function HODdashboard() {
  // ==========================================
  // LOGGED-IN USER
  // ==========================================

  const { user } = useSelector((state) => state.auth);

  // ==========================================
  // HOD DATA
  // ==========================================

  const [hodData, setHodData] = useState({
    hod: null,

    statistics: {
      students: 0,
      mentors: 0,
      projects: 0,
      pendingReviews: 0,
      mentorVerified: 0,
    },

    students: [],
    mentors: [],
    projects: [],
  });

  // ==========================================
  // STATES
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const [exporting, setExporting] = useState(false);

  // ==========================================
  // FETCH HOD DATA
  // ==========================================

  useEffect(() => {
    const fetchHODData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/hod/dashboard", {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        console.log("HOD API RESPONSE:", result);

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch HOD data"
          );
        }

        setHodData({
          hod: result.hod || null,

          statistics: {
            students: result.statistics?.students || 0,
            mentors: result.statistics?.mentors || 0,
            projects: result.statistics?.projects || 0,
            pendingReviews:
              result.statistics?.pendingReviews || 0,
            mentorVerified:
              result.statistics?.mentorVerified || 0,
          },

          students: result.students || [],
          mentors: result.mentors || [],

          // Projects are already filtered by HOD department
          projects: result.projects || [],
        });
      } catch (error) {
        console.error("HOD DASHBOARD ERROR:", error);

        setError(
          error.message || "Unable to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHODData();
  }, []);

  // ==========================================
  // EXTRACT DATA
  // ==========================================

  const {
    hod,
    statistics,
    projects,
  } = hodData;

  // ==========================================
  // HOD INFORMATION
  // ==========================================

  const hodName =
    hod?.name ||
    user?.name ||
    "HOD";

  const hodDepartment =
    hod?.department ||
    user?.department ||
    "";

  // ==========================================
  // HOD PROJECTS
  // ==========================================
  //
  // IMPORTANT:
  // API already returns projects belonging
  // to students of this HOD's department.
  //
  // DO NOT filter by project.department here
  // because project.department does not exist.
  // ==========================================
  const [filters, setFilters] = useState({
  projectType: "",
  status: "",
  semester: "",
});

const departmentProjects = projects;

const filteredProjects = departmentProjects.filter((project) => {
  // Project Type
  if (
    filters.projectType &&
    String(project.projectType || "").toLowerCase() !==
      String(filters.projectType).toLowerCase()
  ) {
    return false;
  }

  // Status
  if (
    filters.status &&
    String(project.status || "").toLowerCase() !==
      String(filters.status).toLowerCase()
  ) {
    return false;
  }

  // Semester
  if (
    filters.semester &&
    String(project.semester || "").toLowerCase() !==
      String(filters.semester).toLowerCase()
  ) {
    return false;
  }

  return true;
});

  // ==========================================
  // DEBUG
  // ==========================================

  console.log(
    "HOD DEPARTMENT:",
    hodDepartment
  );

  console.log(
    "HOD PROJECTS:",
    departmentProjects
  );

  // ==========================================
  // STAT CARDS
  // ==========================================

  const hodStatCards = [
    {
      id: "students",

      title: "Total Students",

      value: loading
        ? "..."
        : statistics.students.toLocaleString(),

      icon: "GraduationCap",

      description: `Students in ${
        hodDepartment || "your department"
      }`,
    },

    {
      id: "mentors",

      title: "Total Mentors",

      value: loading
        ? "..."
        : statistics.mentors.toLocaleString(),

      icon: "UserRound",

      description: `Mentors in ${
        hodDepartment || "your department"
      }`,
    },

    {
      id: "pending-reviews",

      title: "Pending Reviews",

      value: loading
        ? "..."
        : statistics.pendingReviews.toLocaleString(),

      icon: "FileText",

      description:
        "Projects awaiting review",
    },

    {
      id: "mentor-verified",

      title: "Mentor Verified",

      value: loading
        ? "..."
        : statistics.mentorVerified.toLocaleString(),

      icon: "BadgeCheck",

      description:
        "Mentor verified projects",
    },
  ];

  // ==========================================
  // APPLY FILTERS
  // ==========================================

  const handleApplyFilters = (selectedFilters) => {
    setFilters(selectedFilters);

    console.log(
      "Applied HOD filters:",
      selectedFilters
    );
  };

  // ==========================================
  // PROJECT CLICK
  // ==========================================

  const router = useRouter();

  const handleViewProject = (project) => {
    const projectId =
      project._id || project.id;

    if (!projectId) {
      console.error(
        "Project ID not found:",
        project
      );

      return;
    }

    router.push(
      `/hod-dashboard/projects/${projectId}`
    );
  };

  // ==========================================
  // EXPORT
  // ==========================================

  const handleExport = async (filteredProjects) => {
    try {
      console.log(
        "FILTERED PROJECTS FOR EXPORT:",
        filteredProjects
      );

      if (
        !filteredProjects ||
        filteredProjects.length === 0
      ) {
        alert(
          "No projects available to export."
        );

        return;
      }

      const projectIds = filteredProjects
        .map(
          (project) =>
            project._id || project.id
        )
        .filter(Boolean);

      console.log(
        "PROJECT IDS:",
        projectIds
      );

      if (projectIds.length === 0) {
        alert(
          "No valid project IDs found."
        );

        return;
      }

      const response = await fetch(
        "/api/hod/export",
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            projectIds,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage =
          "Failed to export report";

        try {
          const errorData =
            await response.json();

          errorMessage =
            errorData.message ||
            errorMessage;
        } catch {
          // Ignore
        }

        throw new Error(
          errorMessage
        );
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      const departmentName =
        hodDepartment
          ? hodDepartment
              .replace(/\s+/g, "_")
              .replace(
                /[^a-zA-Z0-9_-]/g,
                ""
              )
          : "Department";

      const date =
        new Date()
          .toISOString()
          .split("T")[0];

      link.download =
        `HOD_${departmentName}_Project_Report_${date}.xlsx`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "HOD EXPORT ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to export report"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <StudentRosterSkeleton/>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="flex h-full">
      <main className="min-w-0 flex-1 px-8 py-8">

        {/* HEADER */}

        <DashboardHeader
          {...HOD_DASHBOARD_HEADER}
          title={`Welcome, ${hodName}`}
          actionLabel={false}
          description="Mentorship & Department Insights"
        />

        {/* ERROR */}

        {error && (
          <p className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}

        {/* STATISTICS */}

        <StatCards
          cards={hodStatCards}
        />

        {/* PROJECT ROSTER */}

        <div className="mt-2 w-full">

          <Roster
            title="Project Roster"

            onExport={handleExport}

            /*
             * API has already filtered projects
             * according to HOD department.
             */
            data={departmentProjects}

            /*
             * PROJECT_COLUMNS should contain:
             * projectTitle
             * student
             * mentor
             * projectType
             * status
             */
            columns={PROJECT_COLUMNS}

            onRowClick={handleViewProject}

            searchPlaceholder="Search projects, students or mentors..."

            defaultFilters={filters}

            filterContext={{
              department: hodDepartment,
            }}

            filterConfig={HOD_PROJECT_FILTERS}

            showApplyButton={true}

            onApplyFilters={
              handleApplyFilters
            }

            className="w-full shadow-sm"

            initialVisibleRows={3}

          />

        </div>
      </main>
    </div>
  );
}