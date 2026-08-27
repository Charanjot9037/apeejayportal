
"use client";

import {
  StatCards,
  Roster,
  DashboardHeader,
} from "@/app/components/elements";
import { STUDENT_FILTERS } from "@/constants/adminData";
import { HOD_PROJECT_FILTERS } from "@/constants/hodData";

import {
  HOD_DASHBOARD_HEADER,
  PROJECT_COLUMNS,
} from "@/constants/hodData";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StudentFilters from "../elements/StudentFilter";

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

  const [filteredProjects, setFilteredProjects] =
    useState([]);

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
  // Only projects belonging to the HOD's
  // department will be passed to Roster.
  // ==========================================

  const departmentProjects =
    projects.filter((project) => {
      if (!hodDepartment) {
        return false;
      }

      return (
        String(project.department || "")
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

    // Later:
    // router.push(
    //   `/hod/projects/${project._id}`
    // );
  };

  // ==========================================
  // EXPORT REPORT
  // ==========================================

  const handleExportReport = () => {
    if (!filteredProjects.length) {
      alert(
        "No projects available to export."
      );

      return;
    }

    const headers = [
      "Project Title",
      "Student",
      "Mentor",
      "Status",
      "Technology Stack",
      "Department",
      "Program / Degree",
      "Specialization",
      "Academic Batch",
      "Semester",
    ];

    const rows =
      filteredProjects.map(
        (project) => {
          const studentName =
            typeof project.student ===
            "object"
              ? project.student?.name
              : project.student;

          const mentorName =
            typeof project.mentor ===
            "object"
              ? project.mentor?.name
              : project.mentor;

          return [
            project.projectTitle ||
              project.title ||
              "",

            studentName ||
              project.name ||
              "",

            mentorName || "",

            project.status || "",

            Array.isArray(
              project.techStack
            )
              ? project.techStack.join(
                  ", "
                )
              : project.techStack || "",

            project.department ||
              hodDepartment ||
              "",

            project.program || "",

            project.specialization ||
              "",

            project.academicBatch ||
              "",

            project.currentSemester ||
              "",
          ];
        }
      );

    // ==========================================
    // CREATE CSV
    // ==========================================

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value ?? ""
              ).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    // ==========================================
    // DOWNLOAD CSV
    // ==========================================

    const blob = new Blob(
      [csvContent],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    const departmentName =
      hodDepartment
        ? hodDepartment
            .replace(
              /\s+/g,
              "_"
            )
        : "Department";

    link.download =
      `HOD_${departmentName}_Project_Report_${new Date()
        .toISOString()
        .split("T")[0]}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
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
          description="Mentorship & Department Insights"
          onAction={
            handleExportReport
          }
        />

        {/* ====================================
            ERROR
        ==================================== */}

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

            /*
             * IMPORTANT:
             * Only projects from the HOD's
             * department are shown.
             */
            data={departmentProjects}

            columns={
              PROJECT_COLUMNS
            }

            searchPlaceholder="Search projects, students or mentors..."

            defaultFilters={filters}

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
          />

        </div>

      </main>
    </div>
  );
}