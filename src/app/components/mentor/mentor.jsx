"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { StatCards, Roster, DashboardHeader } from "@/app/components/elements";

import RosterSkeleton from "@/app/components/skeletons/roasterSkeleton";

import {
  generateAcademicYears,
  programOptions,
  semesterOptions,
} from "@/constants/gloabl";

import {
  MENTOR_STAT_CARDS,
  MENTOR_STUDENT_COLUMNS,
  MENTOR_DASHBOARD_HEADER,
} from "@/constants/mentorData";

import { mapMentorProjectToRoster } from "@/mappers/mentor";
import { apiRequest } from "@/lib/apiRequest";
import AuthGuardModal from "../AuthGuardModal";

const ACADEMIC_YEAR_OPTIONS = generateAcademicYears();

const DEFAULT_FILTERS = {
  program: "",
  semester: "",
  academicYear: "",
};

export default function Mentor() {
  const router = useRouter();

  const user = useSelector((state) => state.mentor);

  const mentorDepartment = user?.department || "";

  const [allProjects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [authModal, setAuthModal] = useState({
    open: false,
    type: null,
    message: "",
  });

  const mentorProgramOptions = useMemo(() => {
    if (!mentorDepartment) {
      return [];
    }

    const normalizeDepartment = (value) =>
      String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");

    const departmentKey = Object.keys(programOptions).find(
      (key) =>
        normalizeDepartment(key) === normalizeDepartment(mentorDepartment),
    );

    if (!departmentKey) {
      console.warn(
        "No program options found for department:",
        mentorDepartment,
      );

      return [];
    }

    const programs = programOptions[departmentKey];

    if (!Array.isArray(programs)) {
      return [];
    }

    return programs.map((program) => ({
      value: program.value,
      label: program.label,
    }));
  }, [mentorDepartment]);

  useEffect(() => {
    if (mentorProgramOptions.length > 0 && !filters.program) {
      const mentorProgram = mentorProgramOptions[0].value;

      setFilters((prev) => ({
        ...prev,
        program: mentorProgram,
        semester: "",
      }));
    }
  }, [mentorProgramOptions, filters.program]);

  const mentorSemesterOptions = useMemo(() => {
    const selectedProgram = filters?.program;

    if (!selectedProgram) {
      return [];
    }

    return semesterOptions[selectedProgram] || [];
  }, [filters?.program]);

  const MENTOR_PROJECT_FILTERS = useMemo(
    () => [
      {
        key: "program",
        label: "Program",
        placeholder: "Select Program",
        options: mentorProgramOptions,
      },
      {
        key: "semester",
        label: "Semester",
        placeholder: "All Semesters",
        options: mentorSemesterOptions,
      },
      {
        key: "academicYear",
        label: "Academic Year",
        placeholder: "All Academic Years",
        options: ACADEMIC_YEAR_OPTIONS,
      },
    ],
    [mentorProgramOptions, mentorSemesterOptions],
  );

  const fetchMentorProjects = async (
    filterValues = DEFAULT_FILTERS,
    isInitialLoad = false,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        program: filterValues?.program || "",
        semester: filterValues?.semester || "",
        academicYear: filterValues?.academicYear || "",
      };

      console.log("POST /api/projects/mentor");

      console.log("FILTER PAYLOAD:", payload);

      const result = await apiRequest("/api/projects/mentor", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      console.log("MENTOR PROJECT API RESULT:", result);

      if (result?.status === 401) {
        setAuthModal({
          open: true,
          type: "authentication",
          message:
            result?.message || "Your session has expired. Please login again.",
        });

        return;
      }

      if (result?.status === 403) {
        setAuthModal({
          open: true,
          type: "unauthorized",
          message:
            result?.message ||
            "You are not authorized to access the mentor dashboard.",
        });

        return;
      }

      if (!result?.success) {
        throw new Error(result?.message || "Failed to load mentor projects.");
      }

      const returnedProjects = result?.data?.projects || [];

      console.log(
        isInitialLoad
          ? "INITIAL PROJECTS FROM BACKEND:"
          : "FILTERED PROJECTS FROM BACKEND:",
        returnedProjects,
      );

      if (isInitialLoad) {
        setAllProjects(returnedProjects);
      }

      setProjects(returnedProjects);
    } catch (err) {
      console.error("MENTOR_PROJECT_ERROR:", err);

      setError(
        err?.message || "Something went wrong while fetching mentor projects.",
      );

      setProjects([]);

      if (isInitialLoad) {
        setAllProjects([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorProjects(DEFAULT_FILTERS, true);
  }, []);

  const handleApplyFilters = async (selectedFilters) => {
    console.log("ROSTER SELECTED FILTERS:", selectedFilters);

    const appliedFilters = {
      program: selectedFilters?.program || filters?.program || "",

      semester: selectedFilters?.semester || "",

      academicYear: selectedFilters?.academicYear || "",
    };

    console.log("SENDING FILTERS TO BACKEND:", appliedFilters);

    setFilters(appliedFilters);

    await fetchMentorProjects(appliedFilters, false);
  };

  const rosterData = projects.map(mapMentorProjectToRoster);

  const totalProjects = allProjects.length;

  const pendingProjects = allProjects.filter(
    (project) => project.status === "Pending Approval",
  ).length;

  const approvedProjects = allProjects.filter(
    (project) => project.status === "Approved",
  ).length;

  const inReviewProjects = allProjects.filter(
    (project) => project.status === "In Review",
  ).length;

  const mentorStatCards = MENTOR_STAT_CARDS.map((card) => {
    const values = {
      approved: approvedProjects,
      projects: totalProjects,
      pending: pendingProjects,
      inReview: inReviewProjects,
    };

    return {
      ...card,
      value: values[card.id] ?? 0,
    };
  });

  const mentorDashboardHeader = {
    ...MENTOR_DASHBOARD_HEADER,
    actionLabel: `${pendingProjects} Pending Reviews`,
  };

  const handleViewProject = (item) => {
    router.push(`/mentor-dashboard/projects/${item.id}`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-full">
      <main>
        <DashboardHeader {...mentorDashboardHeader} />

        <StatCards cards={mentorStatCards} />

        {error && (
          <div className="mt-6 rounded-2xl">
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-base font-semibold text-slate-700">
                Unable to load projects
              </h2>

              <p className="mt-1 text-sm text-slate-500">{error}</p>

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

        {!error && (
          <div className="relative mt-6">
            {loading ? (
              <RosterSkeleton
                title="Project Roster"
                columns={MENTOR_STUDENT_COLUMNS}
                rows={5}
                showDelete={false}
                showExport={true}
                showFilters={true}
              />
            ) : (
              <Roster
                title="Project Roster"
                data={rosterData}
                columns={MENTOR_STUDENT_COLUMNS}
                searchPlaceholder="Search projects..."
                onRowClick={handleViewProject}
                filterConfig={MENTOR_PROJECT_FILTERS}
                filters={filters}
                setFilters={setFilters}
                showApplyButton={true}
                onApplyFilters={handleApplyFilters}
                onViewAll={() => router.push("/mentor-dashboard/projects")}
                viewAllLabel="View All Projects"
                className="shadow-sm"
              />
            )}
          </div>
        )}
      </main>

      <AuthGuardModal
        open={authModal.open}
        type={authModal.type}
        message={authModal.message}
        onClose={() =>
          setAuthModal({
            open: false,
            type: null,
            message: "",
          })
        }
        onLogin={() => router.push("/login")}
        onBack={() => router.back()}
      />
    </div>
  );
}
