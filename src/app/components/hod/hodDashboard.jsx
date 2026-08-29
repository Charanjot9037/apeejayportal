"use client";

import {
  StatCards,
  Roster,
  DashboardHeader,
} from "@/app/components/elements";

import { HOD_PROJECT_FILTERS } from "@/constants/hodData";

import {
  HOD_DASHBOARD_HEADER,
  PROJECT_COLUMNS,
} from "@/constants/hodData";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function HODdashboard() {
  // ==========================================
  // LOGGED-IN USER
  // ==========================================

  const { user } = useSelector(
    (state) => state.auth
  );

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

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filters, setFilters] =
    useState({});

  // IMPORTANT:
  // This contains the FINAL filtered
  // project roster data.
  const [filteredProjects, setFilteredProjects] =
    useState([]);

  const [exporting, setExporting] =
    useState(false);

  // ==========================================
  // FETCH HOD DATA
  // ==========================================

  useEffect(() => {
    const fetchHODData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/hod",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result =
          await response.json();

        console.log(
          "HOD API RESPONSE:",
          result
        );

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to fetch HOD data"
          );
        }

        setHodData({
          hod: result.hod || null,

          statistics: {
            students:
              result.statistics
                ?.students || 0,

            mentors:
              result.statistics
                ?.mentors || 0,

            projects:
              result.statistics
                ?.projects || 0,

            pendingReviews:
              result.statistics
                ?.pendingReviews || 0,

            mentorVerified:
              result.statistics
                ?.mentorVerified || 0,
          },

          students:
            result.students || [],

          mentors:
            result.mentors || [],

          projects:
            result.projects || [],
        });
      } catch (error) {
        console.error(
          "HOD DASHBOARD ERROR:",
          error
        );

        setError(
          error.message ||
            "Unable to load dashboard"
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

  const departmentProjects =
    projects.filter((project) => {
      if (!hodDepartment) {
        return false;
      }

      return (
        String(
          project.department || ""
        )
          .trim()
          .toLowerCase() ===
        String(hodDepartment)
          .trim()
          .toLowerCase()
      );
    });

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
        hodDepartment ||
        "your department"
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
        hodDepartment ||
        "your department"
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
  const handleExport = async (filteredProjects) => {
  try {
    console.log(
      "FILTERED PROJECTS FOR EXPORT:",
      filteredProjects
    );

    if (!filteredProjects || filteredProjects.length === 0) {
      alert("No projects available to export.");
      return;
    }

    const projectIds = filteredProjects
      .map((project) => project._id || project.id)
      .filter(Boolean);

    console.log("PROJECT IDS:", projectIds);

    if (projectIds.length === 0) {
      alert("No valid project IDs found.");
      return;
    }

    const response = await fetch(
      `/api/hod/export?projectIds=${projectIds.join(",")}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const error = await response.json();

      alert(
        error?.message || "Failed to export report"
      );

      return;
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "hod-project-report.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(
      "EXPORT ERROR:",
      error
    );

    alert("Failed to export report.");
  }
};

  // ==========================================
  // APPLY FILTERS
  // ==========================================

  const handleApplyFilters = (
    selectedFilters
  ) => {
    setFilters(selectedFilters);

    console.log(
      "Applied HOD filters:",
      selectedFilters
    );
  };

  // ==========================================
  // PROJECT CLICK
  // ==========================================

  const handleViewProject = (
    project
  ) => {
    console.log(
      "Selected project:",
      project
    );
  };

  // ==========================================
  // EXPORT EXCEL REPORT
  // ==========================================

  const handleExportReport = async () => {
    try {
      // ----------------------------------------
      // CHECK DATA
      // ----------------------------------------

      if (!filteredProjects.length) {
        alert(
          "No projects available to export."
        );

        return;
      }

      setExporting(true);

      // ----------------------------------------
      // GET PROJECT IDS
      // ----------------------------------------

      const projectIds =
        filteredProjects
          .map(
            (project) =>
              project._id || project.id
          )
          .filter(Boolean);

      if (!projectIds.length) {
        alert(
          "No valid projects available to export."
        );

        return;
      }

      console.log(
        "EXPORT PROJECT IDS:",
        projectIds
      );

      // ----------------------------------------
      // CALL EXPORT API
      // ----------------------------------------

      const response =
        await fetch(
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

      // ----------------------------------------
      // HANDLE ERROR
      // ----------------------------------------

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
          // Ignore JSON parsing error
        }

        throw new Error(
          errorMessage
        );
      }

      // ----------------------------------------
      // GET EXCEL BLOB
      // ----------------------------------------

      const blob =
        await response.blob();

      // ----------------------------------------
      // CREATE DOWNLOAD URL
      // ----------------------------------------

      const url =
        window.URL.createObjectURL(
          blob
        );

      // ----------------------------------------
      // CREATE DOWNLOAD LINK
      // ----------------------------------------

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

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      // ----------------------------------------
      // CLEAN URL
      // ----------------------------------------

      window.URL.revokeObjectURL(
        url
      );
    } catch (error) {
      console.error(
        "HOD EXPORT ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to export report"
      );
    } finally {
      setExporting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex h-full">
        <main className="min-w-0 flex-1 px-8 py-8">
          <p className="text-sm text-gray-500">
            Loading HOD dashboard...
          </p>
        </main>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="flex h-full">
      <main className="min-w-0 flex-1 px-8 py-8">

        {/* ====================================
            HEADER
        ==================================== */}

        <DashboardHeader
          {...HOD_DASHBOARD_HEADER}

          title={`Welcome, ${hodName}`}
          actionLabel={false}

          description="Mentorship & Department Insights"

        />

        {error && (
          <p className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}

        {/* ====================================
            STATISTICS
        ==================================== */}

        <StatCards
          cards={hodStatCards}
        />

        {/* ====================================
            PROJECT ROSTER
        ==================================== */}

        <div className="mt-2 w-full">

          <Roster
            title="Project Roster"
            onExport={handleExport}
    

            data={
              departmentProjects
            }

            columns={
              PROJECT_COLUMNS
            }

            searchPlaceholder="Search projects, students or mentors..."

            defaultFilters={
              filters
            }
            filterContext={{
  department: hodDepartment,
}}
            filterConfig={
              HOD_PROJECT_FILTERS
            }

            showApplyButton={true}

            onApplyFilters={
              handleApplyFilters
            }

            className="w-full shadow-sm"

            onRowClick={
              handleViewProject
            }

            initialVisibleRows={3}

            // ==================================
            // IMPORTANT
            // Get FINAL filtered roster data
            // ==================================

            onFilteredData={
              setFilteredProjects
            }
          />

        </div>

      </main>
    </div>
  );
}