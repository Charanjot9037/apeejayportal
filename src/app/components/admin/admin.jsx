"use client";

import { useEffect, useState } from "react";
import Roster from "@/app/components/elements/roaster";
import { toast } from "sonner";
import AuthGuardModal from "@/app/components/AuthGuardModal";
import { DashboardHeader } from "@/app/components/elements";
import { StatCards } from "@/app/components/elements";
import {
  DEPARTEMENT_DASHBOARD_HEADER,
  HOD_DASHBOARD_HEADER,
} from "@/constants/hodData";
import ExcelJS from "exceljs";
import {
  programOptions,
  specializationOptions,
  semesterOptions,
} from "@/constants/gloabl";
import { getHODFilterConfig } from "@/lib/getHODFilterConfig";

import { generateAcademicYears } from "@/constants/gloabl";
import {
  projectColumns,
  DEFAULT_PROJECT_FILTERS,
  HOD_PROJECT_FILTERS,
  mapProjectToRoster,
  HOD_STAT_CARDS,
} from "@/constants/hodData";
import StudentRosterSkeleton from "@/app/components/admin/skeleton/studentRosterSkeleton";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const getHODProjectFilters = (department) => {
  const normalizedDepartment = department?.toUpperCase();

  if (!normalizedDepartment) {
    return [];
  }

  const programs = programOptions[normalizedDepartment] || [];

  const specializations = specializationOptions[normalizedDepartment] || [];

  return [
    // =========================
    // DEPARTMENT
    // =========================
    {
      key: "department",
      label: "Department",
      placeholder: "Department",
      options: [
        {
          value: normalizedDepartment,
          label: normalizedDepartment,
        },
      ],
      disabled: true,
    },

    // =========================
    // PROGRAM
    // =========================
    {
      key: "program",
      label: "Program",
      placeholder: "All Programs",
      options: programs,
    },

    // =========================
    // SPECIALIZATION
    // Only show if department has specialization
    // =========================
    ...(specializations.length > 0
      ? [
          {
            key: "specialization",
            label: "Specialization",
            placeholder: "All Specializations",
            options: specializations,
          },
        ]
      : []),

    // =========================
    // SEMESTER
    // Depends on Program
    // =========================
    {
      key: "semester",
      label: "Semester",
      placeholder: "All Semesters",
      options: semesterOptions,
      dependsOn: "program",
    },

    // =========================
    // STATUS
    // =========================
    {
      key: "status",
      label: "Status",
      options: [
        {
          label: "All Status",
          value: "",
        },
        {
          label: "Pending Approval",
          value: "Pending Approval",
        },
        {
          label: "In Review",
          value: "In Review",
        },
        {
          label: "Approved",
          value: "Approved",
        },
        {
          label: "Rejected",
          value: "Rejected",
        },
      ],
    },
  ];
};

export default function HODProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const department = useSelector((state) => state.mentor?.department);

  const [authModal, setAuthModal] = useState({
    open: false,
    type: "authentication",
    message: "",
  });
  const [filters, setFilters] = useState({
    ...DEFAULT_PROJECT_FILTERS,
  });
  const router = useRouter();
  const [statistics, setStatistics] = useState({
    students: 0,
    mentors: 0,
    projects: 0,
    pendingReviews: 0,
    mentorVerified: 0,
  });

  // =========================================================
  // FETCH PROJECTS
  // =========================================================

  const fetchProjects = async (selectedFilters) => {
    try {
      setLoading(true);
      setError("");

      const apiFilters = {
        department: selectedFilters.department,
        program: selectedFilters.program,
        semester: selectedFilters.semester,
        specialization: selectedFilters.specialization,
        status: selectedFilters.status,
        academicYear: selectedFilters.academicYear,
      };

      // Remove empty filters
      Object.keys(apiFilters).forEach((key) => {
        if (
          apiFilters[key] === "" ||
          apiFilters[key] === null ||
          apiFilters[key] === undefined ||
          apiFilters[key] === "all"
        ) {
          delete apiFilters[key];
        }
      });

      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiFilters),
      });

      const data = await response.json();
      if (response.status === 401) {
        setAuthModal({
          open: true,
          type: "authentication",
          message:
            data.message || "Your session has expired. Please log in again.",
        });

        return;
      }

      // Authorization error
      if (response.status === 403) {
        setAuthModal({
          open: true,
          type: "unauthorized",
          message: data.message || "You are not authorized ",
        });

        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch HOD projects");
      }
      setStatistics(
        data.statistics || {
          students: 0,
          mentors: 0,
          projects: 0,
          pendingReviews: 0,
          mentorVerified: 0,
        },
      );

      const mappedProjects = (data.projects || []).map(mapProjectToRoster);

      setProjects(mappedProjects);
    } catch (error) {
      console.error("FETCH_HOD_PROJECTS_ERROR:", error);

      toast.error(error.message || "Failed to fetch projects");

      setError(error.message || "Something went wrong");

      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    if (!department) return;

    const initialFilters = {
      ...DEFAULT_PROJECT_FILTERS,
      department: department.toUpperCase(),
      program: "",
      specialization: "",
      semester: "",
    };

    setFilters(initialFilters);

    fetchProjects(initialFilters);
  }, [department]);

  // =========================================================
  // APPLY FILTERS
  // =========================================================

  const handleApplyFilters = (selectedFilters) => {
    setFilters({
      ...selectedFilters,
    });

    fetchProjects(selectedFilters);
  };

  const handleExportProjects = async (filteredProjects) => {
    try {
      if (!filteredProjects || filteredProjects.length === 0) {
        toast.error("No projects available to export");
        return;
      }

      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("Project Roster");

      // -------------------------------------------------------
      // TITLE
      // -------------------------------------------------------

      worksheet.mergeCells("A1:F1");

      worksheet.getCell("A1").value = "HOD Project Roster";

      worksheet.getCell("A1").font = {
        bold: true,
        size: 16,
      };

      worksheet.getCell("A1").alignment = {
        horizontal: "center",
      };

      // -------------------------------------------------------
      // HEADERS
      // -------------------------------------------------------

      worksheet.addRow([]);

      const headerRow = worksheet.addRow([
        "Project",
        "Student",
        "Mentor",
        "Semester",
        "Status",
        "Approval Date",
      ]);

      headerRow.font = {
        bold: true,
      };

      // -------------------------------------------------------
      // PROJECT DATA
      // -------------------------------------------------------

      filteredProjects.forEach((project) => {
        worksheet.addRow([
          project.projectTitle || "-",
          project.student || "-",
          project.mentor || "-",
          project.semester || "-",
          project.status || "-",
          project.approvalDate || "-",
        ]);
      });

      // -------------------------------------------------------
      // COLUMN WIDTHS
      // -------------------------------------------------------

      worksheet.columns = [
        {
          key: "project",
          width: 40,
        },
        {
          key: "student",
          width: 25,
        },
        {
          key: "mentor",
          width: 25,
        },
        {
          key: "semester",
          width: 15,
        },
        {
          key: "status",
          width: 22,
        },
        {
          key: "approvalDate",
          width: 20,
        },
      ];

      // -------------------------------------------------------
      // DOWNLOAD
      // -------------------------------------------------------

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `HOD_Project_Roster_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success(
        `${filteredProjects.length} projects exported successfully`,
      );
    } catch (error) {
      console.error("EXPORT_PROJECTS_ERROR:", error);

      toast.error("Failed to export projects");
    }
  };
  // =========================================================
  // RETRY
  // =========================================================

  const handleRetry = () => {
    fetchProjects(filters);
  };

  const statCards = HOD_STAT_CARDS.map((card) => {
    if (card.title === "Total Students") {
      return {
        ...card,
        value: statistics.students,
      };
    }

    if (card.title === "Total Mentors") {
      return {
        ...card,
        value: statistics.mentors,
      };
    }

    if (card.title === "Total Projects") {
      return {
        ...card,
        value: statistics.projects,
      };
    }

    if (card.title === "Pending Approvals") {
      return {
        ...card,
        value: statistics.pendingReviews,
      };
    }

    return card;
  });

  return (
    <div className="w-full">
      {/* ================= HEADER ================= */}

      <DashboardHeader
        {...DEPARTEMENT_DASHBOARD_HEADER}
        onAction={() => console.log("Pending Approvals")}
      />

      {/* ================= STAT CARDS ================= */}

      <StatCards cards={statCards} />

      {/* ================= AUTH MODAL ================= */}

      <AuthGuardModal
        open={authModal.open}
        type={authModal.type}
        message={authModal.message}
        onClose={() => {
          if (authModal.type === "unauthorized") {
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

      {/* ================= ERROR ================= */}

      {error && (
        <div className="mb-4 rounded-xl bg-white p-5">
          <p className="text-sm text-red-500">{error}</p>

          <button
            onClick={handleRetry}
            className="mt-3 rounded-lg bg-primary-orange px-4 py-2 text-sm text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ================= PROJECT ROSTER ================= */}

      {loading ? (
        <div className="mt-4">
          <StudentRosterSkeleton />
        </div>
      ) : (
        <Roster
          title="Project Roster"
          data={projects}
          setData={setProjects}
          columns={projectColumns}
          searchPlaceholder="Search projects..."

          filterConfig={[
            {
              key: "department",
              label: "Department",
              placeholder: "All Departments",
              options: Object.keys(programOptions).map((department) => ({
                value: department,
                label: department,
              })),
            },

            {
              key: "program",
              label: "Program",
              placeholder: "All Programs",
              options: programOptions,
              dependsOn: "department",
            },

            {
              key: "specialization",
              label: "Specialization",
              placeholder: "All Specializations",
              options: specializationOptions,
              dependsOn: "department",
            },
            {
              key: "academicYear",
              label: "Academic Year",
              placeholder: "All Academic Years",
              options: generateAcademicYears(),
            },
            {
              key: "semester",
              label: "Semester",
              placeholder: "All Semesters",
              options: semesterOptions,
              dependsOn: "program",
            },
          ]}

          showApplyButton={true}
          onApplyFilters={handleApplyFilters}
          onExport={handleExportProjects}

          onRowClick={(project) => {
            const projectId = project?.id || project?._id;

            if (!projectId) {
              toast.error("Project ID not found");
              return;
            }

            router.push(`mentor-dashboard/projects/${projectId}`);
          }}
        />
      )}
    </div>
  );
}
